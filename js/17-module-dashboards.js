// ================= Module dashboards with citizen tools =================
const TOOLS={matru:['preg','vax'],immun:['vax'],polio:['vax'],asha:['family','vax'],scheme:['scheme'],billing:['scheme'],phr:['family','consent','medrem'],abha:['consent'],shr:['consent'],mpi:['consent'],
 pharmacy:['medrem','generic'],meddir:['generic','medrem'],meddel:['medrem','generic'],dignurse:['medrem','elder'],lab:['labexp'],doorcheck:['risk','labexp'],npncd:['risk'],nutri:['risk'],
 nphce:['elder','risk'],homecare:['elder'],mental:['phq9'],nmhp:['phq9'],blood:['donor'],organ:['donor'],consult:['risk','phq9'],clinic:['risk'],phc:['risk','vax','scheme']};
const TOOL_NAME={vax:'💉 Vaccination tracker',preg:'🤰 Pregnancy tracker',scheme:'🧾 Scheme eligibility',family:'👨‍👩‍👧 Family profiles',medrem:'⏰ Medicine reminders',labexp:'🧪 Understand my lab report',risk:'❤️ Health risk check',phq9:'🧠 Mental wellness check',elder:'🏠 Home visit for elders',consent:'🔐 Who viewed my records',generic:'💊 Cheaper generic medicines',donor:'🩸 Blood & organ donor'};
const modTools=s=>TOOLS[s.k]||[];
function modPage(){
 const s=SV.find(x=>x.k===S.mod)||SV[0];const tl=modTools(s);const cur=tl.includes(S.tool)?S.tool:tl[0];
 const roleName=s.role==='admin'?'Admin':(ROLES.find(r=>r.k===s.role)||{n:'Citizen'}).n;
 return`<section class="sec fx">
 <div class="md-head">${sico(s)}<div><span class="eyebrow">${t(GROUPS[s.grp])}</span><h1>${svName(s)}</h1><p class="muted">${s.desc}</p></div>
  <div class="row md-acts"><button class="btn" data-a="as" data-r="${s.role}">${t('Open as')} ${t(roleName)}</button><button class="btn" data-a="mods">All dashboards</button></div></div>
 <div class="md-kpis"><div><b>${s.count}</b><span>${s.unit}</span></div><div><b>${s.rec?nf(s.rec):'—'}</b><span>Records this month</span></div><div><b>${s.uptime||'99.9%'}</b><span>API uptime</span></div><div><b>${tl.length||'—'}</b><span>Citizen tools</span></div></div>
 ${tl.length?`<div class="md-tabs" role="tablist">${tl.map(k=>`<button role="tab" data-a="tool" data-t="${k}" aria-selected="${k===cur}">${TOOL_NAME[k]}</button>`).join('')}</div>
 <div class="md-tool">${TOOLF[cur]()}</div>`:`<div class="fx-card"><p class="muted">Citizen tools for this module are being added. Live data and providers are below.</p></div>`}
 <div class="fx-grid">${s.rec?`<div class="fx-card"><h3>Records exchanged per month</h3>${barChart(s.months)}</div>`:''}${provSection(s)}</div>
 </section>`;
}
function modsHub(){
 const ks=Object.keys(TOOLS).map(k=>SV.find(s=>s.k===k)).filter(Boolean);
 return`<section class="sec fx">${pageHead('My health dashboards','Health tools inside each service','Open a service to use its tools: vaccination, pregnancy, schemes, medicines, reports, mental wellness and more.')}
 <div class="hub">${ks.map(s=>`<button class="hub-c" data-a="mod" data-s="${s.k}">${sico(s)}<b>${svName(s)}</b><span>${modTools(s).map(k=>TOOL_NAME[k]).join(' · ')}</span></button>`).join('')}</div></section>`;
}
const TOOLF={};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const iso=d=>new Date(d).toISOString().slice(0,10);

/* Vaccination tracker — India Universal Immunization Programme schedule */
const UIP=[[0,'At birth',['BCG','OPV-0','Hepatitis B birth dose']],[42,'6 weeks',['OPV-1','Pentavalent-1','Rotavirus-1','fIPV-1','PCV-1']],[70,'10 weeks',['OPV-2','Pentavalent-2','Rotavirus-2']],[98,'14 weeks',['OPV-3','Pentavalent-3','Rotavirus-3','fIPV-2','PCV-2']],[274,'9 months',['MR-1','PCV booster','fIPV-3','Vitamin A (1st)','JE-1 (endemic districts)']],[487,'16–24 months',['MR-2','DPT booster-1','OPV booster','Vitamin A (2nd)','JE-2 (endemic districts)']],[1826,'5–6 years',['DPT booster-2']],[3652,'10 years',['Td']],[5844,'16 years',['Td']]];
TOOLF.vax=()=>{
 const kids=mine('child');const sel=kids.find(k=>k._id===S.kid)||kids[0];
 let body='';
 if(sel){const done=sel.done||{};const today=new Date();let next=null;
  body=`<div class="vx">${UIP.map(([d,l,vs])=>{const due=addDays(sel.dob,d);return`<div class="vx-row"><div class="vx-when"><b>${l}</b><span>${dstr(due)}</span></div><div class="vx-list">${vs.map(v=>{const k=d+'|'+v,ok=done[k];const od=!ok&&due<today;if(!ok&&!od&&!next)next=[v,due];return`<label class="vx-i ${ok?'ok':od?'od':''}"><input type="checkbox" data-a="vx-tick" data-k="${esc(k)}" ${ok?'checked':''}> ${v}${od?' <em>overdue</em>':''}</label>`}).join('')}</div></div>`}).join('')}</div>`;
  const tot=UIP.reduce((a,x)=>a+x[2].length,0),dn=Object.values(done).filter(Boolean).length;
  body=`<div class="md-sum"><div><b>${dn}/${tot}</b><span>vaccines given</span></div><div><b>${next?esc(next[0]):'All done'}</b><span>${next?'next due '+dstr(next[1]):'schedule complete'}</span></div></div>`+body;
 }
 return`<div class="tool-g"><div class="fx-card"><h3>Add a child</h3><div class="grid2"><label class="fld"><span>Child's name</span><input class="inp" id="kid-n"></label><label class="fld"><span>Date of birth</span><input class="inp" type="date" id="kid-d" max="${iso(new Date())}"></label></div><button class="btn pri" data-a="kid-add">Add child</button>
  ${kids.length?`<div class="chips">${kids.map(k=>`<button class="chip" data-a="kid-sel" data-i="${k._id}" aria-pressed="${sel&&k._id===sel._id}">${esc(k.name)}</button>`).join('')}</div>`:''}
  <p class="small muted">Schedule as per India's Universal Immunization Programme. Vaccines are free at government centres. Your ANM or doctor may adjust dates.</p></div>
 <div class="fx-card">${sel?`<h3>${esc(sel.name)} · born ${dstr(sel.dob)}</h3>${body}`:'<p class="muted">Add a child to see the vaccination schedule with due dates.</p>'}</div></div>`;
};
/* Pregnancy tracker */
TOOLF.preg=()=>{
 const p=mine('preg')[0];let body='<p class="muted">Enter the first day of your last period (LMP) to see your due date and check-up plan.</p>';
 if(p){const lmp=new Date(p.lmp),edd=addDays(lmp,280),wk=Math.floor((Date.now()-lmp)/864e5/7);
  const anc=[['1st check-up (ANC-1)',0,84,'Registration, blood & urine tests, BP, weight, Td-1'],['2nd check-up (ANC-2)',98,182,'Ultrasound, Td-2, start iron & calcium'],['3rd check-up (ANC-3)',196,238,'BP, sugar test (OGTT), baby growth'],['4th check-up (ANC-4)',252,280,'Birth plan, delivery place, danger signs']];
  body=`<div class="md-sum"><div><b>${Math.max(0,wk)} weeks</b><span>pregnant</span></div><div><b>${dstr(edd)}</b><span>expected delivery date</span></div><div><b>${wk<13?'1st':wk<28?'2nd':'3rd'}</b><span>trimester</span></div></div>
  <div class="anc">${anc.map(a=>{const st=Date.now()>addDays(lmp,a[2]);return`<div class="anc-r ${st?'past':''}"><b>${a[0]}</b><span>${dstr(addDays(lmp,a[1]))} – ${dstr(addDays(lmp,a[2]))}</span><small>${a[3]}</small></div>`}).join('')}</div>
  <div class="warn"><b>Go to hospital or call 108 at once if:</b> bleeding, severe headache or blurred vision, fits, high fever, baby moving less, water breaking, severe swelling of face or hands.</div>
  <p class="small">Benefits to ask about: Janani Suraksha Yojana (cash support for institutional delivery), PMMVY (maternity benefit), free delivery and transport under JSSK.</p>`}
 return`<div class="tool-g"><div class="fx-card"><h3>Pregnancy details</h3><label class="fld"><span>First day of last period (LMP)</span><input class="inp" type="date" id="lmp" value="${p?p.lmp:''}" max="${iso(new Date())}"></label><button class="btn pri" data-a="preg-save">${p?'Update':'Start tracking'}</button><p class="small muted">Iron-folic acid and calcium tablets are free at the PHC. Eat well, rest and keep every check-up.</p></div><div class="fx-card">${body}</div></div>`;
};
/* Scheme eligibility */
TOOLF.scheme=()=>{
 const r=S.schemeR;
 return`<div class="tool-g"><div class="fx-card"><h3>Answer a few questions</h3>
  <div class="grid2"><label class="fld"><span>State</span><select class="inp" id="sc-st"><option>Maharashtra</option><option>Other state</option></select></label><label class="fld"><span>Your age</span><input class="inp" type="number" id="sc-age" min="0" max="120"></label></div>
  <label class="fld"><span>Ration card</span><select class="inp" id="sc-rc"><option value="none">No ration card</option><option value="yellow">Yellow (BPL) / Antyodaya</option><option value="orange">Orange</option><option value="white">White</option></select></label>
  <label class="vx-i"><input type="checkbox" id="sc-ab"> I have an Ayushman (PM-JAY) card or my family is in the PM-JAY list</label>
  <label class="vx-i"><input type="checkbox" id="sc-pg"> Pregnant or recently delivered</label>
  <label class="vx-i"><input type="checkbox" id="sc-tb"> Under TB treatment</label>
  <label class="vx-i"><input type="checkbox" id="sc-ch"> Have a child under 18</label>
  <button class="btn pri" data-a="sc-check">Check schemes</button></div>
 <div class="fx-card"><h3>You may be eligible for</h3>${r?r.map(x=>`<div class="sc-r"><b>${x[0]}</b><span>${x[1]}</span><small>Documents: ${x[2]}</small></div>`).join('')||'<p class="muted">No match from these answers. Ask the Arogya Mitra at any empanelled hospital.</p>':'<p class="muted">Fill the form to see likely schemes.</p>'}
  <p class="small muted">This is guidance only. Final eligibility is decided by the scheme authority.</p></div></div>`;
};
function schemeCheck(){
 const st=val('sc-st'),age=+val('sc-age')||0,rc=val('sc-rc'),g=id=>(document.getElementById(id)||{}).checked;
 const R=[];
 if(g('sc-ab'))R.push(['PM-JAY (Ayushman Bharat)','Cashless hospital treatment up to ₹5 lakh per family per year at empanelled hospitals.','Ayushman card or Aadhaar, ration card']);
 if(age>=70)R.push(['PM-JAY for senior citizens (70+)','All citizens aged 70 and above can get the Ayushman Vay Vandana card, regardless of income.','Aadhaar']);
 if(st==='Maharashtra'&&rc!=='none')R.push(['Mahatma Jyotirao Phule Jan Arogya Yojana','Cashless treatment for listed procedures at empanelled hospitals in Maharashtra.','Ration card, Aadhaar, domicile proof']);
 if(g('sc-pg')){R.push(['Janani Suraksha Yojana (JSY)','Cash assistance for delivery in a government or accredited hospital.','MCP card, Aadhaar, bank account']);R.push(['PM Matru Vandana Yojana (PMMVY)','Maternity benefit paid to the bank account.','MCP card, Aadhaar, bank account']);R.push(['JSSK','Free delivery, medicines, tests, food and transport in public hospitals.','MCP card'])}
 if(g('sc-tb'))R.push(['Ni-kshay Poshan Yojana','Monthly nutrition support for people on TB treatment, paid to the bank account.','Ni-kshay ID, bank account']);
 if(g('sc-ch'))R.push(['Rashtriya Bal Swasthya Karyakram (RBSK)','Free screening and treatment for children for birth defects, diseases and developmental delays.','Child\'s birth certificate or Aadhaar']);
 S.schemeR=R;render();
}
/* Family profiles */
TOOLF.family=()=>{
 const fam=mine('fam');
 return`<div class="tool-g"><div class="fx-card"><h3>Add a family member</h3><div class="grid2"><label class="fld"><span>Name</span><input class="inp" id="fm-n"></label><label class="fld"><span>Relation</span><select class="inp" id="fm-r">${['Self','Spouse','Mother','Father','Son','Daughter','Grandparent','Other'].map(x=>`<option>${x}</option>`).join('')}</select></label></div>
  <div class="grid2"><label class="fld"><span>Age</span><input class="inp" type="number" id="fm-a" min="0" max="120"></label><label class="fld"><span>Gender</span><select class="inp" id="fm-g"><option>Female</option><option>Male</option><option>Other</option></select></label></div>
  <label class="fld"><span>ABHA number (optional)</span><input class="inp" id="fm-ab" placeholder="14 digits"></label><button class="btn pri" data-a="fm-add">Add member</button></div>
 <div class="fx-card"><h3>My family (${fam.length})</h3>${fam.length?fam.map(m=>`<div class="fam"><span class="avatar">${esc(m.name[0]||'?')}</span><div><b>${esc(m.name)}</b><span>${esc(m.rel)} · ${m.age} yrs · ${esc(m.g)}${m.ab?' · ABHA linked':''}</span></div>
   <div class="row">${m.age<17?`<button class="btn sm" data-a="mod" data-s="immun">Vaccines</button>`:''}${m.age>=30?`<button class="btn sm" data-a="mod" data-s="npncd">Risk check</button>`:''}${m.age>=60?`<button class="btn sm" data-a="mod" data-s="nphce">Home visit</button>`:''}<button class="x" data-a="ap-del" data-i="${m._id}" aria-label="Remove">×</button></div></div>`).join(''):'<p class="muted">Add parents, children and elders to manage everyone\'s health from one login.</p>'}</div></div>`;
};
/* Medicine reminders */
TOOLF.medrem=()=>{
 const meds=mine('med');const slots=[['m','Morning 8 am'],['a','Afternoon 2 pm'],['n','Night 9 pm']];const today=iso(new Date());
 return`<div class="tool-g"><div class="fx-card"><h3>Add a medicine</h3><div class="grid2"><label class="fld"><span>Medicine</span><input class="inp" id="md-n" placeholder="e.g. Metformin 500 mg"></label><label class="fld"><span>For how many days</span><input class="inp" type="number" id="md-d" value="30" min="1"></label></div>
  <div class="row">${slots.map(([k,l])=>`<label class="vx-i"><input type="checkbox" id="md-${k}" ${k==='m'?'checked':''}> ${l}</label>`).join('')}</div>
  <label class="vx-i"><input type="checkbox" id="md-f"> After food</label><button class="btn pri" data-a="md-add">Add reminder</button></div>
 <div class="fx-card"><h3>Today's medicines</h3>${meds.length?slots.map(([k,l])=>{const ms=meds.filter(m=>m.slots.includes(k)&&addDays(m.start,m.days)>new Date());return ms.length?`<div class="md-slot"><b>${l}</b>${ms.map(m=>{const tk=(m.taken||{})[today+k];return`<label class="vx-i ${tk?'ok':''}"><input type="checkbox" data-a="md-take" data-i="${m._id}" data-k="${today+k}" ${tk?'checked':''}> ${esc(m.name)}${m.food?' · after food':''}</label>`}).join('')}</div>`:''}).join('')+`<h3>All reminders</h3>${meds.map(m=>{const left=Math.max(0,Math.ceil((addDays(m.start,m.days)-new Date())/864e5));return`<div class="row" style="justify-content:space-between"><span><b>${esc(m.name)}</b> · ${left} days left${left<=5?' · <em style="color:var(--red)">refill soon</em>':''}</span><button class="x" data-a="ap-del" data-i="${m._id}" aria-label="Remove">×</button></div>`}).join('')}`:'<p class="muted">Add your medicines to get a daily checklist and refill alerts.</p>'}</div></div>`;
};
/* Lab report explainer */
const LABREF=[['Haemoglobin',/h(a)?emoglobin|\bhb\b/i,v=>v<12?'Low — may mean anaemia':v>17.5?'High':'Normal (12–17.5 g/dL)'],['Fasting sugar',/fasting|fbs/i,v=>v<70?'Low':v<100?'Normal (70–99 mg/dL)':v<126?'Pre-diabetes range':'Diabetes range — see a doctor'],['HbA1c',/hba1c/i,v=>v<5.7?'Normal (below 5.7%)':v<6.5?'Pre-diabetes range':'Diabetes range'],['Total cholesterol',/cholesterol/i,v=>v<200?'Desirable (below 200)':v<240?'Borderline high':'High'],['Creatinine',/creatinine/i,v=>v<=1.3?'Normal (about 0.6–1.3 mg/dL)':'High — kidney check advised'],['TSH',/tsh/i,v=>v<0.4?'Low — thyroid check advised':v<=4.5?'Normal (0.4–4.5)':'High — thyroid check advised']];
TOOLF.labexp=()=>`<div class="tool-g"><div class="fx-card"><h3>Paste your report values</h3><textarea class="inp" id="lab-t" rows="7" placeholder="e.g.\nHaemoglobin 10.8\nFasting blood sugar 132\nHbA1c 6.9\nTSH 3.1">${esc(S.labT||'')}</textarea><button class="btn pri" data-a="lab-go" ${S.labBusy?'disabled':''}>${S.labBusy?'Explaining…':'Explain in simple words'}</button><p class="small muted">Explained in ${curLang().nat}. This is not a diagnosis; show the report to your doctor.</p></div>
 <div class="fx-card"><h3>What it means</h3>${S.labOut?`<div class="lab-out">${S.labOut}</div>`:'<p class="muted">Your explanation appears here.</p>'}</div></div>`;
async function labGo(){
 const txt=val('lab-t').trim();S.labT=txt;if(!txt)return;
 const rows=LABREF.map(([n,re,f])=>{const line=txt.split('\n').find(l=>re.test(l));const m=line&&line.match(/(\d+(\.\d+)?)/g);if(!m)return null;const v=parseFloat(m[m.length-1]);return`<div class="sc-r"><b>${n}: ${v}</b><span>${f(v)}</span></div>`}).filter(Boolean).join('');
 S.labOut=rows||'<p class="muted">Could not read values. Write one test per line, e.g. "Haemoglobin 10.8".</p>';S.labBusy=true;render();
 try{const sp=CHAT.sample!==undefined?CHAT.sample:(window.claude&&claude.use?await claude.use('sample'):null);CHAT.sample=sp;
  if(sp){const r=await sp([{role:'user',content:`Explain these lab report values to a patient in ${curLang().en} in simple words. For each value say whether it looks normal, low or high for an adult and what it may mean, in one short line each. End with one line advising which kind of doctor to see if anything is abnormal. Do not diagnose with certainty. Values:\n${txt}`}],{modelTier:'quick',cache:false});const text=(r&&r.text)||'';if(text)S.labOut=rows+`<div class="lab-ai">${esc(text).replace(/\n/g,'<br>')}</div>`}
 }catch(e){}
 S.labBusy=false;render();
}
/* Health risk check: BMI + BP + Indian Diabetes Risk Score */
TOOLF.risk=()=>{
 const r=S.riskR;
 return`<div class="tool-g"><div class="fx-card"><h3>Your details</h3><div class="grid2"><label class="fld"><span>Age</span><input class="inp" type="number" id="rk-age"></label><label class="fld"><span>Gender</span><select class="inp" id="rk-g"><option>Female</option><option>Male</option></select></label></div>
  <div class="grid2"><label class="fld"><span>Height (cm)</span><input class="inp" type="number" id="rk-h"></label><label class="fld"><span>Weight (kg)</span><input class="inp" type="number" id="rk-w"></label></div>
  <div class="grid2"><label class="fld"><span>Waist (cm)</span><input class="inp" type="number" id="rk-wa"></label><label class="fld"><span>BP (e.g. 130/85, optional)</span><input class="inp" id="rk-bp"></label></div>
  <label class="fld"><span>Physical activity</span><select class="inp" id="rk-pa"><option value="0">Regular exercise or heavy physical work</option><option value="10">Exercise or work, moderate</option><option value="20">Mild activity</option><option value="30">Mostly sitting, no exercise</option></select></label>
  <label class="fld"><span>Diabetes in parents</span><select class="inp" id="rk-fh"><option value="0">None</option><option value="10">One parent</option><option value="20">Both parents</option></select></label>
  <button class="btn pri" data-a="rk-go">Check my risk</button></div>
 <div class="fx-card"><h3>Result</h3>${r?r:'<p class="muted">Fill your details to see BMI, BP and diabetes risk with simple advice.</p>'}<p class="small muted">Diabetes risk uses the Indian Diabetes Risk Score (IDRS). A free check-up is available at your PHC.</p></div></div>`;
};
function riskGo(){
 const age=+val('rk-age'),g=val('rk-g'),hgt=+val('rk-h'),w=+val('rk-w'),wa=+val('rk-wa'),bp=val('rk-bp'),pa=+val('rk-pa'),fh=+val('rk-fh');
 const out=[];const fl=(c,t,s)=>`<div class="rk ${c}"><b>${t}</b><span>${s}</span></div>`;
 if(hgt&&w){const b=w/((hgt/100)**2);out.push(b<18.5?fl('y','BMI '+b.toFixed(1)+' · Underweight','Eat a balanced diet; see a doctor if weight keeps falling.'):b<23?fl('g','BMI '+b.toFixed(1)+' · Healthy','Keep it up.'):b<25?fl('y','BMI '+b.toFixed(1)+' · Overweight (Asian cut-off 23)','More activity and less sugar and fried food.'):fl('r','BMI '+b.toFixed(1)+' · Obese','Get BP and sugar checked; ask about a diet plan.'))}
 const m=bp.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);if(m){const sy=+m[1],di=+m[2];out.push(sy>=180||di>=120?fl('r','BP '+sy+'/'+di+' · Very high','Get medical help today. Call 108 if chest pain, breathlessness or weakness.'):sy>=140||di>=90?fl('r','BP '+sy+'/'+di+' · High','See a doctor this week; reduce salt.'):sy>=130||di>=85?fl('y','BP '+sy+'/'+di+' · Above normal','Recheck in a month; walk daily and reduce salt.'):fl('g','BP '+sy+'/'+di+' · Normal','Check once a year.'))}
 if(age){const sa=age<35?0:age<50?20:30;const sw=!wa?0:g==='Male'?(wa<90?0:wa<100?10:20):(wa<80?0:wa<90?10:20);const sc=sa+sw+pa+fh;out.push(sc>=60?fl('r','Diabetes risk score '+sc+' · High','Get a fasting sugar or HbA1c test soon.'):sc>=30?fl('y','Diabetes risk score '+sc+' · Moderate','Get a sugar test this year; stay active.'):fl('g','Diabetes risk score '+sc+' · Low','Stay active and check every 3 years.'))}
 S.riskR=out.join('')||'<p class="muted">Please enter at least age, or height and weight.</p>';render();
}
/* PHQ-9 */
const PHQ=['Little interest or pleasure in doing things','Feeling down, depressed or hopeless','Trouble falling or staying asleep, or sleeping too much','Feeling tired or having little energy','Poor appetite or overeating','Feeling bad about yourself, or that you are a failure or have let yourself or your family down','Trouble concentrating on things, such as reading or watching TV','Moving or speaking so slowly that others noticed, or being very fidgety or restless','Thoughts that you would be better off dead, or of hurting yourself'];
TOOLF.phq9=()=>{
 const r=S.phqR;
 return`<div class="tool-g"><div class="fx-card"><h3>Over the last 2 weeks, how often have you been bothered by:</h3>${PHQ.map((q,i)=>`<div class="phq"><span>${i+1}. ${q}</span><select class="inp" id="phq${i}"><option value="0">Not at all</option><option value="1">Several days</option><option value="2">More than half the days</option><option value="3">Nearly every day</option></select></div>`).join('')}<button class="btn pri" data-a="phq-go">See my result</button><p class="small muted">PHQ-9 questionnaire. Private: results stay on your device or account.</p></div>
 <div class="fx-card"><h3>Result</h3>${r||'<p class="muted">Answer the questions to see your result.</p>'}
  <div class="warn"><b>Need to talk now?</b> Tele-MANAS <a href="tel:14416">14416</a> (free, 24×7, confidential). In danger, call <a href="tel:112">112</a>.</div></div></div>`;
};
function phqGo(){
 const v=PHQ.map((_,i)=>+val('phq'+i));const s=v.reduce((a,b)=>a+b,0);
 const lv=s<5?['g','Minimal','Keep doing what helps you: sleep, activity, people you trust.']:s<10?['y','Mild','Talk to someone you trust and recheck in 2 weeks.']:s<15?['y','Moderate','Please speak to a doctor or counsellor. Tele-MANAS 14416 can help today.']:s<20?['r','Moderately severe','Please see a doctor or psychiatrist soon. Call Tele-MANAS 14416.']:['r','Severe','Please get help today. Call Tele-MANAS 14416 or see a psychiatrist.'];
 let out=`<div class="rk ${lv[0]}"><b>Score ${s}/27 · ${lv[1]}</b><span>${lv[2]}</span></div>`;
 if(v[8]>0)out+=`<div class="rk r"><b>You mentioned thoughts of self-harm.</b><span>You are not alone. Please call Tele-MANAS 14416 now, or 112 if you are in immediate danger, and stay with someone you trust.</span></div>`;
 out+=`<div class="row"><button class="btn" data-a="chat-find" data-t="mental">Find a psychiatrist near me</button><button class="btn" data-a="appt" data-s="mental">Book a counsellor</button></div>`;
 S.phqR=out;storeSave({type:'phq',score:s,at:Date.now()});render();
}
/* Elderly home visit */
TOOLF.elder=()=>{
 const reqs=mine('visit');
 return`<div class="tool-g"><div class="fx-card"><h3>Request a home visit</h3><div class="grid2"><label class="fld"><span>Elder's name</span><input class="inp" id="hv-n"></label><label class="fld"><span>Age</span><input class="inp" type="number" id="hv-a"></label></div>
  <label class="fld"><span>Needed</span><select class="inp" id="hv-t">${['BP & sugar check','Wound dressing','Physiotherapy','Medicine review','Palliative care','Sample collection for tests','General check-up'].map(x=>`<option>${x}</option>`).join('')}</select></label>
  <div class="grid2"><label class="fld"><span>Area / address</span><input class="inp" id="hv-ad"></label><label class="fld"><span>Preferred date</span><input class="inp" type="date" id="hv-d" min="${iso(addDays(new Date(),1))}"></label></div>
  <button class="btn pri" data-a="hv-add">Request visit</button><p class="small muted">An ASHA, ANM or nurse visits. Elders 70+ may be covered under PM-JAY.</p></div>
 <div class="fx-card"><h3>My requests</h3>${reqs.length?reqs.map(r=>`<div class="sc-r"><b>${esc(r.need)} · ${esc(r.name)}</b><span>${r.date?dstr(r.date):'Date to be confirmed'} · ${esc(r.addr)}</span><small>Status: ${Date.now()-r.at>120000?'Health worker assigned':'Request received'}</small></div>`).join(''):'<p class="muted">No requests yet.</p>'}</div></div>`;
};
/* Consent & access log */
TOOLF.consent=()=>{
 const rev=(mine('revoke')[0]||{}).ids||[];
 const log=[[0,DOCS[3]&&DOCS[3].name||'Doctor','e-Consultation','Viewed vitals and prescriptions'],[1,'District Lab','Pathology lab','Uploaded blood test report'],[2,'Jan Aushadhi Kendra','Pharmacy','Viewed e-Prescription to dispense'],[4,'BPO call centre / 104','Health helpline','Viewed red-flag vitals for follow-up call'],[6,DOCS[2]&&DOCS[2].name||'Doctor','Follow-up consultation','Viewed history and lab report']];
 return`<div class="fx-card"><h3>Who viewed my health records</h3><p class="small muted"><span class="pill">Demo log</span> Every access through the exchange is recorded. You can stop any provider's access.</p>
 <table class="ct"><thead><tr><th>When</th><th>Who</th><th>Service</th><th>What</th><th></th></tr></thead><tbody>${log.map(([d,w,s,x],i)=>{const off=rev.includes(i);return`<tr class="${off?'off':''}"><td>${dstr(addDays(new Date(),-d))}</td><td><b>${esc(w)}</b></td><td>${s}</td><td>${x}</td><td>${off?'<span class="pill">Access stopped</span>':`<button class="btn sm" data-a="ct-rev" data-i="${i}">Stop access</button>`}</td></tr>`}).join('')}</tbody></table></div>`;
};
/* Generic medicines */
const GEN=[['Crocin / Dolo','Paracetamol','Fever, pain'],['Glycomet','Metformin','Diabetes'],['Amlong / Amlodac','Amlodipine','Blood pressure'],['Telma','Telmisartan','Blood pressure'],['Ecosprin','Aspirin (low dose)','Heart'],['Atorva / Lipitor','Atorvastatin','Cholesterol'],['Pan / Pantocid','Pantoprazole','Acidity'],['Thyronorm / Eltroxin','Levothyroxine','Thyroid'],['Augmentin','Amoxicillin + Clavulanic acid','Infection'],['Azithral / Azee','Azithromycin','Infection'],['Allegra','Fexofenadine','Allergy'],['Montair','Montelukast','Asthma, allergy'],['Shelcal','Calcium + Vitamin D3','Bones'],['Janumet','Sitagliptin + Metformin','Diabetes'],['Clopilet / Plavix','Clopidogrel','Heart']];
TOOLF.generic=()=>{
 const q=(S.genQ||'').toLowerCase();const L=GEN.filter(g=>!q||(g.join(' ')).toLowerCase().includes(q));
 return`<div class="fx-card"><h3>Find the generic medicine for a brand</h3><input class="inp" id="gen-q" placeholder="Type a brand or salt, e.g. Glycomet, Telma, Paracetamol" value="${esc(S.genQ||'')}">
 <table class="ct"><thead><tr><th>Common brand</th><th>Generic (salt)</th><th>Used for</th><th></th></tr></thead><tbody>${L.map(g=>`<tr><td>${g[0]}</td><td><b>${g[1]}</b></td><td>${g[2]}</td><td><a class="btn sm" target="_blank" rel="noopener" href="https://janaushadhi.gov.in/">Jan Aushadhi price ↗</a></td></tr>`).join('')}</tbody></table>
 <p class="small muted">Generic medicines have the same salt and strength. Do not switch without asking your doctor or pharmacist. Brand names belong to their owners.</p>
 <button class="btn" data-a="chat-find" data-t="meddir">📍 Find a Jan Aushadhi Kendra near me</button></div>`;
};
/* Blood & organ donor */
TOOLF.donor=()=>{
 const d=mine('donor')[0];
 return`<div class="tool-g"><div class="fx-card"><h3>Register as a blood donor</h3><div class="grid2"><label class="fld"><span>Blood group</span><select class="inp" id="dn-bg">${['A+','A-','B+','B-','AB+','AB-','O+','O-','Don\'t know'].map(x=>`<option ${d&&d.bg===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="fld"><span>Age</span><input class="inp" type="number" id="dn-age" value="${d?d.age:''}"></label></div>
  <div class="grid2"><label class="fld"><span>Weight (kg)</span><input class="inp" type="number" id="dn-w" value="${d?d.w:''}"></label><label class="fld"><span>Gender</span><select class="inp" id="dn-g"><option>Male</option><option ${d&&d.g==='Female'?'selected':''}>Female</option></select></label></div>
  <div class="grid2"><label class="fld"><span>Last donation (if any)</span><input class="inp" type="date" id="dn-last" value="${d&&d.last||''}" max="${iso(new Date())}"></label><label class="fld"><span>Area</span><input class="inp" id="dn-ar" value="${d?esc(d.area):''}"></label></div>
  <button class="btn pri" data-a="dn-save">${d?'Update':'Register'}</button></div>
 <div class="fx-card"><h3>Donor status</h3>${d?donorStatus(d):'<p class="muted">Register to get alerts when someone near you needs your blood group.</p>'}
  <div class="sc-r"><b>Pledge your organs</b><span>One donor can save up to 8 lives. Register your pledge on the national NOTTO portal.</span><a class="btn sm" target="_blank" rel="noopener" href="https://notto.mohfw.gov.in/">Pledge on NOTTO ↗</a></div>
  <a class="btn sm" target="_blank" rel="noopener" href="https://eraktkosh.mohfw.gov.in/">Check blood stock on e-RaktKosh ↗</a></div></div>`;
};
function donorStatus(d){
 const gap=d.g==='Female'?120:90;const next=d.last?addDays(d.last,gap):new Date();const okAge=d.age>=18&&d.age<=65,okW=d.w>=(d.g==='Female'?45:50);
 const ok=okAge&&okW&&next<=new Date();
 return`<div class="rk ${ok?'g':'y'}"><b>${esc(d.bg)} donor · ${ok?'Eligible to donate now':'Not eligible right now'}</b><span>${!okAge?'Donors must be 18–65 years. ':''}${!okW?'Minimum weight 45–50 kg. ':''}${next>new Date()?'Next donation after '+dstr(next)+'.':''}${ok?'Thank you! You will get alerts for requests near '+esc(d.area||'you')+'.':''}</span></div>`;
}


// voice input / read-out for chat
function micHelp(why){CHAT.listen=false;CHAT.micMsg=why;render();setTimeout(()=>{const b=document.getElementById('chatbox');if(b)b.focus()},30)}
function chatMic(){
 if(CHAT.listen&&CHAT.rec){try{CHAT.rec.stop()}catch(e){}CHAT.listen=false;render();return}
 const R=window.SpeechRecognition||window.webkitSpeechRecognition;
 const fp=document.permissionsPolicy||document.featurePolicy;
 if(!R)return micHelp('nosupport');
 if(fp&&fp.allowsFeature&&!fp.allowsFeature('microphone'))return micHelp('blocked');
 try{const r=new R();r.lang=LANG+(P.india||LANG==='en'?'-IN':'');r.interimResults=true;CHAT.rec=r;CHAT.listen=true;render();
  r.onresult=ev=>{const tx=Array.from(ev.results).map(x=>x[0].transcript).join('');const b=document.getElementById('chatbox');if(b)b.value=tx;if(ev.results[ev.results.length-1].isFinal){CHAT.listen=false;chatSend(tx)}};
  r.onerror=ev=>{const c=ev&&ev.error;if(c==='no-speech'||c==='aborted'){CHAT.listen=false;render();return}micHelp(c==='not-allowed'||c==='service-not-allowed'?'blocked':c==='network'?'network':'blocked')};r.onend=()=>{if(CHAT.listen){CHAT.listen=false;render()}};CHAT.micMsg='';r.start()}catch(e){micHelp('blocked')}
}
function chatSpeak(i){try{const m=CHAT.turns[i];if(!m||!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(m.content);u.lang=LANG+(P.india||LANG==='en'?'-IN':'');speechSynthesis.speak(u)}catch(e){}}
