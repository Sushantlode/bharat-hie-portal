// ================= helpers =================
let seed=20261102;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const ri=(a,b)=>Math.floor(a+rnd()*(b-a+1));const pick=a=>a[Math.floor(rnd()*a.length)];
const pad=(n,l)=>String(n).padStart(l,'0');
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const NOW=new Date('2026-11-02T15:30:00');let clock=new Date(NOW);
const ago=h=>new Date(NOW.getTime()-h*3600000);
const fmt=d=>d.toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false});
const fmtD=d=>d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const tick=(m=4)=>{clock=new Date(clock.getTime()+m*60000);return clock};
