// ================= About us: vision & mission =================
function aboutPage(){
 const ic=n=>`<span class="ab-ic" aria-hidden="true">${n}</span>`;
 const PRI=[
  ['Preventive healthcare','Early detection, screening and prevention of diseases.','Screening at PHC/Sub-centre/Gram Panchayat and at home, with automatic red, yellow and green flags.'],
  ['Primary healthcare','Accessible healthcare at village and community levels.','ANM and ASHA workers register citizens, record vitals and refer only when needed.'],
  ['Maternal & child health','Protecting mothers, newborns and children.','Matrujyoti mother and child tracking, immunization records and follow-up reminders.'],
  ['Communicable diseases','Prevention and control of infectious diseases.','Disease surveillance (IDSP / IHIP), TB, malaria, dengue and outbreak alerts on one dashboard.'],
  ['Non-communicable diseases','Screening for diabetes, hypertension, cancer and other chronic diseases.','Continuous monitoring, e-Consultation and e-Prescription loops until the citizen is back to green.'],
  ['Digital healthcare','Strengthening health information systems and technology.','A consent-based Health Information Exchange on FHIR, aligned with ABDM, ABHA and HMIS.'],
  ['Universal health coverage','Affordable healthcare without financial hardship.','Scheme eligibility checks for PM-JAY and state schemes, medicines and sample collection at home.']];
 const FW=[['NRHM','National Rural Health Mission'],['NUHM','National Urban Health Mission'],['Ayushman Arogya Mandir','Comprehensive primary healthcare'],['NHM programmes','Disease prevention and control'],['Digital health initiatives','Technology-enabled healthcare']];
 const AL=[['Preventive healthcare','Preventive health screening'],['Universal access','Village-level preventive centres'],['Early diagnosis','Multi-parameter testing'],['Digital health','Integrated health dashboards and a health information exchange'],['Rural healthcare','Gram Panchayat-level access'],['Employment generation','Local healthcare workforce'],['Quality healthcare','Technology-enabled monitoring']];
 const MIS=[
  ['One card, one login','Every citizen gets one ABHA / eHS-linked health card that works with every connected provider.'],
  ['Connect every provider','Hospitals, doctors, pharmacies, labs, blood banks and NGOs exchange records through open FHIR APIs.'],
  ['Consent first','Records move only with the citizen\'s consent, through a consent manager aligned with ABDM.'],
  ['Prevent before treat','Screening at PHC/Sub-centre/Gram Panchayat and at home, so risk is found early.'],
  ['Act within hours','Red flags reach the BPO call centre, KPO clinical review and Command Centre the same day.'],
  ['Care at the doorstep','e-Consultation, e-Prescription, medicine delivery and sample collection at home.'],
  ['Data for decisions','Live dashboards for districts and the state, from screening to recovery.'],
  ['Local jobs','Health workers, call-centre staff and technicians hired from the communities they serve.']];
 const nhm=P.india;
 return`<section class="sec ab">
 <div class="ab-hero"><span class="eyebrow">About us</span><h1>Vision &amp; Mission</h1>
  <p class="muted">Bharat HIE Portal is a Health Information Exchange that connects every healthcare provider, so that care is preventive, predictive, accessible and digitally connected.${nhm?' It is designed to support the vision of the National Health Mission (NHM).':''}</p></div>

 <div class="ab-vm">
  <article class="ab-card ab-vision">${ic('◎')}<span class="eyebrow">Our vision</span>
   <h2>A healthier ${P.india?'India':esc(P.co.n)}, where every citizen is screened early, cared for close to home and never faces financial hardship.</h2>
   <p class="muted">We aim for the highest possible level of health and well-being for all, at all ages, through prevention, early diagnosis and universal access to quality care.</p></article>
  <article class="ab-card">${ic('➜')}<span class="eyebrow">Our mission</span>
   <ul class="ab-list">${MIS.map(m=>`<li><b>${m[0]}.</b> ${m[1]}</li>`).join('')}</ul></article>
 </div>

 <div class="ab-hie"><span class="eyebrow">Health Information Exchange at the core</span>
  <div class="ab-flow">${['Screen','Flag','Triage','Treat','Deliver','Monitor'].map((s,i)=>`<div><b>${i+1}</b><span>${s}</span></div>`).join('<i aria-hidden="true">›</i>')}</div>
  <p class="small muted">Every step is recorded once and shared, with consent, with the provider who needs it next.</p></div>

 ${nhm?`<div class="ab-sec"><span class="eyebrow">National Health Mission (NHM), India</span><h2>National vision</h2>
  <blockquote class="ab-quote">“Attainment of the highest possible level of health and well-being for all at all ages, through a preventive and promotive health care orientation in all developmental policies, and universal access to good quality health care services without anyone having to face financial hardship as a consequence.”<cite>National Health Policy 2017, as stated on the NHM website</cite></blockquote>
  <p class="muted">NHM aims for universal access to equitable, affordable and quality healthcare that is accountable and responsive to people's needs, especially for vulnerable and underserved populations.</p></div>

 <div class="ab-sec"><h2>Seven national health priorities and how the portal supports them</h2>
  <div class="ab-pri">${PRI.map((p,i)=>`<article class="ab-card"><span class="ab-n">${i+1}</span><h3>${p[0]}</h3><p class="small muted">${p[1]}</p><p class="small"><b>Portal support:</b> ${p[2]}</p></article>`).join('')}</div></div>

 <div class="ab-two">
  <div class="ab-sec"><h2>NHM implementation framework</h2>
   <div class="ab-tw"><table class="ab-t"><thead><tr><th>Framework</th><th>Purpose</th></tr></thead><tbody>${FW.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="ab-sec"><h2>Programme alignment</h2>
   <div class="ab-tw"><table class="ab-t"><thead><tr><th>NHM vision</th><th>Bharat HIE contribution</th></tr></thead><tbody>${AL.map(r=>`<tr><td>${r[0]}</td><td><b>${r[1]}</b></td></tr>`).join('')}</tbody></table></div></div>
 </div>

 <div class="ab-pos"><span class="eyebrow">Our position</span><p>Bharat HIE is a technology and infrastructure partner that supports NHM's stated vision of moving healthcare delivery towards prevention, prediction, access and digital connection. It works with existing national programmes. It is not a separate health scheme.</p></div>
 <p class="ab-disc small">This page describes a <b>potential programme alignment</b>. It does not claim approval, endorsement or partnership by the National Health Mission, the Ministry of Health and Family Welfare or the Government of India.</p>
 <div class="ab-refs"><span class="eyebrow">Official references</span>
  <a href="https://nhm.gov.in/vision.php" target="_blank" rel="noopener">NHM: Vision ↗</a>
  <a href="https://nhm.gov.in/" target="_blank" rel="noopener">NHM official website ↗</a>
  <a href="https://www.mohfw.gov.in/" target="_blank" rel="noopener">Ministry of Health and Family Welfare ↗</a></div>`
 :`<div class="ab-pos"><span class="eyebrow">Our position</span><p>Bharat HIE works as a technology and infrastructure partner to ${esc(P.co.n)}'s national health programmes, supporting prevention, early diagnosis, universal access and digital health. It is not a separate health scheme and does not claim government endorsement.</p></div>`}
 </section>`;
}
