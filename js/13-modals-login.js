// ================= drawer + modals =================
function drawer(){
 const c=C(S.sel);if(!c)return'';
 const si=c.stage==='monitor'?STAGES.length:STAGES.findIndex(s=>s[0]===c.stage);
 const next={new:'Admin → BPO queue: call the citizen',bpo:'Admin → BPO queue: call the citizen',kpo:'Admin → KPO review',cc:'Admin → Command Centre: assign doctor',consult:'Doctor login: write e-Prescription',rx:'Pharmacist and Pathologist logins',follow:'Admin → BPO queue: record follow-up vitals'}[c.stage];
 return`<div class="scrim" data-a="close"></div><aside class="drawer" role="dialog" aria-label="Citizen details">
 <div class="row" style="justify-content:space-between"><div><h2>${esc(c.name)}</h2><p class="muted small">${c.age} · ${c.sex} · ${esc(c.district)} · from ${esc(c.fac)}</p></div><button class="x" data-a="close" aria-label="Close">×</button></div>
 <div class="row">${flagPill(c.flag)}<span class="mono">${c.card.type} ${c.card.no}</span>${c.loop>1?`<span class="loopn">Loop #${c.loop}</span>`:''}</div>
 ${vitalsHtml(c.v)}<p style="font-size:13px">${c.reasons.join(', ')}</p>
 <div class="sec"><h3>Care loop</h3><div class="steps">${STAGES.map((s,i)=>`<div class="step ${i<si?'done':i===si?'cur':''}"><span class="dot">${i<si?'✓':i+1}</span><div><b>${s[1]}</b><span>${s[2]}</span></div></div>`).join('')}</div>
 <p class="note">${c.stage==='monitor'?'Citizen is stable. Routine monitoring with a monthly reminder.':'Next action: '+next}</p></div>
 <div class="sec"><h3>BP trend</h3>${trendChart(c.hist)}</div>
 <div class="sec"><h3>History</h3><div class="log">${c.log.slice().reverse().map(l=>`<div><time>${fmt(l.d)}</time><span><b>${esc(l.by)}:</b> ${esc(l.t)}</span></div>`).join('')}</div></div></aside>`;
}
function modal(){
 if(S.modal==='svc')return svcModal();
 if(S.modal==='xl')return xlModal();
 if(S.modal==='lang')return langModal();
 if(S.modal==='apply')return applyModal();
 if(S.modal==='consult')return consultModal();
 if(S.modal==='login'){
  const v=SV.find(x=>x.k===S.lsvc)||SV.find(x=>x.k==='phr'),accts=acctsFor(v);
  return`<div class="scrim" data-a="close"></div><div class="modal" role="dialog" aria-label="${t('Log in')}"><div class="row" style="justify-content:space-between"><h2>${t('Log in')}</h2><button class="x" data-a="close" aria-label="${t('Close')}">×</button></div>
  <label class="fld"><span>${t('Healthcare service')} <span class="mono" style="font-size:11px">(${SV.length})</span></span><select class="inp" id="lg-svc">${svcOptions(v.k)}</select></label>
  <p class="small muted">${t('Opens the dashboard:')} <b>${t(roleLabel(v.role))}</b></p>
  <label class="fld">${v.role==='citizen'?t('ABHA / eHS card'):t('Account')}<select class="inp" id="lg-acct">${accts.map((a,i)=>`<option value="${i}">${esc(a.name)} · ${esc(a.sub)}</option>`).join('')}</select></label>
  <label class="fld">OTP<input class="inp" id="lg-otp" inputmode="numeric" value="123456" aria-describedby="otpn"></label>
  <p class="note" id="otpn">${t('The OTP is pre-filled in this demo. In production it is sent to the registered mobile number.')}</p>
  <button class="btn pri" data-a="do-login">${t('Log in')}</button></div>`;
 }
 if(S.modal==='reg'){
  const v=SV.find(x=>x.k===S.lsvc)||SV.find(x=>x.k==='phr'),cz=v.role==='citizen';
  return`<div class="scrim" data-a="close"></div><div class="modal" role="dialog" aria-label="${t('New registration')}"><div class="row" style="justify-content:space-between"><h2>${t('New registration')}</h2><button class="x" data-a="close" aria-label="${t('Close')}">×</button></div>
  <label class="fld"><span>${t('Registering as')} <span class="mono" style="font-size:11px">(${SV.length})</span></span><select class="inp" id="rg-svc">${svcOptions(v.k)}</select></label>
  <div class="grid2"><label class="fld">${t('Full name')}<input class="inp" id="rg-name" value="${cz?'Shubham Kadam':'Dr. Priya Nikam'}"></label><label class="fld">${t('Mobile')}<input class="inp" id="rg-mob" inputmode="numeric" value="9823014567"></label></div>
  ${cz?`<div class="grid2"><label class="fld">${t('Age')}<input class="inp" type="number" id="rg-age" value="58"></label><label class="fld">${t('District')}<select class="inp" id="rg-dist">${DISTRICTS.map(d=>`<option>${d}</option>`).join('')}</select></label></div>
   <label class="fld">${t('ABHA / eHS card number (leave blank to create a new ABHA)')}<input class="inp" id="rg-card" placeholder="91-XXXX-XXXX-XXXX"></label>
   <p style="font-size:13px;font-weight:600;margin-top:4px">${t('First screening (PHC, ASHA worker or home device)')}</p>
   <div class="grid3">${[['sbp','Systolic',172],['dbp','Diastolic',108],['sugar','Sugar',226],['spo2','SpO₂',96],['pulse','Pulse',94],['bmi','BMI',28.5]].map(([k,l,x])=>`<label class="fld">${t(l)}<input class="inp" type="number" step="any" id="rg-${k}" value="${x}"></label>`).join('')}</div>`
  :`<div class="grid2"><label class="fld">${t('Facility / organisation name')}<input class="inp" id="rg-org" value="${esc(sampleOrg(v))}"></label><label class="fld">${t('District')}<select class="inp" id="rg-dist">${DISTRICTS.map(d=>`<option>${d}</option>`).join('')}</select></label></div>
   <label class="fld">${t('Registration / licence no.')}<input class="inp" id="rg-lic" value="MH-HIE-2026-0${(SV.indexOf(v)*7919%9000+1000)}"></label><p class="note">${t('The account goes live after document verification and a test API exchange in the sandbox.')}</p>`}
  <button class="btn pri" data-a="do-reg">${t('Register')}</button></div>`;
 }
 return'';
}

// ================= language picker =================
function langModal(){
 const q=(S.lq||'').toLowerCase(),rg=S.lr||'all';
 const list=LANGS.filter(x=>(rg==='all'||x.reg===rg)&&(!q||(x.en+' '+x.nat+' '+x.c).toLowerCase().includes(q)));
 return`<div class="scrim" data-a="close"></div><div class="modal lmodal" role="dialog" aria-label="${t('Language')}">
 <div class="row" style="justify-content:space-between"><div><h2>${t('Language')}</h2><p class="muted small">${LANGS.length} official and national languages of all 196 countries, including India's 22 scheduled languages</p></div><button class="x" data-a="close" aria-label="${t('Close')}">×</button></div>
 <input class="inp" id="lq" placeholder="Search language (e.g. Tamil, Français, 日本語)" value="${esc(S.lq||'')}" aria-label="Search language">
 <div class="filters">${['all',...LREG].map(r=>`<button class="chip" data-a="lreg" data-g="${r}" aria-pressed="${rg===r}">${r==='all'?'All regions':r} <span class="muted">${r==='all'?LANGS.length:LANGS.filter(x=>x.reg===r).length}</span></button>`).join('')}</div>
 <div class="lgrid">${list.map(x=>`<button class="lopt" data-a="pick-lang" data-l="${x.c}" aria-pressed="${LANG===x.c}" ${x.rtl?'dir="auto"':''}><b lang="${x.c}">${x.nat}</b><span>${x.en} · ${x.reg}</span>${FULL.includes(x.c)?'<em>Full translation</em>':''}</button>`).join('')||'<p class="muted">No language matches your search</p>'}</div>
 <p class="note">English, हिन्दी and मराठी are fully translated. Other languages show the portal in English until their translation pack is added.</p></div>`;
}

// ================= login helpers =================
const ROLE_SVC={citizen:'phr',doctor:'doctors',pharmacist:'pharmacy',pathologist:'lab',bloodbank:'blood',ngo:'ngo'};
const ADMIN_TAB={bpo:'bpo',cc:'cc',amb:'cc',analytics:'kpo',dash:'districts',gis:'districts',engine:'services',hfr:'providers',hpr:'providers',surv:'overview',mpi:'overview',shr:'overview'};
const roleLabel=r=>r==='admin'?'Admin':ROLES.find(x=>x.k===r).n;
function svcOptions(sel){return Object.entries(GROUPS).map(([g,n])=>`<optgroup label="${g} · ${t(n)}">${SV.filter(x=>x.grp===g).map(x=>`<option value="${x.k}" ${x.k===sel?'selected':''}>${svName(x)}</option>`).join('')}</optgroup>`).join('')}
function sampleOrg(v){return({govhosp:'Sub-district Hospital, Baramati',pvthosp:'Sahyadri Nursing Home, Baramati',phc:'PHC Supe, Baramati',clinic:'Nikam Clinic, Baramati',doctors:'Nikam Clinic, Baramati',consult:'Baramati Tele-health Centre',lab:'Baramati Diagnostic Lab',radio:'Baramati Imaging Centre',pharmacy:'Shree Medicals, Baramati',asha:'Sub-centre Supe, Baramati',ayush:'Ayurved Rugnalaya, Baramati',dental:'Smile Dental Clinic, Baramati',mental:'Manas Counselling Centre, Baramati',specialty:'Baramati Dialysis Centre',homecare:'Sevadham Home Care, Baramati',physio:'Baramati Physio & Rehab',blood:'Baramati Blood Bank',ngo:'Gram Arogya Sanstha, Baramati'})[v.k]||(v.name+', Baramati')}
function acctsFor(v){
 if(v.role==='citizen')return citizens.slice(0,20).map(c=>({name:c.name,sub:c.card.no}));
 if(ROLE_SVC[v.role]===v.k){const l=providers.filter(p=>p.role===v.role);if(l.length)return l.map((p,i)=>({name:i===0?hl(v.role):p.name,sub:p.org}))}
 return[0,3,4].map(k=>DISTRICTS[k%DISTRICTS.length]).map((d,i)=>({name:`${svName(v)} · ${d}`,sub:['Nodal officer','Operator','Supervisor'][i]}));
}

// ================= render =================
const ADM_TABS={analytics:'Live analytics',overview:'All citizens',districts:'Districts',bpo:'BPO queue',kpo:'KPO review',cc:'Command Centre',services:'Services',providers:'Providers'};
function crumbs(){
 if(S.view==='mods'||S.view==='mod'){const s=SV.find(x=>x.k===S.mod);return`<nav class="crumbs" aria-label="Breadcrumb"><ol><li><button data-a="home">${t('Home')}</button></li>${S.view==='mod'?`<li><button data-a="mods">My health dashboards</button></li><li aria-current="page">${s?svName(s):''}</li>`:'<li aria-current="page">My health dashboards</li>'}</ol></nav>`}
 if({appt:1,camps:1,griev:1,faq:1}[S.view])return`<nav class="crumbs" aria-label="Breadcrumb"><ol><li><button data-a="home">${t('Home')}</button></li><li aria-current="page">${{appt:'Book appointment',camps:'Health camps',griev:'Complaints & feedback',faq:'FAQ & help'}[S.view]}</li></ol></nav>`;
 if(S.view==='find')return`<nav class="crumbs" aria-label="Breadcrumb"><ol><li><button data-a="home">${t('Home')}</button></li><li aria-current="page">${t('Find healthcare near me')}</li></ol></nav>`;
 if(S.view==='about')return`<nav class="crumbs" aria-label="Breadcrumb"><ol><li><button data-a="home">${t('Home')}</button></li><li aria-current="page">${t('About us')}</li></ol></nav>`;
 if(!S.user||S.view==='home')return'';
 const items=[`<li><button data-a="home">Home</button></li>`];
 const role=S.user.roleName,sub=S.user.role==='admin'?ADM_TABS[S.tab]:S.user.role==='citizen'&&S.hcView?'Health Card':null;
 items.push(sub?`<li><button data-a="crumb-role">${esc(role)}</button></li><li aria-current="page">${esc(sub)}</li>`:`<li aria-current="page">${esc(role)}</li>`);
 return`<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.join('')}</ol></nav>`;
}
