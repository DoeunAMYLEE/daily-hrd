
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
    '모두가 알아야 하는 공통 기반은 넓게 제공하되, 실제 업무에 필요한 심화역량은 수준과 직무에 따라 다르게 설계하는 방식',
    'GenAI PowerUser Program',
    '총 4단계',
    '직무와 요구되는 전문성에 따라 학습경로가 갈라집니다.',
    '80% 이상이 2단계 과정을 수료',
    '실제 현업 과제를 수행해 전문성을 검증',
    '교육의 끝을 수료에만 두지 않았다는 것',
    '2,500명의 임직원을 대상으로 서비스 실효성을 검증',
    '전 직원 교육이냐, 맞춤형 교육이냐’ 중 하나를 선택하는 문제가 아니라는 점',
    '우리 구성원 모두가 알아야 하는 수준은 어디까지이고, 직무별로 달라져야 하는 역량은 무엇이며, 누가 더 깊은 전문가로 성장해야 하는가?'
  ],
  '2026-09-04': [
    '배울 시간이 없다',
    '직업훈련이 필요한 인원은 약 15만 명, 현원 대비 30.2%',
    '과중한 업무로 인한 교육시간 확보 부족’이 41.6%로 가장 큰 제약요인',
    '업무량은 그대로인데 학습만 업무 사이에 추가된다면 학습은 결국 ‘남는 시간에 해야 하는 일’이 될 수 있습니다.',
    '48%가 업무 또는 가족으로 인한 시간 부족을 가장 중요한 이유',
    '시간 제약을 주요 장벽으로 꼽은 비율이 60% 이상인 국가',
    '교육 참여율을 학습자의 의지만으로 설명해서는 안 된다는 것',
    '조직이 ‘이 시간은 학습에 사용해도 된다’고 명확하게 인정해주는 구조',
    '교육받을 기회, 업무에서 빠져나올 수 있는 시간, 그리고 학습해도 괜찮다는 조직의 허용',
    '배울 수 있는 조건을 만드는 것'
  ],
  '2026-09-07': [
    'AI가 들어온 뒤 우리 구성원에게 어떤 역량이 새롭게 필요해졌고, 그 변화는 어떻게 확인할 것인가?',
    '구성원의 역량을 어떻게 변화시키고, 그 변화를 어떻게 측정할 것인가',
    '앞으로 필요한 Skill이 무엇인지, 현재 구성원이 어떤 Skill을 어느 수준으로 가지고 있는지, 그리고 그 둘 사이에 어떤 Gap이 있는지를 지속적으로 파악하는 것',
    '2030년까지 근로자의 핵심 Skill 가운데 평균 39%가 변화할 것',
    '63%는 Skill Gap을 사업 전환의 가장 큰 장벽',
    '85%는 이에 대응하기 위해 기존 구성원의 Upskilling을 우선 추진',
    '환경이 바뀔 때마다 교육과정을 하나씩 추가하는 것만으로는 조직의 역량 변화를 따라가기 어렵기 때문입니다.',
    'Skill을 조직 안에서 같은 의미로 사용할 수 있는 공통 언어',
    '그 데이터가 검증 가능하고 신뢰할 수 있어야 한다',
    '조직의 역량이 실제로 어떻게 변하고 있는지를 읽고 그 변화에 맞춰 육성 방향을 계속 조정해야 합니다.',
    '우리 조직이 앞으로 해야 할 일을 위해 어떤 Skill이 필요하고, 그 Skill은 지금 어디에 있으며, 무엇을 더 키워야 하는가?'
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

const SEP7_OVERRIDE = {
  date: '2026-09-07',
  weekday: '월',
  category: 'HRD Trend',
  title: '직무보다 ‘스킬’을 먼저 본다 — HRD에도 필요한 Skill Intelligence',
  summary: [
    'AI가 업무에 빠르게 들어오면서 기업의 관심도 조금씩 달라지고 있습니다. 처음에는 “어떤 AI를 도입할 것인가?”가 중요한 질문이었다면, 이제는 “AI가 들어온 뒤 우리 구성원에게 어떤 역량이 새롭게 필요해졌고, 그 변화는 어떻게 확인할 것인가?”가 중요한 과제가 되고 있습니다.',
    'KMA는 HR 트렌드 리포트에서 이러한 흐름을 Skill Intelligence라는 키워드로 제시합니다. KMA는 AI가 업무환경에 스며들면서 기업의 고민이 단순한 기술 도입을 넘어 구성원의 역량을 어떻게 변화시키고, 그 변화를 어떻게 측정할 것인가로 이동하고 있다고 설명합니다. 특히 교육 역시 단순히 과정을 제공하는 것보다 실제 업무 적용과 행동 변화, 나아가 조직의 성과로 이어지는지를 확인하는 것이 중요해지고 있다고 봅니다.',
    '그렇다면 Skill Intelligence는 단순히 우리 회사에 어떤 Skill이 필요한지를 목록으로 만드는 것일까요? 핵심은 그보다 조금 더 넓습니다. 앞으로 필요한 Skill이 무엇인지, 현재 구성원이 어떤 Skill을 어느 수준으로 가지고 있는지, 그리고 그 둘 사이에 어떤 Gap이 있는지를 지속적으로 파악하는 것에 가깝습니다.',
    '왜 이런 관점이 필요할까요? 기존 HRD는 주로 ‘직무’를 기준으로 교육을 설계해 왔습니다. 영업교육, MD교육, 점장교육처럼 직무나 역할을 먼저 정하고 그 안에 필요한 과정을 배치하는 방식입니다. 하지만 같은 직무라도 실제로 수행하는 업무와 필요한 Skill은 계속 달라질 수 있습니다. 몇 년 전 영업직무에서 상품지식과 고객응대가 핵심이었다면, 지금은 Data 활용, 생성형 AI 활용, Omni-channel 고객 이해와 같은 새로운 Skill이 함께 요구될 수 있습니다.',
    '이러한 변화의 속도는 상당합니다. World Economic Forum의 「Future of Jobs Report 2025」에 따르면 기업들은 2030년까지 근로자의 핵심 Skill 가운데 평균 39%가 변화할 것으로 예상했습니다. 또한 기업의 63%는 Skill Gap을 사업 전환의 가장 큰 장벽으로 꼽았고, 85%는 이에 대응하기 위해 기존 구성원의 Upskilling을 우선 추진할 계획이라고 답했습니다. 전 세계 근로자를 100명으로 가정하면 59명은 2030년까지 추가적인 Training이 필요할 것으로 전망됐습니다.',
    '여기서 KMA가 제시한 Skill Intelligence의 의미가 조금 더 선명해집니다. 환경이 바뀔 때마다 교육과정을 하나씩 추가하는 것만으로는 조직의 역량 변화를 따라가기 어렵기 때문입니다. 먼저 사업과 업무가 어떻게 변하고 있는지를 보고, 그 변화가 어떤 Skill을 요구하는지 확인하고, 현재 조직이 그 Skill을 얼마나 보유하고 있는지를 알아야 어떤 사람에게 어떤 학습이 필요한지도 판단할 수 있습니다.',
    '예를 들어 새로운 AI Tool을 전사에 도입한다고 생각해볼 수 있습니다. 기존 방식이라면 전 직원 대상 AI 교육과정을 먼저 만들 수 있습니다. 하지만 Skill Intelligence 관점에서는 질문의 순서가 달라질 수 있습니다. 어떤 업무가 AI 때문에 달라지는가? → 그 업무를 수행하려면 어떤 새로운 Skill이 필요한가? → 현재 구성원은 그 Skill을 어느 정도 가지고 있는가? → Gap이 큰 사람과 작은 사람은 누구인가? → 각각 어떤 Learning Experience가 필요한가? 이렇게 보면 교육 대상과 내용도 달라집니다. 모든 구성원에게 동일한 과정을 제공하기보다 기본 AI Literacy가 필요한 사람, 업무 적용 Skill이 필요한 사람, 전문적인 AI 활용역량이 필요한 사람을 구분하고 서로 다른 학습경로를 연결할 수 있습니다. 9/3에 살펴본 삼성전자의 단계별 AI 육성체계 역시 이러한 관점에서 연결해볼 수 있습니다.',
    '하지만 Skill Intelligence를 실제로 운영하는 것은 생각보다 쉽지 않습니다. 가장 먼저 필요한 것은 Skill을 조직 안에서 같은 의미로 사용할 수 있는 공통 언어입니다. Deloitte의 「The Skills-Based Organization」 관련 연구에서는 Skills Taxonomy나 Framework를 효과적으로 구축하고 있다고 답한 HR Executive가 10%에 불과한 반면, 85%는 관련 작업을 어느 정도 추진하고 있다고 답했습니다. Skill 중심 HR에 대한 관심은 높지만, 실제 데이터를 사용할 수 있는 수준으로 정리하는 것은 여전히 어려운 과제라는 의미입니다.',
    '데이터의 정확성도 중요합니다. 구성원에게 “Data Analysis 역량이 어느 정도인가요?”라고 물어 자기평가 결과만 모으면 같은 4점이라도 사람마다 기준이 다를 수 있습니다. 실제 프로젝트 경험, 수행한 업무, 평가 결과, 학습이력, 자격이나 인증 등 여러 신호를 함께 봐야 보다 신뢰할 수 있는 Skill Data가 됩니다. Deloitte 역시 배치·승진·보상처럼 중요한 People Decision에 Skill 데이터를 활용하려면 그 데이터가 검증 가능하고 신뢰할 수 있어야 한다고 지적합니다.',
    '이 때문에 최근에는 AI를 활용해 직무정보, 업무경험, 학습기록 등의 데이터를 분석하고 구성원의 Skill을 추론하거나, 필요한 Skill과 학습 콘텐츠를 연결하는 기술도 확대되고 있습니다. 하지만 여기서 중요한 것은 AI 자체가 아닙니다. AI가 Skill을 추정해준다고 해서 조직이 무엇을 육성해야 하는지가 자동으로 결정되는 것은 아니기 때문입니다. 어떤 Skill이 사업에 중요한지 판단하고, 어떤 수준까지 육성할지 결정하며, 그 결과를 실제 Learning과 Career Opportunity에 연결하는 것은 여전히 HR과 현업의 역할입니다.',
    'KMA 리포트가 Skill Intelligence를 HR의 주요 키워드로 제시한 이유도 여기에 있다고 볼 수 있습니다. AI 시대의 HRD는 단순히 새로운 교육 콘텐츠를 빠르게 제공하는 데서 끝나는 것이 아니라, 조직의 역량이 실제로 어떻게 변하고 있는지를 읽고 그 변화에 맞춰 육성 방향을 계속 조정해야 합니다. 교육의 결과 역시 ‘몇 명이 수료했는가?’에서 끝나는 것이 아니라, 필요한 Skill이 실제로 개발됐는지, 업무에서 활용되고 있는지를 확인하는 방향으로 확장될 필요가 있습니다.',
    'HRD 관점에서 이를 실무적으로 정리하면 Business 변화 파악 → 필요한 Skill 정의 → 현재 Skill 파악 → Skill Gap 확인 → 적절한 Learning Experience 연결 → Skill 변화 확인의 흐름으로 이해해볼 수 있습니다. 이 단계는 KMA가 공식적으로 제시한 6단계 모델이라기보다, KMA가 강조하는 ‘역량 변화의 파악과 측정’이라는 관점을 HRD 업무에 적용하기 쉽게 구조화한 것입니다.',
    '결국 Skill Intelligence가 HRD에게 던지는 질문은 “어떤 교육과정을 새로 만들까?”보다 조금 앞에 있습니다. “우리 조직이 앞으로 해야 할 일을 위해 어떤 Skill이 필요하고, 그 Skill은 지금 어디에 있으며, 무엇을 더 키워야 하는가?” 이 질문에 답할 수 있을 때 HRD는 교육과정을 운영하는 역할을 넘어, 조직의 역량 변화를 읽고 필요한 성장을 연결하는 역할에 더 가까워질 수 있습니다.'
  ],
  bite_term: 'Skill Intelligence',
  bite_definition: '조직이 현재 어떤 Skill을 가지고 있는지, 앞으로 어떤 Skill이 필요해질지, 그리고 그 사이에 어떤 Gap이 있는지를 데이터 기반으로 지속적으로 파악하고 활용하는 접근입니다. 단순한 Skill List와 달리 Need에서 앞으로 필요한 Skill을 정의하고, Know에서 현재 누가 어떤 Skill을 가지고 있는지 파악한 뒤, Gap을 확인하고, Develop 단계에서 교육·OJT·Coaching·Project 등 적절한 경험을 연결하고, Update에서 실제 Skill 변화와 새로운 요구를 계속 반영하는 흐름으로 이해할 수 있습니다. Need → Know → Gap → Develop → Update는 특정 기관의 공식 Skill Intelligence 모델이 아니라 이번 개념을 이해하기 위해 정리한 실무적 흐름입니다.',
  bite_line: '교육과정을 먼저 보기 전에, 우리 조직에 어떤 Skill이 필요하고 무엇이 부족한지부터 봐야 합니다.',
  source_name: 'KMA 한국능률협회',
  source_title: 'HR 트렌드 리포트',
  source_url: 'https://studio.kma.or.kr/member/feed/detail/916',
  sources: [
    {
      name: 'KMA 한국능률협회',
      title: 'HR 트렌드 리포트',
      url: 'https://studio.kma.or.kr/member/feed/detail/916'
    },
    {
      name: 'World Economic Forum',
      title: 'Future of Jobs Report 2025',
      url: 'https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf'
    },
    {
      name: 'Deloitte',
      title: 'The Skills-Based Organization',
      url: 'https://www2.deloitte.com/us/en/insights/topics/talent/organizational-skill-based-hiring.html'
    }
  ],
  tags: ['HRD Trend', 'Skill Intelligence', 'Skills-First', 'Upskilling']
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
    if(item.date === '2026-08-31'){
      return {
        ...item,
        source_name: 'ATD',
        source_title: 'Highlights From ATD’s 2026 State of the Industry Report',
        source_url: 'https://www.td.org/content/atd-blog/highlights-from-atd-s-2026-state-of-the-industry-report'
      };
    }
    if(item.date === '2026-09-07') return {...item, ...SEP7_OVERRIDE};
    return item;
  });
}
function itemSources(item){
  if(Array.isArray(item.sources) && item.sources.length) return item.sources;
  return [{name:item.source_name,title:item.source_title,url:item.source_url}];
}
function renderSources(item){
  return itemSources(item).map(source=>`
      <div class="source-box">
        <div class="source-meta">
          <small>출처 · ${escapeHTML(source.name)}</small>
          <strong>${escapeHTML(source.title)}</strong>
        </div>
        <a class="source-link" target="_blank" rel="noopener noreferrer" href="${source.url}">원문 보기 ↗</a>
      </div>`).join('');
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
      ${renderSources(item)}
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