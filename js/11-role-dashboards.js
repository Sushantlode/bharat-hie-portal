// ================= admin =================
function adminView(){
 const n=f=>citizens.filter(c=>c.flag===f).length;
 const q={bpo:citizens.filter(c=>['new','bpo','follow'].includes(c.stage)).length,kpo:citizens.filter(c=>c.stage==='kpo').length,cc:citizens.filter(c=>c.stage==='cc').length};
 const tabs=[['analytics','Live analytics',null],['overview','All citizens',citizens.length],['districts','Districts',null],['bpo','BPO queue',q.bpo],['kpo','KPO review',q.kpo],['cc','Command Centre',q.cc],['services','Services',SV.length],['providers','Providers',providers.length]];
 const body={analytics:analyticsView,overview,districts:districtView,bpo:bpoView,kpo:kpoView,cc:ccView,services:servicesView,providers:providersView}[S.tab]();
 return`<section class="sec">${head('Admin · '+P.full,'Citizen health monitoring',`Live status of ${citizens.length} citizens in the demo. Updated ${fmt(NOW)}.`)}
  <div class="kpis">
   <button class="kpi b" data-a="flagF" data-f="all"><span class="n">${citizens.length}</span><span class="l">Citizens in view</span><span class="d">+6 registered today</span></button>
   <button class="kpi r" data-a="flagF" data-f="red"><span class="n">${n('red')}</span><span class="l">Red · act now</span><span class="d">${SLA.red}</span></button>
   <button class="kpi y" data-a="flagF" data-f="yellow"><span class="n">${n('yellow')}</span><span class="l">Yellow · watch</span><span class="d">${SLA.yellow}</span></button>
   <button class="kpi g" data-a="flagF" data-f="green"><span class="n">${n('green')}</span><span class="l">Green · normal</span><span class="d">${SLA.green}</span></button>
  </div>
  <div class="tabs" role="tablist">${tabs.map(t=>`<button class="tab" role="tab" data-a="tab" data-t="${t[0]}" aria-selected="${S.tab===t[0]}">${t[1]}${t[2]!=null?` <span class="cnt">${t[2]}</span>`:''}</button>`).join('')}</div>
  ${body}</section>`;
}
function overview(){
 const max=Math.max(1,...STAGES.map(s=>citizens.filter(c=>c.stage===s[0]).length));
 const dists=[...new Set(citizens.map(c=>c.district))].sort();
 let list=citizens.filter(c=>(S.flagF==='all'||c.flag===S.flagF)&&(S.distF==='all'||c.district===S.distF)&&(!S.q||(c.name+c.card.no).toLowerCase().includes(S.q.toLowerCase())));
 sortQ(list);const per=12,pages=Math.max(1,Math.ceil(list.length/per));S.page=Math.min(S.page,pages-1);const rows=list.slice(S.page*per,S.page*per+per);
 const feed=citizens.flatMap(c=>c.log.filter(l=>l.by!=='HIE').map(l=>({...l,c}))).sort((a,b)=>b.d-a.d).slice(0,9);
 return`<div class="split" style="grid-template-columns:1.6fr 1fr"><div class="sec"><h3>Where citizens are in the care loop</h3><div class="funnel">${STAGES.map(s=>{const n=citizens.filter(c=>c.stage===s[0]).length;return`<div class="fs"><span class="n">${n}</span><span class="l">${s[1]}</span><span class="bar"><i style="width:${n/max*100}%"></i></span></div>`}).join('')}</div>
  <div class="kpis">${kpi(pharmacyQ.filter(o=>!o.done).length,'Prescriptions awaiting pharmacy')}${kpi(labQ.filter(o=>!o.done).length,'Lab orders pending')}${kpi(bloodReq.filter(r=>!r.done).length,'Blood requests open')}${kpi(ngoTasks.filter(t=>!t.done).length,'NGO visits pending')}</div></div>
  <div class="panel"><h3 style="margin-bottom:6px">Recent activity</h3><div class="feed">${feed.map(f=>`<div><time>${fmt(f.d)}</time><span><b>${esc(f.by)}</b> · ${esc(f.c.name)}: ${esc(f.t)}</span></div>`).join('')}</div></div></div>
 <div class="filters">${['all','red','yellow','green'].map(f=>`<button class="chip" data-a="flagF" data-f="${f}" aria-pressed="${S.flagF===f}">${f==='all'?'All':f[0].toUpperCase()+f.slice(1)}</button>`).join('')}
  <select class="inp" id="distF" aria-label="District"><option value="all">All districts</option>${dists.map(d=>`<option ${S.distF===d?'selected':''}>${d}</option>`).join('')}</select>
  <input class="inp" id="q" placeholder="Search name or card number" value="${esc(S.q)}" aria-label="Search">
  <span class="muted small">${list.length} citizens</span></div>
 <div class="tbl-wrap"><table><thead><tr><th>Citizen</th><th>Health card</th><th>District</th><th>Flag</th><th>Reason</th><th>Current stage</th><th>Last update</th><th></th></tr></thead><tbody>
 ${rows.map(c=>`<tr><td><b>${esc(c.name)}</b><div class="muted" style="font-size:12px">${c.age} · ${c.sex} · ${c.source}</div></td><td class="mono">${c.card.type}<br>${c.card.no}</td><td>${esc(c.district)}</td><td>${flagPill(c.flag)}</td><td style="max-width:220px;font-size:12.5px">${c.reasons.join(', ')}</td><td><span class="stage ${c.stage==='monitor'?'done':''}">${stageName(c.stage)}</span>${c.loop>1?`<div class="loopn">Loop #${c.loop}</div>`:''}</td><td class="mono">${fmt(c.log[c.log.length-1].d)}</td><td><button class="btn sm" data-a="open" data-c="${c.id}">View</button></td></tr>`).join('')||`<tr><td colspan="8" class="muted">No citizens match this filter</td></tr>`}
 </tbody></table></div>
 <div class="pager"><span>Page ${S.page+1} of ${pages}</span><button class="btn sm" data-a="pg" data-d="-1" ${S.page===0?'disabled':''}>Previous</button><button class="btn sm" data-a="pg" data-d="1" ${S.page>=pages-1?'disabled':''}>Next</button></div>`;
}
function districtView(){
 const ds=[...new Set(citizens.map(c=>c.district))].map(d=>{const l=citizens.filter(c=>c.district===d);return{d,n:l.length,r:l.filter(c=>c.flag==='red').length,y:l.filter(c=>c.flag==='yellow').length,g:l.filter(c=>c.flag==='green').length,open:l.filter(c=>c.stage!=='monitor').length}}).sort((a,b)=>b.r-a.r||b.n-a.n);
 return`<div class="tbl-wrap"><table><thead><tr><th>District</th><th class="num">Citizens</th><th class="num">Red</th><th class="num">Yellow</th><th class="num">Green</th><th>Flag mix</th><th class="num">Open cases</th><th></th></tr></thead><tbody>
 ${ds.map(x=>`<tr><td><b>${esc(x.d)}</b></td><td class="num">${x.n}</td><td class="num" style="color:var(--red);font-weight:700">${x.r}</td><td class="num" style="color:var(--amb);font-weight:700">${x.y}</td><td class="num" style="color:var(--grn);font-weight:700">${x.g}</td><td><div class="sbar"><i class="r" style="width:${x.r/x.n*100}%"></i><i class="y" style="width:${x.y/x.n*100}%"></i><i class="g" style="width:${x.g/x.n*100}%"></i></div></td><td class="num">${x.open}</td><td><button class="btn sm" data-a="dist" data-d="${esc(x.d)}">Citizens</button></td></tr>`).join('')}</tbody></table></div>
 <p class="note">Government dashboards show only these aggregated counts down to taluka and Gram Panchayat level. Individual records open only for authorised clinical staff.</p>`;
}
function caseCard(c,inner){return`<div class="card ${c.flag[0]}"><div class="card-h"><div><b>${esc(c.name)}</b><div class="muted" style="font-size:12px">${c.age} · ${c.sex} · ${esc(c.district)} · <span class="mono">${c.card.no}</span></div></div>${flagPill(c.flag)}</div>${vitalsHtml(c.v)}<div style="font-size:12.5px">${c.reasons.join(', ')}</div>${inner}<button class="btn sm" data-a="open" data-c="${c.id}" style="align-self:flex-start">Full history</button></div>`}
function bpoView(){
 const calls=sortQ(citizens.filter(c=>['new','bpo'].includes(c.stage))),fol=sortQ(citizens.filter(c=>c.stage==='follow'));
 const done=citizens.flatMap(c=>c.log.filter(l=>l.by==='BPO').map(l=>({...l,c}))).sort((a,b)=>b.d-a.d).slice(0,8);
 return`<div class="kpis">${kpi(calls.filter(c=>c.flag==='red').length,'Red calls due','r','Within 1 hour')}${kpi(calls.filter(c=>c.flag==='yellow').length,'Yellow calls due','y','Within 48 hours')}${kpi(fol.length,'Follow-ups due','b')}${kpi(42,'Agents on shift','','Pune & Nagpur centres')}</div>
 <h3>Calls to make</h3>${calls.length?`<div class="cards">${calls.map(c=>caseCard(c,`<span class="sla ${c.flag}">${SLA[c.flag]}</span><span class="muted" style="font-size:12.5px">Mobile: <span class="mono">${c.mobile.replace(/(\d{5})(\d{5})/,'$1 $2')}</span> · Facility: ${esc(c.fac)}</span>
  <label class="fld">Call outcome<select class="inp" id="bpo-${c.id}"><option>Spoke to citizen, symptoms confirmed</option><option>Spoke to citizen, feeling fine</option><option>No answer, retry</option></select></label>
  <button class="btn pri sm" data-a="bpo-done" data-c="${c.id}" style="align-self:flex-start">Log call and send to KPO</button>`)).join('')}</div>`:'<div class="empty">No calls pending</div>'}
 <h3>Follow-up after treatment</h3>${fol.length?`<div class="cards">${fol.map(c=>caseCard(c,`<p style="font-size:12.5px">Medicines and tests are complete. Record new vitals from the phone call, PHC or home device. The flag will be recalculated.</p>
  <div class="grid3">${[['sbp','Systolic'],['dbp','Diastolic'],['sugar','Sugar'],['spo2','SpO₂'],['pulse','Pulse']].map(([k,l])=>`<label class="fld">${l}<input class="inp" type="number" id="f-${c.id}-${k}" value="${followGuess(c,k)}"></label>`).join('')}</div>
  <button class="btn pri sm" data-a="follow" data-c="${c.id}" style="align-self:flex-start">Recalculate flag</button>`)).join('')}</div>`:'<div class="empty">No follow-ups pending</div>'}
 <h3>Recent calls</h3><div class="tbl-wrap"><table><thead><tr><th>Time</th><th>Citizen</th><th>Flag</th><th>Outcome</th></tr></thead><tbody>${done.map(x=>`<tr><td class="mono">${fmt(x.d)}</td><td>${esc(x.c.name)}</td><td>${flagPill(x.c.flag)}</td><td>${esc(x.t.replace('BPO call: ',''))}</td></tr>`).join('')}</tbody></table></div>`;
}
function followGuess(c,k){const v=c.v[k];if(k==='sbp')return Math.max(118,v-28);if(k==='dbp')return Math.max(76,v-16);if(k==='sugar')return v<70?104:Math.max(112,Math.round(v*.62));if(k==='spo2')return Math.min(98,v+3);if(k==='pulse')return v>100?Math.round(v*.78):v;return v}
function kpoView(){
 const l=sortQ(citizens.filter(c=>c.stage==='kpo'));
 return`<div class="kpis">${kpi(l.length,'Cases awaiting review','b')}${kpi(14,'Reviewed today')}${kpi('18 min','Avg. review time')}${kpi(6,'Clinical analysts on shift')}</div>
 ${l.length?`<div class="cards">${l.map(c=>caseCard(c,`<p style="font-size:12.5px"><b>BPO note:</b> ${esc((c.log.filter(x=>x.by==='BPO').pop()||{t:'—'}).t)}</p>
 <p style="font-size:12.5px"><b>History:</b> ${c.hist.length} readings, ${c.rx.length} prescriptions, ${c.reports.length} lab reports</p>
 <label class="fld">Decision<select class="inp" id="kpo-${c.id}"><option value="cc">Needs consultation, send to Command Centre</option><option value="monitor">No consultation needed, monitor</option></select></label>
 <button class="btn pri sm" data-a="kpo-done" data-c="${c.id}" style="align-self:flex-start">Save decision</button>`)).join('')}</div>`:'<div class="empty">No cases waiting for KPO review</div>'}`;
}
function ccView(){
 const l=sortQ(citizens.filter(c=>c.stage==='cc'));
 return`<div class="kpis">${kpi(l.length,'Cases to assign','r')}${kpi(11,'Ambulances available','','Linked to 108')}${kpi(DOCS.length,'Doctors on duty')}${kpi(bloodReq.filter(r=>!r.done).length,'Open blood requests')}</div>
 ${l.length?`<div class="cards">${l.map(c=>caseCard(c,`<div class="grid2">
  <label class="fld">Doctor<select class="inp" id="cc-doc-${c.id}">${DOCS.map(d=>`<option value="${d.name}">${d.name} · ${d.spec}</option>`).join('')}</select></label>
  <label class="fld">Mode<select class="inp" id="cc-mode-${c.id}"><option>e-Consultation</option><option>Hospital visit</option>${c.flag==='red'?'<option selected>Ambulance + emergency</option>':''}</select></label>
  <label class="fld">NGO follow-up<select class="inp" id="cc-ngo-${c.id}"><option value="">None</option>${NGOS.map(n=>`<option>${n}</option>`).join('')}</select></label>
  <label class="fld">Blood needed<select class="inp" id="cc-bl-${c.id}"><option value="">No</option>${Object.keys(blood).map(g=>`<option>${g}</option>`).join('')}</select></label></div>
  <button class="btn ${c.flag==='red'?'red':'pri'} sm" data-a="cc-done" data-c="${c.id}" style="align-self:flex-start">Assign and send to doctor</button>`)).join('')}</div>`:'<div class="empty">No cases in the Command Centre</div>'}`;
}
function providersView(){
 return`<div class="kpis">${kpi(providers.filter(p=>p.api==='Connected').length,'Connected','g')}${kpi(providers.filter(p=>p.api==='Testing').length,'In sandbox testing','y')}${kpi(providers.filter(p=>p.api==='Pending verification').length,'Pending verification','r')}</div>
 <div class="tbl-wrap"><table><thead><tr><th>Type</th><th>Name</th><th>Location</th><th>API status</th><th>Last sync</th><th></th></tr></thead><tbody>${providers.map((p,i)=>`<tr><td><span class="role-tag">${esc(p.svc?svName(SV.find(x=>x.k===p.svc)):ROLES.find(r=>r.k===p.role).n)}</span></td><td><b>${esc(p.name)}</b></td><td>${esc(p.org)}</td><td><span class="pill ${p.api==='Connected'?'ok':p.api==='Testing'?'warn':'bad'}">${p.api}</span></td><td class="mono">${p.sync?fmt(p.sync):'—'}</td><td>${p.api==='Pending verification'?`<button class="btn sm pri" data-a="approve" data-o="${i}">Approve</button>`:''}</td></tr>`).join('')}</tbody></table></div>`;
}

// ================= doctor =================
function doctorView(){
 const l=sortQ(citizens.filter(c=>c.stage==='consult'));
 const recent=citizens.flatMap(c=>c.rx.map(r=>({r,c}))).sort((a,b)=>b.r.d-a.r.d).slice(0,10);
 const sched=[...l.map((c,i)=>({t:`${pad(10+Math.floor(i/2),2)}:${i%2?'30':'00'}`,c,what:c.mode||'e-Consultation',st:'Waiting'})),...citizens.filter(c=>c.flag==='green').slice(0,4).map((c,i)=>({t:`${pad(16+Math.floor(i/2),2)}:${i%2?'30':'00'}`,c,what:'Routine check-up',st:'Booked'}))];
 return`<section class="sec">${head('Doctor · '+esc(DOCS[0].org),'Good afternoon, '+esc(S.user.name),'Patients assigned by the Command Centre appear here. Sending a prescription routes it to the pharmacy and lab automatically.')}
 <div class="kpis">${kpi(l.length,'Waiting for consultation','r')}${kpi(9,'Seen today','g')}${kpi(sched.length,'Appointments today','b')}${kpi('6 / 3','Tele / in-person today')}</div>
 ${ptabs([['queue','Consultation queue',l.length],['sched','Today\'s schedule',sched.length],['recent','Recent prescriptions',recent.length]])}
 ${S.ptab==='sched'?`<div class="tbl-wrap"><table><thead><tr><th>Time</th><th>Patient</th><th>Flag</th><th>Type</th><th>Status</th></tr></thead><tbody>${sched.sort((a,b)=>a.t.localeCompare(b.t)).map(s=>`<tr><td class="mono">${s.t}</td><td><b>${esc(s.c.name)}</b> <span class="muted small">${s.c.age} · ${s.c.sex}</span></td><td>${flagPill(s.c.flag)}</td><td>${esc(s.what)}</td><td><span class="pill ${s.st==='Waiting'?'warn':'info'}">${s.st}</span></td></tr>`).join('')}</tbody></table></div>`
 :S.ptab==='recent'?`<div class="tbl-wrap"><table><thead><tr><th>Rx no.</th><th>Date</th><th>Patient</th><th>Medicines</th><th>Tests</th></tr></thead><tbody>${recent.map(({r,c})=>`<tr><td class="mono">${r.id}</td><td class="mono">${fmt(r.d)}</td><td>${esc(c.name)}</td><td style="font-size:12.5px">${r.meds.join(', ')}</td><td style="font-size:12.5px">${r.tests.join(', ')}</td></tr>`).join('')}</tbody></table></div>`
 :l.length?`<div class="cards">${l.map(c=>caseCard(c,`<p style="font-size:12.5px"><b>Assigned:</b> ${esc(c.doctor||'')} · ${esc(c.mode||'')}</p>
  <div class="fld">Medicines<div class="checks">${MEDS.map((m,i)=>`<label><input type="checkbox" id="m-${c.id}-${i}" ${suggestMeds(c).includes(m)?'checked':''}>${m}</label>`).join('')}</div></div>
  <div class="fld">Tests<div class="checks">${TESTS.map((t,i)=>`<label><input type="checkbox" id="t-${c.id}-${i}" ${suggestTests(c).includes(t)?'checked':''}>${t}</label>`).join('')}</div></div>
  <label class="fld">Advice<input class="inp" id="adv-${c.id}" value="Low salt diet, 30 min walk daily, review in 2 weeks"></label>
  <button class="btn pri sm" data-a="rx" data-c="${c.id}" style="align-self:flex-start">Send e-Prescription</button>`)).join('')}</div>`:'<div class="empty">No consultations waiting. Assign a case from Admin → Command Centre.</div>'}
 </section>`;
}
// ================= pharmacy =================
function pharmView(){
 const l=pharmacyQ.filter(o=>!o.done),d=pharmacyQ.filter(o=>o.done).sort((a,b)=>b.at-a.at),low=MEDSTOCK.filter(m=>m[1]<m[2]);
 return`<section class="sec">${head('Pharmacist · '+ORG.pharmacist,'Prescription desk','The citizen gives their card number and the e-Prescription appears here. Dispensing updates their health record.')}
 <div class="kpis">${kpi(l.length,'Prescriptions waiting','y')}${kpi(d.length+21,'Dispensed this week','g')}${kpi(low.length,'Items below reorder level','r')}${kpi(MEDSTOCK.length,'Medicines in stock list')}</div>
 ${ptabs([['queue','Waiting',l.length],['done','Dispensed',d.length],['stock','Inventory',MEDSTOCK.length]])}
 ${S.ptab==='done'?`<div class="tbl-wrap"><table><thead><tr><th>Time</th><th>Rx no.</th><th>Citizen</th><th>Medicines</th><th>Prescribed by</th></tr></thead><tbody>${d.map(o=>`<tr><td class="mono">${fmt(o.at)}</td><td class="mono">${o.rx.id}</td><td>${esc(C(o.cid).name)}</td><td style="font-size:12.5px">${o.rx.meds.join(', ')}</td><td>${esc(o.rx.by)}</td></tr>`).join('')}</tbody></table></div>`
 :S.ptab==='stock'?`<div class="tbl-wrap"><table><thead><tr><th>Medicine</th><th class="num">In stock</th><th class="num">Reorder level</th><th>Status</th></tr></thead><tbody>${MEDSTOCK.map(m=>`<tr><td><b>${m[0]}</b></td><td class="num">${m[1].toLocaleString('en-IN')}</td><td class="num">${m[2]}</td><td><span class="pill ${m[1]<m[2]?'bad':'ok'}">${m[1]<m[2]?'Reorder':'OK'}</span></td></tr>`).join('')}</tbody></table></div>`
 :l.length?`<div class="cards">${l.map(o=>{const c=C(o.cid);return`<div class="card ${c.flag[0]}"><div class="card-h"><div><b>${esc(c.name)}</b><div class="mono muted">${c.card.no}</div></div><span class="mono">${o.rx.id}</span></div><div class="small muted">${esc(o.rx.by)} · ${fmt(o.rx.d)}</div><ul style="margin:0;padding-left:18px">${o.rx.meds.map(m=>`<li>${esc(m)} <span class="muted small">· 30 days</span></li>`).join('')}</ul><div class="small"><b>Advice:</b> ${esc(o.rx.advice||'')}</div><button class="btn pri sm" data-a="dispense" data-o="${pharmacyQ.indexOf(o)}" style="align-self:flex-start">Mark as dispensed</button></div>`}).join('')}</div>`:'<div class="empty">No prescriptions waiting</div>'}
 </section>`;
}
// ================= lab =================
function labView(){
 const l=labQ.filter(o=>!o.done),d=labQ.filter(o=>o.done).sort((a,b)=>b.at-a.at);
 return`<section class="sec">${head('Pathologist · '+ORG.pathologist,'Test orders','Reports appear in the citizen\'s health record and on the Admin dashboard as soon as they are uploaded.')}
 <div class="kpis">${kpi(l.length,'Orders pending','y')}${kpi(d.length+34,'Reports this week','g')}${kpi('5.2 h','Avg. turnaround')}${kpi(3,'Abnormal results today','r')}</div>
 ${ptabs([['queue','Pending orders',l.length],['done','Completed reports',d.length]])}
 ${S.ptab==='done'?`<div class="tbl-wrap"><table><thead><tr><th>Uploaded</th><th>Rx no.</th><th>Citizen</th><th>Results</th></tr></thead><tbody>${d.map(o=>`<tr><td class="mono">${fmt(o.at)}</td><td class="mono">${o.rx.id}</td><td>${esc(C(o.cid).name)}</td><td style="font-size:12.5px">${(o.res||[]).map(r=>`${esc(r.name)}: <b>${esc(r.val)}</b>`).join(' · ')}</td></tr>`).join('')}</tbody></table></div>`
 :l.length?`<div class="cards">${l.map(o=>{const c=C(o.cid),i=labQ.indexOf(o);return`<div class="card ${c.flag[0]}"><div class="card-h"><div><b>${esc(c.name)}</b><div class="mono muted">${c.card.no}</div></div><span class="mono">${o.rx.id}</span></div><div class="small muted">Ordered by ${esc(o.rx.by)} · ${fmt(o.rx.d)}</div>
  ${o.rx.tests.map((t,j)=>`<label class="fld">${esc(t)} result<input class="inp" id="lab-${i}-${j}" value="${labVal(t,c)}"></label>`).join('')}
  <button class="btn pri sm" data-a="report" data-o="${i}" style="align-self:flex-start">Upload report</button></div>`}).join('')}</div>`:'<div class="empty">No pending test orders</div>'}
 </section>`;
}
// ================= blood bank =================
function bloodView(){
 const tot=Object.values(blood).reduce((a,b)=>a+b,0);
 return`<section class="sec">${head('Blood Bank · '+ORG.bloodbank,'Stock and requests','Requests raised by the Command Centre for high-risk citizens arrive here.')}
 <div class="kpis">${kpi(tot,'Units in stock','b')}${kpi(bloodReq.filter(r=>!r.done).length,'Open requests','r')}${kpi(donations.reduce((a,d)=>a+d[1],0),'Units collected (3 weeks)','g')}${kpi(Object.values(blood).filter(n=>n<5).length,'Groups below 5 units','y')}</div>
 <div class="kpis">${Object.entries(blood).map(([g,n])=>`<div class="kpi ${n<5?'r':''}"><span class="n">${n}</span><span class="l">${g} units${n<5?' · low':''}</span></div>`).join('')}</div>
 ${ptabs([['queue','Requests',bloodReq.length],['done','Donor camps',donations.length]])}
 ${S.ptab==='done'?`<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Camp</th><th class="num">Units</th></tr></thead><tbody>${donations.map(d=>`<tr><td class="mono">${fmtD(d[2])}</td><td>${d[0]}</td><td class="num">${d[1]}</td></tr>`).join('')}</tbody></table></div>`
 :`<div class="tbl-wrap"><table><thead><tr><th>Raised</th><th>Citizen</th><th>Hospital</th><th>Group</th><th class="num">Units</th><th>Status</th><th></th></tr></thead><tbody>${bloodReq.map((r,i)=>`<tr><td class="mono">${fmt(r.d)}</td><td>${esc(C(r.cid).name)}</td><td>${esc(r.hosp)}</td><td><b>${r.g}</b></td><td class="num">${r.units}</td><td>${r.done?'<span class="pill ok">Issued</span>':'<span class="pill bad">Pending</span>'}</td><td>${r.done?'':`<button class="btn pri sm" data-a="issue" data-o="${i}" ${blood[r.g]<r.units?'disabled':''}>Issue ${r.units} unit${r.units>1?'s':''}</button>`}</td></tr>`).join('')}</tbody></table></div>`}
 </section>`;
}
// ================= ngo =================
function ngoView(){
 const open=ngoTasks.filter(t=>!t.done),done=ngoTasks.filter(t=>t.done);
 return`<section class="sec">${head('NGO · '+ORG.ngo,'Field follow-up','Citizens assigned by the Command Centre for home visits, medicine adherence and counselling.')}
 <div class="kpis">${kpi(open.length,'Visits pending','y')}${kpi(done.length+18,'Visits this month','g')}${kpi(12,'Field workers active')}${kpi(3,'Districts covered')}</div>
 ${ptabs([['queue','Pending visits',open.length],['done','Completed visits',done.length]])}
 ${S.ptab==='done'?`<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Citizen</th><th>District</th><th>NGO</th><th>Note</th></tr></thead><tbody>${done.map(t=>{const c=C(t.cid);return`<tr><td class="mono">${fmt(t.d)}</td><td>${esc(c.name)}</td><td>${esc(c.district)}</td><td>${esc(t.ngo)}</td><td>${esc(t.note)}</td></tr>`}).join('')}</tbody></table></div>`
 :open.length?`<div class="cards">${open.map(t=>{const c=C(t.cid);return caseCard(c,`<p style="font-size:12.5px"><b>${esc(t.ngo)}</b> · assigned ${fmt(t.d)}</p><label class="fld">Visit note<input class="inp" id="ngo-${ngoTasks.indexOf(t)}" value="Taking medicines regularly, BP checked at home"></label><button class="btn pri sm" data-a="visit" data-o="${ngoTasks.indexOf(t)}" style="align-self:flex-start">Record home visit</button>`)}).join('')}</div>`:'<div class="empty">No visits pending</div>'}
 </section>`;
}
// ================= citizen =================
function trendChart(h){
 const W=520,H=150,pl=34,pr=10,pt=12,pb=26,max=Math.max(200,...h.map(x=>x.sbp))+10,min=60;
 const X=i=>pl+i*(W-pl-pr)/(h.length-1),Y=v=>pt+(max-v)/(max-min)*(H-pt-pb);
 const line=k=>h.map((x,i)=>`${X(i).toFixed(1)},${Y(x[k]).toFixed(1)}`).join(' ');
 const ticks=[80,120,160,200].filter(t=>t<=max);
 return`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Blood pressure trend">
  ${ticks.map(t=>`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="var(--line)"/><text x="${pl-6}" y="${Y(t)+4}" text-anchor="end">${t}</text>`).join('')}
  <line x1="${pl}" x2="${W-pr}" y1="${Y(140)}" y2="${Y(140)}" stroke="var(--amb)" stroke-dasharray="4 4"/>
  <polyline points="${line('sbp')}" fill="none" stroke="var(--core)" stroke-width="2.2"/><polyline points="${line('dbp')}" fill="none" stroke="var(--prov)" stroke-width="2.2"/>
  ${h.map((x,i)=>`<circle cx="${X(i)}" cy="${Y(x.sbp)}" r="3.5" fill="var(--core)"/><circle cx="${X(i)}" cy="${Y(x.dbp)}" r="3.5" fill="var(--prov)"/><text x="${X(i)}" y="${H-8}" text-anchor="middle">${x.d.toLocaleDateString('en-IN',{month:'short'})}</text>`).join('')}
 </svg><div class="row small muted"><span style="color:var(--core);font-weight:700">● Systolic</span><span style="color:var(--prov);font-weight:700">● Diastolic</span><span style="color:var(--amb);font-weight:700">- - 140 limit</span></div>`;
}
function citizenView(){
 if(S.hcView==='form')return hcFormPage();
 if(S.hcView==='done')return hcDonePage();
 const c=C(S.user.cid);
 return`<section class="sec">${head('Citizen · My Health Record','Hello, '+esc(c.name.split(' ')[0]),`Member since ${fmtD(c.since)} · Linked facility: ${esc(c.fac)}`)}
 <div class="hero" style="grid-template-columns:1fr 1.2fr"><div class="idcard"><div class="row" style="justify-content:space-between"><b>${c.card.type}</b><span class="sub">Bharat HIE · Maharashtra</span></div><div class="mono">${c.card.no}</div><div>${esc(c.name)}</div><div class="row sub"><span>${c.age} yrs · ${c.sex==='F'?'Female':'Male'}</span><span>${esc(c.district)}</span><span>Scheme: ${c.scheme}</span></div></div>
  <div class="panel sec"><div class="row" style="justify-content:space-between"><h3>My health status</h3>${flagPill(c.flag)}</div>${vitalsHtml(c.v)}<p style="font-size:13px">${c.reasons.join(', ')}</p><p class="muted small">Current step: <b>${stageName(c.stage)}</b>${c.doctor?` · Doctor: ${esc(c.doctor)}`:''}</p></div></div>
 ${hcSection(c)}
 <div class="kpis">${kpi(c.hist.length,'Vitals readings','b')}${kpi(c.rx.length,'Prescriptions')}${kpi(c.reports.length,'Lab reports')}${kpi(c.appts.length,'Upcoming appointments')}</div>
 <div class="split"><div class="panel sec"><h3>Blood pressure trend</h3>${trendChart(c.hist)}</div>
  <div class="panel sec"><h3>Upcoming appointments</h3>${c.appts.length?`<div class="feed">${c.appts.map(a=>`<div><time>${fmt(a.d)}</time><span><b>${esc(a.what)}</b><br><span class="muted small">${esc(a.where)}</span></span></div>`).join('')}</div>`:'<p class="muted">No appointments booked</p>'}
   <h3>Linked providers</h3><div class="feed">${[c.fac,`${P.pharm}, ${c.district}`,`${P.lab}, ${c.district}`].map(f=>`<div><time>Linked</time><span>${esc(f)}</span></div>`).join('')}</div></div></div>
 ${ptabs([['queue','Prescriptions',c.rx.length],['reports','Lab reports',c.reports.length],['vitals','Vitals history',c.hist.length],['done','Timeline',c.log.length]])}
 ${S.ptab==='reports'?(c.reports.length?`<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Test</th><th>Result</th><th>Lab</th><th>Status</th></tr></thead><tbody>${c.reports.map(r=>`<tr><td class="mono">${fmtD(r.d)}</td><td><b>${esc(r.name)}</b></td><td>${esc(r.val)}</td><td>${esc(r.lab)}</td><td><span class="pill ${r.status==='Abnormal'?'bad':'ok'}">${r.status}</span></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No lab reports yet</div>')
 :S.ptab==='vitals'?`<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Source</th><th class="num">BP</th><th class="num">Sugar</th><th class="num">SpO₂</th></tr></thead><tbody>${c.hist.slice().reverse().map(h=>`<tr><td class="mono">${fmtD(h.d)}</td><td>${esc(h.src)}</td><td class="num">${h.sbp}/${h.dbp}</td><td class="num">${h.sugar}</td><td class="num">${h.spo2}%</td></tr>`).join('')}</tbody></table></div>`
 :S.ptab==='done'?`<div class="panel"><div class="log">${c.log.slice().reverse().map(l=>`<div><time>${fmt(l.d)}</time><span><b>${esc(l.by)}:</b> ${esc(l.t)}</span></div>`).join('')}</div></div>`
 :(c.rx.length?`<div class="cards">${c.rx.slice().reverse().map(r=>`<div class="card"><div class="card-h"><b class="mono">${r.id}</b><span class="muted small">${fmtD(r.d)}</span></div><div class="small">${esc(r.by)}</div><ul style="margin:0;padding-left:18px">${r.meds.map(m=>`<li>${esc(m)}</li>`).join('')}</ul><div class="small muted">Tests: ${r.tests.join(', ')||'—'}</div><div class="small"><b>Advice:</b> ${esc(r.advice||'')}</div></div>`).join('')}</div>`:'<div class="empty">No prescriptions yet</div>')}
 </section>`;
}
