"""
Daily HRD generator
- Reads selected RSS feeds
- Keeps recent HRD/L&D items
- Uses OpenAI Responses API to select and draft ONE briefing
- Appends validated JSON to data/briefings.json

Required secret:
  OPENAI_API_KEY
Optional:
  OPENAI_MODEL (default: gpt-5.6-luna)

Human-in-the-loop note:
For a corporate production workflow, consider generating a "draft" branch/PR first
instead of publishing automatically. This prototype publishes automatically.
"""
from __future__ import annotations
import json, os, re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import quote_plus

import feedparser
from bs4 import BeautifulSoup
from dateutil import parser as dtparser
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "briefings.json"
KST = timezone(timedelta(hours=9))

# Start small, just as the briefing pattern recommends.
# Direct RSS where available + Google News RSS queries focused on trusted HRD sources.
FEEDS = [
    ("Training Industry", "https://trainingindustry.com/feed/"),
    ("HR Dive", "https://www.hrdive.com/feeds/news/"),
    ("ATD via Google News", "https://news.google.com/rss/search?q=" + quote_plus('site:td.org "learning and development" OR "talent development"') + "&hl=en-US&gl=US&ceid=US:en"),
    ("SHRM via Google News", "https://news.google.com/rss/search?q=" + quote_plus('site:shrm.org "learning and development" OR upskilling OR reskilling') + "&hl=en-US&gl=US&ceid=US:en"),
    ("Korean HRD", "https://news.google.com/rss/search?q=" + quote_plus('"기업교육" OR "인재육성" OR "HRD"') + "&hl=ko&gl=KR&ceid=KR:ko"),
]

KEYWORDS = [
    "learning", "development", "talent", "training", "upskill", "reskill",
    "leadership", "onboarding", "learning culture", "skills", "HRD", "인재육성",
    "기업교육", "리더십", "온보딩", "직무교육", "학습", "교육"
]

def clean_html(text: str) -> str:
    return BeautifulSoup(text or "", "html.parser").get_text(" ", strip=True)

def published_at(entry):
    raw = entry.get("published") or entry.get("updated") or ""
    try:
        dt = dtparser.parse(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(KST)
    except Exception:
        return datetime.now(KST)

def collect_candidates():
    cutoff = datetime.now(KST) - timedelta(days=4)
    seen, rows = set(), []
    for source, url in FEEDS:
        feed = feedparser.parse(url)
        for e in feed.entries[:25]:
            link = e.get("link","")
            title = clean_html(e.get("title",""))
            summary = clean_html(e.get("summary","") or e.get("description",""))
            dt = published_at(e)
            haystack = f"{title} {summary}".lower()
            if not link or link in seen or dt < cutoff:
                continue
            if not any(k.lower() in haystack for k in KEYWORDS):
                continue
            seen.add(link)
            rows.append({
                "source": source,
                "title": title[:300],
                "summary": summary[:1600],
                "url": link,
                "published": dt.isoformat()
            })
    rows.sort(key=lambda x: x["published"], reverse=True)
    return rows[:40]

def load_existing():
    if not DATA.exists(): return []
    return json.loads(DATA.read_text(encoding="utf-8"))

def create_prompt(candidates, recent):
    recent_titles = [x["title"] for x in recent[-14:]]
    today = datetime.now(KST)
    return f"""
You are the curator of a Korean corporate HRD team's daily briefing.

TODAY: {today:%Y-%m-%d}
AUDIENCE: busy HRD / talent development practitioners in a large retail company.
GOAL: broaden their HRD perspective with one trustworthy, current, useful item.

Choose EXACTLY ONE candidate. Prioritize:
1) direct relevance to HRD/L&D/talent development,
2) source trustworthiness,
3) recency,
4) practical learning value,
5) novelty versus recent briefing titles.

Do NOT select general HR news unless the learning/talent-development implication is central.
Do NOT invent numbers, company practices, quotes, or claims not present in candidate metadata.
If candidate metadata is thin, write cautiously and avoid unsupported specifics.
Avoid duplicating these recent titles:
{json.dumps(recent_titles, ensure_ascii=False)}

Candidates:
{json.dumps(candidates, ensure_ascii=False)}

Return ONLY valid JSON with this exact shape:
{{
  "category": "short category such as AI × HRD / HRD Trend / 타사 HRD Case / Learning Design",
  "title": "Korean headline",
  "summary": [
    "Korean paragraph 1, 2-4 sentences",
    "Korean paragraph 2, 2-4 sentences",
    "Korean paragraph 3, 2-4 sentences"
  ],
  "bite_term": "one HRD concept",
  "bite_definition": "1-2 sentence Korean definition",
  "bite_line": "one memorable Korean sentence",
  "source_name": "source",
  "source_title": "original title",
  "source_url": "exact candidate URL",
  "tags": ["tag1","tag2","tag3"]
}}
"""

def extract_json(text: str):
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.S)
    start, end = text.find("{"), text.rfind("}")
    if start < 0 or end < 0:
        raise ValueError("No JSON object found in model output")
    return json.loads(text[start:end+1])

def validate(item, candidates):
    urls = {c["url"] for c in candidates}
    required = ["category","title","summary","bite_term","bite_definition",
                "bite_line","source_name","source_title","source_url","tags"]
    for k in required:
        if k not in item: raise ValueError(f"Missing {k}")
    if item["source_url"] not in urls:
        raise ValueError("Model returned a URL outside the candidate set")
    if not isinstance(item["summary"], list) or len(item["summary"]) != 3:
        raise ValueError("summary must contain exactly 3 paragraphs")
    if not isinstance(item["tags"], list) or not (2 <= len(item["tags"]) <= 5):
        raise ValueError("tags must contain 2-5 items")
    return item

def main():
    candidates = collect_candidates()
    if not candidates:
        print("No fresh HRD candidates found. Leaving the site unchanged.")
        return

    existing = load_existing()
    today = datetime.now(KST).strftime("%Y-%m-%d")
    if any(x.get("date") == today for x in existing):
        print(f"{today} already exists. Nothing to do.")
        return

    client = OpenAI()
    response = client.responses.create(
        model=os.getenv("OPENAI_MODEL", "gpt-5.6-luna"),
        input=create_prompt(candidates, existing)
    )
    drafted = validate(extract_json(response.output_text), candidates)

    weekday_ko = ["월","화","수","목","금","토","일"][datetime.now(KST).weekday()]
    drafted["date"] = today
    drafted["weekday"] = weekday_ko

    existing.append(drafted)
    existing.sort(key=lambda x: x["date"])
    DATA.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Published Daily HRD for {today}: {drafted['title']}")

if __name__ == "__main__":
    main()
