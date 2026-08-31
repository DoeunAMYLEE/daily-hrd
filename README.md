# Daily HRD Curation

롯데마트·슈퍼 인재육성팀용 **Daily HRD Curation prototype**입니다.

## 사이트 고정 포맷
1. 오늘의 HRD Pick
2. 오늘의 HRD 한입
3. 오늘의 자료 유익도 1~5점

추가 기능:
- 지난 브리핑 아카이브
- 키워드 검색
- 날짜별 고유 URL(`#2026-09-02`) 공유
- 모바일 Web Share / 데스크톱 링크 복사
- 개인 브라우저 기준 1~5점 평가(localStorage)

## 자동화 흐름

`신뢰 소스 RSS → 최근 HRD 후보 수집 → AI 1건 선정/초안 → URL 검증 → briefings.json 저장 → 사이트 자동 반영`

GitHub Actions가 평일 오전 8:30(KST)에 실행되도록 설정되어 있습니다.

> 중요: 현재 버전은 prototype이라 AI 초안을 곧바로 게시합니다. 사내 정식 운영 시에는
> `자동 초안 생성 → 담당자 검수 → 게시` 방식으로 전환하는 것을 권장합니다.

## 로컬에서 보기

브라우저의 보안정책 때문에 `index.html`을 더블클릭하기보다 간단한 로컬 서버로 실행하세요.

```bash
python -m http.server 8000
```

그 다음 `http://localhost:8000` 접속.

## GitHub Pages로 공개하기

1. 새 GitHub repository 생성
2. 이 폴더의 파일 전체 업로드
3. Repository `Settings → Secrets and variables → Actions`에서
   `OPENAI_API_KEY` secret 추가
4. `Settings → Pages`에서 `Deploy from a branch`
5. Branch를 `main / root`로 선택

이후 `data/briefings.json`이 매일 업데이트되면 Pages 사이트에도 반영됩니다.

## Vercel로 공개하기

GitHub repository를 Vercel에 연결한 후 별도 Build Command 없이 정적 사이트로 배포할 수 있습니다.
GitHub Actions가 데이터를 갱신해 push할 때 Vercel이 자동 재배포합니다.

## 소스 변경

`scripts/generate_briefing.py`의 `FEEDS`를 수정하면 됩니다.
처음에는 소스를 너무 많이 넣지 말고, 3~5개 그룹을 일주일간 튜닝하는 방식을 권장합니다.

## 평가 데이터에 대해

현재 별점은 **각 사용자의 브라우저 localStorage**에만 저장됩니다.
팀 전체 평균을 보고 싶다면 추후 Supabase / Firebase / Google Forms / 사내 DB 같은
공용 저장소를 연결해야 합니다.
