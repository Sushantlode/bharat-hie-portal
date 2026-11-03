// ================= Health Card generator (citizen) =================
// images are attached after render so place-name localisation never touches data URLs
let HCIMG=[];const hcImg=u=>'i'+(HCIMG.push(u)-1);
function hcFill(root){(root||document).querySelectorAll('img[data-hc]').forEach(im=>{const u=HCIMG[+im.getAttribute('data-hc').slice(1)];if(u&&im.getAttribute('src')!==u)im.setAttribute('src',u)})}
const HC_LOGO=()=>{const im=document.querySelector('.brand-logo');return im?im.getAttribute('src'):''};
const hcKey=cid=>'setu-hc-'+cid;
function hcGet(cid){S.hc=S.hc||{};if(S.hc[cid]===undefined){try{const v=localStorage.getItem(hcKey(cid));S.hc[cid]=v?JSON.parse(v):null}catch(e){S.hc[cid]=null}}return S.hc[cid]}
function hcSave(cid,d){S.hc=S.hc||{};S.hc[cid]=d;try{localStorage.setItem(hcKey(cid),JSON.stringify(d))}catch(e){}}
function hcNumber(d){const src=(d.name||'')+'|'+(d.dob||'')+'|'+(d.mobile||'')+'|'+(d.phr||'');let h1=2166136261,h2=5381;for(const ch of src){h1=Math.imul(h1^ch.charCodeAt(0),16777619);h2=(Math.imul(h2,33)+ch.charCodeAt(0))|0}const D9='012456789';let a=h1>>>0,b=h2>>>0,n='';for(let k=0;k<6;k++){n+=D9[a%9];a=Math.floor(a/9)}for(let k=0;k<6;k++){n+=D9[b%9];b=Math.floor(b/9)}return'0091'+n}
const hcNumFmt=n=>n.replace(/(\d{4})(?=\d)/g,'$1 ');
const hcDob=v=>{if(!v)return'';const[y,m,d]=v.split('-');return`${d}-${m}-${y}`};
const hcMob=v=>{const d=String(v||'').replace(/\D/g,'');return d.length>=4?'XXXXXX'+d.slice(-4):''};
const hcValid=()=>{const d=new Date();return pad(d.getMonth()+1,2)+'/'+String(d.getFullYear()).slice(-2)};
function hcQR(d){
 if(!window.qrcode)return'';
 try{const q=qrcode(0,'M');q.addData(`HEALTH CARD ${hcNumFmt(d.no)}\n${d.name}\nPHR: ${d.phr}\nDOB: ${hcDob(d.dob)}${d.blood?'\nBlood group: '+d.blood:''}${d.donor?'\nOrgan donor: Yes':''}`);q.make();return q.createDataURL(4,0)}catch(e){return''}
}
function hcDraftFrom(c){
 const prev=hcGet(c.id);if(prev)return Object.assign({},prev);
 const y=2026-c.age,m=pad(1+((c.age*7)%12),2),dd=pad(1+((c.age*13)%28),2);
 const user=c.name.toLowerCase().split(' ')[0].replace(/[^a-z]/g,'');
 return{name:c.name,phr:user+(c.age)+'@abdm',dob:`${y}-${m}-${dd}`,gender:c.sex==='F'?'Female':c.sex==='M'?'Male':'Other',mobile:c.mobile||'',blood:'',donor:false,photo:'',valid:hcValid()};
}
const HC_GLOBE=`<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="hcg" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#9fd3ff"></stop><stop offset=".45" stop-color="#3b8fe0"></stop><stop offset="1" stop-color="#0b3f8f"></stop></radialGradient><clipPath id="hcgc"><circle cx="100" cy="100" r="96"></circle></clipPath></defs><circle cx="100" cy="100" r="96" fill="url(#hcg)"></circle><g clip-path="url(#hcgc)" fill="#eaf5ff" stroke="#1c5fb0" stroke-width="1.2"><path d="M30 52c10-12 26-18 40-14 8 2 6 10 14 12 9 2 12 10 6 16-8 8-20 2-28 10-6 6-2 16-10 18-10 2-14-8-20-14-6-6-10-16-2-28z"></path><path d="M70 92c8-4 18 0 22 8 4 8 0 14 6 22 5 8 2 20-6 26-8 6-12 18-20 16-8-2-6-14-10-22-4-8-12-12-10-22 2-10 10-24 18-28z"></path><path d="M112 40c12-8 30-6 44 2 12 7 22 16 20 28-2 10-14 8-20 16-6 8 2 18-6 24-8 6-18-4-26 0-8 4-6 16-14 16-8 0-10-12-8-20 2-8-6-14-4-22 2-10 4-36 14-44z"></path><path d="M134 128c10-4 20 2 22 12 2 10-6 20-16 22-10 2-16-8-16-16 0-8 2-14 10-18z"></path><path d="M150 150c6 0 10 4 9 9s-7 7-11 5-4-14 2-14z"></path></g><circle cx="100" cy="100" r="96" fill="none" stroke="#0b3f8f" stroke-width="2"></circle><ellipse cx="70" cy="55" rx="34" ry="18" fill="#fff" opacity=".18" transform="rotate(-30 70 55)"></ellipse></svg>`;
const HC_IC={note:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 8h8M8 11h8M8 14h6"/><path d="M14 17l5-5 2 2-5 5h-2z"/>',card:'<rect x="2" y="5" width="20" height="14" rx="1.5"/><rect x="4.5" y="8" width="6" height="4" rx=".5"/><path d="M4.5 15h4M10 15h4M15.5 15h4M13 9h7M13 11.5h5"/><circle cx="19" cy="17" r="2.6" fill="#fff"/><path d="M19 15.8v2.4M17.8 17h2.4"/>',list:'<rect x="4" y="3" width="15" height="18" rx="1"/><path d="M7 3V2h9v1"/><path d="M7 8h2M11 8h5M7 12h2M11 12h5M7 16h2"/><rect x="13" y="15" width="6" height="6" fill="#fff"/><path d="M14 18l1.5 1.5 3-3"/>'};
const HCA={globe:"assets/images/health-card/globe-7c86c1e3.jpg",front:"assets/images/health-card/front-63f28de2.jpg",back:"assets/images/health-card/back-16b0d66b.jpg",ribbon:"assets/images/health-card/ribbon-edf06406.png",dig:{"0": "assets/images/health-card/img-a6727dce.png", "9": "assets/images/health-card/img-60bad99e.png", "1": "assets/images/health-card/img-a699aac1.png", "8": "assets/images/health-card/img-ad714e77.png", "7": "assets/images/health-card/img-41167e5d.png", "4": "assets/images/health-card/img-f70afc10.png", "2": "assets/images/health-card/img-0caabf8d.png", "5": "assets/images/health-card/img-7c9fc106.png", "6": "assets/images/health-card/img-1f7f101d.png"}};
const PT=100/242.7817,cq=v=>(v*PT).toFixed(3)+'cqw';
const HC_DIG={x0:12.384,top:118.944,w:7.200,h:9.648,pitch:7.104,group:35.328};
function hcDigits(no){return String(no).split('').map((c,i)=>{const g=Math.floor(i/4),j=i%4;const u=HCA.dig[c];return u?`<img class="hf-dig" data-hc="${hcImg(u)}" alt="" style="left:${cq(HC_DIG.x0+g*HC_DIG.group+j*HC_DIG.pitch)};top:${cq(HC_DIG.top)};width:${cq(HC_DIG.w)};height:${cq(HC_DIG.h)}">`:''}).join('')}
function hcFront(d){
 const no=d.no||hcNumber(d),qr=hcQR(Object.assign({},d,{no})),logo=HC_LOGO();
 const L=(cls,x,top,txt,extra)=>`<div class="${cls}" style="left:${cq(x)};top:${cq(top)}${extra||''}">${txt}</div>`;
 return`<div class="hc hc-front" role="img" aria-label="Health Card front for ${esc(d.name||'')}">
  <img class="hf-bg" data-hc="${hcImg(HCA.front)}" alt="">
  <img class="hf-globe" data-hc="${hcImg(HCA.globe)}" alt="" style="left:${cq(146)};top:${cq(28.6)};width:${cq(121.4)};height:${cq(121.4)}">
  <div class="hf-logo" style="left:${cq(12.64)};top:${cq(4.66)};width:${cq(26.9)};height:${cq(18.17)}">${logo?`<img data-hc="${hcImg(logo)}" alt="">`:''}</div>
  <div class="hf-org hf-hi" style="left:${cq(43.3)};width:${cq(83.5)};top:${cq(2.6)}">भारत HIE पोर्टल</div>
  <div class="hf-org hf-en" style="left:${cq(43.3)};width:${cq(83.5)};top:${cq(16.1)}">Bharat HIE Portal</div>
  <div class="hf-photo" style="left:${cq(12.28)};top:${cq(30.73)};width:${cq(44.7)};height:${cq(57.47)}">${d.photo?`<img data-hc="${hcImg(d.photo)}" alt="">`:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4"/><path d="M4 22c1-5 4.5-7 8-7s7 2 8 7"/></svg>`}</div>
  ${L('hf-t',65.6,31.17,'PHR Address : '+esc(d.phr||''))}
  ${L('hf-t',65.6,39.02,'Date of Birth : '+hcDob(d.dob))}
  ${L('hf-t',65.6,46.86,'Gender : '+esc(d.gender||''))}
  ${L('hf-t',65.6,54.71,'Mobile : '+hcMob(d.mobile))}
  ${d.blood?L('hf-t',65.6,62.56,'Blood Group : '+esc(d.blood)):''}
  ${L('hf-name',12.69,93.06,esc(d.name||'Your name'))}
  ${L('hf-valid',13.18,105.09,'VALID FROM: '+esc(d.valid||hcValid()))}
  ${qr?`<img class="hf-qr" data-hc="${hcImg(qr)}" alt="" style="left:${cq(97)};top:${cq(71)};width:${cq(35)};height:${cq(35)}">`:''}
  <div class="hf-scan" style="left:${cq(94.5)};width:${cq(40)};top:${cq(107.4)}">Scan for Details</div>
  ${hcDigits(no)}
 </div>`;
}
function hcBack(d){
 return`<div class="hc hc-back" role="img" aria-label="Health Card back">
  <img class="hf-bg" data-hc="${hcImg(HCA.back)}" alt="">
  ${d.donor?`<img class="hf-ribbon" data-hc="${hcImg(HCA.ribbon)}" alt="" style="left:${cq(198.624)};top:${cq(71.224)};width:${cq(38.852)};height:${cq(45.552)}">`:''}
 </div>`;
}
function hcSection(c){
 const d=hcGet(c.id);
 if(!d)return`<div class="panel hc-cta"><div class="row" style="gap:14px;flex-wrap:nowrap;align-items:center">${ico('card')}<div style="min-width:0"><h3>Health Card</h3><p class="muted small">Generate your Health Card with your photo, PHR address and a 16-digit card number. Doctors can open your record with the card number or QR code.</p></div></div><button class="btn pri" data-a="hc-open">Generate Health Card</button></div>`;
 return`<section class="panel sec"><div class="row" style="justify-content:space-between"><h3>My Health Card</h3><div class="row"><button class="btn sm" data-a="hc-open">Edit details</button><button class="btn sm pri" data-a="hc-dl">Download card</button></div></div>
  <div class="hc-pair"><div class="hcw">${hcFront(d)}</div><div class="hcw">${hcBack(d)}</div></div></section>`;
}
function hcFormPage(){
 const D=S.hcDraft;
 return`<section class="sec hc-page"><div class="row"><button class="btn sm" data-a="hc-back">← Back to dashboard</button></div>
 <div><span class="eyebrow">Health Card · Step 1 of 2</span><h1>Enter your details</h1><p class="muted">Fill in the details below and generate your Health Card.</p></div>
 <form class="panel sec hc-form" onsubmit="return false">
  <div class="hc-up"><div class="hc-upph">${D.photo?`<img data-hc="${hcImg(D.photo)}" alt="Your photo">`:ico('user')}</div><div class="sec" style="gap:6px"><label class="btn sm" for="hc-photo">${D.photo?'Change photo':'Upload photo'}</label><input type="file" id="hc-photo" accept="image/*" hidden><span class="small muted">Passport-size photo (35 × 45 mm). The full photo is shown on the card.</span></div></div>
  <label class="fld">Full name<input class="inp" id="hc-name" value="${esc(D.name)}" autocomplete="name" required></label>
  <label class="fld">PHR address<input class="inp" id="hc-phr" value="${esc(D.phr)}" placeholder="name@abdm"></label>
  <div class="grid2"><label class="fld">Date of birth<input class="inp" type="date" id="hc-dob" value="${esc(D.dob)}"></label><label class="fld">Gender<select class="inp" id="hc-gender">${['Female','Male','Other'].map(g=>`<option ${D.gender===g?'selected':''}>${g}</option>`).join('')}</select></label></div>
  <div class="grid2"><label class="fld">Mobile number<input class="inp" id="hc-mobile" inputmode="numeric" value="${esc(D.mobile)}" autocomplete="tel"></label><label class="fld">Blood group (optional)<select class="inp" id="hc-blood"><option value="">Not shown</option>${['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g=>`<option ${D.blood===g?'selected':''}>${g}</option>`).join('')}</select></label></div>
  <label class="hc-chk"><input type="checkbox" id="hc-donor" ${D.donor?'checked':''}> I am a registered organ donor</label>
  <p class="small muted">Only the last 4 digits of your mobile number are printed on the card.</p>
  <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-a="hc-back">Cancel</button><button type="button" class="btn pri" data-a="hc-gen">Generate Health Card</button></div>
 </form></section>`;
}
function hcDonePage(){
 const d=hcGet(S.user.cid);if(!d){S.hcView=null;return citizenView()}
 return`<section class="sec hc-page wide"><div class="row"><button class="btn sm" data-a="hc-back">← Back to dashboard</button></div>
 <div><span class="eyebrow">Health Card · Step 2 of 2</span><h1>Your Health Card is ready</h1><p class="muted">Card number ${hcNumFmt(d.no)}. Show this card or its number at any hospital, clinic, lab or pharmacy.</p></div>
 <div class="hc-pair"><div class="hcw">${hcFront(d)}</div><div class="hcw">${hcBack(d)}</div></div>
 <div class="row"><button class="btn pri" data-a="hc-dl">Download card</button><button class="btn" data-a="hc-open">Edit details</button></div></section>`;
}
function hcRead(){const D=S.hcDraft,v=id=>{const e=document.getElementById(id);return e?e.value:''};D.name=v('hc-name').trim();D.phr=v('hc-phr').trim();D.dob=v('hc-dob');D.gender=v('hc-gender');D.mobile=v('hc-mobile').trim();D.blood=v('hc-blood');const dn=document.getElementById('hc-donor');D.donor=!!(dn&&dn.checked);D.no=null}
function hcPhoto(file){
 const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const W=420,H=540,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');const s=Math.min(W/im.width,H/im.height),w=im.width*s,h=im.height*s;g.fillStyle='#fff';g.fillRect(0,0,W,H);g.drawImage(im,(W-w)/2,(H-h)/2,w,h);S.hcDraft.photo=cv.toDataURL('image/jpeg',.85);render()};im.onerror=()=>toast('That image could not be read. Try a JPG or PNG.');im.src=rd.result};rd.readAsDataURL(file);
}
function hcGenerate(){
 hcRead();const D=S.hcDraft,miss=[];
 if(!D.name)miss.push('name');if(!D.dob)miss.push('date of birth');if(String(D.mobile).replace(/\D/g,'').length<10)miss.push('10-digit mobile number');if(!D.phr)miss.push('PHR address');
 if(miss.length){toast('Please add your '+miss.join(', '));return}
 D.no=hcNumber(D);D.valid=D.valid||hcValid();D.at=Date.now();
 hcSave(S.user.cid,Object.assign({},D));S.hcView='done';window.scrollTo(0,0);render();
}
async function hcDownload(){
 const d=hcGet(S.user.cid);if(!d)return;
 if(!window.html2canvas){toast('Card download is not available right now.');return}
 let dl=null;try{dl=await claude.use('downloads')}catch(e){}
 if(!dl){toast('Download is not available here.');return}
 try{
  const host=document.createElement('div');host.className='hc-export';host.innerHTML=`<div class="hcw">${hcFront(d)}</div><div class="hcw">${hcBack(d)}</div>`;document.body.appendChild(host);hcFill(host);
  await new Promise(r=>setTimeout(r,120));
  const cv=await html2canvas(host,{scale:2.5,backgroundColor:'#ffffff',useCORS:true,logging:false});host.remove();
  const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
  await dl.save({filename:'Health_Card_'+(d.name||'card').replace(/\W+/g,'_')+'.png',data:blob});toast('Health Card saved');
 }catch(e){document.querySelectorAll('.hc-export').forEach(x=>x.remove());if(e&&e.code==='declined')return;toast(e&&e.code==='rate_limited'?'A save is already open. Try again in a moment.':'Could not save the card here.')}
}
