// ================= Find healthcare professionals near me =================
const FIND_TYPES=[

 ['Doctor specialists',[['sp0','General physician','general physician'],['sp1','Family medicine doctor','family doctor'],['sp2','Cardiologist (heart)','cardiologist'],['sp3','Cardiothoracic surgeon','cardiothoracic surgeon'],['sp4','Neurologist (brain & nerves)','neurologist'],['sp5','Neurosurgeon','neurosurgeon'],['sp6','Nephrologist (kidney)','nephrologist'],['sp7','Urologist','urologist'],['sp8','Gastroenterologist (stomach)','gastroenterologist'],['sp9','Hepatologist (liver)','hepatologist'],['sp10','Pulmonologist (lungs)','pulmonologist'],['sp11','Endocrinologist (hormones, thyroid)','endocrinologist'],['sp12','Diabetologist (diabetes)','diabetologist'],['sp13','Rheumatologist (joints)','rheumatologist'],['sp14','Oncologist (cancer)','oncologist'],['sp15','Haematologist (blood)','haematologist'],['sp16','Dermatologist (skin & hair)','dermatologist'],['sp17','Venereologist','venereologist'],['sp18','Trichologist (hair)','trichologist'],['sp19','Psychiatrist','psychiatrist'],['sp20','Psychologist / counsellor','psychologist'],['sp21','Paediatrician (child specialist)','paediatrician'],['sp22','Neonatologist (newborn)','neonatologist'],['sp23','Paediatric surgeon','paediatric surgeon'],['sp24','Gynaecologist & obstetrician','gynaecologist'],['sp25','Infertility / IVF specialist','IVF centre'],['sp26','Orthopaedic surgeon (bones)','orthopaedic doctor'],['sp27','Spine surgeon','spine surgeon'],['sp28','Sports medicine specialist','sports medicine doctor'],['sp29','General surgeon','general surgeon'],['sp30','Laparoscopic surgeon','laparoscopic surgeon'],['sp31','Bariatric surgeon (weight loss)','bariatric surgeon'],['sp32','Plastic & cosmetic surgeon','plastic surgeon'],['sp33','Vascular surgeon','vascular surgeon'],['sp34','ENT specialist (ear, nose, throat)','ENT specialist'],['sp35','Ophthalmologist (eye)','eye specialist ophthalmologist'],['sp36','Dentist','dentist'],['sp37','Orthodontist','orthodontist'],['sp38','Oral & maxillofacial surgeon','oral maxillofacial surgeon'],['sp39','Anaesthesiologist','anaesthesiologist'],['sp40','Pain management specialist','pain management clinic'],['sp41','Physiatrist (rehabilitation)','physical medicine rehabilitation doctor'],['sp42','Geriatrician (elderly)','geriatrician'],['sp43','Infectious disease specialist','infectious disease specialist'],['sp44','Allergist & immunologist','allergist'],['sp45','Critical care / intensivist','ICU critical care hospital'],['sp46','Emergency medicine','emergency hospital'],['sp47','Radiologist','radiologist'],['sp48','Pathologist','pathologist'],['sp49','Andrologist (men\'s health)','andrologist'],['sp50','Sexologist','sexologist'],['sp51','Audiologist & speech therapist','audiologist speech therapist'],['sp52','Occupational therapist','occupational therapist'],['sp53','Podiatrist (foot)','podiatrist'],['sp54','Ayurveda doctor','ayurvedic doctor'],['sp55','Homoeopathy doctor','homeopathy doctor'],['sp56','Unani doctor','unani doctor'],['sp57','Siddha doctor','siddha doctor'],['sp58','Naturopathy & yoga doctor','naturopathy centre']]],
 ['Hospitals & centres',[['phc','Primary Health Centre (PHC)','primary health centre'],['govhosp','Government hospital','government hospital'],['pvthosp','Private hospital / nursing home','hospital'],['clinic','Clinic / family doctor (GP)','clinic general physician'],['doctors','Multi-speciality hospital','multi speciality hospital'],['specialty','Cancer hospital','cancer hospital'],['pmndp','Dialysis centre','dialysis centre'],['npcbvi','Eye hospital','eye hospital'],['mental','Mental health hospital','mental health hospital'],['matru','Maternity hospital','maternity hospital'],['nphce','Elderly care home','old age care home'],['ayush','Ayurveda / AYUSH hospital','ayurvedic hospital']]],
 ['Tests & medicines',[['lab','Pathology lab / blood test','pathology lab'],['radio','X-ray, CT, MRI, ultrasound','diagnostic imaging centre MRI CT scan'],['pharmacy','Pharmacy / chemist','pharmacy'],['meddir','Jan Aushadhi Kendra','Jan Aushadhi Kendra'],['blood','Blood bank','blood bank']]],
 ['Care & therapy',[['physio','Physiotherapy centre','physiotherapy'],['homecare','Home nursing / palliative care','home nursing service'],['yogactr','Yoga centre','yoga centre'],['nutri','Dietitian / nutritionist','dietitian'],['ntep','TB / chest clinic','TB chest clinic']]],
 ['Emergency',[['amb','Ambulance service','ambulance service'],['trauma','Emergency / trauma centre','emergency trauma hospital']]],
 ['Animal health',[['mvu','Veterinary hospital','veterinary hospital'],['pet','Pet clinic','pet clinic']]]
];
const findAll=()=>FIND_TYPES.flatMap(g=>g[1]);
function findPage(){
 const f=S.find||{type:'sp0',loc:''};
 const ty=findAll().find(x=>x[0]===f.type)||findAll()[0];
 const q=!f.loc?'':f.loc==='me'?`${ty[2]} near me`:`${ty[2]} near ${f.loc}${P.india&&!/india|^-?\d/i.test(f.loc)?', India':''}`;
 const g='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
 const o='https://www.openstreetmap.org/search?query='+encodeURIComponent(q);
 const local=f.done&&P.def?((PROV[ty[0]]||[]).filter(r=>f.loc&&r[1].toLowerCase().includes(f.loc.toLowerCase().split(/[ ,]+/)[0]))):[];
 return`<section class="sec fd">
 <div class="fd-hero"><span class="eyebrow">${t('Find healthcare near me')}</span><h1>${t('Find healthcare professionals near you')}</h1>
  <p class="muted">${t('Choose what you need, enter an area, city or PIN code anywhere in India, and see the nearest options on the map.')}</p></div>
 <div class="fd-form" id="fd-form">
  <label class="fld"><span><b>1</b> ${t('Which healthcare professional do you need?')}</span>
   <select class="inp" id="fd-type">${FIND_TYPES.map(gr=>`<optgroup label="${gr[0]}">${gr[1].map(x=>`<option value="${x[0]}" ${x[0]===ty[0]?'selected':''}>${x[1]}</option>`).join('')}</optgroup>`).join('')}</select></label>
  <label class="fld"><span><b>2</b> ${t('Which area do you need it in?')}</span>
   <input class="inp" id="fd-loc" list="fd-places" placeholder="${t('Area, city or PIN code, e.g. Wagholi Pune or 411014')}" value="${esc(f.loc||'')}" autocomplete="off">
   <datalist id="fd-places">${FIND_PLACES.map(x=>`<option value="${x}">`).join('')}</datalist></label>
  <div class="row"><button class="btn pri" data-a="fd-go">${t('Show on map')} →</button><button class="btn" data-a="fd-me">📍 ${t('Use my location')}</button></div>
  ${f.err?`<p class="small" style="color:var(--red)">${esc(f.err)}</p>`:''}
 </div>
 ${f.done&&f.loc?`<div class="fd-res"><div><span class="eyebrow">${t('Results')}</span><h2>${esc(ty[1])} · ${esc(f.loc==='me'?t('Near my location'):f.loc)}</h2>
   <p class="small muted">${t('The map opens in a new tab and lists the nearest places with directions, timings and phone numbers.')}</p></div>
   <div class="row"><a class="btn pri" href="${g}" target="_blank" rel="noopener" id="fd-open">${t('Open in Google Maps')} ↗</a><a class="btn" href="${o}" target="_blank" rel="noopener">OpenStreetMap ↗</a></div>
   ${local.length?`<div class="tbl-wrap pv-t"><table><thead><tr><th>${t('Verified on this portal')}</th><th>Address</th></tr></thead><tbody>${local.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div>`:''}
  </div>`:''}
 <div class="fd-quick"><span class="small muted">${t('Emergency')}:</span><a class="btn sm" href="tel:108">🚑 108</a><a class="btn sm" href="tel:104">☎ 104</a><a class="btn sm" href="tel:14416">Tele-MANAS 14416</a><a class="btn sm" href="tel:1962">🐄 1962</a></div>
 </section>`;
}
const FIND_PLACES=['Mumbai','Pune','Nagpur','Nashik','Thane','Aurangabad (Chh. Sambhajinagar)','Kolhapur','Solapur','Delhi','New Delhi','Bengaluru','Chennai','Hyderabad','Kolkata','Ahmedabad','Jaipur','Lucknow','Patna','Bhopal','Indore','Chandigarh','Bhubaneswar','Guwahati','Thiruvananthapuram','Kochi','Visakhapatnam','Surat','Varanasi','Ranchi','Raipur','Dehradun','Shimla','Srinagar','Jammu','Goa (Panaji)','Imphal','Shillong','Agartala','Aizawl','Kohima','Itanagar','Gangtok','Port Blair','Puducherry','Wagholi, Pune','Andheri, Mumbai','Hinjewadi, Pune','Dharavi, Mumbai'];
function findGo(){
 const ty=document.getElementById('fd-type').value,loc=(document.getElementById('fd-loc').value||'').trim();
 if(!loc){S.find={type:ty,loc:'',err:t('Please enter an area, city or PIN code.')};render();return}
 S.find={type:ty,loc,done:true};render();
 const a=document.getElementById('fd-open');if(a){try{window.open(a.href,'_blank','noopener')}catch(e){}}
}
function findMe(){
 const ty=document.getElementById('fd-type').value;
 const done=loc=>{S.find={type:ty,loc,done:true};render();const a=document.getElementById('fd-open');if(a){try{window.open(a.href,'_blank','noopener')}catch(e){}}};
 if(!navigator.geolocation){done('me');return}
 navigator.geolocation.getCurrentPosition(p=>done(p.coords.latitude.toFixed(5)+','+p.coords.longitude.toFixed(5)),()=>done('me'),{timeout:8000});
}
