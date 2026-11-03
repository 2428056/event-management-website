const IMG = s => `https://picsum.photos/seed/${s}/700/420`;
const events = [
  {id:1,name:"CodeSprint Hackathon",cat:"Tech",date:"2026-12-05T09:00",venue:"Tech Park Auditorium, Chennai",img:IMG("hackathon"),desc:"A 24-hour build marathon for student teams.",more:"Form teams of up to four, pick a problem track and ship a working prototype. Mentors and prizes included."},
  {id:2,name:"UI/UX Design Workshop",cat:"Workshop",date:"2026-11-20T10:00",venue:"Design Studio, Anna Nagar",img:IMG("uxdesign"),desc:"Learn Figma and design thinking hands-on.",more:"A full-day workshop covering wireframes, prototyping and usability testing. Bring your laptop."},
  {id:3,name:"Sunset Indie Music Night",cat:"Music",date:"2026-12-12T18:30",venue:"Marina Open Stage, Chennai",img:IMG("concert"),desc:"Live sets from five independent bands.",more:"Gates open at 6 PM. Food stalls, open seating and a closing jam session."},
  {id:4,name:"Startup Pitch Day",cat:"Business",date:"2026-12-18T11:00",venue:"Innovation Hub, OMR",img:IMG("startup"),desc:"Ten founders pitch to a panel of investors.",more:"Watch live pitches, network with founders and join the Q&A with the judges."},
  {id:5,name:"Intro to AI Bootcamp",cat:"Tech",date:"2027-01-09T09:30",venue:"Online (Zoom)",img:IMG("aicourse"),desc:"Machine learning basics with live coding.",more:"Two sessions covering Python, data and your first model. No prior experience needed."},
  {id:6,name:"Street Photography Walk",cat:"Workshop",date:"2026-11-28T06:30",venue:"Mylapore Heritage Walk",img:IMG("photowalk"),desc:"Capture the city at sunrise with a pro.",more:"A guided two-hour walk with tips on light, framing and candid shots."},
  {id:7,name:"Carnatic Fusion Evening",cat:"Music",date:"2027-01-16T19:00",venue:"Music Academy, Mylapore",img:IMG("fusion"),desc:"Classical meets contemporary on one stage.",more:"An evening of fusion performances by leading artists. Reserved seating."},
  {id:8,name:"Product Management Meetup",cat:"Business",date:"2027-02-06T16:00",venue:"Co-work Space, T. Nagar",img:IMG("meetup"),desc:"Talks and networking for aspiring PMs.",more:"Three short talks followed by open networking and snacks."}
];
const $ = id => document.getElementById(id);
const store = {
  get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
};
let category = "All", current = null;

const fmt = d => new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});
const upcoming = () => events.filter(e => new Date(e.date) > new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date));

/* ---------- Theme ---------- */
function setTheme(t){document.documentElement.dataset.theme=t;$("themeBtn").textContent=t==="dark"?"☀️":"🌙";store.set("theme",t)}
setTheme(store.get("theme", matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));
$("themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark");
$("menuBtn").onclick = () => {const o=$("navLinks").classList.toggle("open");$("menuBtn").setAttribute("aria-expanded",o)};
$("navLinks").onclick = e => {if(e.target.tagName==="A")$("navLinks").classList.remove("open")};

/* ---------- Countdown ---------- */
function timerHTML(date){
  let ms = Math.max(0,new Date(date)-new Date()), s=Math.floor(ms/1000);
  const p=[[Math.floor(s/86400),"days"],[Math.floor(s%86400/3600),"hrs"],[Math.floor(s%3600/60),"min"],[s%60,"sec"]];
  return p.map(([n,l])=>`<div><b>${String(n).padStart(2,"0")}</b><span>${l}</span></div>`).join("");
}
function tick(){
  const n = upcoming()[0];
  if(n){$("nextName").textContent=n.name;$("nextTimer").innerHTML=timerHTML(n.date);$("nextBtn").onclick=()=>openModal(n.id)}
  if(current)$("mTimer").innerHTML=timerHTML(current.date);
}
setInterval(tick,1000);

/* ---------- Events list, search, filter ---------- */
function renderChips(){
  const cats=["All",...new Set(events.map(e=>e.cat))];
  $("chips").innerHTML=cats.map(c=>`<button class="chip ${c===category?"on":""}" data-c="${c}" aria-pressed="${c===category}">${c}</button>`).join("");
}
$("chips").onclick = e => {if(e.target.dataset.c){category=e.target.dataset.c;renderChips();renderEvents()}};
$("search").oninput = renderEvents;
function renderEvents(){
  const q=$("search").value.trim().toLowerCase();
  const list=events.filter(e=>(category==="All"||e.cat===category)&&(e.name+e.venue+e.desc+e.cat).toLowerCase().includes(q));
  $("grid").innerHTML=list.map(e=>`
    <article class="card" tabindex="0" data-id="${e.id}">
      <img src="${e.img}" alt="${e.name}" loading="lazy">
      <div class="card-body">
        <span class="tag">${e.cat}</span>
        <h3>${e.name}</h3>
        <p class="muted">${fmt(e.date)}<br>${e.venue}</p>
        <p>${e.desc}</p>
        <button class="btn" tabindex="-1">View and register</button>
      </div></article>`).join("");
  $("empty").hidden=list.length>0;
}
$("grid").onclick = e => {const c=e.target.closest(".card");if(c)openModal(+c.dataset.id)};
$("grid").onkeydown = e => {if(e.key==="Enter"){const c=e.target.closest(".card");if(c)openModal(+c.dataset.id)}};

/* ---------- Modal ---------- */
function openModal(id){
  current=events.find(e=>e.id===id);
  $("mImg").src=current.img;$("mImg").alt=current.name;
  $("mCat").textContent=current.cat;$("mTitle").textContent=current.name;
  $("mMeta").textContent=`${fmt(current.date)} at ${current.venue}`;
  $("mDesc").textContent=current.desc+" "+current.more;
  $("eventSel").innerHTML=events.map(e=>`<option value="${e.id}" ${e.id===id?"selected":""}>${e.name}</option>`).join("");
  $("form").hidden=false;$("success").hidden=true;$("form").reset();$("eventSel").value=id;clearErrors();
  $("modal").hidden=false;document.body.style.overflow="hidden";tick();$("closeBtn").focus();
}
function closeModal(){$("modal").hidden=true;document.body.style.overflow="";current=null}
$("closeBtn").onclick=closeModal;
$("modal").onclick=e=>{if(e.target===$("modal"))closeModal()};
document.onkeydown=e=>{if(e.key==="Escape"&&!$("modal").hidden)closeModal()};
$("eventSel").onchange=()=>openModalKeepForm(+$("eventSel").value);
function openModalKeepForm(id){
  const v={n:$("name").value,e:$("email").value,p:$("phone").value};
  openModal(id);$("name").value=v.n;$("email").value=v.e;$("phone").value=v.p;
}

/* ---------- Validation ---------- */
const rules={
  name:v=>/^[A-Za-z][A-Za-z .'-]{2,49}$/.test(v)?"":"Enter your full name (letters only, at least 3 characters).",
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?"":"Enter a valid email address, like name@example.com.",
  phone:v=>/^[6-9]\d{9}$/.test(v.replace(/[\s-]/g,""))?"":"Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9."
};
function clearErrors(){Object.keys(rules).forEach(k=>{$(k+"Err").textContent="";$(k).classList.remove("bad")})}
function check(k){const m=rules[k]($(k).value.trim());$(k+"Err").textContent=m;$(k).classList.toggle("bad",!!m);return !m}
Object.keys(rules).forEach(k=>$(k).addEventListener("blur",()=>check(k)));

$("form").onsubmit = e => {
  e.preventDefault();
  const ok=Object.keys(rules).map(check).every(Boolean);
  if(!ok)return;
  const ev=events.find(x=>x.id===+$("eventSel").value);
  const regs=store.get("regs",[]);
  const email=$("email").value.trim().toLowerCase();
  if(regs.some(r=>r.eventId===ev.id&&r.email===email)){$("emailErr").textContent="This email is already registered for this event.";$("email").classList.add("bad");return}
  regs.push({eventId:ev.id,name:$("name").value.trim(),email,phone:$("phone").value.trim(),at:new Date().toISOString()});
  store.set("regs",regs);
  $("form").hidden=true;
  $("success").hidden=false;
  $("success").innerHTML=`<h4>You're registered, ${$("name").value.trim().split(" ")[0]}!</h4><p>We've saved your spot for <b>${ev.name}</b> on ${fmt(ev.date)}. A confirmation will be sent to ${email}.</p>`;
  renderRegs();toast("Registration confirmed");
};

/* ---------- My registrations (Local Storage) ---------- */
function renderRegs(){
  const regs=store.get("regs",[]);
  $("regList").innerHTML=regs.length?regs.map((r,i)=>{
    const ev=events.find(e=>e.id===r.eventId);
    return `<li><span><b>${ev.name}</b><br><small class="muted">${r.name} · ${r.email} · ${fmt(ev.date)}</small></span><button data-i="${i}">Cancel registration</button></li>`}).join("")
    :`<li><span class="muted">No registrations yet. Pick an event above to get started.</span></li>`;
}
$("regList").onclick=e=>{
  if(e.target.dataset.i===undefined)return;
  const regs=store.get("regs",[]);regs.splice(+e.target.dataset.i,1);store.set("regs",regs);renderRegs();toast("Registration cancelled");
};
function toast(m){$("toast").textContent=m;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2500)}

renderChips();renderEvents();renderRegs();tick();
