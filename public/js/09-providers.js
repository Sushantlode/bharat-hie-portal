// ================= Verified public providers & official figures (Maharashtra, 2025–26) =================
const DHS=['Directorate of Health Services, Maharashtra','Arogya Bhavan, St. George\'s Hospital Compound, P. D\'Mello Road, Mumbai 400001'];
const NHMMH=['National Health Mission, Maharashtra (State Health Society)','Arogya Bhavan, St. George\'s Hospital Compound, P. D\'Mello Road, Mumbai 400001'];
const KEM=['KEM Hospital & Seth GS Medical College','Acharya Donde Marg, Parel, Mumbai 400012'];
const TMH=['Tata Memorial Hospital','Dr. E. Borges Road, Parel, Mumbai 400012'];
const NIV=['ICMR-National Institute of Virology','20-A, Dr. Ambedkar Road, Pune 411001'];
const NHA=['National Health Authority (ABDM)','Tower-l, Jeevan Bharati Building, Connaught Place, New Delhi 110001'];
const CAH=['Commissionerate of Animal Husbandry, Maharashtra','Aundh, Pune 411067'];
const PROV={
 phc:[DHS,NHMMH],
 asha:[NHMMH,DHS],
 phr:[NHA],
 bpo:[['104 Health Helpline, Public Health Department',DHS[1]],['Tele-MANAS mental health helpline 14416 (MoHFW)','National toll-free line, available across Maharashtra']],
 consult:[['eSanjeevani, Ministry of Health & Family Welfare','Nirman Bhawan, Maulana Azad Road, New Delhi 110011']],
 lab:[NIV,['Haffkine Institute for Training, Research & Testing','Acharya Donde Marg, Parel, Mumbai 400012']],
 radio:[TMH,KEM],
 govhosp:[['Sassoon General Hospital (B.J. Government Medical College)','Jai Prakash Narayan Road, near Pune Railway Station, Pune 411001'],KEM,['Sir J.J. Group of Hospitals (Grant Government Medical College)','J.J. Marg, Byculla, Mumbai 400008'],['Lokmanya Tilak Municipal General Hospital (Sion Hospital)','Dr. Babasaheb Ambedkar Road, Sion (West), Mumbai 400022'],['Government Medical College & Hospital, Nagpur','Medical Square, Nagpur 440003']],
 pvthosp:[['Kokilaben Dhirubhai Ambani Hospital','Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri (West), Mumbai 400053'],['P. D. Hinduja Hospital','Veer Savarkar Marg, Mahim, Mumbai 400016'],['Ruby Hall Clinic','40, Sassoon Road, Pune 411001'],['Jehangir Hospital','32, Sassoon Road, Pune 411001'],['Deenanath Mangeshkar Hospital','Erandwane, Pune 411004']],
 specialty:[TMH,['ACTREC, Tata Memorial Centre','Sector 22, Kharghar, Navi Mumbai 410210'],['AIIMS Nagpur','MIHAN, Nagpur 441108']],
 dental:[['Government Dental College & Hospital, Mumbai','P. D\'Mello Road, Fort, Mumbai 400001'],['Nair Hospital Dental College','Dr. A. L. Nair Road, Mumbai Central, Mumbai 400008'],['Government Dental College & Hospital, Nagpur','Medical Square, Nagpur 440003']],
 mental:[['Regional Mental Hospital, Yerawada','Yerawada, Pune 411006'],['Regional Mental Hospital, Thane','Thane (East), Thane'],['Regional Mental Hospital, Nagpur','Nagpur']],
 ayush:[['National Institute of Naturopathy (Ministry of AYUSH)','Bapu Bhavan, Tadiwala Road, Pune 411001'],['Seth Tarachand Ramnath Charitable Ayurvedic Hospital','Rasta Peth, Pune 411011'],['R. A. Podar Medical College (Ayurved)','Dr. Annie Besant Road, Worli, Mumbai 400018']],
 physio:[['All India Institute of Physical Medicine & Rehabilitation','Haji Ali Park, K. Khadye Marg, Mahalaxmi, Mumbai 400034']],
 homecare:[['Cipla Palliative Care & Training Centre','Warje, Pune 411058'],['Shanti Avedna Sadan','Bandra (West), Mumbai 400050']],
 blood:[['State Blood Transfusion Council, Maharashtra','Mumbai'],['KEM Hospital Blood Centre',KEM[1]]],
 scheme:[['State Health Assurance Society (MJPJAY)','ESIS Hospital Compound, Ganpatrao Kadam Marg, Worli, Mumbai 400013'],NHA],
 program:[DHS,NHMMH], hr:[DHS], cc:[DHS],
 training:[['Maharashtra University of Health Sciences','Dindori Road, Mhasrul, Nashik 422004'],['Armed Forces Medical College','Solapur Road, Wanowrie, Pune 411040'],['Grant Government Medical College','J.J. Marg, Byculla, Mumbai 400008']],
 supply:[['Haffkine Bio-Pharmaceutical Corporation Ltd.','Acharya Donde Marg, Parel, Mumbai 400012'],['Maharashtra Medical Goods Procurement Authority','Mumbai']],
 research:[NIV,['National Centre for Cell Science','S.P. Pune University Campus, Ganeshkhind, Pune 411007'],['ICMR-National Institute for Research in Reproductive & Child Health','Jehangir Merwanji Street, Parel, Mumbai 400012']],
 census:[['Directorate of Census Operations, Maharashtra','Mumbai']],
 crvs:[DHS], hfr:[NHA], hpr:[NHA], abha:[NHA], mpi:[NHA], shr:[NHA], engine:[NHA],
 term:[['National Resource Centre for EHR Standards (C-DAC)','C-DAC Innovation Park, Panchavati, Pashan, Pune 411008']],
 gis:[['Maharashtra Remote Sensing Applications Centre','VNIT Campus, South Ambazari Road, Nagpur 440010']],
 env:[['Maharashtra Pollution Control Board','Kalpataru Point, Sion Circle, Sion (East), Mumbai 400022']],
 amb:[['Maharashtra Emergency Medical Services (MEMS 108)','Operated by Sumeet SSG BVG Maharashtra EMS, Pune']],
 surv:[['State Surveillance Unit, IDSP (Directorate of Health Services)','Pune']],
 ngo:[['SEARCH (Society for Education, Action and Research in Community Health)','Shodhgram, Chatgaon, Dhanora Road, Gadchiroli 442605'],['Comprehensive Rural Health Project','Jamkhed, Ahilyanagar 413201']],
 yogactr:[['Kaivalyadhama Yoga Institute','Swami Kuvalayananda Marg, Lonavala 410403'],['Ramamani Iyengar Memorial Yoga Institute','1107 B/1, Hare Krishna Mandir Road, Model Colony, Shivajinagar, Pune 411016'],['The Yoga Institute','Shri Yogendra Marg, Prabhat Colony, Santacruz (East), Mumbai 400055']],
 spiritual:[['Vipassana International Academy, Dhamma Giri','Igatpuri, Nashik 422403']],
 stemcell:[['Reliance Life Sciences','Dhirubhai Ambani Life Sciences Centre, Rabale, Navi Mumbai 400701']],
 nacp:[['Maharashtra State AIDS Control Society','Acworth Complex, R. A. Kidwai Marg, Wadala (West), Mumbai 400031']],
 organ:[['Zonal Transplant Coordination Centre / ROTTO, Mumbai',KEM[1]]],
 meddir:[['Pharmaceuticals & Medical Devices Bureau of India (Jan Aushadhi)','National programme, Kendras across Maharashtra']],
 meddel:[['Pharmaceuticals & Medical Devices Bureau of India (Jan Aushadhi)','National programme, Kendras across Maharashtra']],
 pharmacy:[['Food & Drug Administration, Maharashtra (pharmacy licensing)','Bandra Kurla Complex, Bandra (East), Mumbai 400051']],
 mvu:[CAH,['Animal helpline 1962','Toll-free, statewide']],
 animsurv:[CAH,['Western Regional Disease Diagnostic Laboratory','Aundh, Pune 411067']],
 gokul:[CAH], nlm:[CAH], ahidf:[CAH], lcss:[CAH],
 npdd:[['Mahanand Dairy (Maharashtra Rajya Sahakari Dudh Mahasangh)','Goregaon (East), Mumbai'],CAH],
 sdcfpo:[['Mahanand Dairy (Maharashtra Rajya Sahakari Dudh Mahasangh)','Goregaon (East), Mumbai']],
 slaughter:[['Deonar Abattoir (Brihanmumbai Municipal Corporation)','Deonar, Govandi, Mumbai 400043']],
 zoonotic:[CAH,['Bombay Veterinary College (MAFSU)','Parel, Mumbai 400012']],
 pashu:[CAH]
};
const GRP_PROV={G:[DHS,NHMMH],I:[CAH,['Bombay Veterinary College (MAFSU)','Parel, Mumbai 400012'],['Nagpur Veterinary College (MAFSU)','Seminary Hills, Nagpur 440006']]};
const DIRS={
 phc:['Health Facility Registry search (ABDM)','https://facility.abdm.gov.in/'],asha:['NHM Maharashtra','https://nrhm.maharashtra.gov.in/'],
 phr:['ABHA (ABDM)','https://abha.abdm.gov.in/'],abha:['ABHA (ABDM)','https://abha.abdm.gov.in/'],hfr:['Health Facility Registry','https://facility.abdm.gov.in/'],hpr:['Healthcare Professionals Registry','https://hpr.abdm.gov.in/'],
 consult:['eSanjeevani','https://esanjeevani.mohfw.gov.in/'],clinic:['National Medical Commission register','https://www.nmc.org.in/'],doctors:['National Medical Commission register','https://www.nmc.org.in/'],
 pharmacy:['Jan Aushadhi Kendra locator','https://janaushadhi.gov.in/'],meddir:['Jan Aushadhi','https://janaushadhi.gov.in/'],meddel:['Jan Aushadhi','https://janaushadhi.gov.in/'],
 lab:['NABL accredited labs','https://nabl-india.org/'],blood:['e-RaktKosh blood centre search','https://eraktkosh.mohfw.gov.in/'],
 scheme:['MJPJAY / PM-JAY hospitals','https://www.jeevandayee.gov.in/'],billing:['MJPJAY / PM-JAY hospitals','https://www.jeevandayee.gov.in/'],govhosp:['MJPJAY / PM-JAY hospitals','https://www.jeevandayee.gov.in/'],pvthosp:['MJPJAY / PM-JAY hospitals','https://www.jeevandayee.gov.in/'],
 immun:['U-WIN','https://uwin.mohfw.gov.in/'],crvs:['Civil Registration System','https://crsorgi.gov.in/'],census:['Census of India','https://censusindia.gov.in/'],
 dash:['HMIS','https://hmis.mohfw.gov.in/'],analytics:['HMIS','https://hmis.mohfw.gov.in/'],surv:['IHIP','https://ihip.mohfw.gov.in/'],
 ntep:['Ni-kshay','https://www.nikshay.in/'],nvbdcp:['NCVBDC','https://ncvbdc.mohfw.gov.in/'],
 jobs:['Mahaswayam employment portal','https://rojgar.mahaswayam.gov.in/'],lms:['DIKSHA','https://diksha.gov.in/'],
 mvu:['Department of Animal Husbandry & Dairying','https://dahd.gov.in/']
};
const GRP_DIR={G:['NHM Maharashtra','https://nrhm.maharashtra.gov.in/'],I:['Department of Animal Husbandry & Dairying','https://dahd.gov.in/']};
// [value, what it counts, source, date, url]
const FIGS={
 blood:['410','blood centres in Maharashtra, all listed for 2025–26 inspection','Free Press Journal','13 May 2026','https://www.freepressjournal.in/mumbai/maharashtra-orders-fresh-inspection-of-410-blood-banks-across-state-with-expanded-safety-checks'],
 amb:['1,756','MEMS 108 ambulances in the new fleet','Indian Pharma Post','9 Apr 2026','https://www.indianpharmapost.com/healthcare/maharashtra-mems-108-gets-1756-new-ambulances-as-sumeet-ssg-partners-pinnacle-19632'],
 training:['80 · 11,844','medical colleges · MBBS seats (NEET UG 2025)','Medical Dialogues','29 Jul 2025','https://medicaldialogues.in/news/education/medical-admissions/maharashtra-mbbs-seat-matrix-2025-80-medical-colleges-11844-seats-for-neet-counselling-152615'],
 abha:['585.9 lakh','ABHA accounts in Maharashtra','Free Press Journal','19 Mar 2025','https://www.freepressjournal.in/india/over-76-crore-indians-now-have-abha-id-under-ayushman-bharat-digital-mission-up-rajasthan-lead'],
 phr:['585.9 lakh','ABHA accounts in Maharashtra','Free Press Journal','19 Mar 2025','https://www.freepressjournal.in/india/over-76-crore-indians-now-have-abha-id-under-ayushman-bharat-digital-mission-up-rajasthan-lead'],
 scheme:['2,031','hospitals empanelled under MJPJAY and PM-JAY (1,359 private, 672 government)','Medical Dialogues','12 Aug 2025','https://medicaldialogues.in/amp/news/health/hospital-diagnostics/pune-adds-104-private-hospitals-to-govt-health-schemes-153305'],
 govhosp:['672','government hospitals empanelled under MJPJAY and PM-JAY','Medical Dialogues','12 Aug 2025','https://medicaldialogues.in/amp/news/health/hospital-diagnostics/pune-adds-104-private-hospitals-to-govt-health-schemes-153305'],
 pvthosp:['1,359','private hospitals empanelled under MJPJAY and PM-JAY','Medical Dialogues','12 Aug 2025','https://medicaldialogues.in/amp/news/health/hospital-diagnostics/pune-adds-104-private-hospitals-to-govt-health-schemes-153305']
};
function provSection(s){
 const mh=!!P.def;
 const list=(PROV[s.k]||GRP_PROV[s.grp]||[]),dir=DIRS[s.k]||GRP_DIR[s.grp],fig=FIGS[s.k];
 const figH=fig&&mh?`<div class="pv-fig"><b>${fig[0]}</b><span>${fig[1]}<small>Source: <a href="${fig[4]}" target="_blank" rel="noopener">${fig[2]}</a>, ${fig[3]}</small></span></div>`:'';
 const dirH=dir&&P.india?`<p class="small">Full official directory: <a href="${dir[1]}" target="_blank" rel="noopener">${dir[0]} ↗</a></p>`:'';
 if(!mh){return`<div class="panel sec"><h3>Service providers</h3><p class="small muted">A verified provider list for ${esc(P.st||P.co.n)} has not been added yet. Only public, verified institutions are listed here, so nothing is filled in until it can be checked.</p>${dirH}</div>`}
 const body=list.length?`<div class="tbl-wrap pv-t"><table><thead><tr><th>Provider</th><th>Address</th></tr></thead><tbody>${list.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div>`
  :(s.grp==='H'?`<p class="small muted">This is a Bharat HIE platform module. Partner onboarding is open; no external provider is listed yet.</p>`:`<p class="small muted">Individual providers are too many to list here. Use the official directory below.</p>`);
 return`<div class="panel sec"><h3>Service providers · Maharashtra</h3>${figH}${body}${dirH}<p class="small muted">Public institutions with their published addresses. Login IDs and passwords are not published.</p></div>`;
}

function svcModal(){
 const s=SV.find(x=>x.k===S.svc);if(!s)return'';
 const steps=['planned','sandbox','pilot','live'],si=steps.indexOf(s.st);
 const chg=s.prev?Math.round((s.rec-s.prev)/s.prev*100):0;
 const roleName=s.role==='admin'?'Admin':ROLES.find(r=>r.k===s.role).n;
 return`<div class="scrim" data-a="close"></div><div class="modal" role="dialog" aria-label="${esc(s.name)}" style="width:min(680px,calc(100% - 24px))">
 <div class="row" style="justify-content:space-between;align-items:start;flex-wrap:nowrap"><div class="row" style="flex-wrap:nowrap">${sico(s)}<div><h2>${svName(s)}</h2><p class="muted small">${s.desc}</p></div></div><button class="x" data-a="close" aria-label="Close">×</button></div>
 <div class="row"><span class="pill">${t(GROUPS[s.grp])}</span></div>
 <div class="kpis">${kpi(s.count,s.unit,'b')}${kpi(s.rec?nf(s.rec):'—','Records this month','',s.prev?`${chg>=0?'+':''}${chg}% vs last month`:'')}${kpi(s.uptime,'API uptime')}${kpi(s.sync?fmt(s.sync).split(', ')[1]:'—','Last sync today')}</div>
 ${s.rec?`<div class="panel sec"><h3>Records exchanged per month</h3>${barChart(s.months)}</div>
 <div class="panel sec"><h3>Top districts this month</h3>${s.top.map(t=>`<div class="row" style="flex-wrap:nowrap"><span style="width:150px;flex:none" class="small">${t.d}</span><div class="sbar" style="flex:1"><i class="g" style="width:${t.v/s.top[0].v*100}%;background:var(--core)"></i></div><span class="mono" style="width:70px;text-align:right">${nf(t.v)}</span></div>`).join('')}</div>`
 :`<div class="note">No live traffic yet. ${s.count} ${s.unit} have registered interest; integration is scheduled for ${s.golive}.</div>`}
 ${provSection(s)}
 <div class="row">${TOOLS[s.k]?`<button class="btn pri" data-a="mod" data-s="${s.k}">📊 Open dashboard</button>`:''}<button class="btn ${TOOLS[s.k]?'':'pri'}" data-a="as" data-r="${s.role}">${t("Open as")} ${t(roleName)}</button><button class="btn" data-a="close">${t("Close")}</button></div></div>`;
}
function servicesView(){
 const c=st=>SV.filter(s=>s.st===st).length;
 const tot=SV.reduce((a,s)=>a+s.rec,0);
 return`<div class="kpis">${kpi(SV.length,'Services connected','g')}${kpi(nf(tot),'Records this month (all services)')}</div>
 <div class="filters">${[['all','All']].concat(Object.entries(GROUPS)).map(([g,n])=>`<button class="chip" data-a="sg" data-g="${g}" aria-pressed="${S.sg===g}">${g==='all'?n:g+' · '+n}</button>`).join('')}</div>
 <div class="tbl-wrap"><table><thead><tr><th>Service</th><th class="num">Providers / units</th><th class="num">Records this month</th><th class="num">Change</th><th class="num">Uptime</th><th>Last sync</th><th></th></tr></thead><tbody>
 ${SV.filter(s=>S.sg==='all'||s.grp===S.sg).map(s=>{const ch=s.prev?Math.round((s.rec-s.prev)/s.prev*100):null;return`<tr><td><div class="row" style="flex-wrap:nowrap">${sico(s)}<div><b>${svName(s)}</b><div class="muted" style="font-size:12px">${t(GROUPS[s.grp])}</div></div></div></td><td class="num">${s.count} <span class="muted small">${s.unit}</span></td><td class="num">${s.rec?nf(s.rec):'—'}</td><td class="num" style="color:${ch==null?'var(--muted)':ch>=0?'var(--grn)':'var(--red)'}">${ch==null?'—':(ch>=0?'+':'')+ch+'%'}</td><td class="num">${s.uptime}</td><td class="mono">${fmt(s.sync)}</td><td><button class="btn sm" data-a="svc" data-s="${s.k}">Details</button></td></tr>`}).join('')}
 </tbody></table></div>`;
}
