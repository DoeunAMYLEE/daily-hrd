
const state = { briefings: [], current: null };
const FEEDBACK_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwGRNgeLHQOz8M9bZ_iO0VNEOqcYu5QxtSP3VcvOvzpXPCRdKhed-8AAOmeAQdvyL2GXg/exec';

const CURATED_BOLD = {
  '2026-08-31': [
    '구성원의 공식 학습시간은 늘어난 반면, 1인당 직접 학습비용은 크게 감소',
    '2025년 구성원 1인당 연간 공식 학습시간은 평균 16.7시간',
    '2024년 1,254달러에서 2025년 846달러',
    'Talent Development 기능이 직접적으로 투입하는 학습 관련 비용의 평균치',
    '제한된 자원 안에서 학습을 더 효율적으로 제공해야 하는 압력이 커지고 있다는 신호',
    'Skill Gap 해소와 Learning Goal을 Organizational Goal에 연결',
    '교육 운영의 효율성과 Learning Impact를 증명하는 역량'
  ],
  '2026-09-01': [
    '기업들이 온라인과 오프라인 중 하나를 고르기보다 여러 학습방식을 함께 가져가고 있다는 모습',
    '교육 콘텐츠는 AI·디지털 중심으로 빠르게 변화하는데, 교육 전달방식은 오히려 오프라인까지 포함해 다양해지고 있다는 것',
    '학습목표와 상황에 맞는 다양한 방법을 활용하는 것이 중요',
    '동기식 학습과 비동기식 학습을 하나의 프로그램으로 연결',
    '효과적인 학습이 반드시 하나의 방식으로 이루어지는 것은 아니라는 점',
    '이 학습목표를 달성하려면 어떤 경험을 어디에 배치해야 할까?'
  ],
  '2026-09-02': [
    'L&D의 새로운 병목이 더 이상 ‘콘텐츠 제작’ 자체가 아니라 AI가 만들어낸 결과물을 제대로 검증하는 과정',
    'Confabulation',
    'AI의 앞과 뒤에 사람의 판단을 명확하게 배치',
    'Input Control',
    'Structural Audit',
    'Ground-Truth Verification',
    'L&D 기능은 점차 AI가 만들어내는 학습 결과물의 품질을 보증하는 역할',
    '좋은 학습 콘텐츠가 만들어지도록 기준을 설계하고 품질을 지키는 사람'
  ],
  '2026-09-03': [
    '구성원이 지속적으로 배우고 자신의 성장을 주도할 수 있는 Growth Culture',
    'Agility, Shared Outcomes, Skills Focus',
    '역할별 학습을 다르게 설계',
    '학습을 특정 교육일이나 LMS 안에서만 일어나게 하지 않고, 구성원의 실제 업무와 경력개발 과정 속에 학습 장치를 배치',
    'Manager와 Employee가 일상적으로 반복하는 업무 리듬 속에 포함',
    'Formal Learning과 일상적 개발 경험을 함께 연결',
    '교육 플랫폼, 경력개발, 관리자 대화, 멘토링, 역할별 Skill Development를 연결하는 Talent System',
    '학습을 업무 밖에 하나 더 얹는 것이 아니라, 업무와 성장의 과정 안에 학습이 자연스럽게 흘러가게 만드는 것'
  ],
  '2026-09-04': [
    'Professional Development의 범위는 이보다 훨씬 넓어지고 있습니다',
    '외부의 다양한 학습자원까지 포함하는 구조로 확장',
    '직장인의 86%가 Employer-Sponsored Professional Development에 참여한 경험',
    '이미 존재하는 양질의 학습자원을 발견하고 필요한 사람에게 연결하는 것 자체가 중요한 HRD 활동',
    'Content Curation 역량',
    '정확성, 최신성, 저작권, 접근권한',
    '이 학습자에게 지금 무엇이 필요한가?',
    '필요한 것을 발견하고, 믿을 만한지 검증하고, 학습자의 맥락에 맞게 연결하는 능력'
  ],
  '2026-09-07': [
    '우리 조직에 현재 어떤 Skill이 있고, 앞으로 어떤 Skill이 더 필요해질 것인가?',
    '핵심 Skill 가운데 평균 39%가 변화하거나 현재와 다른 수준의 역량을 요구',
    '63%의 기업이 Skill Gap을 2025~2030년 비즈니스 전환을 가로막는 주요 장벽',
    '85%는 이에 대응하기 위해 기존 구성원의 Upskilling을 우선 추진',
    '앞으로 필요한 Skill이 무엇인지, 현재 구성원이 어떤 Skill을 어느 수준으로 가지고 있는지, 그리고 그 둘 사이에 어떤 Gap이 존재하는지',
    '현재 영업 구성원의 Skill을 파악하고 → 앞으로 필요한 Skill을 정의하고 → Gap이 큰 영역을 찾아',
    '효과적으로 분류·관리하고 있다고 답한 HR Executive는 10%에 불과',
    'Skill Data가 검증 가능하고 신뢰할 수 있어야',
    'Business 변화 파악 → 필요한 Skill 정의 → 현재 Skill 파악 → Skill Gap 확인 → 적절한 Learning Experience 연결 → 변화 확인'
  ],
  '2026-09-08': [
    '구성원이 교육에서 배운 내용을 실제 업무에서 사용하고 있는가?',
    '교육만 잘 설계한다고 Transfer가 자동으로 일어나지는 않는다는 것',
    'Practice, Permission, Opportunity',
    'Manager를 꼽은 비율이 38%였던 반면, L&D를 꼽은 비율은 18%',
    '현업으로 Transfer하도록 지원한다고 응답한 비율은 36%',
    '동료 지원, 상사 지원, 조직 지원 모두 Training Transfer와 유의한 정적 관계',
    '관리자가 Transfer를 지원하기 쉽게 만드는 장치를 교육과 함께 설계',
    'Manager Performance 지표가 20~28% 개선',
    '이 사람이 돌아간 현업에는 배운 것을 써볼 수 있는 조건이 마련되어 있는가?'
  ],
  '2026-09-09': [
    '어떤 Business Outcome을 개선하려고 하며, 현재 무엇이 제대로 이루어지지 않고 있는가?',
    'Performance Gap의 원인을 지식·Skill 부족뿐 아니라 System Barrier와 Environmental Friction까지 포함',
    'Needs Analysis의 결과가 반드시 ‘교육과정’일 필요는 없습니다',
    '무언가 제대로 작동하지 않고 있다는 신호',
    '요청을 Partnership의 시작점으로 바라볼 것',
    'Quick Scan → Focused Sensemaking → Micro-Test',
    '업무 오류율, 문의가 집중되는 단계, 숙련까지 걸리는 시간, 시스템 사용 패턴',
    '교육 말고 바꿔야 할 시스템·프로세스·관리 방식은 없는지',
    '관리자 교육 + Conversation Guide + 면담시간 확보 + Performance 정보 제공의 조합',
    '어떤 문제에는 교육이 필요하고, 어떤 문제에는 다른 해결책이 필요한지를 구분',
    '이 교육으로 어떤 문제를 해결하고 싶은가요?'
  ]
};

function formatDate(dateStr, weekday){
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${weekday})`;
}
function localToday(){
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth()+1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
function publishedItems(items){
  const today = localToday();
  return items.filter(x => x.date <= today);
}
function latestForToday(items){
  const eligible = publishedItems(items).sort((a,b)=>b.date.localeCompare(a.date));
  return eligible[0] || null;
}
function escapeHTML(str){
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function renderRichText(str, date){
  let html = escapeHTML(str);
  (CURATED_BOLD[date] || []).forEach(phrase => {
    const safe = escapeHTML(phrase);
    html = html.split(safe).join(`<strong>${safe}</strong>`);
  });
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  return html;
}
function applyEditorialOverrides(items){
  return items.map(item => {
    if(item.date !== '2026-08-31') return item;
    return {
      ...item,
      source_name: 'ATD',
      source_title: 'Highlights From ATD’s 2026 State of the Industry Report',
      source_url: 'https://www.td.org/content/atd-blog/highlights-from-atd-s-2026-state-of-the-industry-report'
    };
  });
}
function renderBriefing(item){
  if(!item) return;
  state.current = item;
  document.title = `${item.title} | Daily HRD`;
  document.getElementById('todayLabel').textContent = formatDate(item.date, item.weekday);
  const card = document.getElementById('currentBriefing');
  card.innerHTML = `
    <div class="briefing-top">
      <div class="date-row">
        <strong>${formatDate(item.date, item.weekday)}</strong>
        <span class="category">${escapeHTML(item.category)}</span>
      </div>
      <div class="title-wrap">
        <div class="section-kicker"><span class="section-number">1</span> 오늘의 HRD Pick 🎯</div>
        <h2>${escapeHTML(item.title)}</h2>
      </div>
    </div>
    <div class="briefing-body">
      <div class="summary">
        ${item.summary.map(p=>`<p>${renderRichText(p, item.date)}</p>`).join('')}
      </div>
      <div class="source-box">
        <div class="source-meta">
          <small>출처 · ${escapeHTML(item.source_name)}</small>
          <strong>${escapeHTML(item.source_title)}</strong>
        </div>
        <a class="source-link" target="_blank" rel="noopener noreferrer" href="${item.source_url}">원문 보기 ↗</a>
      </div>
      <div class="bite">
        <div>
          <div class="section-kicker"><span class="section-number">2</span> 오늘의 HRD 한입 🍪</div>
          <h3>${escapeHTML(item.bite_term)}</h3>
        </div>
        <div class="bite-copy">
          <strong>${escapeHTML(item.bite_term)}</strong>
          <p>${escapeHTML(item.bite_definition)}</p>
          <p class="bite-line">${escapeHTML(item.bite_line)}</p>
        </div>
      </div>
      <div class="tags">${item.tags.map(t=>`<span class="tag">#${escapeHTML(t)}</span>`).join('')}</div>
    </div>`;
  restoreFeedback();
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderArchive(items){
  const list = document.getElementById('archiveList');
  const currentDate = state.current?.date;
  const filtered = publishedItems(items)
    .filter(x=>x.date !== currentDate)
    .sort((a,b)=>b.date.localeCompare(a.date));
  list.innerHTML = filtered.map(item=>`
    <button class="archive-item" data-date="${item.date}">
      <span class="mini-date">${formatDate(item.date,item.weekday)}</span>
      <span class="mini-cat">${escapeHTML(item.category)}</span>
      <h3>${escapeHTML(item.title)}</h3>
    </button>`).join('');
  list.querySelectorAll('.archive-item').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const found = publishedItems(state.briefings).find(x=>x.date===btn.dataset.date);
      if(!found) return;
      history.replaceState(null,'',`${location.pathname}${location.search}#${found.date}`);
      renderBriefing(found);
      renderArchive(filterItems(document.getElementById('searchInput').value));
    });
  });
}
function filterItems(query){
  const visible = publishedItems(state.briefings);
  const q = query.trim().toLowerCase();
  if(!q) return visible;
  return visible.filter(x =>
    [x.title,x.category,x.bite_term,...x.tags,...x.summary].join(' ').toLowerCase().includes(q)
  );
}
function ratingKey(){ return `daily-hrd-rating-${state.current?.date}`; }
function commentKey(){ return `daily-hrd-comment-${state.current?.date}`; }
function submittedKey(){ return `daily-hrd-feedback-submitted-${state.current?.date}`; }
function restoreFeedback(){
  const value = localStorage.getItem(ratingKey());
  const comment = localStorage.getItem(commentKey()) || '';
  const submitted = localStorage.getItem(submittedKey()) === 'true';
  const commentBox = document.getElementById('feedbackComment');
  const submitBtn = document.getElementById('feedbackSaveBtn');

  document.querySelectorAll('#rating button').forEach(b=>{
    b.classList.toggle('active', b.dataset.value===value);
    b.disabled = submitted;
  });

  if(commentBox){
    commentBox.value = comment;
    commentBox.disabled = submitted;
  }
  if(submitBtn){
    submitBtn.disabled = submitted;
    submitBtn.textContent = submitted ? '피드백 전송 완료' : '피드백 보내기';
  }

  const result = document.getElementById('ratingResult');
  if(submitted){
    result.textContent = '피드백을 보내주셨어요. 감사합니다!';
  } else if(value){
    result.textContent = `${value}점을 선택했어요.`;
  } else {
    result.textContent = '';
  }
}
async function submitFeedback(){
  const score = localStorage.getItem(ratingKey());
  const commentBox = document.getElementById('feedbackComment');
  const submitBtn = document.getElementById('feedbackSaveBtn');

  if(!score){
    showToast('먼저 1~5점 중 하나를 선택해 주세요.');
    return;
  }
  if(localStorage.getItem(submittedKey()) === 'true'){
    showToast('이미 피드백을 보내주셨어요.');
    return;
  }

  const comment = commentBox ? commentBox.value.trim() : '';
  if(comment) localStorage.setItem(commentKey(), comment);
  else localStorage.removeItem(commentKey());

  if(submitBtn){
    submitBtn.disabled = true;
    submitBtn.textContent = '보내는 중...';
  }

  const payload = {
    date: state.current.date,
    score: Number(score),
    comment,
    submittedAt: new Date().toISOString()
  };

  try{
    await fetch(FEEDBACK_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(payload),
      keepalive: true
    });
    localStorage.setItem(submittedKey(), 'true');
    restoreFeedback();
    showToast('피드백을 보냈어요. 감사합니다!');
  }catch(e){
    if(submitBtn){
      submitBtn.disabled = false;
      submitBtn.textContent = '피드백 보내기';
    }
    showToast('전송하지 못했어요. 잠시 후 다시 시도해 주세요.');
  }
}
function showToast(text){
  const el=document.getElementById('toast'); el.textContent=text; el.classList.add('show');
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>el.classList.remove('show'),1800);
}
async function shareCurrent(){
  const item=state.current;
  const text=`[Daily HRD] ${item.title}\n${item.bite_term} · ${item.bite_line}`;
  const url=location.href.split('#')[0] + `#${item.date}`;
  if(navigator.share){
    try{ await navigator.share({title:`Daily HRD | ${item.title}`,text,url}); return; }catch(e){}
  }
  try{ await navigator.clipboard.writeText(`${text}\n${url}`); showToast('공유 링크를 복사했어요.'); }
  catch(e){ showToast('주소창의 링크를 복사해 주세요.'); }
}
async function init(){
  const res=await fetch('data/briefings.json',{cache:'no-store'});
  state.briefings=applyEditorialOverrides(await res.json());
  const visible = publishedItems(state.briefings);
  const hash=location.hash.replace('#','');

  // Archive/search remain date-gated, but an exact #YYYY-MM-DD link can preview
  // any briefing that has already been prepared in the data file.
  const requested = state.briefings.find(x=>x.date===hash);
  state.current=requested || latestForToday(state.briefings);

  if(hash && !requested){
    history.replaceState(null,'',location.pathname + location.search);
  }

  if(!state.current){
    document.getElementById('currentBriefing').innerHTML='<div class="briefing-body"><p>아직 공개된 HRD 브리핑이 없습니다.</p></div>';
    renderArchive([]);
    return;
  }
  renderBriefing(state.current);
  renderArchive(visible);
}
document.getElementById('shareBtn').addEventListener('click',shareCurrent);
document.getElementById('searchInput').addEventListener('input',e=>renderArchive(filterItems(e.target.value)));
document.querySelectorAll('#rating button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    localStorage.setItem(ratingKey(),btn.dataset.value);
    restoreFeedback();
  });
});
document.getElementById('feedbackSaveBtn').addEventListener('click',submitFeedback);
window.addEventListener('hashchange',()=>{
  const hash=location.hash.replace('#','');
  const found=state.briefings.find(x=>x.date===hash);
  if(found){
    renderBriefing(found);
    renderArchive(filterItems(document.getElementById('searchInput').value));
  } else {
    const latest = latestForToday(state.briefings);
    if(hash){
      history.replaceState(null,'',location.pathname + location.search);
    }
    if(latest){
      renderBriefing(latest);
      renderArchive(filterItems(document.getElementById('searchInput').value));
    }
  }
});
init().catch(err=>{
  document.getElementById('currentBriefing').innerHTML=`<div class="briefing-body"><p>브리핑을 불러오지 못했습니다.</p><pre>${escapeHTML(err.message)}</pre></div>`;
});