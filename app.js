const app = document.getElementById('app')
document.getElementById('year').textContent = new Date().getFullYear()

// Fixed 20 questions (same for everyone)
const Q = [
  {id:1,  title:'동물', a:'강아지', b:'고양이', axis:'EI', aSide:'E', bSide:'I'},
  {id:2,  title:'음식', a:'자장면', b:'짬뽕', axis:'AM', aSide:'A', bSide:'M'},
  {id:3,  title:'휴일 보내기', a:'집에서 쉬기', b:'밖에서 놀기', axis:'EI', aSide:'I', bSide:'E'},
  {id:4,  title:'여행 스타일', a:'촘촘한 계획', b:'즉흥 여행', axis:'JP', aSide:'J', bSide:'P'},
  {id:5,  title:'대화 스타일', a:'직설적 표현', b:'돌려 말하기', axis:'TF', aSide:'T', bSide:'F'},
  {id:6,  title:'공부 방식', a:'이론 중심', b:'실습 중심', axis:'NS', aSide:'N', bSide:'S'},
  {id:7,  title:'영화 취향', a:'다큐멘터리', b:'판타지', axis:'NS', aSide:'S', bSide:'N'},
  {id:8,  title:'문제 해결', a:'데이터/분석', b:'사람/마음', axis:'TF', aSide:'T', bSide:'F'},
  {id:9,  title:'팀 갈등', a:'원인 규명 먼저', b:'분위기 수습 먼저', axis:'TF', aSide:'T', bSide:'F'},
  {id:10, title:'음악 즐기기', a:'이어폰 감상', b:'페스티벌', axis:'EI', aSide:'I', bSide:'E'},
  {id:11, title:'게임 취향', a:'전략·시뮬레이션', b:'액션·아케이드', axis:'JP', aSide:'J', bSide:'P'},
  {id:12, title:'작업 습관', a:'일찍 시작', b:'마감 직전 몰아', axis:'JP', aSide:'J', bSide:'P'},
  {id:13, title:'색 취향', a:'파랑', b:'빨강', axis:'AM', aSide:'A', bSide:'M'},
  {id:14, title:'사진 취향', a:'풍경 위주', b:'상상/콘셉트', axis:'NS', aSide:'S', bSide:'N'},
  {id:15, title:'날씨 취향', a:'겨울 선호', b:'여름 선호', axis:'AM', aSide:'A', bSide:'M'},
  {id:16, title:'책 취향', a:'철학·사고', b:'실용·노하우', axis:'NS', aSide:'N', bSide:'S'},
  {id:17, title:'운동 취향', a:'요가·산책', b:'크로스핏·축구', axis:'AM', aSide:'A', bSide:'M'},
  {id:18, title:'선물 고르기', a:'실용성', b:'감성', axis:'TF', aSide:'T', bSide:'F'},
  {id:19, title:'모임 규모', a:'소수 깊게', b:'다수 넓게', axis:'EI', aSide:'I', bSide:'E'},
  {id:20, title:'작업 환경', a:'조용한 개인실', b:'활기찬 오픈스페이스', axis:'JP', aSide:'J', bSide:'P'},
]

// State (persist for accidental refresh)
const KEY = 'balance20_state_v1'
let state = JSON.parse(localStorage.getItem(KEY) || '{}')
state.step ??= 1
state.answers ??= [] // array of 'A'|'B'
state.scores ??= {E:0,I:0,N:0,S:0,T:0,F:0,J:0,P:0,A:0,M:0}
save()

const axisNames = {
  E:'외향', I:'내향',
  N:'직관', S:'현실',
  T:'분석', F:'공감',
  J:'계획', P:'즉흥',
  A:'안정', M:'모험',
}
const axisPairs = [['E','I'],['N','S'],['T','F'],['J','P'],['A','M']]

function save(){ localStorage.setItem(KEY, JSON.stringify(state)) }
function reset(){
  state = {step:1, answers:[], scores:{E:0,I:0,N:0,S:0,T:0,F:0,J:0,P:0,A:0,M:0}}
  save()
}

render()

function render(){
  if (state.step===1 && state.answers.length===0){
    return renderIntro()
  }
  if (state.step>Q.length){ return renderResult() }
  const q = Q[state.step-1]
  app.innerHTML = `
    <section class="card" aria-live="polite">
      <div class="header">
        <span class="badge">BALANCE-20</span>
        <span class="badge">Q ${state.step}/${Q.length}</span>
        <span class="right help">선택 즉시 다음 질문으로 넘어갑니다 · 단축키 <span class="kbd">A</span>/<span class="kbd">B</span></span>
      </div>
      <div class="title">${q.id}. ${q.title}</div>
      <div class="subtitle">하나를 고른다면?</div>
      <div class="progress"><span style="width:${Math.round((state.step-1)/Q.length*100)}%"></span></div>
      <div class="options">
        <button class="btn" id="btnA"><span>🅰️</span> ${q.a}</button>
        <button class="btn" id="btnB"><span>🅱️</span> ${q.b}</button>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn secondary" id="restart">처음부터</button>
      </div>
    </section>
  `
  document.getElementById('btnA').onclick = ()=> choose('A', q)
  document.getElementById('btnB').onclick = ()=> choose('B', q)
  document.getElementById('restart').onclick = ()=>{ reset(); render() }
  // keyboard
  const once = (e)=>{
    if (e.key.toLowerCase()==='a' || e.key==='ArrowLeft') choose('A', q)
    if (e.key.toLowerCase()==='b' || e.key==='ArrowRight') choose('B', q)
    window.removeEventListener('keydown', once)
  }
  window.addEventListener('keydown', once)
}

function renderIntro(){
  app.innerHTML = `
    <section class="card center">
      <div class="header" style="justify-content:center">
        <span class="badge">BALANCE-20</span>
      </div>
      <div class="title">밸런스 20 — 성향 테스트</div>
      <p class="subtitle">20개의 고정된 밸런스 질문을 순서대로 고르면, 당신의 성향을 분석해 드립니다.</p>
      <div class="progress"><span style="width:0%"></span></div>
      <div class="options" style="max-width:680px;margin:0 auto">
        <button class="btn" id="startBtn">시작하기</button>
        <button class="btn secondary" id="clearBtn">이전 기록 삭제</button>
      </div>
      <p class="help" style="margin-top:12px">모든 사용자가 동일한 20문항을 받습니다. 서버 없이 브라우저만으로 작동하며, 기록은 내 기기에만 저장됩니다.</p>
    </section>
  `
  document.getElementById('startBtn').onclick = ()=>{ state.step=1; state.answers=[]; state.scores={E:0,I:0,N:0,S:0,T:0,F:0,J:0,P:0,A:0,M:0}; save(); render() }
  document.getElementById('clearBtn').onclick = ()=>{ localStorage.removeItem(KEY); reset(); render() }
}

function choose(which, q){
  state.answers.push(which)
  // score
  const side = which==='A' ? q.aSide : q.bSide
  state.scores[side]++
  state.step++
  save()
  // small transition delay
  setTimeout(render, 60)
}

function renderResult(){
  // compute axis winners
  const winners = axisPairs.map(([L,R])=>{
    const lv = state.scores[L], rv = state.scores[R]
    const letter = lv===rv ? (L+'/'+R) : (lv>rv?L:R)
    const diff = Math.abs(lv-rv)
    const pctL = Math.round(lv/(lv+rv)*100)
    const pctR = 100-pctL
    return {L,R,lv,rv,letter,diff,pctL,pctR}
  })
  // top 2 axes for title
  const sorted = [...winners].sort((a,b)=>b.diff-a.diff)
  const nameParts = []
  for (let i=0;i<2;i++){
    const w = sorted[i]
    const letter = w.letter.includes('/') ? w.L+'/'+w.R : w.letter
    nameParts.push(axisNames[letter.split('/')[0]] + (letter.includes('/')?'/'+axisNames[letter.split('/')[1]]:''))
  }
  const typeName = nameParts.join(' ') + '형'

  const chips = winners.map(w => {
    const left = `${axisNames[w.L]} ${w.pctL}%`
    const right = `${axisNames[w.R]} ${w.pctR}%`
    return `<div class="axis">
      <small>${left}</small>
      <div class="bar"><span style="width:${w.pctL}%;"></span></div>
      <small style="text-align:right">${right}</small>
    </div>`
  }).join('')

  const features = buildFeatures(winners)

  app.innerHTML = `
    <section class="card">
      <div class="header">
        <span class="badge">BALANCE-20</span>
        <span class="badge">완료</span>
        <span class="right help">다시 하려면 아래 버튼을 누르세요</span>
      </div>
      <div class="result-title">당신은 <mark style="background:transparent;color:#fff">${typeName}</mark> 사람입니다.</div>
      <div class="chips">
        ${axisPairs.map(([L,R])=>`<span class="chip">${axisNames[L]} vs ${axisNames[R]}</span>`).join('')}
      </div>
      <div class="subtitle">요약 특징</div>
      <ul>
        ${features.map(t=>`<li>${t}</li>`).join('')}
      </ul>
      <div class="subtitle" style="margin-top:18px">축약 통계</div>
      ${chips}
      <div class="actions">
        <button class="btn" id="retry">다시하기</button>
        <button class="btn secondary" id="share">결과 복사</button>
      </div>
    </section>
  `
  document.getElementById('retry').onclick = ()=>{ reset(); render() }
  document.getElementById('share').onclick = ()=>{
    const text = `밸런스20 결과: ${typeName} — `+ winners.map(w=>`${axisNames[w.L]} ${w.pctL}% / ${axisNames[w.R]} ${w.pctR}%`).join(' · ')
    navigator.clipboard.writeText(text).then(()=>alert('결과를 복사했어요!')).catch(()=>{})
  }
}

function buildFeatures(winners){
  const map = {}
  winners.forEach(w=>{
    const letter = w.letter.includes('/') ? (w.pctL>=50?w.L:w.R) : w.letter
    map[w.L+w.R] = letter
  })
  const f = []
  // EI
  if (map['EI']==='E') f.push('사람들 사이에서 에너지를 얻고, 다양한 상황에 쉽게 적응합니다.')
  else if (map['EI']==='I') f.push('혼자만의 시간에서 집중력이 올라가며, 깊이 있는 대화를 선호합니다.')
  else f.push('상황에 따라 에너지 원천이 바뀌는 균형형입니다.')
  // NS
  if (map['NS']==='N') f.push('큰 그림과 가능성을 먼저 보고, 새로운 아이디어에 설렙니다.')
  else if (map['NS']==='S') f.push('구체적 사실과 현실적 판단을 중시하며, 실행력이 좋습니다.')
  else f.push('직관과 현실을 번갈아 사용해 상황을 입체적으로 봅니다.')
  // TF
  if (map['TF']==='T') f.push('의사결정에서 논리·근거를 중시하고, 문제의 핵심을 정밀하게 짚습니다.')
  else if (map['TF']==='F') f.push('상대의 감정과 관계를 고려해 조화로운 해법을 찾습니다.')
  else f.push('논리와 공감의 균형을 맞추며 설득과 중재에 강점이 있습니다.')
  // JP
  if (map['JP']==='J') f.push('계획을 세워 질서 있게 진행하며, 마감 관리가 뛰어납니다.')
  else if (map['JP']==='P') f.push('유연하게 흐름을 타며, 기회가 보이면 과감히 전환합니다.')
  else f.push('계획과 즉흥을 상황에 맞게 섞는 실용형입니다.')
  // AM
  if (map['AM']==='A') f.push('안정과 지속을 중시해 꾸준한 성과를 냅니다.')
  else if (map['AM']==='M') f.push('새로움과 자극을 즐기며, 도전에서 동력을 얻습니다.')
  else f.push('안정과 변화의 최적점을 탐색하는 균형 추구자입니다.')
  return f
}
