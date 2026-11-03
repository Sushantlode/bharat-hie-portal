// ================= 45 services =================
const codeLbl=(c,long)=>c==='Ext'?(long?'Bharat HIE extension (outside WHO list)':'Bharat HIE extension'):c==='NHP'?(long?'National Health Programme, MoHFW':'National Health Programme'):'WHO '+c;
const stPill=st=>`<span class="pill ${STATUS[st][1]}">${t(STATUS[st][0])}</span>`;
const nf=n=>n.toLocaleString('en-IN');
function svcSection(){
 const live=SV.filter(s=>s.st==='live').length;
 const q=(S.sq||'').trim().toLowerCase();const list=SV.filter(s=>(S.sg==='all'||s.grp===S.sg)&&(!q||(svName(s)+' '+s.name+' '+s.desc+' '+GROUPS[s.grp]+' '+t(GROUPS[s.grp])).toLowerCase().includes(q)));
 const limit=S.svcLimit||24;const page=list.slice(0,limit);const more=list.length>page.length;
 const grps=Object.keys(GROUPS).filter(g=>page.some(s=>s.grp===g));
 const tile=(s,sel)=>`<button class="ss-tile" data-a="svc-pick" data-s="${s.k}" aria-pressed="${s.k===sel.k}">${sico(s)}<b>${svName(s)}</b></button>`;
 return`<div class="sec-h"><div><span class="wwo-eye">${t("What we offer")}</span></div></div>
 <div class="filters">${[['all','All']].concat(Object.entries(GROUPS)).map(([g,n])=>`<button class="chip" data-a="sg" data-g="${g}" aria-pressed="${S.sg===g}">${g==='all'?t(n):g+' · '+t(n)}</button>`).join('')}</div>
 ${q?`<p class="srch-res" role="status"><b>${list.length}</b> ${list.length===1?'service matches':'services match'} “${esc(S.sq)}” <button class="btn sm" data-a="sq-clear">Clear search</button></p>`:''}${q&&!list.length?`<div class="empty">No services match “${esc(S.sq)}”. Try another word, such as pharmacy, dialysis or TB.</div>`:''}
 ${page.length?(()=>{const sel=page.find(s=>s.k===S.svcSel)||list.find(s=>s.k===S.svcSel)||page[0];return`<div class="ss-wrap"><div class="ss-left">${grps.map(g=>`<div class="ss-grp"><h3><span class="mono" style="color:var(--core)">${g}</span> · ${t(GROUPS[g])} <span class="muted small">(${list.filter(s=>s.grp===g).length})</span></h3>
  <div class="ss-tiles">${page.filter(s=>s.grp===g).map(s=>tile(s,sel)).join('')}</div></div>`).join('')}${more?`<div id="svc-scroll-more" aria-busy="true" aria-label="Loading more services"><div class="hie-skel sk-row"></div><div class="hie-skel sk-row"></div><p class="small muted" style="margin:4px 0 0">Loading more services… ${page.length} of ${list.length}</p></div>`:`<div id="svc-scroll-more" data-done="1"></div>`}</div>
  <aside class="ss-panel" aria-live="polite">${svcPanel(sel)}</aside></div>`})():''}`;
}
const SS_FEAT={A:['Linked to the citizen\'s ABHA / eHS health card','Receives e-Prescriptions, test orders and referrals','Red, yellow and green flags shared in real time','Follow-up and monitoring on one shared record'],
 B:['Live dashboards for administrators','Records shared with consent and a full audit trail','Connected to state and national systems','Ready reports for programme reviews'],
 C:['One trusted registry for identities and facilities','Built on FHIR, SNOMED CT and ABDM standards','Searchable by authorised providers','Updated in real time'],
 D:['Data from every connected provider in one place','AI and analytics for early warnings','Maps and dashboards for district and state teams','Privacy by design with consent controls'],
 E:['Red flags reach responders within minutes','Ambulance and Command Centre linked to the citizen record','Outbreak alerts by district','Field teams and NGOs coordinated on one screen'],
 F:['Wellness services linked to the citizen\'s health record','Verified centres and practitioners','Book sessions and track progress','Works alongside clinical care'],
 G:['Programme screening and treatment on one record','Patients tracked from detection to cure','Automatic reporting to programme dashboards','Reminders for follow-up and medicines'],
 H:['A Bharat HIE Global Platform module','Linked to the citizen\'s single login','Works on web and mobile','Partner onboarding open'],
 I:['Linked to livestock owners and veterinary teams','Disease reporting and vaccination tracking','Mobile veterinary units on call through 1962','One Health link with human disease surveillance']};
function svcPanel(s){
 const roleName=s.role==='admin'?'Admin':(ROLES.find(r=>r.k===s.role)||{n:'Citizen'}).n;
 const st2=s.rec?[nf(s.rec),t('Records this month')]:[s.uptime||'99.9%','API uptime'];
 return`<div class="ss-top">${sico(s)}<div><h2>${svName(s)}</h2><p>${s.desc}</p></div></div>
 <div class="ss-body"><p class="ss-txt">${svName(s)} is connected to Bharat HIE, so records, orders and referrals move with the citizen's consent. ${t(GROUPS[s.grp])} · opens the ${t(roleName)} dashboard.</p>
  <div class="ss-stats"><div><b>${s.count}</b><span>${s.unit}</span></div><div><b>${st2[0]}</b><span>${st2[1]}</span></div></div>
  <ul class="ss-feat">${(SS_FEAT[s.grp]||SS_FEAT.A).map(f=>`<li>${f}</li>`).join('')}</ul>
  ${provSection(s)}
  <div class="row">${TOOLS[s.k]?`<button class="btn pri" data-a="mod" data-s="${s.k}">📊 Open dashboard →</button>`:''}<button class="btn ${TOOLS[s.k]?'':'pri'}" data-a="as" data-r="${s.role}">${t("Open as")} ${t(roleName)}${TOOLS[s.k]?'':' →'}</button><button class="btn" data-a="svc" data-s="${s.k}">${t('View details')}</button></div>${TOOLS[s.k]?`<p class="small muted">Inside: ${TOOLS[s.k].map(k=>TOOL_NAME[k]).join(' · ')}</p>`:''}</div>`;
}
function barChart(m){
 const W=420,H=150,pl=44,pb=24,pt=10,max=Math.max(1,...m.map(x=>x.v)),bw=(W-pl-10)/m.length;
 const nice=v=>{const p=Math.pow(10,Math.floor(Math.log10(v)));return Math.ceil(v/p)*p};const top=nice(max);
 const Y=v=>pt+(1-v/top)*(H-pt-pb);
 return`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Records per month">${[0,.5,1].map(f=>`<line x1="${pl}" x2="${W-6}" y1="${Y(top*f)}" y2="${Y(top*f)}" stroke="var(--line)"/><text x="${pl-6}" y="${Y(top*f)+4}" text-anchor="end">${nf(Math.round(top*f))}</text>`).join('')}
 ${m.map((x,i)=>`<rect x="${pl+i*bw+bw*.18}" y="${Y(x.v)}" width="${bw*.64}" height="${Math.max(0,H-pb-Y(x.v))}" rx="3" fill="${i===m.length-1?'var(--core)':'color-mix(in srgb,var(--core) 45%,var(--surface))'}"/><text x="${pl+i*bw+bw/2}" y="${H-7}" text-anchor="middle">${x.m}</text>`).join('')}</svg>`;
}
