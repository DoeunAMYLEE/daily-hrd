
const state = { briefings: [], current: null };

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
        ${item.summary.map(p=>`<p>${escapeHTML(p)}</p>`).join('')}
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
  restoreRating();
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
function restoreRating(){
  const value = localStorage.getItem(ratingKey());
  document.querySelectorAll('#rating button').forEach(b=>b.classList.toggle('active', b.dataset.value===value));
  document.getElementById('ratingResult').textContent = value ? `${value}점으로 남겨주셨어요. 감사합니다!` : '';
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
  state.briefings=await res.json();
  const visible = publishedItems(state.briefings);
  const hash=location.hash.replace('#','');
  const requested = visible.find(x=>x.date===hash);
  state.current=requested || latestForToday(state.briefings);

  // If someone opens a future/unpublished date URL, remove the future hash
  // and show the latest published briefing instead.
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
    restoreRating();
  });
});
window.addEventListener('hashchange',()=>{
  const hash=location.hash.replace('#','');
  const visible = publishedItems(state.briefings);
  const found=visible.find(x=>x.date===hash);
  if(found){
    renderBriefing(found);
    renderArchive(filterItems(document.getElementById('searchInput').value));
  } else if(hash){
    const latest = latestForToday(state.briefings);
    history.replaceState(null,'',location.pathname + location.search);
    if(latest){
      renderBriefing(latest);
      renderArchive(filterItems(document.getElementById('searchInput').value));
    }
  }
});
init().catch(err=>{
  document.getElementById('currentBriefing').innerHTML=`<div class="briefing-body"><p>브리핑을 불러오지 못했습니다.</p><pre>${escapeHTML(err.message)}</pre></div>`;
});
