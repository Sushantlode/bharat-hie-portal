function render(){
 const a=document.getElementById('app');document.documentElement.lang=LANG;if(CNAME)document.title=CNAME+' HIE Portal';document.documentElement.dir=(LANGS.find(x=>x.c===LANG)||{}).rtl?'rtl':'ltr';HCIMG=[];
 const fe=document.activeElement,focusId=fe&&fe.id,caret=(focusId==='q'||focusId==='lq'||focusId==='gsearch')?fe.selectionStart:null;
 const keepK=S.view+'|'+S.mod+'|'+S.tool,keep=keepK===render.k?[...a.querySelectorAll('.md-tool [id]')].filter(e=>/^(rk-|phq|sc-|lab-t)/.test(e.id)).map(e=>[e.id,e.type==='checkbox'?e.checked:e.value]):[];render.k=keepK;
 const NV={appt:apptPage,camps:campsPage,griev:grievPage,faq:faqPage,mod:modPage,mods:modsHub};
 let view=NV[S.view]?NV[S.view]():S.view==='find'?findPage():S.view==='about'?aboutPage():(!S.user||S.view==='home')?home():{admin:adminView,doctor:doctorView,pharmacist:pharmView,pathologist:labView,bloodbank:bloodView,ngo:ngoView,citizen:citizenView}[S.user.role]();
 a.innerHTML=brandFix(`<button class="skip" data-a="skip">Skip to main content</button>`+topbar()+phcFix(loc(`<main class="wrapx" id="main" tabindex="-1">${crumbs()}${view}</main>`+footer()+(S.sel?drawer():'')+modal())))+fabs()+(S.toast?`<div class="toast" role="status">${esc(S.toast)}</div>`:'');
 hcFill(a);keep.forEach(([id,v])=>{const e=document.getElementById(id);if(e){if(e.type==='checkbox')e.checked=v;else e.value=v}});
 const cm=document.getElementById('cmsgs');if(cm)cm.scrollTop=cm.scrollHeight;
 if(focusId){const el=document.getElementById(focusId);if(el){el.focus();if(caret!=null)el.setSelectionRange(caret,caret)}}
}
const val=id=>{const e=document.getElementById(id);return e?e.value:''};
function loginAs(role,idx=0){
 if(role==='admin')S.user={role,roleName:'Admin',name:'State Health Control'};
 else if(role==='citizen'){const c=citizens[idx]||citizens[0];S.user={role,roleName:'Citizen',name:c.name,cid:c.id}}
 else{const list=providers.filter(x=>x.role===role);const p=list[idx]||list[0];S.user={role,roleName:ROLES.find(r=>r.k===role).n,name:idx===0?hl(role):p.name}}
 S.view='app';S.modal=null;S.sel=null;S.ptab='queue';S.hcView=null;window.scrollTo(0,0);
}
function checkRx(cid){const c=C(cid);const open=pharmacyQ.some(o=>o.cid===cid&&!o.done)||labQ.some(o=>o.cid===cid&&!o.done);if(!open&&c.stage==='rx'){c.stage='follow';c.log.push({d:tick(1),t:'Medicines and tests complete, sent to BPO for follow-up',by:'System'})}}
const lg=(c,t,by)=>c.log.push({d:tick(),t,by});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='fd-loc'){e.preventDefault();findGo()}if(e.key==='Enter'&&!e.shiftKey&&e.target&&e.target.id==='chatbox'){e.preventDefault();chatSend(e.target.value)}if(e.key==='Enter'&&e.target&&e.target.id==='gv-q'){S.gvQ=e.target.value;render()}if(e.key==='Escape'&&(S.sosOpen||S.more)){S.sosOpen=false;S.more=false;render()}});
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]');if(!t||t.tagName==='SELECT'||t.tagName==='INPUT')return;
 const a=t.dataset.a,cid=t.dataset.c,c=cid&&C(cid);
 switch(a){
 case'home':S.view='home';S.sel=null;window.scrollTo(0,0);break;
 case'about':S.view='about';S.sel=null;S.modal=null;window.scrollTo(0,0);break;
 case'find':S.view='find';S.sel=null;S.modal=null;window.scrollTo(0,0);break;
 case'fd-go':findGo();return;
 case'mods':S.view='mods';S.more=false;S.modal=null;S.sel=null;window.scrollTo(0,0);break;
 case'mod':S.view='mod';S.mod=t.dataset.s;S.tool=null;S.more=false;S.modal=null;S.sel=null;S.schemeR=S.riskR=S.phqR=S.labOut=null;window.scrollTo(0,0);break;
 case'tool':S.tool=t.dataset.t;break;
 case'kid-add':{const n=val('kid-n').trim(),d=val('kid-d');if(!n||!d){S.toast='Enter name and date of birth';break}const o={type:'child',name:n,dob:d,done:{}};storeSave(o).then(()=>{S.kid=o._id;render()});return}
 case'kid-sel':S.kid=t.dataset.i;break;
 case'preg-save':{const d=val('lmp');if(!d){S.toast='Choose the LMP date';break}const p=mine('preg')[0]||{type:'preg'};p.lmp=d;storeSave(p).then(render);return}
 case'sc-check':schemeCheck();return;
 case'fm-add':{const n=val('fm-n').trim();if(!n){S.toast='Enter a name';break}storeSave({type:'fam',name:n,rel:val('fm-r'),age:+val('fm-a')||0,g:val('fm-g'),ab:val('fm-ab').trim()}).then(render);return}
 case'md-add':{const n=val('md-n').trim();const sl=['m','a','n'].filter(k=>(document.getElementById('md-'+k)||{}).checked);if(!n||!sl.length){S.toast='Enter medicine and at least one time';break}storeSave({type:'med',name:n,days:+val('md-d')||30,slots:sl,food:!!(document.getElementById('md-f')||{}).checked,start:iso(new Date()),taken:{}}).then(render);return}
 case'lab-go':labGo();return;
 case'rk-go':riskGo();return;
 case'phq-go':phqGo();return;
 case'hv-add':{const n=val('hv-n').trim();if(!n){S.toast='Enter the elder\'s name';break}storeSave({type:'visit',name:n,age:+val('hv-a')||0,need:val('hv-t'),addr:val('hv-ad').trim()||'—',date:val('hv-d'),at:Date.now()}).then(render);return}
 case'ct-rev':{const r=mine('revoke')[0]||{type:'revoke',ids:[]};r.ids=(r.ids||[]).concat(+t.dataset.i);storeSave(r).then(render);return}
 case'dn-save':{const d=mine('donor')[0]||{type:'donor'};Object.assign(d,{bg:val('dn-bg'),age:+val('dn-age')||0,w:+val('dn-w')||0,g:val('dn-g'),last:val('dn-last'),area:val('dn-ar').trim()});storeSave(d).then(render);return}
 case'chat-mic':chatMic();return;
 case'mic-x':CHAT.micMsg='';break;
 case'chat-say':chatSpeak(+t.dataset.i);return;
 case'sos':S.sosOpen=!S.sosOpen;break;
 case'chat-open':S.chatOpen=true;S.sosOpen=false;render();setTimeout(()=>{chatScroll();const b=document.getElementById('chatbox');if(b)b.focus()},30);return;
 case'chat-close':S.chatOpen=false;if(CHAT.ctl)try{CHAT.ctl.abort()}catch(e){}break;
 case'chat-send':{const b=document.getElementById('chatbox');chatSend(b?b.value:'');return}
 case'chat-q':chatSend(t.dataset.q);return;
 case'chat-find':S.find={type:t.dataset.t,loc:''};S.view='find';S.chatOpen=false;window.scrollTo(0,0);break;
 case'appt':S.view='appt';S.ap={type:t.dataset.s||(S.ap&&S.ap.type)};S.apErr='';S.chatOpen=false;S.more=false;window.scrollTo(0,0);break;
 case'ap-book':apBook();return;
 case'ap-cancel':{const a=STORE.items.find(x=>x._id===t.dataset.i);if(a){a.status='cancelled';storeSave(a).then(render)}return}
 case'ap-del':storeDel(t.dataset.i).then(render);return;
 case'camps':S.view='camps';S.more=false;window.scrollTo(0,0);break;
 case'camp-f':S.campF=t.dataset.g;break;
 case'camp-remind':storeSave({type:'remind',title:t.dataset.t,date:t.dataset.d,where:t.dataset.w,at:Date.now()}).then(()=>{S.toast='Reminder saved. We will notify you a day before.';render()});return;
 case'griev':S.view='griev';S.more=false;S.gvErr='';window.scrollTo(0,0);break;
 case'gv-send':gvSend();return;
 case'gv-track':S.gvQ=(document.getElementById('gv-q')||{}).value||'';break;
 case'faq':S.view='faq';S.more=false;window.scrollTo(0,0);break;
 case'more':S.more=!S.more;break;
 case'fd-me':findMe();return;
 case'dash':S.view='app';break;
 case'jump':{if(S.view!=='home'||!S.user){S.view='home'}render();const el=document.getElementById(t.dataset.j);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});return}
 case'logout':S.user=null;S.view='home';S.sel=null;break;
 case'open-login':S.modal='login';S.lsvc='phr';break;
 case'role-login':S.modal='login';S.lsvc=ROLE_SVC[t.dataset.r];break;
 case'open-reg':S.modal='reg';S.lsvc=t.dataset.s||'phr';break;
 case'login-admin':loginAs('admin');S.tab='analytics';break;
 case'as':loginAs(t.dataset.r,0);if(t.dataset.t)S.tab=t.dataset.t;break;
 case'svc':S.svc=t.dataset.s;S.modal='svc';break;
 case'svc-pick':if(window.innerWidth<900){S.svc=t.dataset.s;S.modal='svc'}else{S.svcSel=t.dataset.s}break;
 case'sg':S.sg=t.dataset.g;S.svcLimit=24;break;
 case'js':S.js=+t.dataset.i;break;
 case'jph':S.js=+t.dataset.i;break;
 case'ss':S.ss=t.dataset.g;break;
 case'close':S.sel=null;S.modal=null;S.ctStart=null;break;
 case'ax-range':AX.range=t.dataset.g;break;
 case'ax-xl':xlOpen(t.dataset.sheet,t.dataset.row);break;
 case'xl-cell':S.xl.sel=[+t.dataset.r,+t.dataset.c];break;
 case'xl-tab':S.xl.sheet=t.dataset.s;S.xl.sel=[1,0];S.xl.hi=null;break;
 case'xl-dl':xlDownload();return;
 case'xl-copy':{const txt=xlTSV();try{navigator.clipboard.writeText(txt).then(()=>toast('Sheet copied. Paste it into Excel.'),()=>toast('Copy was blocked here.'))}catch(e){toast('Copy was blocked here.')}return}
 case'ax-live':AX.live=!AX.live;break;
 case'ax-all':AX.showAll=!AX.showAll;break;
 case'lang-open':S.modal='lang';S.lq='';break;
 case'apply':S.job=+t.dataset.i;S.modal='apply';break;
 case'ap-send':S.modal=null;toast('Application received for '+JOBS()[S.job||0][0]+' (demo)');return;
 case'consult-open':{S.cdoc=+t.dataset.i;S.modal='consult';S.ctStart=Date.now();S.mute=false;const d=DOCS[S.cdoc%DOCS.length],me=persona();S.chat=[{me:false,t:`Hello ${me.name.split(' ')[0]}, I am ${d.name}. I can see your Bharat HIE health record. How are you feeling today?`,at:hhmm()}];break}
 case'c-mute':S.mute=!S.mute;break;
 case'c-send':{const v=val('cmsg').trim();if(!v)return;S.chat.push({me:true,t:v,at:hhmm()});docSay();return}
 case'c-vitals':{const v=persona().v;S.chat.push({me:true,t:`Shared vitals: BP ${v.sbp}/${v.dbp}, sugar ${v.sugar}, SpO₂ ${v.spo2}%, pulse ${v.pulse}`,at:hhmm()});docSay();return}
 case'c-phr':S.chat.push({me:true,t:'Shared my health record with the doctor (consent valid for 24 hours)',at:hhmm()});docSay();return;
 case'c-end':S.modal=null;S.ctStart=null;toast('Consultation ended. Notes saved to the health record (demo)');return;
 case'skip':{const m=document.getElementById('main');if(m){m.focus();m.scrollIntoView()}return}
 case'crumb-role':S.hcView=null;if(S.user.role==='admin')S.tab='analytics';window.scrollTo(0,0);break;
 case'sq-clear':S.sq='';break;
 case'hc-open':S.hcDraft=hcDraftFrom(C(S.user.cid));S.hcView='form';S.modal=null;window.scrollTo(0,0);break;
 case'hc-back':S.hcView=null;window.scrollTo(0,0);break;
 case'hc-gen':hcGenerate();return;
 case'hc-dl':hcDownload();return;
 case'open-login-svc':S.modal='login';S.lsvc=t.dataset.s;break;
 case'lreg':S.lr=t.dataset.g;break;
 case'pick-lang':LANG=t.dataset.l;try{localStorage.setItem('setu-lang',LANG)}catch(e){}S.modal=null;break;
 case'do-login':{const v=SV.find(x=>x.k===val('lg-svc')),i=+val('lg-acct'),ac=acctsFor(v)[i];if(v.role==='citizen')loginAs('citizen',i);else{loginAs(v.role,0);S.user.name=ac.name;S.user.roleName=svName(v);if(v.role==='admin')S.tab=ADMIN_TAB[v.k]||'services'}toast('✓ '+svName(v));return}
 case'do-reg':return doReg();
 case'tab':S.tab=t.dataset.t;S.page=0;break;
 case'ptab':S.ptab=t.dataset.t;break;
 case'pg':S.page+= +t.dataset.d;break;
 case'flagF':S.flagF=t.dataset.f;S.tab='overview';S.page=0;break;
 case'dist':S.distF=t.dataset.d;S.flagF='all';S.tab='overview';S.page=0;break;
 case'open':S.sel=cid;break;
 case'approve':{const p=providers[+t.dataset.o];p.api='Connected';p.sync=tick();toast(p.name+' approved and connected');return}
 case'bpo-done':{const r=val('bpo-'+cid);lg(c,'BPO call: '+r,'BPO');
   if(/feeling fine/.test(r)&&c.flag!=='red'){c.stage='monitor';toast(c.name+' moved to monitoring')}
   else if(/No answer/.test(r)){c.stage='bpo';toast('Kept in queue for a retry call')}
   else{c.stage='kpo';toast(c.name+' sent to KPO review')}break}
 case'kpo-done':{if(val('kpo-'+cid)==='cc'){c.stage='cc';lg(c,'KPO review: consultation needed, escalated to Command Centre','KPO');toast(c.name+' sent to Command Centre')}else{c.stage='monitor';lg(c,'KPO review: monitoring is sufficient','KPO');toast(c.name+' moved to monitoring')}break}
 case'cc-done':{c.doctor=val('cc-doc-'+cid);c.mode=val('cc-mode-'+cid);c.stage='consult';lg(c,`Command Centre assigned ${c.doctor} (${c.mode})`,'Command Centre');
   const n=val('cc-ngo-'+cid);if(n){ngoTasks.push({cid,ngo:n,done:false,d:tick(1),note:''});lg(c,'NGO follow-up assigned: '+n,'Command Centre')}
   const g=val('cc-bl-'+cid);if(g){bloodReq.push({cid,g,units:1,done:false,hosp:c.fac,d:tick(1)});lg(c,'Blood request raised: '+g,'Command Centre')}
   toast(c.name+' sent to doctor queue');break}
 case'rx':{const meds=MEDS.filter((m,i)=>document.getElementById(`m-${cid}-${i}`).checked),tests=TESTS.filter((x,i)=>document.getElementById(`t-${cid}-${i}`).checked);
   const rx={id:'RX-'+(rxN++),meds,tests,by:c.doctor||S.user.name,d:tick(),advice:val('adv-'+cid)};c.rx.push(rx);
   lg(c,`e-Prescription ${rx.id}: ${meds.join(', ')||'no medicines'} · Tests: ${tests.join(', ')||'none'}`,'Doctor');
   if(meds.length)pharmacyQ.push({rx,cid,done:false,ph:P.pharm+', '+c.district});if(tests.length)labQ.push({rx,cid,done:false,lab:P.lab+', '+c.district});
   c.stage=(meds.length||tests.length)?'rx':'follow';toast('Prescription sent to pharmacy and lab');break}
 case'dispense':{const o=pharmacyQ[+t.dataset.o];o.done=true;o.at=tick();lg(C(o.cid),`Medicines dispensed (${o.rx.id})`,'Pharmacy');checkRx(o.cid);toast('Dispensed. Health record updated');break}
 case'report':{const i=+t.dataset.o,o=labQ[i],cc=C(o.cid);o.at=tick();o.res=o.rx.tests.map((x,j)=>({name:x,val:val(`lab-${i}-${j}`),d:o.at,lab:o.lab,status:'Reviewed'}));o.res.forEach(r=>cc.reports.push(r));lg(cc,`Lab report uploaded: ${o.res.map(r=>r.name+' '+r.val).join(', ')}`,'Lab');o.done=true;checkRx(o.cid);toast('Report saved to health record');break}
 case'issue':{const r=bloodReq[+t.dataset.o];if(blood[r.g]>=r.units){blood[r.g]-=r.units;r.done=true;lg(C(r.cid),`Blood bank issued ${r.units} unit(s) ${r.g}`,'Blood Bank');toast('Blood issued')}break}
 case'visit':{const i=+t.dataset.o,o=ngoTasks[i];o.note=val('ngo-'+i);o.done=true;o.d=tick();lg(C(o.cid),o.ngo+' home visit: '+o.note,'NGO');toast('Home visit recorded');break}
 case'follow':{const nv=Object.assign({},c.v);['sbp','dbp','sugar','spo2','pulse'].forEach(k=>{const x=parseFloat(val(`f-${cid}-${k}`));if(!isNaN(x))nv[k]=x});
   c.v=nv;c.hist.push({d:tick(),sbp:nv.sbp,dbp:nv.dbp,sugar:nv.sugar,spo2:nv.spo2,src:'BPO follow-up'});const r=assess(nv);c.flag=r.flag;c.reasons=r.reasons;
   lg(c,`Follow-up vitals: BP ${nv.sbp}/${nv.dbp}, sugar ${nv.sugar}, SpO₂ ${nv.spo2}%`,'BPO');lg(c,`Flag recalculated: ${r.flag.toUpperCase()}`,'System');
   if(r.flag==='green'){c.stage='monitor';toast(c.name+' is now green: monitoring')}else{c.loop++;c.stage='bpo';toast(`${c.name} still ${r.flag}: loop #${c.loop} started`)}break}
 default:return;
 }
 render();
});
document.addEventListener('change',e=>{const t=e.target;
 if(t.dataset&&t.dataset.a==='vx-tick'){const kids=mine('child');const sel=kids.find(k=>k._id===S.kid)||kids[0];if(sel){sel.done=sel.done||{};sel.done[t.dataset.k]=t.checked;storeSave(sel).then(render)}return}
 if(t.dataset&&t.dataset.a==='md-take'){const m=STORE.items.find(x=>x._id===t.dataset.i);if(m){m.taken=m.taken||{};m.taken[t.dataset.k]=t.checked;storeSave(m).then(render)}return}
 if(t.id==='hc-photo'&&t.files&&t.files[0]){hcRead();hcPhoto(t.files[0]);return}
 if(S.hcView==='form'&&/^hc-/.test(t.id)){hcRead();return}
 if(t.id==='pmphoto'&&t.files&&t.files[0]){const f=t.files[0],rd=new FileReader();rd.onload=()=>{S.pmPhoto=S.pmPhoto||{};S.pmPhoto[P.cc]=rd.result;try{localStorage.setItem('setu-pm-'+P.cc,rd.result)}catch(err){}render()};rd.readAsDataURL(f);return}
 if(t.id==='ctry'){setPlace(t.value,t.value==='IN'?'Maharashtra':'all');return}
 if(t.id==='stsel'){setPlace(P.cc,t.value);return}
 if(t.id==='distF'){S.distF=t.value;S.page=0;render()}
 if(t.id==='lg-svc'||t.id==='rg-svc'){S.lsvc=t.value;render()}
});
document.addEventListener('input',e=>{if(e.target.id==='gen-q'){S.genQ=e.target.value;const pos=e.target.selectionStart;render();const el=document.getElementById('gen-q');if(el){el.focus();el.setSelectionRange(pos,pos)}return}if(e.target.id==='faq-q'){S.faqQ=e.target.value;const pos=e.target.selectionStart;render();const el=document.getElementById('faq-q');if(el){el.focus();el.setSelectionRange(pos,pos)}return}if(e.target.id==='gsearch'){const first=!S.sq;S.sq=e.target.value;S.svcLimit=24;if(S.view!=='home'){S.view='home';S.sel=null}render();if(first&&S.sq){const el=document.getElementById('services');if(el)el.scrollIntoView({block:'start'})}return}if(S.hcView==='form'&&/^hc-/.test(e.target.id)){hcRead();return}if(e.target.id==='q'){S.q=e.target.value;S.page=0;render()}if(e.target.id==='lq'){S.lq=e.target.value;render()}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='gsearch'){const el=document.getElementById('services');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});return}if(e.key==='Enter'&&e.target.id==='cmsg'){e.preventDefault();document.querySelector('[data-a=c-send]').click();return}if(e.key==='Escape'&&(S.sel||S.modal)){S.sel=null;S.modal=null;render()}});
function doReg(){
 const v0=SV.find(x=>x.k===val('rg-svc')),r=v0.role,name=val('rg-name').trim()||'New user';
 if(r==='citizen'){
  const v={sbp:+val('rg-sbp')||120,dbp:+val('rg-dbp')||80,sugar:+val('rg-sugar')||100,spo2:+val('rg-spo2')||98,pulse:+val('rg-pulse')||75,bmi:+val('rg-bmi')||23};
  const a=assess(v),i=citizens.length,card=val('rg-card').trim(),dist=val('rg-dist')||DISTRICTS[0];
  const c={id:'c'+i,name,age:+val('rg-age')||40,sex:'—',district:dist,card:card?{type:'ABHA',no:card}:{type:'ABHA',no:`91-${pad(7000+i*37,4)}-${pad(2100+i*91,4)}-${pad(8800+i*13,4)}`},mobile:val('rg-mob'),fac:'Self registration',source:'Self',v,flag:a.flag,reasons:a.reasons,stage:a.flag==='green'?'monitor':'new',loop:1,scheme:'None',since:new Date(clock),hist:[{d:ago(24*60),sbp:v.sbp-8,dbp:v.dbp-4,sugar:v.sugar-30,spo2:v.spo2,src:'ASHA home visit'},{d:new Date(clock),sbp:v.sbp,dbp:v.dbp,sugar:v.sugar,spo2:v.spo2,src:'First screening'}],log:[],rx:[],reports:[],appts:[]};
  citizens.unshift(c);lg(c,card?'Registered; existing ABHA linked':'Registered; new ABHA created','HIE');lg(c,`Flag set to ${a.flag.toUpperCase()}: ${a.reasons.join(', ')}`,'System');
  S.user={role:'citizen',roleName:'Citizen',name,cid:c.id};S.view='app';S.modal=null;S.ptab='queue';toast(`Registered · Flag: ${a.flag}`);
 }else{providers.push({role:r,svc:v0.k,name,org:(val('rg-org')||'—')+' · '+(val('rg-dist')||''),dist:val('rg-dist')||'—',api:'Pending verification',sync:null});S.modal=null;loginAs('admin');S.tab='providers';toast('Registration sent to Admin for verification')}
}
// Each HTML page sets window.START_VIEW (and START_MOD for a module dashboard) to open on that page.
(function(){const v=window.START_VIEW;if(!v)return;if(v.indexOf('role:')===0){loginAs(v.slice(5))}else{S.view=v;if(window.START_MOD)S.mod=window.START_MOD}})();
window.HIE=window.HIE||{};window.HIE.S=S;window.HIE.render=render;window.HIE.loginAs=loginAs;
render();storeInit();
