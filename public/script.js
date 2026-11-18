const opening=document.getElementById('opening');
const openBtn=document.getElementById('openBtn');
const invitation=document.getElementById('invitation');
const musicBtn=document.getElementById('musicBtn');
const audio=new Audio('assets/wedding-music.mp3');
audio.loop=true;
audio.preload='none';

;

let invitationOpened=false;

openBtn.addEventListener('click',(event)=>{
  event.preventDefault();
  if(invitationOpened) return;
  invitationOpened=true;
  openBtn.disabled=true;
  opening.classList.add('opened');
  invitation.classList.remove('locked');

  // Start the music from the user's tap/click (required by mobile browser autoplay rules).
  audio.play().then(()=>musicBtn.textContent='♫').catch(()=>{musicBtn.textContent='♪'});

  // Keep the page locked while the doors are physically opening.
  // Scrolling becomes available only after the original door transition finishes.
  setTimeout(()=>{
    document.body.classList.remove('locked');
    document.body.classList.add('invitation-opened');
  },1900);

  setTimeout(()=>{
    opening.remove();
    document.body.classList.remove('invitation-opened');
  },2150);
});

musicBtn.addEventListener('click',()=>{
  if(audio.paused){audio.play().then(()=>musicBtn.textContent='♫').catch(()=>{});}
  else{audio.pause();musicBtn.textContent='♪';}
});

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const dateSection=document.getElementById('dateReveal');
let dateTriggered=false;
const dateObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && entry.intersectionRatio>.25 && !dateTriggered){
      dateTriggered=true;
      const hearts=[...document.querySelectorAll('.date-heart')];
      hearts.forEach((h,i)=>setTimeout(()=>{
        h.classList.add('revealed');
        spawnRice(h,32);
      },i*650));
    }
  });
},{threshold:[.25,.5,.75]});
dateObserver.observe(dateSection);

function spawnRice(source,count){
  const field=document.getElementById('riceField');
  const r=source.getBoundingClientRect(), f=field.getBoundingClientRect();
  const sx=r.left+r.width/2-f.left, sy=r.top+r.height/2-f.top;
  for(let i=0;i<count;i++){
    const el=document.createElement('i');
    el.className='rice';
    el.style.left=sx+'px';
    el.style.top=sy+'px';
    el.style.setProperty('--dx',(Math.random()*260-130)+'px');
    el.style.setProperty('--dy',(100+Math.random()*300)+'px');
    el.style.setProperty('--rot',(Math.random()*720-360)+'deg');
    el.style.animationDelay=(Math.random()*.25)+'s';
    field.appendChild(el);
    setTimeout(()=>el.remove(),2300);
  }
}

const target=new Date('2027-10-24T09:30:00+05:30').getTime();
function tick(){
  let diff=Math.max(0,target-Date.now());
  const d=Math.floor(diff/86400000); diff%=86400000;
  const h=Math.floor(diff/3600000); diff%=3600000;
  const m=Math.floor(diff/60000); const s=Math.floor((diff%60000)/1000);
  document.getElementById('days').textContent=String(d).padStart(2,'0');
  document.getElementById('hours').textContent=String(h).padStart(2,'0');
  document.getElementById('minutes').textContent=String(m).padStart(2,'0');
  document.getElementById('seconds').textContent=String(s).padStart(2,'0');
}
tick();setInterval(tick,1000);

const petalLayer=document.querySelector('.petal-layer');
for(let i=0;i<28;i++){
  const p=document.createElement('span');p.className='petal';
  p.style.left=(Math.random()*100)+'%';
  p.style.setProperty('--x',(Math.random()*140-70)+'px');
  p.style.setProperty('--dur',(4+Math.random()*5)+'s');
  p.style.setProperty('--delay',(Math.random()*5)+'s');
  p.style.transform=`scale(${.55+Math.random()*.8})`;
  petalLayer.appendChild(p);
}

document.querySelectorAll('a[href^="https://www.google.com/maps"]').forEach(a=>{
  a.addEventListener('click',()=>{});
});

/* RSVP + Admin */
const RSVP_KEY='karthikeyan-harini-rsvp-v1';
const rsvpForm=document.getElementById('rsvpForm');
const rsvpAttending=document.getElementById('rsvpAttending');
const rsvpStatus=document.getElementById('rsvpStatus');
const adminPanel=document.getElementById('adminPanel');
const adminOpenBtn=document.getElementById('adminOpenBtn');
const adminLogin=document.getElementById('adminLogin');
const adminDashboard=document.getElementById('adminDashboard');
const ADMIN_PASSWORD='admin123';

function getRsvps(){
  try{return JSON.parse(localStorage.getItem(RSVP_KEY)||'[]')}catch(e){return []}
}
function saveRsvps(rows){localStorage.setItem(RSVP_KEY,JSON.stringify(rows))}
document.querySelectorAll('.attendance-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.attendance-btn').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    rsvpAttending.value=btn.dataset.attending;
  });
});
rsvpForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('rsvpName').value.trim();
  const guests=Number(document.getElementById('rsvpGuests').value);
  const attending=rsvpAttending.value;
  if(!name||!guests||!attending){rsvpStatus.textContent='Please complete all required fields.';return}
  const rows=getRsvps();
  rows.push({name,guests,attending,createdAt:new Date().toISOString()});
  saveRsvps(rows);
  rsvpForm.reset();
  document.querySelectorAll('.attendance-btn').forEach(b=>b.classList.remove('selected'));
  rsvpAttending.value='';
  rsvpStatus.textContent='Thank you. Your response has been recorded.';
  window.open('https://wa.me/917025423395?text='+encodeURIComponent('RSVP - Karthikeyan & Harini (24 October 2027)\nName: '+name+'\nAttending: '+attending+'\nGuests: '+guests),'_blank','noopener');
});

function showAdmin(){
  document.body.classList.add('admin-mode');
  adminPanel.hidden=false;
  document.getElementById('invitation').style.display='none';
  window.scrollTo(0,0);
}
function showInvitation(){
  adminPanel.hidden=true;
  document.getElementById('invitation').style.display='';
  document.body.classList.remove('admin-mode');
  window.scrollTo(0,0);
}
adminOpenBtn?.addEventListener('click',showAdmin);
document.getElementById('adminBackBtn')?.addEventListener('click',showInvitation);
document.getElementById('adminInvitationBtn')?.addEventListener('click',showInvitation);
document.getElementById('adminLoginBtn')?.addEventListener('click',()=>{
  const input=document.getElementById('adminPassword');
  if(input.value===ADMIN_PASSWORD){
    adminLogin.hidden=true; adminDashboard.hidden=false; input.value='';
    renderDashboard();
  }else{
    document.getElementById('adminError').textContent='Incorrect admin password.';
  }
});
document.getElementById('adminPassword')?.addEventListener('keydown',e=>{
  if(e.key==='Enter') document.getElementById('adminLoginBtn').click();
});
function renderDashboard(){
  const rows=getRsvps();
  const attending=rows.filter(r=>r.attending==='yes');
  const notAttending=rows.filter(r=>r.attending==='no');
  document.getElementById('statResponses').textContent=rows.length;
  document.getElementById('statAttending').textContent=attending.length;
  document.getElementById('statNotAttending').textContent=notAttending.length;
  document.getElementById('statGuests').textContent=attending.reduce((sum,r)=>sum+Number(r.guests||0),0);
  const list=document.getElementById('rsvpList');
  if(!rows.length){list.innerHTML='<p class="empty-rsvp">No RSVP responses yet.</p>';return}
  list.innerHTML='<div class="rsvp-row head"><span>Name</span><span>Guests</span><span>Response</span></div>'+
    rows.slice().reverse().map(r=>`<div class="rsvp-row"><span>${escapeHtml(r.name)}</span><span>${Number(r.guests)}</span><span class="${r.attending==='yes'?'yes':'no'}">${r.attending==='yes'?'Attending':'Not attending'}</span></div>`).join('');
}
function escapeHtml(v){
  return String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
document.getElementById('clearRsvpBtn')?.addEventListener('click',()=>{
  if(confirm('Clear all RSVP responses?')){localStorage.removeItem(RSVP_KEY);renderDashboard();}
});
document.getElementById('exportRsvpBtn')?.addEventListener('click',()=>{
  const rows=getRsvps();
  if(!rows.length){alert('No RSVP responses to export.');return}
  const csv=[['Name','Guests','Response','Submitted At'],...rows.map(r=>[r.name,r.guests,r.attending==='yes'?'Attending':'Not attending',r.createdAt])]
    .map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='rsvp-responses.csv';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
});
