// ================= state =================
const S={sg:'all',ss:'all',user:null,view:'home',tab:'analytics',flagF:'all',distF:'all',q:'',page:0,sel:null,svc:null,modal:null,regRole:'citizen',toast:null,ptab:'queue',svcLimit:24};
// Bridge for React (LegacyPortal) — classic-script const is not on window by default
window.HIE = window.HIE || {};
window.HIE.S = S;
const C=id=>citizens.find(c=>c.id===id);
const stageName=k=>k==='monitor'?'Monitoring':(STAGES.find(s=>s[0]===k)||['',k])[1];
const flagPill=f=>`<span class="flag ${f}">${t(f[0].toUpperCase()+f.slice(1))}</span>`;
const ORD={red:0,yellow:1,green:2};
const sortQ=a=>a.sort((x,y)=>ORD[x.flag]-ORD[y.flag]);
function toast(t){S.toast=t;render();clearTimeout(toast.h);toast.h=setTimeout(()=>{S.toast=null;render()},2600)}
const vitalsHtml=v=>`<div class="vitals"><span class="vt ${cls(one('bp',{sbp:v.sbp,dbp:v.dbp}))}">BP ${v.sbp}/${v.dbp}</span><span class="vt ${cls(one('sugar',v.sugar))}">Sugar ${v.sugar}</span><span class="vt ${cls(one('spo2',v.spo2))}">SpO₂ ${v.spo2}%</span><span class="vt ${cls(one('pulse',v.pulse))}">Pulse ${v.pulse}</span><span class="vt ${cls(one('bmi',v.bmi))}">BMI ${v.bmi}</span></div>`;
const head=(eyebrow,title,sub)=>`<div class="sec-h"><div class="sec" style="gap:6px"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${sub?`<p class="muted" style="max-width:70ch">${sub}</p>`:''}</div></div>`;
const kpi=(n,l,c='',d='')=>`<div class="kpi ${c}"><span class="n">${n}</span><span class="l">${l}</span>${d?`<span class="d">${d}</span>`:''}</div>`;
const ptabs=list=>`<div class="tabs" role="tablist">${list.map(t=>`<button class="tab" role="tab" data-a="ptab" data-t="${t[0]}" aria-selected="${S.ptab===t[0]}">${t[1]}${t[2]!=null?` <span class="cnt">${t[2]}</span>`:''}</button>`).join('')}</div>`;
