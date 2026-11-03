// ================= reference data =================
const ROLES=[
 {k:'citizen',n:'Citizen',d:'Health card, PHR, prescriptions',i:'user'},
 {k:'doctor',n:'Doctor',d:'Consultations, e-Prescriptions',i:'doctor'},
 {k:'pharmacist',n:'Pharmacist',d:'Dispense against e-Prescription',i:'pharmacy'},
 {k:'pathologist',n:'Pathologist',d:'Test orders, report upload',i:'lab'},
 {k:'bloodbank',n:'Blood Bank',d:'Stock, requests, donor camps',i:'blood'},
 {k:'ngo',n:'NGO',d:'Field outreach and home visits',i:'ngo'}
];
// 45 services mapped to the WHO Classification of Digital Interventions, Services and Applications in Health (2nd ed., 2023)
const GROUPS={A:'Point of service',B:'Health system administration',C:'Registries & directories',D:'Data management',E:'Surveillance & response',F:'Wellness & allied services',G:'Government health programmes',H:'Bharat HIE Global Platform: body, mind & spirit',I:'Animal health programmes'};
const STATUS={live:['Live','ok'],pilot:['Pilot','info'],sandbox:['API sandbox','warn'],planned:['Planned','']};
const SV=[
 ['phc','PHC / CHC','Ayushman Arogya Mandir network','A5','A','live','doctor','phc','1,912','centres'],
 ['asha','ASHA / ANM workers','Village-level screening and follow-up','A2','A','pilot','ngo','asha','3,450','workers'],
 ['phr','Citizen PHR app','Personal health record for every citizen','A7','A','live','citizen','phr','12.4 lakh','users'],
 ['bpo','BPO call centre / 104','Outbound calls to flagged citizens','A1','A','live','admin','phone','42','agents'],
 ['consult','e-Consultation / Telemedicine','Video and phone consultation','A9','A','live','doctor','consult','412','tele-doctors'],
 ['clinic','Clinics & GPs','Private and charitable clinics','A5','A','live','doctor','clinic','640','clinics'],
 ['doctors','Doctors & specialists','Consultation, diagnosis and e-Prescription','A3','A','live','doctor','doctor','1,180','doctors'],
 ['pharmacy','Pharmacies','Dispensing against e-Prescriptions','A8','A','live','pharmacist','pharmacy','642','pharmacies'],
 ['lab','Pathology labs','Test orders and digital reports','A6','A','live','pathologist','lab','318','labs'],
 ['radio','Radiology & imaging','MRI, CT, X-ray and ultrasound','A4','A','live','doctor','radio','92','centres'],
 ['govhosp','Government hospitals','District, sub-district and medical college hospitals','A5','A','live','doctor','hmis','214','hospitals'],
 ['pvthosp','Private hospitals & nursing homes','Multi-speciality hospitals and nursing homes','A5','A','pilot','doctor','building','86','hospitals'],
 ['specialty','Specialty centres','Dialysis, cancer and TB centres','A5','A','sandbox','doctor','heart','41','centres'],
 ['dental','Dental clinics','Oral health and dental records','A5','A','planned','doctor','tooth','37','registered interest'],
 ['mental','Mental health services','Counselling and tele-mental health','A9','A','pilot','doctor','mind','24','counsellors'],
 ['ayush','AYUSH hospitals & practitioners','Ayurveda, Yoga, Unani, Siddha, Homoeopathy','A5','A','sandbox','doctor','leaf','58','facilities'],
 ['physio','Physiotherapy & rehabilitation','Rehab after stroke, injury and surgery','A5','A','planned','doctor','physio','27','centres'],
 ['homecare','Home, palliative & elderly care','Care at home for bed-ridden and elderly','A2','A','planned','ngo','home','19','agencies'],
 ['device','Remote monitoring devices','BP, glucose and SpO₂ devices at home','A7','A','pilot','citizen','watch','2,800','devices'],
 ['scheme','Insurance & govt schemes','PM-JAY, MJPJAY eligibility and claims','B2','B','live','citizen','scheme','3','schemes'],
 ['blood','Blood banks','Live blood stock and requests','B1','B','live','bloodbank','blood','46','blood banks'],
 ['billing','Admission & billing desk','Registration, admission and billing','B7','B','live','doctor','receipt','214','hospitals'],
 ['supply','Drug supply & warehouses','Stock, indents and expiry (LMIS)','B6','B','pilot','pharmacist','box','34','warehouses'],
 ['program','Health programme monitoring','TB, NCD, maternal and child health','B3','B','sandbox','admin','clip','9','programmes'],
 ['hr','Health workforce (HR)','Postings, attendance and training records','B4','B','planned','admin','users','58,000','staff'],
 ['training','Training & medical colleges','e-Learning and skill courses','B5','B','planned','admin','cap','24','colleges'],
 ['research','Research institutes','Anonymised data for approved studies','B8','B','planned','admin','micro','6','institutes'],
 ['abha','ABHA / eHS identity','One health ID per citizen','C6','C','live','citizen','card','12.4 lakh','IDs'],
 ['immun','Immunization records','Vaccination sessions and certificates','C7','C','pilot','ngo','syringe','1,280','sessions / month'],
 ['crvs','Birth & death registration','Civil registration and vital statistics','C2','C','sandbox','admin','cert','358','registration units'],
 ['mpi','Master patient index','One citizen, one record across providers','C8','C','live','admin','link','12.4 lakh','records'],
 ['hfr','Health facility registry (HFR)','Verified list of every facility','C4','C','pilot','admin','pin','3,104','facilities'],
 ['hpr','Health professional registry (HPR)','Verified doctors, nurses, pharmacists','C5','C','pilot','admin','badge','21,600','professionals'],
 ['term','Medical terminology','SNOMED CT, LOINC and ICD-10 coding','C11','C','live','admin','book','3','code systems'],
 ['census','Census & population data','Household and family-level population','C1','C','planned','admin','people','36','districts'],
 ['shr','Shared health record','Longitudinal record for each citizen','D8','D','live','admin','db','38 lakh','documents'],
 ['engine','HIE interoperability engine','FHIR / HL7 exchange between systems','D2','D','live','admin','swap','1,486','connections'],
 ['analytics','AI / ML analytics & KPO','Risk scores, flags and clinical review','D1','D','live','admin','chart','14','models'],
 ['dash','Government dashboards (HMIS)','State to Gram Panchayat reporting','D6','D','live','admin','grid','412','officer logins'],
 ['gis','GIS health mapping','Village and ward-level health maps','D5','D','sandbox','admin','map','36','districts'],
 ['env','Environmental health','Water and air quality alerts','D4','D','planned','admin','env','18','sensors'],
 ['amb','Ambulance (108)','Emergency transport and tracking','E1','E','live','admin','amb','937','ambulances'],
 ['cc','Command Centre','Real-time control of high-risk cases','E1','E','live','admin','cc','24×7','operations'],
 ['surv','Disease surveillance (IDSP / IHIP)','Outbreak detection and alerts','E2','E','pilot','admin','alert','7','active alerts'],
 ['ngo','NGOs','Field outreach and home visits','A2','E','live','ngo','ngo','38','NGOs'],
 ['yogactr','Yoga centres','Registered yoga and wellness centres','Ext','F','pilot','ngo','yoga','420','centres'],
 ['nutra','Nutraceutical suppliers','Supplements and medical nutrition supply','Ext','F','sandbox','pharmacist','nutra','64','suppliers'],
 ['spiritual','Spiritual healing centres','Meditation and spiritual wellbeing centres','Ext','F','planned','ngo','lotus','31','centres'],
 ['stemcell','Stem cell labs','Cord blood banking and stem cell processing','Ext','F','pilot','pathologist','stem','9','labs'],
 ['npncd', 'Non-Communicable Diseases (NP-NCD)', 'Cancer, diabetes, hypertension, heart disease and stroke', 'NHP', 'G', 'live', 'doctor', 'activity', '38.6 lakh', 'people screened'],
 ['ntep', 'TB Elimination (NTEP)', 'Tuberculosis screening, treatment and Nikshay follow-up', 'NHP', 'G', 'live', 'doctor', 'lungs', '1,84,000', 'patients linked'],
 ['nvbdcp', 'Vector Borne Disease Control (NVBDCP)', 'Malaria, dengue, chikungunya and other vector-borne diseases', 'NHP', 'G', 'live', 'admin', 'mosq', '3,120', 'sentinel sites'],
 ['polio', 'Pulse Polio', 'Polio eradication drives and booth-level coverage', 'NHP', 'G', 'live', 'ngo', 'dropper', '1.12 crore', 'children covered'],
 ['nipi', 'Anaemia & Nutrition (National Iron Plus)', 'Iron-folic acid supplementation and anaemia testing', 'NHP', 'G', 'live', 'ngo', 'droplets', '9.4 lakh', 'beneficiaries'],
 ['nphce', 'Health Care of the Elderly (NPHCE)', 'Geriatric clinics and home-based care for older persons', 'NHP', 'G', 'pilot', 'doctor', 'elder', '1,06,000', 'older persons'],
 ['nmhp', 'Mental Health (NMHP)', 'District mental health programme and Tele-MANAS', 'NHP', 'G', 'pilot', 'doctor', 'msgheart', '61,000', 'beneficiaries'],
 ['pmndp', 'National Dialysis Programme (PMNDP)', 'Free dialysis at district hospitals', 'NHP', 'G', 'live', 'doctor', 'kidney', '4,860', 'patients on dialysis'],
 ['npcbvi', 'Blindness & Visual Impairment (NPCBVI)', 'Eye screening, cataract surgery and spectacles', 'NHP', 'G', 'pilot', 'doctor', 'eye', '2,14,000', 'people screened'],
 ['nohp', 'Oral Health (NOHP)', 'Dental screening and oral health services', 'NHP', 'G', 'sandbox', 'doctor', 'smile', '72,300', 'people screened'],
 ['nppcd', 'Deafness Prevention & Control (NPPCD)', 'Hearing screening, hearing aids and newborn screening', 'NHP', 'G', 'sandbox', 'doctor', 'ear', '27,400', 'people screened'],
 ['nacp', 'HIV / AIDS Control (NACP)', 'Testing, ART linkage and confidential follow-up', 'NHP', 'G', 'pilot', 'doctor', 'ribbon', '42,600', 'beneficiaries'],
 ['nvhcp', 'Viral Hepatitis Control (NVHCP)', 'Hepatitis B and C testing and treatment', 'NHP', 'G', 'pilot', 'doctor', 'liver', '33,800', 'people tested'],
 ['nrcp', 'Rabies Control (NRCP)', 'Anti-rabies vaccine and bite case management', 'NHP', 'G', 'sandbox', 'admin', 'dog', '14,200', 'bite cases'],
 ['snake', 'Snakebite Prevention & Control', 'Anti-snake venom stock and snakebite case management', 'NHP', 'G', 'sandbox', 'admin', 'snake', '6,700', 'bite cases'],
 ['ntcp', 'Tobacco Control (NTCP)', 'Tobacco cessation centres and quit-line support', 'NHP', 'G', 'pilot', 'doctor', 'smoke', '18,500', 'quit attempts'],
 ['nlep', 'Leprosy Eradication (NLEP)', 'Case detection, MDT treatment and disability care', 'NHP', 'G', 'sandbox', 'doctor', 'hand', '8,900', 'patients linked'],
 ['nppcf', 'Fluorosis Prevention & Control (NPPCF)', 'Fluoride screening in water and affected villages', 'NHP', 'G', 'planned', 'admin', 'glass', '46', 'endemic blocks'],
 ['niddcp', 'Iodine Deficiency Disorders (NIDDCP)', 'Salt iodisation monitoring and goitre surveys', 'NHP', 'G', 'planned', 'admin', 'salt', '1,240', 'salt samples'],
 ['amr', 'AMR Containment', 'Antimicrobial resistance surveillance and stewardship', 'NHP', 'G', 'planned', 'pathologist', 'bacteria', '34', 'labs'],
 ['doorcheck', 'Health Check-up at Doorstep', 'Home health check-ups, up to 50% discount', 'SGP', 'H', 'live', 'citizen', 'stetho', '12,600', 'check-ups / month'],
 ['meddel', 'Medicine Delivery at Doorstep', 'Medicines delivered home, up to 50% discount', 'SGP', 'H', 'live', 'pharmacist', 'truck', '48,200', 'deliveries / month'],
 ['meddir', 'Medicine Directory', 'Know your drug content, generics and prices', 'SGP', 'H', 'live', 'citizen', 'searchpill', '18,400', 'medicines'],
 ['dignurse', 'Digital Nurse 24/7', 'A digital nurse available round the clock', 'SGP', 'H', 'live', 'citizen', 'headset', '24×7', 'support'],
 ['matru', 'Matrujyoti: Mother & Child Tracking', 'Pregnancy, delivery and child growth tracking', 'SGP', 'H', 'live', 'ngo', 'baby', '86,300', 'mothers tracked'],
 ['nutri', 'AI Nutrition Calculator', 'Personal diet plans from your health record', 'SGP', 'H', 'live', 'citizen', 'apple', '64,000', 'users'],
 ['organ', 'Organ Donor Program & Post-Transplant Support', 'Donor pledges, matching and care after transplant', 'SGP', 'H', 'live', 'citizen', 'handheart', '21,700', 'pledges'],
 ['genetic', 'Genetic Mapping & Immune Testing', 'Genetic and immunity tests with Ayurveda, homoeopathy and nano-tech medicine', 'SGP', 'H', 'live', 'pathologist', 'dna', '3,400', 'tests'],
 ['hcoin', 'Health Coin & Health Loan', 'Health rewards and low-cost health loans for APL families', 'SGP', 'H', 'live', 'citizen', 'coin', '9,800', 'loans'],
 ['crowd', 'Health Crowdfunding (NGO)', 'Raise funds for treatment through verified NGOs', 'SGP', 'H', 'live', 'ngo', 'handcoins', '1,240', 'campaigns'],
 ['secure', 'Security & Compliance (Blockchain)', 'HIPAA and GDPR-grade data protection with blockchain audit', 'SGP', 'H', 'live', 'admin', 'lock', '100%', 'records audited'],
 ['videos', 'Health & Wealth Expert Videos', 'Videos from doctors and finance experts', 'SGP', 'H', 'live', 'citizen', 'video', '2,600', 'videos'],
 ['sexed', 'Sex Education Awareness', 'Age-appropriate reproductive and sexual health awareness', 'SGP', 'H', 'live', 'ngo', 'info', '340', 'sessions'],
 ['pet', 'My Pet: Care & Awareness', 'Pet health, vaccination reminders and vets', 'SGP', 'H', 'live', 'citizen', 'paw', '11,300', 'pets'],
 ['ecom', 'eCommerce Platform', '1,50,000 household products at doorstep, up to 60% discount', 'SGP', 'H', 'live', 'citizen', 'cart', '1,50,000', 'products'],
 ['fmcg', 'FMCG Grocery Offers', 'Grocery offers and discounts', 'SGP', 'H', 'live', 'citizen', 'bag', '8,200', 'offers'],
 ['jobs', 'AI-based Jobs', 'Domestic and international jobs for citizens', 'SGP', 'H', 'live', 'citizen', 'brief', '14,500', 'openings'],
 ['ewealth', 'eWealth: Financial Literacy', 'Training and financial literacy for youth', 'SGP', 'H', 'live', 'citizen', 'piggy', '38,000', 'learners'],
 ['lms', 'Education: Learning Management System', 'Online courses and learning for all ages', 'SGP', 'H', 'live', 'citizen', 'laptop', '1,180', 'courses'],
 ['agri', 'Agriculture Awareness & Solutions', 'Farming guidance, soil and crop advisory', 'SGP', 'H', 'live', 'citizen', 'sprout', '27,000', 'farmers'],
 ['schoolbus', 'School Bus Security & Tracking', 'Live bus tracking and child safety alerts', 'SGP', 'H', 'live', 'citizen', 'bus', '640', 'buses'],
 ['aarti', 'Ashrams & Temples: Live Aarti', 'Live aarti and spiritual programmes', 'SGP', 'H', 'live', 'citizen', 'temple', '210', 'temples'],
 ['ott', 'OTT Entertainment Platform', 'Health-friendly shows, films and music', 'SGP', 'H', 'live', 'citizen', 'tv', '4,900', 'titles'],
 ['matri', 'Matrimony (Free)', 'Free matrimony services with health profile option', 'SGP', 'H', 'live', 'citizen', 'rings', '52,000', 'profiles'],
 ['mvu', 'Mobile Veterinary Units (1962)', 'Veterinary services at farmers’ doorstep', 'AH', 'I', 'live', 'citizen', 'van', '80', 'mobile units'],
 ['pashu', 'Pashu Aushadhi', 'Affordable generic veterinary medicines', 'AH', 'I', 'live', 'citizen', 'pillbottle', '420', 'outlets'],
 ['lsd', 'Lumpy Skin Disease', 'Prevention and control through LHDCP / ASCAD and state measures', 'AH', 'I', 'live', 'admin', 'patches', '1.3 crore', 'animals vaccinated'],
 ['fmd', 'Foot and Mouth Disease (NADCP)', 'FMD vaccination of cattle and buffaloes under NADCP / LHDCP', 'AH', 'I', 'live', 'admin', 'cow', '2.1 crore', 'animals vaccinated'],
 ['zoonotic', 'Rabies & Zoonotic Diseases (One Health)', 'Animal-side rabies and zoonotic disease control with One Health', 'AH', 'I', 'live', 'admin', 'globe', '8,900', 'dog bite reports'],
 ['brucella', 'Bovine Brucellosis (NADCP)', 'Brucellosis vaccination of female calves', 'AH', 'I', 'live', 'admin', 'vial', '18.4 lakh', 'calves vaccinated'],
 ['ppr', 'PPR in Sheep & Goats (CADCP)', 'Peste des Petits Ruminants control under CADCP', 'AH', 'I', 'live', 'admin', 'sheep', '36 lakh', 'animals vaccinated'],
 ['poultry', 'Poultry Diseases', 'Vaccination, surveillance and control under LHDCP / ASCAD', 'AH', 'I', 'live', 'admin', 'bird', '4.6 crore', 'birds covered'],
 ['csf', 'Classical Swine Fever (CADCP)', 'CSF vaccination and control in pigs', 'AH', 'I', 'live', 'admin', 'pig', '2.4 lakh', 'pigs vaccinated'],
 ['ascad', 'Other Animal Diseases (ASCAD)', 'Economically important, zoonotic, exotic and emerging animal diseases', 'AH', 'I', 'live', 'admin', 'virus', '36', 'districts'],
 ['animsurv', 'Animal Disease Surveillance', 'Outbreak detection and response under LHDCP', 'AH', 'I', 'live', 'admin', 'radar', '1,240', 'surveillance points'],
 ['npdd', 'Dairy Development (NPDD)', 'Dairy development and milk quality infrastructure', 'AH', 'I', 'live', 'admin', 'milk', '3,400', 'village dairy societies'],
 ['sdcfpo', 'Dairy Cooperatives & FPOs (SDCFPO)', 'Support to dairy cooperatives and farmer producer organisations', 'AH', 'I', 'live', 'citizen', 'handshake', '620', 'cooperatives'],
 ['gokul', 'Rashtriya Gokul Mission', 'Indigenous bovine breed conservation and genetic improvement', 'AH', 'I', 'live', 'admin', 'medal', '6.8 lakh', 'inseminations'],
 ['nlm', 'National Livestock Mission', 'Livestock entrepreneurship, small-ruminant and poultry development', 'AH', 'I', 'live', 'citizen', 'store', '1,860', 'entrepreneurs'],
 ['ahidf', 'Animal Husbandry Infrastructure Fund (AHIDF)', 'Dairy and animal husbandry infrastructure financing', 'AH', 'I', 'live', 'admin', 'landmark', '148', 'projects'],
 ['lcss', 'Livestock Census & Sample Survey', 'Livestock population statistics (LC & ISS)', 'AH', 'I', 'live', 'admin', 'sheet', '3.3 crore', 'livestock counted'],
 ['slaughter', 'Slaughter Houses', 'Licensed slaughter houses: ante- and post-mortem inspection, hygiene and meat safety', 'AH', 'I', 'live', 'admin', 'inspect', '310', 'licensed units']
].map(s=>({k:s[0],name:s[1],desc:s[2],code:s[3],grp:s[4],st:s[5],role:s[6],icon:s[7],count:s[8],unit:s[9]}));
function initSV(){SV.forEach(s=>s.st='live');const h=s=>{let x=2166136261;for(const ch of s)x=Math.imul(x^ch.charCodeAt(0),16777619);return(x>>>0)/4294967296};
 const MON=['Jun','Jul','Aug','Sep','Oct','Nov'];
 SV.forEach(s=>{const r=h(s.k),r2=h(s.k+'x');
  const base=s.st==='live'?Math.round(6000+r*84000):s.st==='pilot'?Math.round(400+r*3600):s.st==='sandbox'?Math.round(40+r*360):0;
  const start=s.st==='live'?0:s.st==='pilot'?2:s.st==='sandbox'?4:6;
  s.months=MON.map((m,i)=>({m,v:i<start?0:Math.round(base*(0.55+0.45*(i-start+1)/(6-start))*(0.92+0.16*h(s.k+i)))}));
  if(!P.def){s.months.forEach(x=>x.v=Math.round(x.v*P.scale));const num=parseFloat(s.count.replace(/,/g,''))*(/lakh/.test(s.count)?1e5:1);if(s.unit==='districts')s.count=String(P.areas.length);else if(num>=20&&!['schemes','models','code systems','programmes','active alerts','operations','sessions / month'].includes(s.unit))s.count=fmtBig(Math.max(1,num*P.scale))}
  s.rec=s.months[5].v;s.prev=s.months[4].v;
  s.uptime=s.st==='live'?(99.2+r2*0.75).toFixed(2)+'%':s.st==='pilot'?(97.5+r2*1.8).toFixed(1)+'%':'—';
  s.sync=s.st==='live'?ago(r2*0.4):s.st==='pilot'?ago(1+r2*6):null;
  s.golive=s.st==='live'?'Live':s.st==='pilot'?'Dec 2026':s.st==='sandbox'?(r2<.5?'Jan 2027':'Feb 2027'):(r2<.5?'Apr 2027':'Jun 2027');
  const d=[...DISTRICTS].sort((a,b)=>h(s.k+a)-h(s.k+b)).slice(0,4);s.top=d.map((x,i)=>({d:x,v:Math.round(s.rec*[.28,.19,.13,.09][i])}));
 });}
const SERVICES=SV;
const STAGES=[
 ['new','Flagged','System flags the citizen from vitals'],
 ['bpo','BPO call','Call centre confirms symptoms'],
 ['kpo','KPO review','Clinical team reviews the record'],
 ['cc','Command Centre','Assigns doctor, ambulance, NGO'],
 ['consult','Consultation','Doctor consults and prescribes'],
 ['rx','Pharmacy / Lab','Medicines dispensed, tests done'],
 ['follow','Follow-up','New vitals, flag recalculated']
];
const SLA={red:'Call within 1 hour',yellow:'Call within 48 hours',green:'Monthly reminder'};
const MEDS=['Amlodipine 5 mg','Telmisartan 40 mg','Metformin 500 mg','Glimepiride 1 mg','Atorvastatin 10 mg','Paracetamol 500 mg','ORS sachets','Iron + Folic acid','Salbutamol inhaler','Pantoprazole 40 mg'];
const TESTS=['HbA1c','Fasting blood sugar','Lipid profile','CBC','Kidney function','ECG','Chest X-ray','Thyroid profile'];
const DISTRICTS=['Pune','Mumbai','Thane','Nashik','Nagpur','Chh. Sambhajinagar','Solapur','Kolhapur','Satara','Amravati','Latur','Nanded','Jalgaon','Ratnagiri'];
if(!P.def)DISTRICTS.splice(0,DISTRICTS.length,...P.areas);
initSV();
if(P.def){[['govhosp','672','hospitals (MJPJAY / PM-JAY)'],['pvthosp','1,359','hospitals (MJPJAY / PM-JAY)'],['blood','410','blood centres'],['amb','1,756','ambulances'],['training','80','medical colleges'],['abha','585.9 lakh','ABHA accounts'],['scheme','2,031','empanelled hospitals']].forEach(([k,c,u])=>{const s=SV.find(x=>x.k===k);if(s){s.count=c;s.unit=u}})}
const FAC={Pune:['District Hospital, Aundh','PHC Wagholi','Sahyadri Clinic, Kothrud'],Mumbai:['Municipal Hospital, Kurla','UPHC Dharavi','Shree Clinic, Andheri'],Thane:['Civil Hospital, Thane','PHC Shahapur','Om Clinic, Kalyan'],Nashik:['Civil Hospital, Nashik','PHC Igatpuri','Godavari Clinic'],Nagpur:['GMC Hospital, Nagpur','PHC Kamptee','Sai Clinic, Sitabuldi']};
const facOf=d=>P.def?(FAC[d]||[`District Hospital, ${d}`,`PHC ${d} Rural`,`Arogya Clinic, ${d}`]):P.facs(d);
const FIRST_F=['Sunita','Meena','Lata','Kavita','Pooja','Rekha','Ayesha','Savita','Anita','Shobha','Priya','Neha','Vaishali','Sangeeta','Rupali','Fatima','Jyoti','Asha','Manisha','Swati','Nirmala','Shabana','Komal','Ujwala'];
const FIRST_M=['Ramesh','Vijay','Ganesh','Imran','Suresh','Anil','Mahesh','Sachin','Rajesh','Prakash','Sunil','Dattatray','Santosh','Ajay','Nitin','Rahul','Salim','Balasaheb','Vikas','Pandurang','Sandeep','Kishor','Yusuf','Dnyaneshwar'];
const LAST=['Patil','Jadhav','Shaikh','Pawar','Kulkarni','Shinde','Bhosale','Khan','More','Gaikwad','Deshmukh','Chavan','Waghmare','Salunkhe','Kadam','Mane','Joshi','Deshpande','Sawant','Thakur','Kamble','Wagh','Ingle','Sonawane','Nikam','Ghodke'];
const DOCS=[
 {name:'Dr. Anjali Rao',spec:'General Medicine',org:'District Hospital, Aundh, Pune'},
 {name:'Dr. Sameer Joshi',spec:'Family Physician',org:'PHC Wagholi, Pune'},
 {name:'Dr. Neha Kale',spec:'Tele-medicine',org:'Bharat HIE e-Consultation Desk'},
 {name:'Dr. Arvind Bhagat',spec:'Cardiology',org:'Civil Hospital, Nashik'},
 {name:'Dr. Farah Siddiqui',spec:'Endocrinology',org:'GMC Hospital, Nagpur'},
 {name:'Dr. Mohan Gite',spec:'Pulmonology',org:'Civil Hospital, Thane'}
];
const NGOS=['Arogya Sathi Foundation','Gram Swasthya Mitra Trust','Jeevan Asha Seva Sanstha'];
if(!P.def){FIRST_F.splice(0,FIRST_F.length,...P.pool.f);FIRST_M.splice(0,FIRST_M.length,...P.pool.m);LAST.splice(0,LAST.length,...P.pool.l);DOCS.splice(0,DOCS.length,...P.docs);NGOS.splice(0,NGOS.length,...P.ngos)}

// ================= flag rules =================
function assess(v){
 const r=[],y=[];
 if(v.sbp>=180||v.dbp>=120)r.push(`BP crisis (${v.sbp}/${v.dbp})`);else if(v.sbp<90)r.push(`Low BP (${v.sbp}/${v.dbp})`);else if(v.sbp>=140||v.dbp>=90)y.push(`High BP (${v.sbp}/${v.dbp})`);
 if(v.sugar>=300)r.push(`Very high sugar (${v.sugar})`);else if(v.sugar<70)r.push(`Low sugar (${v.sugar})`);else if(v.sugar>=200)y.push(`High sugar (${v.sugar})`);
 if(v.spo2<90)r.push(`SpO₂ ${v.spo2}%`);else if(v.spo2<95)y.push(`SpO₂ ${v.spo2}%`);
 if(v.pulse>130||v.pulse<45)r.push(`Pulse ${v.pulse}`);else if(v.pulse>100||v.pulse<55)y.push(`Pulse ${v.pulse}`);
 if(v.bmi>=30)y.push(`BMI ${v.bmi}`);else if(v.bmi<16)y.push(`BMI ${v.bmi} (low)`);
 if(r.length)return{flag:'red',reasons:r.concat(y)};
 if(y.length)return{flag:'yellow',reasons:y};
 return{flag:'green',reasons:['All vitals in normal range']};
}
const one=(k,x)=>assess(Object.assign({sbp:120,dbp:80,sugar:100,spo2:98,pulse:75,bmi:23},k==='bp'?x:{[k]:x})).flag;
const cls=f=>f==='red'?'bad':f==='yellow'?'warn':'';

// ================= generate citizens =================
const citizens=[],pharmacyQ=[],labQ=[],bloodReq=[],ngoTasks=[],appts=[];
const STG_POOL=['new','bpo','bpo','kpo','cc','consult','consult','consult','rx','rx','follow','follow'];
function genVitals(kind){
 const v={sbp:ri(108,132),dbp:ri(70,84),sugar:ri(86,134),spo2:ri(96,99),pulse:ri(64,88),bmi:+(19+rnd()*7.5).toFixed(1)};
 if(kind==='yellow'){const n=ri(1,2);for(let i=0;i<n;i++){const k=pick(['bp','bp','sugar','spo2','pulse','bmi']);
  if(k==='bp'){v.sbp=ri(142,172);v.dbp=ri(88,108)}if(k==='sugar')v.sugar=ri(205,285);if(k==='spo2')v.spo2=ri(91,94);if(k==='pulse')v.pulse=ri(102,124);if(k==='bmi')v.bmi=+(30+rnd()*5).toFixed(1)}}
 if(kind==='red'){const k=pick(['bp','bp','sugar','spo2','lowsugar','pulse']);
  if(k==='bp'){v.sbp=ri(182,204);v.dbp=ri(112,126)}if(k==='sugar')v.sugar=ri(305,410);if(k==='lowsugar')v.sugar=ri(52,66);if(k==='spo2'){v.spo2=ri(84,89);v.pulse=ri(104,122)}if(k==='pulse')v.pulse=ri(132,146);
  if(rnd()<.5){v.bmi=+(30+rnd()*4).toFixed(1)}}
 return v;
}
function mkCitizen(i,name,sex,age,district,kind,stage){
 const v=genVitals(kind),a=assess(v);
 const fac=pick(facOf(district)),src=fac.startsWith('PHC')||fac.startsWith('UPHC')||fac.includes('Primary')?'PHC':fac.includes('Clinic')?'Clinic':'Hospital';
 const card=!P.def&&!P.india?{type:P.pr.id,no:`${P.cc}-${pad((3817+i*613)%10000,4)}-${pad((5402+i*389)%10000,4)}-${pad((1290+i*257)%10000,4)}`}:(!P.def&&P.india)?{type:'ABHA',no:`91-${pad((3817+i*613)%10000,4)}-${pad((5402+i*389)%10000,4)}-${pad((1290+i*257)%10000,4)}`}:i%4===3?{type:'eHS card',no:'eHS-MH-'+pad(402130+i*977,7)}:{type:'ABHA',no:`91-${pad((3817+i*613)%10000,4)}-${pad((5402+i*389)%10000,4)}-${pad((1290+i*257)%10000,4)}`};
 const st=a.flag==='green'?'monitor':(stage||pick(STG_POOL));
 const hist=[];for(let k=4;k>=1;k--){hist.push({d:ago(24*30*k+ri(0,120)),sbp:Math.max(100,v.sbp-ri(0,18)+ri(0,8)),dbp:Math.max(64,v.dbp-ri(0,10)+ri(0,4)),sugar:Math.max(78,v.sugar-ri(0,60)+ri(0,20)),spo2:Math.min(99,v.spo2+ri(0,2)),src:pick(['PHC screening','ASHA home visit','Hospital OPD','Self device'])})}
 hist.push({d:ago(ri(20,70)),sbp:v.sbp,dbp:v.dbp,sugar:v.sugar,spo2:v.spo2,src:fac});
 return{id:'c'+i,name,sex,age,district,card,mobile:'9'+pad((822015471+i*7311977)%1000000000,9),fac,source:src,v,flag:a.flag,reasons:a.reasons,stage:st,loop:rnd()<.15&&a.flag!=='green'?2:1,
  scheme:pick(['MJPJAY','PM-JAY','None','MJPJAY','None']),since:ago(24*ri(120,900)),hist,log:[],rx:[],reports:[],appts:[]};
}
const fixed=[ // a few well-known rows first
 ['Sunita Patil','F',52,'Pune','red','follow'],['Ramesh Jadhav','M',61,'Nashik','yellow','rx'],['Lata Bhosale','F',72,'Satara','red','cc'],['Vijay Pawar','M',67,'Solapur','red','bpo'],
 ['Imran Khan','M',48,'Chh. Sambhajinagar','yellow','kpo'],['Pooja Deshmukh','F',27,'Nagpur','red','new'],['Rekha Waghmare','F',63,'Pune','yellow','consult'],['Ganesh Shinde','M',29,'Pune','green']
];
if(!P.def)fixed.forEach((f,i)=>{f[0]=i===0?P.persona:P.nm(f[1],i+1);f[3]=P.areas[i%P.areas.length]});
fixed.forEach((f,i)=>citizens.push(mkCitizen(i,f[0],f[1],f[2],f[3],f[4],f[5])));
for(let i=fixed.length;i<52;i++){const sex=rnd()<.5?'F':'M';const nm=jn(sex==='F'?pick(FIRST_F):pick(FIRST_M),pick(LAST));const r=rnd();
 citizens.push(mkCitizen(i,nm,sex,ri(22,81),pick(DISTRICTS),r<.17?'red':r<.5?'yellow':'green'))}
// make sure seeded "fixed" citizens have the intended flag (regenerate vitals if needed)
citizens.forEach((c,i)=>{if(i<fixed.length){let g=0;while(c.flag!==fixed[i][4]&&g<20){c.v=genVitals(fixed[i][4]);const a=assess(c.v);c.flag=a.flag;c.reasons=a.reasons;c.hist[c.hist.length-1]=Object.assign(c.hist[c.hist.length-1],{sbp:c.v.sbp,dbp:c.v.dbp,sugar:c.v.sugar,spo2:c.v.spo2});g++}}});

// ---- seed histories + queues ----
const L=(c,d,t,by)=>c.log.push({d,t,by});
const suggestMeds=c=>{const m=[];if(c.v.sbp>=140||c.v.dbp>=90)m.push('Telmisartan 40 mg','Amlodipine 5 mg');if(c.v.sugar>=200)m.push('Metformin 500 mg');if(c.v.sugar>=300)m.push('Glimepiride 1 mg');if(c.v.spo2<95)m.push('Salbutamol inhaler');if(c.v.sugar<70)m.push('ORS sachets');if(c.v.bmi>=30)m.push('Atorvastatin 10 mg');return[...new Set(m)].slice(0,3).concat(m.length?[]:['Iron + Folic acid'])};
const suggestTests=c=>{const t=[];if(c.v.sugar>=200||c.v.sugar<70)t.push('HbA1c');if(c.v.sbp>=160)t.push('ECG','Kidney function');if(c.v.spo2<95)t.push('Chest X-ray');if(c.v.bmi>=30)t.push('Lipid profile');return t.length?t.slice(0,2):['CBC']};
let rxN=5100;
citizens.forEach((c,ix)=>{
 L(c,c.since,`Registered from ${c.fac}; ${c.card.type} linked, previous PHR imported`,'HIE');
 c.hist.slice(0,-1).forEach(h=>L(c,h.d,`Vitals (${h.src}): BP ${h.sbp}/${h.dbp}, sugar ${h.sugar}, SpO₂ ${h.spo2}%`,'HIE'));
 const last=c.hist[c.hist.length-1].d;
 L(c,last,`Screening at ${c.fac}: BP ${c.v.sbp}/${c.v.dbp}, sugar ${c.v.sugar}, SpO₂ ${c.v.spo2}%, pulse ${c.v.pulse}`,'HIE');
 L(c,new Date(last.getTime()+60000),`Flag set to ${c.flag.toUpperCase()}: ${c.reasons.join(', ')}`,'System');
 if(c.flag==='green'){ if(rnd()<.6){const d=DOCS[ix%DOCS.length];const rx={id:'RX-'+(rxN++),meds:['Iron + Folic acid'],tests:['CBC'],by:d.name,d:ago(24*ri(10,60)),advice:'Routine check, continue healthy diet'};c.rx.push(rx);c.reports.push({name:'CBC',val:'Hb '+(11+rnd()*3).toFixed(1)+' g/dL',d:new Date(rx.d.getTime()+86400000),lab:P.lab+', '+c.district,status:'Normal'});L(c,rx.d,`Routine check by ${d.name}`,'Doctor')}
  if(rnd()<.35)c.appts.push({d:new Date(NOW.getTime()+3600000*ri(20,300)),what:'Routine check-up',where:c.fac});return}
 const si=STAGES.findIndex(s=>s[0]===c.stage);let t=last.getTime()+ri(10,50)*60000;const nx=m=>{t+=m*60000;return new Date(Math.min(t,NOW.getTime()-ri(2,40)*60000))};
 if(si>=2)L(c,nx(ri(20,90)),'BPO call: spoke to citizen, symptoms confirmed','BPO');
 if(si>=3)L(c,nx(ri(30,120)),'KPO review: records checked, escalated to Command Centre','KPO');
 if(si>=4){const d=c.flag==='red'?DOCS[ix%3===0?3:0]:DOCS[ix%DOCS.length];c.doctor=d.name;c.mode=c.flag==='red'&&rnd()<.4?'Hospital visit':'e-Consultation';L(c,nx(ri(15,60)),`Command Centre assigned ${c.doctor} (${c.mode})`,'Command Centre')}
 if(si>=5){const rx={id:'RX-'+(rxN++),meds:suggestMeds(c),tests:suggestTests(c),by:c.doctor,d:nx(ri(60,300)),advice:'Low salt diet, 30 min walk daily, review in 2 weeks'};c.rx.push(rx);
  L(c,rx.d,`e-Prescription ${rx.id}: ${rx.meds.join(', ')} · Tests: ${rx.tests.join(', ')}`,'Doctor');
  const ph=`${P.pharm}, ${c.district}`,lb=`${P.lab}, ${c.district}`;
  if(c.stage==='rx'){pharmacyQ.push({rx,cid:c.id,done:rnd()<.3,at:null,ph});labQ.push({rx,cid:c.id,done:false,lab:lb});
    if(pharmacyQ[pharmacyQ.length-1].done){pharmacyQ[pharmacyQ.length-1].at=nx(40);L(c,pharmacyQ[pharmacyQ.length-1].at,'Pharmacy dispensed medicines','Pharmacy')}}
  else{const pd=nx(ri(60,240));pharmacyQ.push({rx,cid:c.id,done:true,at:pd,ph});L(c,pd,`Medicines dispensed at ${ph}`,'Pharmacy');
    const ld=nx(ri(120,600));const res=rx.tests.map(x=>({name:x,val:labVal(x,c),d:ld,lab:lb,status:x==='HbA1c'&&c.v.sugar>=200?'Abnormal':'Reviewed'}));res.forEach(r=>c.reports.push(r));labQ.push({rx,cid:c.id,done:true,at:ld,lab:lb,res});L(c,ld,`Lab report uploaded: ${res.map(r=>r.name+' '+r.val).join(', ')}`,'Lab');
    if(c.stage==='follow')L(c,nx(5),'Treatment complete, sent to BPO for follow-up vitals','System')}
 }
 if(c.loop>1)L(c,ago(24*20),'Previous loop closed; flag stayed '+c.flag.toUpperCase()+', loop #2 started','System');
 if(si>=4)c.appts.push({d:new Date(NOW.getTime()+3600000*ri(18,200)),what:'Review with '+(c.doctor||'doctor'),where:c.mode==='e-Consultation'?'Video call':c.fac});
 c.log.sort((a,b)=>a.d-b.d);
});
function labVal(t,c){return{HbA1c:(c.v.sugar>=200?(7.6+rnd()*2).toFixed(1):(5.4+rnd()*.6).toFixed(1))+'%','Fasting blood sugar':Math.round(c.v.sugar*.72)+' mg/dL','Lipid profile':'LDL '+ri(96,168)+' mg/dL',CBC:'Hb '+(10.5+rnd()*3.5).toFixed(1)+' g/dL','Kidney function':'Creatinine '+(0.7+rnd()*.6).toFixed(1)+' mg/dL',ECG:pick(['Sinus rhythm','Sinus tachycardia','LVH changes']),'Chest X-ray':pick(['Lungs clear','Mild bronchial markings']),'Thyroid profile':'TSH '+(1.2+rnd()*3).toFixed(2)+' mIU/L'}[t]||'Normal'}
// blood + ngo + doctor schedule
const blood={'A+':18,'A-':3,'B+':22,'B-':2,'O+':27,'O-':4,'AB+':9,'AB-':1};
const redC=citizens.filter(c=>c.flag==='red');
[['O+',2,true],['B+',1,false],['A-',1,false],['O+',1,true],['AB+',2,true]].forEach(([g,u,done],i)=>{const c=redC[i%redC.length];bloodReq.push({cid:c.id,g,units:u,done,hosp:c.fac,d:ago(ri(2,40))})});
const donations=[['Rotary donor camp, Kothrud',62,ago(24*3)],['College camp, COEP Pune',48,ago(24*8)],['Voluntary walk-in donors',17,ago(24*1)],['Police headquarters camp',39,ago(24*13)],['IT park camp, Hinjewadi',71,ago(24*19)]];
citizens.filter(c=>c.flag!=='green').slice(0,9).forEach((c,i)=>ngoTasks.push({cid:c.id,ngo:NGOS[i%3],done:i%3===0,d:ago(ri(4,70)),note:i%3===0?pick(['Taking medicines regularly','Family counselled on diet','BP checked at home: improving']):''}));
if(!P.def){const A=i=>P.areas[i%P.areas.length];[`${A(0)} donor camp`,`College camp, ${A(1)}`,'Voluntary walk-in donors',`${A(2)} community camp`,`Workplace camp, ${A(0)}`].forEach((n,i)=>donations[i][0]=n)}
const MEDSTOCK=[['Telmisartan 40 mg',1240,400],['Amlodipine 5 mg',860,400],['Metformin 500 mg',2310,600],['Glimepiride 1 mg',180,250],['Atorvastatin 10 mg',540,300],['Paracetamol 500 mg',4100,1000],['ORS sachets',220,300],['Iron + Folic acid',3050,800],['Salbutamol inhaler',36,40],['Pantoprazole 40 mg',910,300]];
const providers=[
 ...DOCS.map(d=>({role:'doctor',name:d.name,org:d.org,dist:d.org.split(', ').pop(),api:'Connected',sync:ago(rnd()*2)})),
 ...[0,3,4,6].map(i=>DISTRICTS[i%DISTRICTS.length]).map(d=>({role:'pharmacist',name:P.pharm,org:d,dist:d,api:'Connected',sync:ago(rnd()*3)})),
 ...[0,2,4,10].map(i=>DISTRICTS[i%DISTRICTS.length]).map((d,i)=>({role:'pathologist',name:P.lab,org:d,dist:d,api:i===3?'Testing':'Connected',sync:ago(rnd()*4)})),
 ...[0,3,7].map(i=>DISTRICTS[i%DISTRICTS.length]).map(d=>({role:'bloodbank',name:P.bb,org:d,dist:d,api:'Connected',sync:ago(rnd()*2)})),
 ...NGOS.map((n,i)=>({role:'ngo',name:n,org:[[0,8],[6,10],[3,12]][i].map(k=>DISTRICTS[k%DISTRICTS.length]).join(', '),dist:'—',api:'Connected',sync:ago(rnd()*12)})),
 {role:'doctor',name:'Dr. Priya Nikam',org:'Nikam Clinic, Baramati',dist:'Pune',api:'Pending verification',sync:null},
 {role:'pharmacist',name:'Shree Medicals',org:'Ichalkaranji',dist:'Kolhapur',api:'Pending verification',sync:null}
];
const hl=(r)=>!P.def?P.hl[r]:({doctor:'Dr. Anjali Rao',pharmacist:'Prakash Mane',pathologist:'Dr. Rutuja Pande',bloodbank:'Shubhangi Kale',ngo:'Arogya Sathi Foundation'})[r];
const ORG=!P.def?P.org:{doctor:'District Hospital, Aundh, Pune',pharmacist:'Jan Aushadhi Kendra, Pune',pathologist:'District Lab, Pune',bloodbank:'District Blood Bank, Pune',ngo:'Pune · Satara · Solapur'};
