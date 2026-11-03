// ================= Citizen features: assistant, SOS, appointments, camps, grievances, FAQ =================
const STORE={db:null,id:null,ready:false,items:[]};
async function storeInit(){
 try{const raw=localStorage.getItem('bhie-mine');STORE.items=raw?JSON.parse(raw):[]}catch(e){STORE.items=[]}
 try{
  if(window.claude&&claude.use){
   const db=await claude.use('db'),user=await claude.use('user');const id=user?await user.id():null;
   if(db&&id){STORE.db=db;STORE.id=id;const snap=await db.collection('data/users/'+id).get();const rows=snap.docs.map(d=>Object.assign({_id:d.id},d.data()));if(rows.length||!STORE.items.length)STORE.items=rows}
  }
 }catch(e){}
 STORE.ready=true;render();
}
async function storeSave(obj){
 obj._id=obj._id||(obj.type+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6));
 const i=STORE.items.findIndex(x=>x._id===obj._id);if(i>=0)STORE.items[i]=obj;else STORE.items.unshift(obj);
 try{localStorage.setItem('bhie-mine',JSON.stringify(STORE.items.slice(0,60)))}catch(e){}
 if(STORE.db){try{const b=Object.assign({},obj);delete b._id;await STORE.db.collection('data/users/'+STORE.id).doc(obj._id).set(b)}catch(e){}}
}
async function storeDel(id){
 STORE.items=STORE.items.filter(x=>x._id!==id);try{localStorage.setItem('bhie-mine',JSON.stringify(STORE.items))}catch(e){}
 if(STORE.db){try{await STORE.db.collection('data/users/'+STORE.id).doc(id).delete()}catch(e){}}
}
const mine=type=>STORE.items.filter(x=>x.type===type);
const pageHead=(eye,title,sub)=>`<div class="fx-hero"><span class="eyebrow">${eye}</span><h1>${title}</h1>${sub?`<p class="muted">${sub}</p>`:''}</div>`;
const dstr=d=>new Date(d).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});

/* ---------- SOS + assistant launchers (every page) ---------- */
function fabs(){
 return`<div class="fab-sos ${S.sosOpen?'open':''}">
  ${S.sosOpen?`<div class="sos-menu" role="menu"><b>Emergency help</b>
   <a href="tel:108" role="menuitem">🚑 <span><b>108</b> Ambulance</span></a>
   <a href="tel:104" role="menuitem">☎️ <span><b>104</b> Health helpline</span></a>
   <a href="tel:14416" role="menuitem">🧠 <span><b>14416</b> Tele-MANAS mental health</span></a>
   <a href="tel:112" role="menuitem">🆘 <span><b>112</b> All emergencies</span></a>
   <a href="tel:1962" role="menuitem">🐄 <span><b>1962</b> Animal helpline</span></a>
   <button data-a="find" role="menuitem">📍 <span>Nearest hospital on map</span></button></div>`:''}
  <button class="sos-btn" data-a="sos" aria-expanded="${!!S.sosOpen}" aria-label="Emergency SOS">SOS</button></div>
 <button class="fab-chat" data-a="chat-open" aria-label="Open AI health assistant" ${S.chatOpen?'hidden':''}><span>💬</span><b>Health assistant</b></button>
 ${S.chatOpen?chatPanel():''}`;
}

/* ---------- AI health assistant ---------- */
const CHAT={turns:[],busy:false,ctl:null,sample:undefined};
const CHAT_SVCS=['phc','consult','pharmacy','lab','govhosp','pvthosp','mental','dental','ayush','blood','amb','matru','ntep','npncd','pmndp','npcbvi','nphce','physio','homecare','mvu'];
function chatPanel(){
 const L=curLang();
 return`<section class="chat" role="dialog" aria-label="AI health assistant">
 <header><div><b>Health assistant</b><span>${L.nat} · AI, not a doctor</span></div><button class="x" data-a="chat-close" aria-label="Close">×</button></header>
 <div class="chat-log" id="chatlog">
  <div class="msg bot"><p>Namaste! Tell me your symptoms or question in any language. I will suggest the right service or doctor. In an emergency, call <a href="tel:108">108</a> now.</p></div>
  ${CHAT.turns.map((m,i)=>`<div class="msg ${m.role==='user'?'me':'bot'} ${m.urg==='emergency'?'urgent':''}" ${i===CHAT.turns.length-1&&m.role!=='user'?'id="chatlast"':''}><p>${esc(m.content).replace(/\n/g,'<br>')}</p>${m.role!=='user'&&m.content?`<button class="say" data-a="chat-say" data-i="${i}" aria-label="Read aloud">🔊</button>`:''}${m.acts?m.acts:''}</div>`).join('')}
  ${CHAT.busy&&(!CHAT.turns.length||CHAT.turns[CHAT.turns.length-1].role==='user')?`<div class="msg bot" id="chatlast"><p class="typing">Thinking…</p></div>`:''}
 </div>
 ${CHAT.turns.length?'':`<div class="chat-sug">${['Fever and body ache for 3 days','Chest pain and sweating','मुझे शुगर की जांच करानी है','How do I create ABHA?','Where is the nearest blood bank?'].map(q=>`<button data-a="chat-q" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>`}
 <div class="chat-in"><button class="btn mic ${CHAT.listen?'on':''}" data-a="chat-mic" aria-label="Speak your question" title="Speak">${CHAT.listen?'●':'🎤'}</button><textarea id="chatbox" rows="1" placeholder="${CHAT.listen?'Listening… speak now':'Type or speak your symptoms…'}" aria-label="Message"></textarea><button class="btn pri" data-a="chat-send" ${CHAT.busy?'disabled':''}>Send</button></div>
 ${CHAT.micMsg?`<div class="mic-help" role="status"><b>🎤 ${CHAT.micMsg==='nosupport'?'This browser has no voice input.':CHAT.micMsg==='network'?'Voice service could not be reached.':'Microphone is blocked on this page.'}</b><span>Speak using your phone keyboard instead: tap the box above, then tap the 🎤 on your keyboard (Gboard / iPhone keyboard) and talk in any language. Answers can still be read aloud with 🔊.</span><button class="x" data-a="mic-x" aria-label="Close">×</button></div>`:''}
 <p class="chat-note">General guidance only. It does not replace a doctor.</p></section>`;
}
function chatActs(meta){
 const b=[];
 if(meta.urgency==='emergency')b.push(`<a class="btn sm sos-a" href="tel:108">🚑 Call 108 now</a>`);
 const ft=findAll().find(x=>x[0]===meta.find);
 if(ft)b.push(`<button class="btn sm" data-a="chat-find" data-t="${ft[0]}">📍 Find ${esc(ft[1].split(' (')[0])} near me</button>`);
 const sv=SV.find(s=>s.k===meta.service);
 if(sv)b.push(`<button class="btn sm" data-a="svc" data-s="${sv.k}">${esc(svName(sv))}</button>`);
 if(meta.urgency!=='emergency')b.push(`<button class="btn sm" data-a="appt" data-s="${(ft&&ft[0])||'sp0'}">📅 Book appointment</button>`);
 return b.length?`<div class="msg-acts">${b.join('')}</div>`:'';
}
function ruleTriage(q){
 const s=q.toLowerCase();const has=(...w)=>w.some(x=>s.includes(x));
 if(has('chest pain','सीने','छाती','breath','सांस','unconscious','बेहोश','stroke','लकवा','bleeding','खून बह','seizure','दौरा','suicide','आत्महत्या'))return{urgency:'emergency',find:'trauma',service:'amb',reply:'This may be an emergency. Call 108 now or go to the nearest emergency hospital. Do not wait.'};
 if(has('sugar','शुगर','diabet','मधुमेह'))return{urgency:'routine',find:'sp12',service:'npncd',reply:'For a blood sugar check, visit your nearest PHC or a pathology lab. A diabetologist can guide long-term care.'};
 if(has('fever','बुखार','ताप','cold','cough','खांसी'))return{urgency:'soon',find:'sp0',service:'consult',reply:'For fever with body ache, drink plenty of fluids and rest. If it lasts more than 2–3 days, or there is high fever, rash or breathlessness, see a doctor. An e-consultation is a quick first step.'};
 if(has('blood bank','ब्लड','रक्त'))return{urgency:'routine',find:'blood',service:'blood',reply:'You can find the nearest blood bank on the map, or check stock on e-RaktKosh.'};
 if(has('abha'))return{urgency:'routine',find:'phc',service:'abha',reply:'You can create ABHA free at abha.abdm.gov.in with Aadhaar or a driving licence and mobile OTP, or at your nearest PHC.'};
 if(has('teeth','दांत','tooth'))return{urgency:'routine',find:'sp36',service:'dental',reply:'For tooth pain, see a dentist. Rinse with warm salt water meanwhile.'};
 if(has('anxiety','depress','tension','तनाव','mental'))return{urgency:'soon',find:'sp19',service:'mental',reply:'You are not alone. Tele-MANAS (14416) gives free, confidential support 24×7. A psychiatrist or counsellor can help.'};
 return{urgency:'routine',find:'sp0',service:'phc',reply:'A general physician or your nearest PHC is a good first step. Tell me more about your symptoms if you like.'};
}
async function chatSend(q){
 q=(q||'').trim();if(!q||CHAT.busy)return;
 CHAT.turns.push({role:'user',content:q});CHAT.busy=true;render();chatScroll();
 if(CHAT.sample===undefined){try{CHAT.sample=window.claude&&claude.use?await claude.use('sample'):null}catch(e){CHAT.sample=null}}
 const L=curLang();
 if(!CHAT.sample){const r=ruleTriage(q);CHAT.turns.push({role:'assistant',content:r.reply,urg:r.urgency,acts:chatActs(r)});CHAT.busy=false;render();chatScroll();return}
 const finds=findAll().map(x=>x[0]+'='+x[1]).join('; ');
 const svcs=CHAT_SVCS.map(k=>{const s=SV.find(x=>x.k===k);return s?k+'='+s.name:''}).join('; ');
 const RULES=`You are the health assistant of the Bharat HIE Portal, a public health information exchange in ${P.place||'India'}. Help citizens understand symptoms and reach the right service. Rules: You are not a doctor; never diagnose with certainty or prescribe medicine doses. If there are danger signs (chest pain, breathlessness, stroke signs, heavy bleeding, unconsciousness, seizures, severe injury, suicidal thoughts, pregnancy emergency, high fever in an infant), tell them to call 108 immediately. Keep answers short: 2-5 sentences, simple words. Reply in ${L.en} (${L.nat}) unless the user writes in another language, then reply in that language. Mention one helpful next step on this portal. After your answer, on a final separate line write exactly @@ followed by JSON: {"urgency":"emergency|soon|routine","find":"<one find id>","service":"<one service key>"}. Find ids: ${finds}. Service keys: ${svcs}.`;
 const msgs=[{role:'user',content:RULES},{role:'assistant',content:'Understood.'}].concat(CHAT.turns.slice(-8).map(m=>({role:m.role,content:m.content})));
 const bot={role:'assistant',content:''};CHAT.turns.push(bot);
 CHAT.ctl=new AbortController();
 try{
  const {text}=await CHAT.sample(msgs,{cache:false,signal:CHAT.ctl.signal,modelTier:'quick',onText:({text})=>{bot.content=text.split('@@')[0].trim();const el=document.querySelector('#chatlast p');if(el){el.classList.remove('typing');el.textContent=bot.content}chatScroll()}});
  const parts=text.split('@@');bot.content=parts[0].trim();let meta={};try{meta=JSON.parse(parts[1].trim().replace(/^[^{]*/,'').replace(/[^}]*$/,''))}catch(e){meta=ruleTriage(q)}
  bot.urg=meta.urgency;bot.acts=chatActs(meta);
 }catch(e){
  const r=ruleTriage(q);bot.content=(e&&e.code==='rate_limited'?'The assistant is busy. ':'')+r.reply;bot.urg=r.urgency;bot.acts=chatActs(r);
  if(e&&e.code==='not_granted')CHAT.sample=null;
 }
 CHAT.busy=false;render();chatScroll();
}
function chatScroll(){const l=document.getElementById('chatlog');if(l)l.scrollTop=l.scrollHeight}

/* ---------- Appointments & token ---------- */
const APPT_SLOTS=['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00'];
function apptPage(){
 const f=S.ap||{};const type=f.type||S.apType||'phc';
 const ty=findAll().find(x=>x[0]===type)||findAll()[0];
 const fac=(P.def?(PROV[{phc:'phc',govhosp:'govhosp',pvthosp:'pvthosp',dental:'dental',mental:'mental',ayush:'ayush',lab:'lab'}[type]]||[]):[]).map(r=>r[0]);
 const days=[...Array(14)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()+i+1);return d.toISOString().slice(0,10)});
 const list=mine('appt');
 return`<section class="sec fx">${pageHead('Appointments','Book an appointment and get a token','Choose the service, the place, a date and a time. You get a token number and your place in the queue.')}
 <div class="fx-grid"><div class="fx-card">
  <label class="fld"><span>1. Service or doctor</span><select class="inp" id="ap-type">${FIND_TYPES.map(g=>`<optgroup label="${g[0]}">${g[1].map(x=>`<option value="${x[0]}" ${x[0]===type?'selected':''}>${x[1]}</option>`).join('')}</optgroup>`).join('')}</select></label>
  <label class="fld"><span>2. Hospital, PHC or clinic</span><input class="inp" id="ap-fac" list="ap-facs" placeholder="e.g. PHC Wagholi, or a hospital name" value="${esc(f.fac||'')}"><datalist id="ap-facs">${fac.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></label>
  <div class="grid2"><label class="fld"><span>3. Date</span><select class="inp" id="ap-date">${days.map(d=>`<option value="${d}" ${d===f.date?'selected':''}>${dstr(d)}</option>`).join('')}</select></label>
  <label class="fld"><span>4. Time</span><select class="inp" id="ap-time">${APPT_SLOTS.map(s=>`<option ${s===f.time?'selected':''}>${s}</option>`).join('')}</select></label></div>
  <div class="grid2"><label class="fld"><span>Patient name</span><input class="inp" id="ap-name" value="${esc(f.name||'')}" autocomplete="name"></label>
  <label class="fld"><span>Mobile</span><input class="inp" id="ap-mob" inputmode="numeric" maxlength="10" value="${esc(f.mob||'')}"></label></div>
  ${S.apErr?`<p class="small" style="color:var(--red)">${esc(S.apErr)}</p>`:''}
  <button class="btn pri" data-a="ap-book">Book and get token</button>
 </div>
 <div class="fx-side"><h3>My appointments</h3>${list.length?list.map(a=>`<article class="tok ${a.status==='cancelled'?'off':''}">
  <div class="tok-n"><span>Token</span><b>${esc(a.token)}</b></div>
  <div class="tok-b"><b>${esc(a.label)}</b><span>${esc(a.fac)}</span><span>${dstr(a.date)} · ${esc(a.time)}</span>
   ${a.status==='cancelled'?'<em>Cancelled</em>':`<em>About ${a.ahead} people ahead · wait ~${a.ahead*4} min</em>`}</div>
  ${a.status==='cancelled'?`<button class="x" data-a="ap-del" data-i="${a._id}" aria-label="Remove">×</button>`:`<button class="btn sm" data-a="ap-cancel" data-i="${a._id}">Cancel</button>`}</article>`).join(''):`<p class="small muted">No appointments yet. Booked tokens appear here.</p>`}
  <p class="small muted">Show the token at the registration counter. You also get it by SMS in the live system.</p></div></div></section>`;
}
async function apBook(){
 const g=id=>(document.getElementById(id)||{}).value||'';
 const f={type:g('ap-type'),fac:g('ap-fac').trim(),date:g('ap-date'),time:g('ap-time'),name:g('ap-name').trim(),mob:g('ap-mob').trim()};
 S.ap=f;
 if(!f.fac||!f.name||!/^\d{10}$/.test(f.mob)){S.apErr='Please fill the place, the patient name and a 10-digit mobile number.';render();return}
 S.apErr='';const ty=findAll().find(x=>x[0]===f.type)||['','Doctor'];
 const pre=(f.type==='phc'?'P':f.type.startsWith('sp')?'D':'S');
 const seq=(mine('appt').length+1)*7+APPT_SLOTS.indexOf(f.time)*3+Math.floor(Math.random()*20);
 await storeSave({type:'appt',label:ty[1],fac:f.fac,date:f.date,time:f.time,name:f.name,mob:f.mob.slice(0,2)+'xxxxxx'+f.mob.slice(-2),token:`${pre}-${String(100+seq).padStart(4,'0')}`,ahead:3+(seq%12),status:'booked',at:Date.now()});
 S.ap={type:f.type};S.toast='Appointment booked. Your token is ready.';render();
}

/* ---------- Health camps ---------- */
function campsList(){
 const areas=(P.areas||['City']).slice(0,8),kinds=[['Free BP & sugar screening','npncd','PHC/Sub-centre/Gram Panchayat'],['Mission Indradhanush vaccination drive','immun','Anganwadi centre'],['Eye check-up & free spectacles','npcbvi','Rural hospital'],['Blood donation camp','blood','Community hall'],['TB screening (Ni-kshay)','ntep','PHC'],['Women & child health camp','matru','Sub-centre'],['Oral cancer & dental screening','nohp','PHC'],['Yoga & wellness morning','yogactr','Public garden'],['Animal vaccination (FMD / LSD)','mvu','Veterinary dispensary']];
 const out=[];const base=new Date();base.setHours(0,0,0,0);
 for(let i=0;i<18;i++){const d=new Date(base);d.setDate(base.getDate()+1+Math.floor(i*1.7));const k=kinds[(i*5+3)%kinds.length];out.push({d,title:k[0],svc:k[1],where:k[2]+', '+areas[i%areas.length],time:['9 am – 1 pm','10 am – 4 pm','8 am – 11 am'][i%3]})}
 return out;
}
function campsPage(){
 const L=campsList(),f=S.campF||'all';
 const kinds=[...new Set(L.map(c=>c.title))];
 const list=L.filter(c=>f==='all'||c.title===f);
 const byM={};list.forEach(c=>{const m=c.d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});(byM[m]=byM[m]||[]).push(c)});
 return`<section class="sec fx">${pageHead('Health camps','Screening camps and vaccination drives near you',`Upcoming camps in ${esc(P.place)}. Entry is free; carry your ABHA or health card if you have one.`)}
 <div class="filters"><button class="chip" data-a="camp-f" data-g="all" aria-pressed="${f==='all'}">All camps</button>${kinds.map(k=>`<button class="chip" data-a="camp-f" data-g="${esc(k)}" aria-pressed="${f===k}">${esc(k)}</button>`).join('')}</div>
 <p class="small muted"><span class="pill">Demo schedule</span> Dates and places are shown for the demonstration. District health offices publish the live camp list here.</p>
 ${Object.entries(byM).map(([m,cs])=>`<h3 class="camp-m">${m}</h3><div class="camps">${cs.map((c,i)=>`<article class="camp"><div class="camp-d"><b>${c.d.getDate()}</b><span>${c.d.toLocaleDateString('en-IN',{month:'short'})}</span><small>${c.d.toLocaleDateString('en-IN',{weekday:'short'})}</small></div>
  <div class="camp-b">${SVC_IMG[c.svc]?`<img src="${SVC_IMG[c.svc]}" alt="">`:''}<div><b>${esc(c.title)}</b><span>📍 ${esc(c.where)}</span><span>🕘 ${c.time}</span></div></div>
  <div class="camp-a"><button class="btn sm" data-a="camp-remind" data-t="${esc(c.title)}" data-d="${c.d.toISOString()}" data-w="${esc(c.where)}">🔔 Remind me</button><a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.where+(P.india?', India':''))}">Map ↗</a></div></article>`).join('')}</div>`).join('')}
 ${mine('remind').length?`<div class="fx-card"><h3>My reminders</h3>${mine('remind').map(r=>`<div class="row" style="justify-content:space-between"><span><b>${esc(r.title)}</b> · ${dstr(r.date)} · ${esc(r.where)}</span><button class="x" data-a="ap-del" data-i="${r._id}" aria-label="Remove">×</button></div>`).join('')}</div>`:''}
 </section>`;
}

/* ---------- Grievances ---------- */
const GRV_STEPS=[['Submitted','Your complaint is registered.'],['Assigned','Sent to the District Health Officer.'],['In progress','The officer is looking into it.'],['Resolved','Action taken and reply sent.']];
const grvStage=g=>g.status==='closed'?3:Math.min(2,Math.floor((Date.now()-g.at)/(2*60*1000)));
function grievPage(){
 const f=S.gv||{},list=mine('grv');const q=(S.gvQ||'').trim().toUpperCase();
 const found=q?list.find(g=>g.ref===q):null;
 const card=g=>{const st=grvStage(g);return`<article class="grv"><div class="row" style="justify-content:space-between"><div><b class="mono">${g.ref}</b> · ${esc(g.cat)}</div><span class="pill ${st===3?'ok':'info'}">${GRV_STEPS[st][0]}</span></div>
  <p class="small muted">${esc(g.text.slice(0,160))}${g.text.length>160?'…':''}</p>
  <ol class="grv-steps">${GRV_STEPS.map((s,i)=>`<li class="${i<=st?'done':''}"><b>${s[0]}</b><span>${i<=st?s[1]:''}</span></li>`).join('')}</ol>
  <p class="small muted">Filed ${new Date(g.at).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})} · ${esc(g.district)}</p></article>`};
 return`<section class="sec fx">${pageHead('Complaints & feedback','Raise a complaint and track its status','Tell us what went wrong or what we can improve. You get a reference number to track it.')}
 <div class="fx-grid"><div class="fx-card">
  <label class="fld"><span>Type</span><select class="inp" id="gv-cat">${['Doctor not available','Medicine not available','Long waiting time','Staff behaviour','Hospital cleanliness','Ambulance delay','Health card / ABHA problem','Scheme or payment issue','Website or app problem','Suggestion / feedback'].map(x=>`<option ${x===f.cat?'selected':''}>${x}</option>`).join('')}</select></label>
  <div class="grid2"><label class="fld"><span>District / area</span><input class="inp" id="gv-dist" value="${esc(f.district||'')}" list="gv-areas"><datalist id="gv-areas">${(P.areas||[]).map(a=>`<option value="${esc(a)}">`).join('')}</datalist></label>
  <label class="fld"><span>Mobile (for updates)</span><input class="inp" id="gv-mob" inputmode="numeric" maxlength="10" value="${esc(f.mob||'')}"></label></div>
  <label class="fld"><span>Describe the problem</span><textarea class="inp" id="gv-text" rows="4" placeholder="What happened, where and when?">${esc(f.text||'')}</textarea></label>
  ${S.gvErr?`<p class="small" style="color:var(--red)">${esc(S.gvErr)}</p>`:''}
  <button class="btn pri" data-a="gv-send">Submit complaint</button>
 </div>
 <div class="fx-side"><h3>Track a complaint</h3><div class="row" style="flex-wrap:nowrap"><input class="inp" id="gv-q" placeholder="Reference, e.g. GRV-2026-1234" value="${esc(S.gvQ||'')}"><button class="btn" data-a="gv-track">Track</button></div>
  ${q?(found?card(found):`<p class="small" style="color:var(--red)">No complaint with ${esc(q)} on this device or account.</p>`):''}
  <h3 style="margin-top:14px">My complaints</h3>${list.length?list.map(card).join(''):`<p class="small muted">No complaints yet.</p>`}
  <p class="small muted">Urgent? Call 104. For corruption or serious misconduct you can also use the CPGRAMS portal (pgportal.gov.in).</p></div></div></section>`;
}
async function gvSend(){
 const g=id=>(document.getElementById(id)||{}).value||'';
 const f={cat:g('gv-cat'),district:g('gv-dist').trim(),mob:g('gv-mob').trim(),text:g('gv-text').trim()};S.gv=f;
 if(f.text.length<10||!f.district){S.gvErr='Please add the district and a short description (at least 10 characters).';render();return}
 S.gvErr='';const ref='GRV-'+new Date().getFullYear()+'-'+String(1000+Math.floor(Math.random()*9000));
 await storeSave({type:'grv',ref,cat:f.cat,district:f.district,mob:f.mob?f.mob.slice(0,2)+'xxxxxx'+f.mob.slice(-2):'',text:f.text,at:Date.now(),status:'open'});
 S.gv={};S.gvQ=ref;S.toast='Complaint submitted. Reference '+ref;render();
}

/* ---------- FAQ & help ---------- */
const FAQS=[
 ['ABHA & health card',[
  ['What is ABHA?','ABHA (Ayushman Bharat Health Account) is a free 14-digit health ID under the Ayushman Bharat Digital Mission. It links your health records from different hospitals and labs, only with your consent.'],
  ['How do I create ABHA?','Go to abha.abdm.gov.in or use the ABHA app. Choose Aadhaar or driving licence, enter the OTP sent to your mobile, and your ABHA number and address are created in a few minutes. You can also ask at your nearest PHC or hospital registration counter.'],
  ['How do I get the Bharat HIE health card?','Log in as a citizen, open "Health Card" in your dashboard, fill in your details and upload a passport-size photo. The card shows your health ID and a QR code that any connected provider can scan.'],
  ['I lost my card or ABHA number. What now?','You can retrieve your ABHA number on abha.abdm.gov.in with your mobile or Aadhaar OTP, and download the card again from your dashboard.']]],
 ['Appointments & doctors',[
  ['How do I book an appointment?','Open "Book appointment", choose the service or doctor, the place, the date and time. You get a token number and your expected waiting time.'],
  ['Can I talk to a doctor online?','Yes. Use e-Consultation for a video or phone consultation. The government\'s free eSanjeevani service is also available at esanjeevani.mohfw.gov.in.'],
  ['How do I find a doctor or hospital near me?','Use "Find healthcare near me", choose the specialist or facility and enter your area or PIN code. The nearest options open on the map.']]],
 ['Medicines, tests & schemes',[
  ['Where can I get low-cost medicines?','Jan Aushadhi Kendras sell quality generic medicines at lower prices. Find the nearest one through the portal\'s map search or janaushadhi.gov.in.'],
  ['Am I eligible for free treatment?','Families covered under PM-JAY and Maharashtra\'s MJPJAY get cashless treatment at empanelled hospitals. Check eligibility at the hospital\'s Arogya Mitra desk or the official scheme portals.'],
  ['How do I get my lab report?','Reports from connected labs appear in your Personal Health Record automatically. You also get an SMS when the report is ready.']]],
 ['Privacy & safety',[
  ['Who can see my health records?','Only you, and the providers you give consent to. You can see every access and withdraw consent at any time from the consent manager.'],
  ['What should I do in an emergency?','Call 108 for an ambulance or 112 for any emergency. The red SOS button on every page lists all emergency numbers.'],
  ['How do I complain or give feedback?','Open "Complaints & feedback", describe the problem and submit. You get a reference number to track the status.']]]
];
function faqPage(){
 const q=(S.faqQ||'').trim().toLowerCase();
 const groups=FAQS.map(([g,items])=>[g,items.filter(([a,b])=>!q||(a+' '+b).toLowerCase().includes(q))]).filter(g=>g[1].length);
 return`<section class="sec fx">${pageHead('FAQ & help','Frequently asked questions','Quick answers about ABHA, the health card, appointments, medicines and privacy.')}
 <div class="faq-search"><input class="inp" id="faq-q" placeholder="Search questions, e.g. ABHA, appointment, medicine" value="${esc(S.faqQ||'')}"></div>
 ${groups.length?groups.map(([g,items])=>`<h3 class="camp-m">${g}</h3><div class="faq">${items.map(([a,b])=>`<details><summary>${esc(a)}</summary><p>${esc(b)}</p></details>`).join('')}</div>`).join(''):`<p class="muted">No answers match. Ask the health assistant instead.</p>`}
 <div class="faq-help"><div><b>Still need help?</b><span>Ask the AI health assistant, call 104, or raise a complaint.</span></div><div class="row"><button class="btn pri" data-a="chat-open">💬 Ask assistant</button><a class="btn" href="tel:104">☎ Call 104</a><button class="btn" data-a="griev">Raise a complaint</button></div></div></section>`;
}
