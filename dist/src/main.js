const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
const pauseC4D=()=>window.dispatchEvent(new Event('boostmind:c4d-pause'));
const resumeC4D=()=>{if(!document.querySelector('dialog[open]'))window.dispatchEvent(new Event('boostmind:c4d-resume'))};
const menu=qs('#mobile-menu'), toggle=qs('#boost-menu-toggle');
toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});qsa('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

const projects={
cheiron:{category:'Enterprise HSE Intelligence',title:'CHEIRON Executive HSE Dashboard',description:'One place for HSE performance, trends and management reporting',image:'/projects/cheiron.webp',video:'/projects/cheiron.mp4',tags:['Executive dashboards','Incident analytics','Role-based access','Reporting']},
moc:{category:'Enterprise Workflow',title:'MOC & Action Tracker',description:'A clear workflow for approvals, actions, owners and deadlines',image:'/projects/moc-tracker.webp',video:'/projects/moc-tracker.mp4',tags:['Approvals','Action tracking','Deadlines','Operational workflow']},
mcdc:{category:'Sports Platform',title:'MCDC Academy Platform',description:'A bilingual platform for academy operations, tournaments and results',image:'/projects/mcdc-academy.webp',video:'/projects/mcdc-academy.mp4',tags:['Arabic & English','Tournament management','Player stats','Admin tools']},
kemit:{category:'Luxury Commerce',title:'Kemit Perfume Web App',description:'A premium bilingual storefront built around the perfume buying experience',image:'/projects/kemit-commerce.webp',video:'/projects/kemit-commerce.mp4',tags:['Premium UI','Bilingual','Commerce','Product catalog']},
media:{category:'Marketing Analytics',title:'Media Buyer Analytics Studio',description:'A clearer view of ad spend, CAC, ROAS and customer performance',image:'/projects/media-buyer.webp',video:'/projects/media-buyer.mp4',tags:['Ad spend','CAC & ROAS','Customer analysis','Unit economics']},
padel:{category:'Smart Automation',title:'We Padel Slot Watcher',description:'Automatic slot monitoring with filters and instant alerts',image:'/projects/we-padel.webp',video:'/projects/we-padel.mp4',tags:['Availability monitoring','Scheduling','Alerts','Filters']}
};
const pmodal=qs('#project-modal'),pimg=qs('#project-image'),pvideo=qs('#project-video'),play=qs('#play-demo');let activeProject=null,lastTrigger=null;
async function videoExists(url){try{const r=await fetch(url,{method:'HEAD'});return r.ok}catch{return false}}
qsa('[data-project]').forEach(btn=>btn.addEventListener('click',async()=>{const p=projects[btn.dataset.project];if(!p)return;activeProject=p;lastTrigger=btn;qs('#project-category').textContent=p.category;qs('#project-title').textContent=p.title;qs('#project-description').textContent=p.description;qs('#project-tags').innerHTML=p.tags.map(t=>`<span>${t}</span>`).join('');pimg.src=p.image;pimg.alt=p.title;pimg.hidden=false;pvideo.hidden=true;pvideo.pause();pvideo.removeAttribute('src');play.hidden=true;pmodal.showModal();pauseC4D();if(await videoExists(p.video)){play.hidden=false}}));
play?.addEventListener('click',()=>{if(!activeProject)return;pvideo.src=activeProject.video;pvideo.poster=activeProject.image;pvideo.hidden=false;pimg.hidden=true;play.hidden=true;pvideo.play().catch(()=>{})});
function closeProject(){if(!pmodal.open)return;pvideo.pause();pmodal.close();resumeC4D();lastTrigger?.focus()}
qs('#project-close')?.addEventListener('click',closeProject);pmodal?.addEventListener('cancel',e=>{e.preventDefault();closeProject()});pmodal?.addEventListener('click',e=>{if(e.target===pmodal)closeProject()});

const imodal=qs('#inquiry-modal'),form=qs('#project-inquiry-form'),submit=qs('#inquiry-submit'),status=qs('#inquiry-status'),success=qs('#inquiry-success');let formOpenedAt=0,lastInquiryTrigger=null;
function openInquiry(trigger){lastInquiryTrigger=trigger;formOpenedAt=Date.now();form.hidden=false;success.hidden=true;status.textContent='';imodal.showModal();pauseC4D();setTimeout(()=>form.querySelector('[name="full-name"]')?.focus(),80)}
function closeInquiry(){if(!imodal.open)return;imodal.close();resumeC4D();lastInquiryTrigger?.focus()}
qsa('[data-open-inquiry]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openInquiry(el)}));qs('#inquiry-close')?.addEventListener('click',closeInquiry);qs('#success-close')?.addEventListener('click',closeInquiry);imodal?.addEventListener('cancel',e=>{e.preventDefault();closeInquiry()});imodal?.addEventListener('click',e=>{if(e.target===imodal)closeInquiry()});
function payload(){const fd=new FormData(form);return{fullName:fd.get('full-name'),email:fd.get('email'),phone:fd.get('phone'),projectBrief:fd.get('project-brief'),referenceLink:fd.get('reference-link'),botField:fd.get('bot-field'),formOpenedAt,sourcePage:location.href}}
form?.addEventListener('submit',async e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();return}submit.disabled=true;submit.classList.add('is-loading');status.textContent='Sending your project brief';try{let result;if(['localhost','127.0.0.1'].includes(location.hostname)){await new Promise(r=>setTimeout(r,550));result={ok:true,message:'Local preview only — email is sent after deployment on Cloudflare Pages'}}else{if(!navigator.onLine)throw new Error('You appear to be offline');const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);let r;try{r=await fetch(new URL('/api/project-inquiry',location.origin),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload()),cache:'no-store',credentials:'same-origin',signal:controller.signal})}finally{clearTimeout(timeout)}const raw=await r.text();try{result=JSON.parse(raw)}catch{result={ok:false,message:r.ok?'The server returned an unreadable response':'The project form service is unavailable'}}if(!r.ok||!result.ok){const err=new Error(result.message||'Could not send your request');err.code=result.code;throw err}}form.reset();form.hidden=true;success.hidden=false;success.querySelector('p').textContent=result.message||'Thanks, we’ll review the details and get back to you soon'}catch(err){let message;if(err?.name==='AbortError'){message='The request took too long, please try again'}else if(!navigator.onLine){message='No internet connection — reconnect and try again'}else if(err?.code==='EMAIL_NOT_CONFIGURED'){message='The project email service is not configured yet'}else if(err instanceof TypeError&&/fetch/i.test(err.message)){message='Could not reach the project form service'}else{message=err.message||'Could not send your request right now'}status.textContent=message+' You can also email info@boostmind-tech.com'}finally{submit.disabled=false;submit.classList.remove('is-loading')}});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});qsa('.expert-card,.project,.process-list article,.client-logo,.client-text').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el)});


const processSection=qs('#process'),processVisual=qs('.process-visual',processSection),processSteps=qsa('.process-list article',processSection);
if(processVisual&&processSteps.length){
  const setActiveStep=index=>{processSteps.forEach((step,i)=>step.classList.toggle('active',i===index));processVisual.dataset.activeStep=String(index+1)};
  setActiveStep(0);
  const processObserver=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const idx=processSteps.indexOf(visible.target);if(idx!==-1)setActiveStep(idx)},{threshold:[.35,.55,.75],rootMargin:'-12% 0px -12% 0px'});
  processSteps.forEach((step,index)=>{processObserver.observe(step);step.addEventListener('mouseenter',()=>setActiveStep(index));step.addEventListener('focusin',()=>setActiveStep(index))});
  processSection?.addEventListener('pointermove',e=>{const rect=processSection.getBoundingClientRect();const x=((e.clientX-rect.left)/rect.width-.5);const y=((e.clientY-rect.top)/rect.height-.5);processVisual.style.transform=`translate3d(${(x*10).toFixed(1)}px, ${(y*8).toFixed(1)}px, 0)`});
  processSection?.addEventListener('pointerleave',()=>{processVisual.style.transform='translate3d(0,0,0)'});
}


// v21: Progressive C4D loader — keep first paint fast, then start WebGL when the browser is idle.
const c4dStage=qs('#visual-stage');
let c4dLoadPromise=null;
const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const saveData=Boolean(connection?.saveData);
const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const verySlowConnection=['slow-2g','2g'].includes(connection?.effectiveType);

function loadC4D(){
  if(c4dLoadPromise||saveData||reducedMotion)return c4dLoadPromise;
  c4dStage?.classList.add('c4d-loading');
  c4dLoadPromise=import('/assets/c4d-scroll-engine.js')
    .then(()=>{
      c4dStage?.classList.remove('c4d-loading');
      c4dStage?.classList.add('c4d-ready');
      document.documentElement.classList.add('c4d-ready');
    })
    .catch(err=>{
      console.warn('C4D visual could not be loaded, keeping lightweight fallback',err);
      c4dStage?.classList.remove('c4d-loading');
      c4dStage?.classList.add('c4d-fallback');
    });
  return c4dLoadPromise;
}

function scheduleC4D(){
  if(saveData||reducedMotion){c4dStage?.classList.add('c4d-fallback');return;}
  const startFromIntent=()=>setTimeout(loadC4D,40);
  const start=()=>{
    if(verySlowConnection){
      // Preserve bandwidth: wait for intent before loading on very slow links.
      ['pointerdown','touchstart','scroll'].forEach(type=>window.addEventListener(type,startFromIntent,{once:true,passive:true}));
      return;
    }
    if('requestIdleCallback' in window){requestIdleCallback(loadC4D,{timeout:1100});}
    else setTimeout(loadC4D,550);
  };
  if(document.readyState==='complete')start();
  else window.addEventListener('load',start,{once:true});
  // If the visitor interacts before idle time, start immediately.
  ['pointerdown','touchstart','scroll'].forEach(type=>window.addEventListener(type,startFromIntent,{once:true,passive:true}));
}

scheduleC4D();


// v23: pause non-WebGL decorative motion when it is off-screen.
const motionSections=qsa('.process,.capability-rail');
if('IntersectionObserver' in window){
  const motionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('motion-active',entry.isIntersecting)),{rootMargin:'120px 0px'});
  motionSections.forEach(el=>motionObserver.observe(el));
}else motionSections.forEach(el=>el.classList.add('motion-active'));


// v24: prioritize scroll smoothness over non-essential CSS motion while scrolling.
let bmScrollIdleTimer=0;
window.addEventListener('scroll',()=>{
  document.documentElement.classList.add('bm-is-scrolling');
  clearTimeout(bmScrollIdleTimer);
  bmScrollIdleTimer=setTimeout(()=>document.documentElement.classList.remove('bm-is-scrolling'),140);
},{passive:true});





// v30: keep the Clients section visually clean by fading the global C4D stage out while it is in view.
const clientsSection=qs('#clients');
if(clientsSection){
  const clientsVisualObserver=new IntersectionObserver(entries=>{
    const entry=entries[0];
    document.documentElement.classList.toggle('bm-clients-active',entry.isIntersecting&&entry.intersectionRatio>0.12);
  },{threshold:[0,.12,.35,.6]});
  clientsVisualObserver.observe(clientsSection);
}

// v33 — mobile expertise swipe indicator
const mobileExpertiseGrid=qs('.expertise-grid');
const mobileExpertiseDots=qsa('.mobile-expertise-dots i');
if(mobileExpertiseGrid&&mobileExpertiseDots.length){
  let expertiseRaf=0;
  const updateExpertiseDots=()=>{
    expertiseRaf=0;
    if(window.innerWidth>700)return;
    const cards=qsa('.expert-card',mobileExpertiseGrid);
    if(!cards.length)return;
    const gridRect=mobileExpertiseGrid.getBoundingClientRect();
    let bestIndex=0,bestDistance=Infinity;
    cards.forEach((card,index)=>{
      const rect=card.getBoundingClientRect();
      const distance=Math.abs(rect.left-gridRect.left);
      if(distance<bestDistance){bestDistance=distance;bestIndex=index}
    });
    mobileExpertiseDots.forEach((dot,index)=>dot.classList.toggle('active',index===bestIndex));
  };
  mobileExpertiseGrid.addEventListener('scroll',()=>{
    if(!expertiseRaf)expertiseRaf=requestAnimationFrame(updateExpertiseDots);
  },{passive:true});
  window.addEventListener('resize',updateExpertiseDots,{passive:true});
  updateExpertiseDots();
}
