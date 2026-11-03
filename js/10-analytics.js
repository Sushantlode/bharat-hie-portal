// ================= live analytics dashboard =================
const IN_POP={'Uttar Pradesh':24,'Maharashtra':12.6,'Bihar':12.7,'West Bengal':10,'Madhya Pradesh':8.6,'Tamil Nadu':7.7,'Rajasthan':8.1,'Karnataka':6.8,'Gujarat':7.1,'Andhra Pradesh':5.3,'Odisha':4.6,'Telangana':3.8,'Kerala':3.5,'Jharkhand':4,'Assam':3.6,'Punjab':3.1,'Chhattisgarh':3,'Haryana':3,'Delhi':2.1,'Jammu and Kashmir':1.4,'Uttarakhand':1.2,'Himachal Pradesh':0.75,'Tripura':0.42,'Meghalaya':0.33,'Manipur':0.32,'Nagaland':0.22,'Goa':0.16,'Arunachal Pradesh':0.16,'Puducherry':0.16,'Mizoram':0.12,'Chandigarh':0.12,'Sikkim':0.07,'Andaman and Nicobar Islands':0.04,'Dadra and Nagar Haveli and Daman and Diu':0.12,'Ladakh':0.03,'Lakshadweep':0.007};
const DISEASES=[['Hypertension',.18,'#C42B2B'],['Diabetes',.09,'#A86100'],['Anaemia',.12,'#B4447A'],['Respiratory / COPD',.04,'#1C4C9E'],['Cardiac disease',.02,'#7A2F2F'],['Mental health',.03,'#6A4BB0'],['Child malnutrition',.02,'#0D6B60'],['Vector-borne (dengue, malaria)',.015,'#2E7D32'],['TB (presumptive)',.01,'#5A6B76'],['Kidney disease (CKD)',.01,'#8A5A2B'],['High-risk pregnancy',.008,'#D9661C'],['Cancer screen positive',.003,'#13212B']];
const AGES=['0–9','10–19','20–29','30–39','40–49','50–59','60–69','70+'];
const AGE_W=[.11,.12,.15,.16,.15,.13,.11,.07],AGE_RED=[.012,.008,.012,.022,.038,.06,.085,.11],AGE_YEL=[.06,.05,.07,.11,.17,.22,.26,.28];
const AX={live:true,range:'today',feed:[],spark:{},seq:20811,lastTick:Date.now(),zero:false};
const ahash=x=>{let h=2166136261;for(const c of x)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296};
function axScope(){
 if(P.india&&!P.st)return{label:'India',unit:'state',list:Object.keys(IN_D).map(n=>({n,w:IN_POP[n]||.1}))};
 if(STATES[P.cc]&&!P.st)return{label:P.co.n,unit:['US','AU','NG','BR','DE'].includes(P.cc)?'state':'region',list:STATES[P.cc].map(n=>({n,w:.4+ahash(n)*1.2}))};
 return{label:P.place,unit:P.india?'district':'area',list:P.areas.map(n=>({n,w:.5+ahash(n)}))};
}
function axInit(){
 const sc=axScope(),tot=sc.list.reduce((a,r)=>a+r.w,0),daily=Math.max(400,1.24e6*P.scale/30*1.15);
 AX.scope=sc;AX.daily=daily;
 const hr=new Date().getHours()+new Date().getMinutes()/60;AX.dayFrac=Math.max(.2,Math.min(1,(hr-6)/14));
 AX.regions=sc.list.map(r=>({n:r.n,share:r.w/tot,screened:r.w/tot*daily,redRate:.025+ahash('r'+r.n)*.035,yelRate:.11+ahash('y'+r.n)*.08,resp:14+Math.round(ahash('t'+r.n)*40),dz:DISEASES.map((d,i)=>d[1]*(.65+ahash(i+'#'+r.n)*.8))}));
 const T=AX.today={screened:Math.round(daily*AX.dayFrac),amb:Math.max(3,Math.round(140*Math.min(6,P.scale)))};
 T.red=Math.round(T.screened*.04);T.yellow=Math.round(T.screened*.145);
 T.consult=Math.round(T.red*1.9+T.yellow*.35);T.rx=Math.round(T.consult*.82);T.lab=Math.round(T.consult*.6);
 T.firstCall=27;T.sla=94.2;T.labTat=91.4;
 AX.days=[...Array(14)].map((_,i)=>{const f=.85+.3*ahash(i+'d')+i*.006;const s=Math.round(daily*f);return{d:new Date(NOW.getTime()-(13-i)*864e5),s,red:Math.round(s*(.044-i*.0006+ahash(i+'r')*.004)),yel:Math.round(s*(.15+ahash(i+'y')*.01))}});
 const curH=new Date().getHours();AX.hours=[...Array(24)].map((_,h)=>h>curH?0:Math.round(daily/14*(h<6?.05:h<9?.7:h<13?1.5:h<17?1.25:h<20?.8:.25)*(.85+ahash(h+'h')*.3)));
 ['screened','red','yellow','consult','rx','lab','firstCall','sla'].forEach(k=>{AX.spark[k]=[...Array(12)].map((_,i)=>T[k]*(k==='firstCall'||k==='sla'?(.94+ahash(i+k)*.12):(.6+i*.035)))});
 AX.feed=[];for(let i=0;i<8;i++)axNewRed(new Date(Date.now()-(8-i)*180000));
}
function axNewRed(at){
 const r=AX.regions[Math.floor(Math.random()*Math.min(AX.regions.length,14))]||AX.regions[0];
 const age=[34,41,47,52,58,61,66,72,79][Math.floor(Math.random()*9)],sex=Math.random()<.5?'F':'M';
 const why=['BP crisis (186/118)','BP crisis (192/121)','Very high sugar (338)','Low sugar (61)','SpO₂ 87%','Pulse 138','Chest pain reported','BP crisis (181/122)'][Math.floor(Math.random()*8)];
 AX.feed.unshift({id:'CS-'+(AX.seq++),at:at||new Date(),age,sex,where:r.n,why,st:'Queued for BPO call'});
 AX.feed=AX.feed.slice(0,9);
 AX.feed.forEach((f,i)=>{if(i>=2&&f.st==='Queued for BPO call')f.st='BPO calling';if(i>=4)f.st='KPO review';if(i>=6)f.st='Doctor assigned'});
}
// DOM morph: update the live dashboard in place so CSS transitions animate bars, rings and lines
function morph(a,b){
 if(a.nodeType!==b.nodeType||a.nodeName!==b.nodeName||(a.nodeType===1&&(a.getAttribute('data-k')||'')!==(b.getAttribute('data-k')||''))){a.replaceWith(b.cloneNode(true));return}
 if(a.nodeType===3){if(a.nodeValue!==b.nodeValue)a.nodeValue=b.nodeValue;return}
 if(a.nodeType!==1)return;
 for(const at of [...a.attributes])if(!b.hasAttribute(at.name))a.removeAttribute(at.name);
 for(const at of [...b.attributes])if(a.getAttribute(at.name)!==at.value)a.setAttribute(at.name,at.value);
 morphKids(a,b);
}
function morphKids(a,b){const ac=[...a.childNodes],bc=[...b.childNodes];for(let i=0;i<Math.max(ac.length,bc.length);i++){if(i>=bc.length){ac[i].remove();continue}if(i>=ac.length){a.appendChild(bc[i].cloneNode(true));continue}morph(ac[i],bc[i])}}
function axPatch(){const el=document.getElementById('anx');if(!el)return;const t=document.createElement('div');t.innerHTML=analyticsInner();morphKids(el,t)}
function axTick(){
 if(!AX.regions||!AX.live)return;
 const T=AX.today,inc=Math.max(1,Math.round(AX.daily/14/900*4*(.6+Math.random()*.8)));
 T.screened+=inc;T.red+=Math.round(inc*.04*(.4+Math.random()*1.2));T.yellow+=Math.round(inc*.145*(.7+Math.random()*.6));
 T.consult+=Math.round(inc*.12*Math.random()*2);T.rx+=Math.round(inc*.1*Math.random()*2);T.lab+=Math.round(inc*.07*Math.random()*2);
 T.firstCall=Math.max(18,Math.min(40,T.firstCall+(Math.random()-.5)*3));T.sla=Math.max(86,Math.min(99,T.sla+(Math.random()-.5)*1.2));T.labTat=Math.max(84,Math.min(98,T.labTat+(Math.random()-.5)*1.2));
 AX.hours[new Date().getHours()]+=inc;
 AX.regions.forEach(r=>{r.screened+=inc*r.share;r.redRate=Math.max(.02,Math.min(.07,r.redRate+(Math.random()-.5)*.002))});
 AX.days[13].red=Math.round(AX.days[13].red*(.985+Math.random()*.03));AX.days[13].yel=Math.round(AX.days[13].yel*(.99+Math.random()*.02));
 ['screened','red','yellow','consult','rx','lab','firstCall','sla'].forEach(k=>{AX.spark[k].push(T[k]);AX.spark[k]=AX.spark[k].slice(-12)});
 if(Math.random()<.55)axNewRed();
 AX.lastTick=Date.now();axPatch();
}
setInterval(axTick,4000);
const nfi=n=>Math.round(n).toLocaleString('en-IN');
const Z=v=>AX.zero?0:v;
function spark(v,col){const mx=Math.max(...v),mn=Math.min(...v),W=110,H=30;const xy=v.map((x,i)=>[(i*W/(v.length-1)),(H-3-(mx===mn?.5:(x-mn)/(mx-mn))*(H-6))]);const d='M'+xy.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');const l=xy[xy.length-1];return`<svg class="spk" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path class="tl" d="${d} L${W} ${H} L0 ${H} Z" fill="${col}" opacity=".12"></path><path class="tl" d="${d}" fill="none" stroke="${col}" stroke-width="1.8" vector-effect="non-scaling-stroke"></path><circle class="tc" cx="${l[0].toFixed(1)}" cy="${l[1].toFixed(1)}" r="2.6" fill="${col}"></circle></svg>`}
function axKpi(k,i,label,val,col,sub){return`<button class="akpi" data-a="ax-xl" data-sheet="KPIs" data-row="${i}" title="Open in Excel view"><span class="l">${label}</span><span class="n">${val}</span>${sub?`<span class="d">${sub}</span>`:''}${spark(AX.spark[k],col)}</button>`}
function gauge(i,label,pct,col,sub){const r=42,C=2*Math.PI*r,v=Math.max(0,Math.min(100,Z(pct)));return`<button class="gauge" data-a="ax-xl" data-sheet="KPIs" data-row="${i}" title="Open in Excel view"><svg viewBox="0 0 110 110" width="112" height="112" aria-hidden="true"><circle cx="55" cy="55" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="11"></circle><circle class="gval" cx="55" cy="55" r="${r}" fill="none" stroke="${col}" stroke-width="11" stroke-linecap="round" stroke-dasharray="${(C*v/100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 55 55)"></circle><circle class="gspin" cx="55" cy="55" r="52" fill="none" stroke="${col}" stroke-width="1.5" stroke-dasharray="4 10" opacity=".45"></circle><text x="55" y="61" text-anchor="middle" class="gv">${pct.toFixed(1)}%</text></svg><span class="gl">${label}</span>${sub?`<span class="gs">${sub}</span>`:''}</button>`}
function trendChart14(){
 const W=640,H=230,pl=52,pr=12,pt=14,pb=28,d=AX.days,mx=Math.max(...d.map(x=>x.yel))*1.15;
 const nice=v=>{const p=Math.pow(10,Math.floor(Math.log10(v)));return Math.ceil(v/p)*p};const top=nice(mx);
 const X=i=>pl+i*(W-pl-pr)/(d.length-1),Y=v=>pt+(1-Z(v)/top)*(H-pt-pb);
 const path=k=>'M'+d.map((x,i)=>`${X(i).toFixed(1)} ${Y(x[k]).toFixed(1)}`).join(' L');
 const area=(k,c)=>`<path class="tl" d="${path(k)} L${X(d.length-1)} ${Y(0)} L${pl} ${Y(0)} Z" fill="${c}" opacity=".1"></path>`;
 const ln=(k,c)=>`<path class="tl" d="${path(k)}" fill="none" stroke="${c}" stroke-width="2.4"></path>${d.map((x,i)=>`<circle class="tc pt" data-a="ax-xl" data-sheet="Daily flags" data-row="${i}" cx="${X(i).toFixed(1)}" cy="${Y(x[k]).toFixed(1)}" r="${i===d.length-1?4.5:3}" fill="${c}"><title>${x.d.toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}: ${nfi(x[k])}</title></circle>`).join('')}`;
 return`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Red and yellow flags per day, last 14 days">${[0,.25,.5,.75,1].map(f=>`<line x1="${pl}" x2="${W-pr}" y1="${pt+(1-f)*(H-pt-pb)}" y2="${pt+(1-f)*(H-pt-pb)}" stroke="var(--line)"></line><text x="${pl-6}" y="${pt+(1-f)*(H-pt-pb)+4}" text-anchor="end">${fmtBig(top*f)}</text>`).join('')}${area('yel','var(--amb)')}${area('red','var(--red)')}${ln('yel','var(--amb)')}${ln('red','var(--red)')}${d.map((x,i)=>i%2===1||i===d.length-1?`<text x="${X(i)}" y="${H-8}" text-anchor="middle">${x.d.toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</text>`:'').join('')}</svg>`;
}
function hourChart(){
 const W=640,H=170,pl=44,pb=24,pt=10,v=AX.hours,mx=Math.max(1,...v),bw=(W-pl-8)/24,cur=new Date().getHours();
 const nice=x=>{const p=Math.pow(10,Math.floor(Math.log10(x)));return Math.ceil(x/p)*p};const top=nice(mx);const Y=x=>pt+(1-Z(x)/top)*(H-pt-pb);
 return`<svg class="chart hour" viewBox="0 0 ${W} ${H}" role="img" aria-label="Screenings per hour today">${[0,.5,1].map(f=>`<line x1="${pl}" x2="${W-6}" y1="${pt+(1-f)*(H-pt-pb)}" y2="${pt+(1-f)*(H-pt-pb)}" stroke="var(--line)"></line><text x="${pl-6}" y="${pt+(1-f)*(H-pt-pb)+4}" text-anchor="end">${fmtBig(top*f)}</text>`).join('')}${v.map((x,h)=>`<rect data-a="ax-xl" data-sheet="Hourly" data-row="${h}" x="${(pl+h*bw+bw*.15).toFixed(1)}" y="${Y(x).toFixed(1)}" width="${(bw*.7).toFixed(1)}" height="${Math.max(0,H-pb-Y(x)).toFixed(1)}" rx="2" fill="${h===cur?'var(--core)':'color-mix(in srgb,var(--core) 40%,var(--surface))'}"><title>${pad(h,2)}:00 · ${nfi(x)}</title></rect>${h%3===0?`<text x="${(pl+h*bw+bw/2).toFixed(1)}" y="${H-7}" text-anchor="middle">${pad(h,2)}:00</text>`:''}`).join('')}</svg>`;
}
function donut(segs){const tot=segs.reduce((a,s)=>a+s[1],0),r=46,C=2*Math.PI*r;let off=0;
 return`<div class="donutw"><svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label="Split by gender"><circle cx="70" cy="70" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="20"></circle>${segs.map((s,i)=>{const len=Z(s[1]/tot)*C,o=off;off+=s[1]/tot*C;return`<circle class="gval seg" data-a="ax-xl" data-sheet="Gender" data-row="${i}" cx="70" cy="70" r="${r}" fill="none" stroke="${s[2]}" stroke-width="20" stroke-dasharray="${Math.max(0,len-1.5).toFixed(1)} ${C.toFixed(1)}" stroke-dashoffset="${(-o).toFixed(1)}" transform="rotate(-90 70 70)"><title>${s[0]}: ${nfi(s[1])}</title></circle>`}).join('')}<text x="70" y="68" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--fg)">${fmtBig(tot)}</text><text x="70" y="84" text-anchor="middle">screened</text></svg><div class="legend2">${segs.map((s,i)=>`<button data-a="ax-xl" data-sheet="Gender" data-row="${i}"><i style="background:${s[2]}"></i><span>${s[0]}</span><b>${Math.round(s[1]/tot*100)}%</b></button>`).join('')}</div></div>`}
function axCompute(){
 const T=AX.today,m={today:1,'7d':7,'30d':30}[AX.range],rl={today:'today','7d':'last 7 days','30d':'last 30 days'}[AX.range];
 const S_=T.screened*(m===1?1:m/AX.dayFrac*.98),RED=T.red*(m===1?1:m/AX.dayFrac*1.01),YEL=T.yellow*(m===1?1:m/AX.dayFrac);
 const regs=AX.regions.map(r=>{const s=r.screened/AX.daily*S_;return{...r,s,red:s*r.redRate,yel:s*r.yelRate}}).sort((a,b)=>b.red/b.s-a.red/a.s);
 const dz=DISEASES.map((d,i)=>({n:d[0],c:d[2],v:regs.reduce((a,r)=>a+r.s*r.dz[i],0),ch:Math.round((ahash(AX.range+d[0])-.45)*18)})).sort((a,b)=>b.v-a.v);
 const ages=AGES.map((a,i)=>{const s=S_*AGE_W[i];return{a,s,red:s*AGE_RED[i],yel:s*AGE_YEL[i]}});
 const topR=regs.slice().sort((a,b)=>b.s-a.s).slice(0,8),topD=dz.slice(0,6);
 const hm=topR.map(r=>topD.map(d=>{const i=DISEASES.findIndex(x=>x[0]===d.n);return r.dz[i]/DISEASES[i][1]}));
 const gender=[['Female',S_*.53,'#B4447A'],['Male',S_*.465,'#1C4C9E'],['Other',S_*.005,'#5A6B76']];
 const target=Math.min(100,T.screened/(AX.daily*1.05)*100),consPct=Math.min(100,T.consult/(T.consult+T.red*.15+30)*100);
 const kpis=[['Citizens screened',S_,'people',rl],['Red flags',RED,'cases',rl],['Yellow flags',YEL,'cases',rl],['Avg time to first call (red)',T.firstCall,'minutes','now'],['Red flags called within 1 hour',T.sla,'%','today'],['Consultations',T.consult*m,'consultations',rl],['e-Prescriptions',T.rx*m,'prescriptions',rl],['Lab reports',T.lab*m,'reports',rl],["Today's screening target achieved",target,'%','today'],['Consultations completed',consPct,'%','today'],['Lab reports within 24 hours',T.labTat,'%','today']];
 return AX.last={T,m,rl,S_,RED,YEL,regs,dz,ages,topR,topD,hm,gender,target,consPct,kpis};
}
function axData(){
 const c=AX.last||axCompute(),u=AX.scope.unit,U=u[0].toUpperCase()+u.slice(1),r1=n=>Math.round(n*10)/10;
 return{
  'KPIs':{cols:['Metric','Value','Unit','Period'],rows:c.kpis.map(k=>[k[0],k[2]==='%'||k[2]==='minutes'?r1(k[1]):Math.round(k[1]),k[2],k[3]])},
  'Daily flags':{cols:['Date','Screened','Red flags','Yellow flags','Red rate %'],rows:AX.days.map(d=>[d.d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),d.s,d.red,d.yel,r1(d.red/d.s*100)])},
  'Diseases':{cols:['Disease','Cases','Share of screened %','Change vs previous period %'],rows:c.dz.map(d=>[d.n,Math.round(d.v),r1(d.v/c.S_*100),d.ch])},
  'Age groups':{cols:['Age group','Screened','Red','Yellow','Green','Red rate %'],rows:c.ages.map(a=>[a.a+' yrs',Math.round(a.s),Math.round(a.red),Math.round(a.yel),Math.round(a.s-a.red-a.yel),r1(a.red/a.s*100)])},
  'Gender':{cols:['Gender','Screened','Share %'],rows:c.gender.map(g=>[g[0],Math.round(g[1]),r1(g[1]/c.S_*100)])},
  [U+'s']:{cols:[U,'Screened','Red','Yellow','Red rate %','First call (min)','Status'],rows:c.regs.map(r=>{const rate=r.red/r.s*100;return[r.n,Math.round(r.s),Math.round(r.red),Math.round(r.yel),r1(rate),r.resp,rate>5?'High alert':rate>3.8?'Watch':'Normal']})},
  'Hotspots':{cols:[U].concat(c.topD.map(d=>d.n+' vs avg %')),rows:c.topR.map((r,i)=>[r.n].concat(c.hm[i].map(v=>Math.round((v-1)*100))))},
  'Hourly':{cols:['Hour','Screenings'],rows:AX.hours.map((v,h)=>[pad(h,2)+':00',Math.round(v)])},
  'Red flag feed':{cols:['Case ID','Time','Sex','Age','Location','Reason','Status'],rows:AX.feed.map(f=>[f.id,f.at.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false}),f.sex==='F'?'Female':'Male',f.age,f.where,f.why,f.st])}
 };
}
const xlBtn=(sheet)=>`<button class="xlbtn" data-a="ax-xl" data-sheet="${sheet}" data-row="-1" title="Open in Excel view"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18M3 15h18M9 3v18"></path></svg>Excel</button>`;
function analyticsInner(){
 const c=axCompute(),T=c.T,U=AX.scope.unit[0].toUpperCase()+AX.scope.unit.slice(1)+'s',dzMax=c.dz[0].v,ageMax=Math.max(...c.ages.map(x=>x.s));
 return`<div class="ax-top"><div class="row"><span class="livepill ${AX.live?'on':''}"><span class="live-dot"></span>${AX.live?'Live':'Paused'}</span><span class="small muted">Updated ${new Date(AX.lastTick).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})} · refreshes every 4 seconds · ${esc(AX.scope.label)} · click any chart to see its data</span></div>
  <div class="row">${[['today','Today'],['7d','7 days'],['30d','30 days']].map(([k,l])=>`<button class="chip" data-a="ax-range" data-g="${k}" aria-pressed="${AX.range===k}">${l}</button>`).join('')}<button class="btn sm" data-a="ax-live">${AX.live?'Pause':'Resume'}</button><button class="btn sm pri" data-a="ax-xl" data-sheet="KPIs" data-row="-1">Open all data in Excel view</button></div></div>
 <div class="gauges">${gauge(4,'Red flags called within 1 hour',T.sla,'var(--grn)','Target 95%')}${gauge(8,"Today's screening target",c.target,'var(--core)',fmtBig(T.screened)+' of '+fmtBig(AX.daily*1.05))}${gauge(9,'Consultations completed',c.consPct,'var(--prov)')}${gauge(10,'Lab reports within 24 hours',T.labTat,'var(--amb)')}</div>
 <div class="akpis">
  ${axKpi('screened',0,'Citizens screened '+c.rl,fmtBig(c.S_),'var(--core)')}
  ${axKpi('red',1,'Red flags '+c.rl,fmtBig(c.RED),'var(--red)',`${(c.RED/c.S_*100).toFixed(1)}% of screened`)}
  ${axKpi('yellow',2,'Yellow flags '+c.rl,fmtBig(c.YEL),'var(--amb)',`${(c.YEL/c.S_*100).toFixed(1)}% of screened`)}
  ${axKpi('firstCall',3,'Avg time to first call (red)',Math.round(T.firstCall)+' min','var(--core)','Target: 60 min')}
  ${axKpi('sla',4,'Red flags called within 1 hour',T.sla.toFixed(1)+'%','var(--grn)')}
  ${axKpi('consult',5,'Consultations '+c.rl,fmtBig(T.consult*c.m),'var(--prov)')}
  ${axKpi('rx',6,'e-Prescriptions '+c.rl,fmtBig(T.rx*c.m),'var(--prov)')}
  ${axKpi('lab',7,'Lab reports '+c.rl,fmtBig(T.lab*c.m),'var(--prov)')}
 </div>
 <div class="agrid g2">
  <section class="apanel"><div class="aph"><h3>Red and yellow flags, last 14 days</h3><div class="row"><div class="leg"><span><i style="background:var(--red)"></i>Red</span><span><i style="background:var(--amb)"></i>Yellow</span></div>${xlBtn('Daily flags')}</div></div>${trendChart14()}</section>
  <section class="apanel"><div class="aph"><h3>Red flag live feed</h3><div class="row"><span class="pill bad">${AX.feed.filter(f=>f.st==='Queued for BPO call').length} waiting</span>${xlBtn('Red flag feed')}</div></div>
   <div class="afeed">${AX.feed.map((f,i)=>`<button data-k="${f.id}" class="${i===0?'new':''}" data-a="ax-xl" data-sheet="Red flag feed" data-row="${i}"><span class="flag red">Red</span><span style="min-width:0;flex:1"><b class="mono">${f.id}</b> · ${f.sex==='F'?'Female':'Male'}, ${f.age} · ${esc(f.where)}<span class="small muted" style="display:block">${f.why} · ${f.st}</span></span><time class="mono">${f.at.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false})}</time></button>`).join('')}</div></section>
 </div>
 <div class="agrid g2">
  <section class="apanel"><div class="aph"><h3>Disease-wise burden</h3><div class="row"><span class="small muted">${c.rl}</span>${xlBtn('Diseases')}</div></div>
   <div class="hbars">${c.dz.map((d,i)=>`<button class="hb" data-k="${d.n}" data-a="ax-xl" data-sheet="Diseases" data-row="${i}"><span class="hl">${d.n}</span><span class="ht"><i style="width:${Z(d.v/dzMax*100).toFixed(1)}%;background:${d.c}"></i></span><span class="hv">${fmtBig(d.v)}</span><span class="hchg ${d.ch>0?'up':'dn'}">${d.ch>0?'▲':'▼'} ${Math.abs(d.ch)}%</span></button>`).join('')}</div></section>
  <section class="apanel"><div class="aph"><h3>Age-wise flags</h3><div class="row"><div class="leg"><span><i style="background:var(--red)"></i>Red</span><span><i style="background:var(--amb)"></i>Yellow</span><span><i style="background:var(--grn)"></i>Green</span></div>${xlBtn('Age groups')}</div></div>
   <div class="hbars">${c.ages.map((x,i)=>`<button class="hb" data-a="ax-xl" data-sheet="Age groups" data-row="${i}"><span class="hl">${x.a} yrs</span><span class="ht stk"><span class="stkin" style="width:${Z(x.s/ageMax*100).toFixed(1)}%"><i style="width:${(x.red/x.s*100).toFixed(1)}%;background:var(--red)"></i><i style="width:${(x.yel/x.s*100).toFixed(1)}%;background:var(--amb)"></i><i style="flex:1;background:var(--grn)"></i></span></span><span class="hv">${fmtBig(x.s)}</span><span class="hchg">${(x.red/x.s*100).toFixed(1)}% red</span></button>`).join('')}</div>
   <div class="aph" style="margin-top:14px"><h3>Gender split</h3>${xlBtn('Gender')}</div>${donut(c.gender)}</section>
 </div>
 <section class="apanel"><div class="aph"><h3>${U.slice(0,-1)}-wise status: ${esc(AX.scope.label)}</h3><div class="row"><span class="small muted">Sorted by red-flag rate · ${c.regs.length} ${AX.scope.unit}s</span>${xlBtn(U)}</div></div>
  <div class="tbl-wrap" style="border:0"><table class="atbl"><thead><tr><th>${AX.scope.unit==='state'?'State / UT':U.slice(0,-1)}</th><th class="num">Screened</th><th class="num">Red</th><th class="num">Yellow</th><th>Red-flag rate</th><th class="num">First call</th><th>Status</th></tr></thead><tbody>
  ${c.regs.slice(0,AX.showAll?c.regs.length:12).map((r,i)=>{const rate=r.red/r.s*100,st=rate>5?['bad','High alert']:rate>3.8?['warn','Watch']:['ok','Normal'];return`<tr data-k="${esc(r.n)}" data-a="ax-xl" data-sheet="${U}" data-row="${i}"><td><b>${esc(r.n)}</b></td><td class="num">${nfi(r.s)}</td><td class="num" style="color:var(--red);font-weight:700">${nfi(r.red)}</td><td class="num" style="color:var(--amb);font-weight:700">${nfi(r.yel)}</td><td><div class="rate"><span class="rbar"><i style="width:${Z(Math.min(100,rate/7*100)).toFixed(0)}%"></i></span><span class="mono">${rate.toFixed(1)}%</span></div></td><td class="num">${r.resp} min</td><td><span class="pill ${st[0]}">${st[1]}</span></td></tr>`}).join('')}
  </tbody></table></div>${c.regs.length>12?`<button class="btn sm" data-a="ax-all" style="align-self:flex-start">${AX.showAll?'Show top 12':'Show all '+c.regs.length}</button>`:''}</section>
 <div class="agrid g2">
  <section class="apanel"><div class="aph"><h3>Disease hotspots</h3><div class="row"><span class="small muted">vs. ${esc(AX.scope.label)} average</span>${xlBtn('Hotspots')}</div></div>
   <div class="tbl-wrap" style="border:0"><table class="heat"><thead><tr><th></th>${c.topD.map(d=>`<th>${d.n.split(' (')[0]}</th>`).join('')}</tr></thead><tbody>${c.topR.map((r,i)=>`<tr data-k="${esc(r.n)}" data-a="ax-xl" data-sheet="Hotspots" data-row="${i}"><th>${esc(r.n)}</th>${c.hm[i].map(v=>{const pct=Math.round((v-1)*100),k=Math.max(0,Math.min(1,(v-.7)/.7));return`<td style="background:color-mix(in srgb,var(--red) ${Math.round(k*70)}%,var(--surface));color:${k>.55?'#fff':'var(--fg)'}">${pct>0?'+':''}${pct}%</td>`}).join('')}</tr>`).join('')}</tbody></table></div></section>
  <section class="apanel"><div class="aph"><h3>Screenings per hour, today</h3>${xlBtn('Hourly')}</div>${hourChart()}
   <div class="aph" style="margin-top:8px"><h3>Care loop right now</h3></div>
   <div class="loopbars">${[['BPO calls in progress',Math.round(c.RED/c.m*.06+3)],['KPO reviews',Math.round(c.RED/c.m*.03+2)],['Command Centre queue',Math.round(c.RED/c.m*.015+1)],['Doctor consultations live',Math.round(c.RED/c.m*.025+2)],['Ambulances on duty',T.amb]].map(([l,v])=>`<div><span>${l}</span><b class="mono">${nfi(v)}</b></div>`).join('')}</div></section>
 </div>`;
}
function analyticsView(){
 if(!AX.regions||AX.key!==P.cc+P.si){AX.key=P.cc+P.si;axInit()}
 const sweep=AX.sweepKey!==AX.key+AX.range;AX.sweepKey=AX.key+AX.range;
 AX.zero=sweep;const h=`<div id="anx">${analyticsInner()}</div>`;AX.zero=false;
 if(sweep)setTimeout(()=>requestAnimationFrame(axPatch),60);
 return h;
}
// ================= Excel view =================
const colL=i=>{let s='';i++;while(i>0){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26)}return s};
function xlModal(){
 const X=S.xl,D=X.data,sh=D[X.sheet]||D[Object.keys(D)[0]],nc=sh.cols.length,sel=X.sel||[1,0];
 const cellVal=(r,c)=>r===0?sh.cols[c]:(sh.rows[r-1]||[])[c];
 const show=v=>typeof v==='number'?v.toLocaleString('en-IN'):esc(v??'');
 const ref=colL(sel[1])+(sel[0]+1),cur=cellVal(sel[0],sel[1]);
 return`<div class="scrim" data-a="close"></div><div class="modal xlwin" role="dialog" aria-label="Excel view">
 <div class="xl-bar"><div class="xl-title"><span class="xl-ico" aria-hidden="true">X</span><b>Bharat_HIE_Analytics.xlsx</b><span class="xl-sub">${esc(AX.scope.label)} · ${AX.last?AX.last.rl:''} · snapshot ${new Date(X.at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})}</span></div>
  <div class="row"><button class="btn sm xl-dl" data-a="xl-dl">Download .xlsx</button><button class="btn sm" data-a="xl-copy">Copy sheet</button><button class="x" data-a="close" aria-label="Close">×</button></div></div>
 <div class="xl-fx"><span class="xl-ref mono">${ref}</span><span class="xl-fxi">fx</span><span class="xl-fv">${show(cur)}</span></div>
 <div class="xl-grid"><table class="xl"><thead><tr><th class="xl-corner"></th>${sh.cols.map((_,c)=>`<th class="${c===sel[1]?'on':''}">${colL(c)}</th>`).join('')}</tr></thead><tbody>
  ${[sh.cols,...sh.rows].map((row,r)=>`<tr class="${r===0?'hdr':''}${X.hi!=null&&r===X.hi+1?' hi':''}"><th class="${r===sel[0]?'on':''}">${r+1}</th>${row.map((v,c)=>`<td data-a="xl-cell" data-r="${r}" data-c="${c}" class="${typeof v==='number'?'n':''}${r===sel[0]&&c===sel[1]?' sel':''}">${show(v)}</td>`).join('')}${row.length<nc?'<td></td>'.repeat(nc-row.length):''}</tr>`).join('')}
  ${[...Array(Math.max(3,14-sh.rows.length))].map((_,k)=>`<tr><th>${sh.rows.length+2+k}</th>${'<td></td>'.repeat(nc)}</tr>`).join('')}
 </tbody></table></div>
 <div class="xl-tabs" role="tablist">${Object.keys(D).map(k=>`<button role="tab" data-a="xl-tab" data-s="${esc(k)}" aria-selected="${k===X.sheet}">${esc(k)}</button>`).join('')}</div>
 </div>`;
}
function xlOpen(sheet,row){
 AX.last||axCompute();const data=axData();
 if(!data[sheet]){const U=AX.scope.unit[0].toUpperCase()+AX.scope.unit.slice(1)+'s';if(sheet===U)sheet=U;else sheet=Object.keys(data).find(k=>k.toLowerCase()===String(sheet).toLowerCase())||'KPIs'}
 const r=+row;S.xl={data,sheet,hi:r>=0?r:null,sel:[r>=0?r+1:1,0],at:Date.now()};S.modal='xl';
}
const xlTSV=()=>{const sh=S.xl.data[S.xl.sheet];return[sh.cols,...sh.rows].map(r=>r.map(v=>String(v??'').replace(/\t|\n/g,' ')).join('\t')).join('\n')};
async function xlDownload(){
 let dl=null;try{dl=await claude.use('downloads')}catch(e){}
 if(!dl){toast('Download is not available here. Use Copy sheet and paste into Excel.');return}
 try{
  let data,name='Bharat_HIE_Analytics_'+AX.scope.label.replace(/\W+/g,'_')+'.xlsx';
  if(window.XLSX){const wb=XLSX.utils.book_new();Object.entries(S.xl.data).forEach(([k,sh])=>{const ws=XLSX.utils.aoa_to_sheet([sh.cols,...sh.rows]);ws['!cols']=sh.cols.map((c,i)=>({wch:Math.max(10,...[c,...sh.rows.map(r=>r[i])].map(v=>String(v??'').length+2))}));XLSX.utils.book_append_sheet(wb,ws,k.slice(0,31))});data=XLSX.write(wb,{bookType:'xlsx',type:'array'})}
  else{const sh=S.xl.data[S.xl.sheet];data=[sh.cols,...sh.rows].map(r=>r.map(v=>{const s=String(v??'');return/[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}).join(',')).join('\n');name=name.replace('.xlsx','_'+S.xl.sheet.replace(/\W+/g,'_')+'.csv')}
  await dl.save({filename:name,data});toast('Excel file saved');
 }catch(e){if(e&&e.code==='declined')return;toast(e&&e.code==='rate_limited'?'A save is already open. Try again in a moment.':'Could not save the file here. Use Copy sheet instead.')}
}
