const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
const pauseC4D=()=>window.dispatchEvent(new Event('boostmind:c4d-pause'));
const resumeC4D=()=>{if(!document.querySelector('dialog[open]'))window.dispatchEvent(new Event('boostmind:c4d-resume'))};
const menu=qs('#mobile-menu'), toggle=qs('#boost-menu-toggle');
toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});qsa('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

const projects={
cheiron:{category:'Enterprise HSE Intelligence',title:'CHEIRON Executive HSE Dashboard',description:'One place for HSE performance, trends and management reporting',image:'/projects/cheiron.webp',video:'/projects/cheiron.mp4',tags:['Executive dashboards','Incident analytics','Role-based access','Reporting']},
bowtie:{category:'Process Safety · Risk Analysis',title:'BowTie Risk Analysis',description:'A visual way to explore threats, preventive barriers, the top event, and mitigation barriers around process-safety risks',image:'/projects/bowtie-risk-analysis.webp',video:null,tags:['BowTie diagrams','Threats & consequences','Preventive barriers','Mitigation barriers']},
moc:{category:'Enterprise Workflow',title:'MOC & Action Tracker',description:'A clear workflow for approvals, actions, owners and deadlines',image:'/projects/moc-tracker.webp',video:'/projects/moc-tracker.mp4',tags:['Approvals','Action tracking','Deadlines','Operational workflow']},
mcdc:{category:'Sports Platform',title:'MCDC Academy Platform',description:'A bilingual platform for academy operations, tournaments and results',image:'/projects/mcdc-academy.webp',video:'/projects/mcdc-academy.mp4',tags:['Arabic & English','Tournament management','Player stats','Admin tools']},
kemit:{category:'Luxury Commerce',title:'Kemit Perfume Web App',description:'A premium bilingual storefront built around the perfume buying experience',image:'/projects/kemit-commerce.webp',video:'/projects/kemit-commerce.mp4',tags:['Premium UI','Bilingual','Commerce','Product catalog']},
media:{category:'Marketing Analytics',title:'Media Buyer Analytics Studio',description:'A clearer view of ad spend, CAC, ROAS and customer performance',image:'/projects/media-buyer.webp',video:'/projects/media-buyer.mp4',tags:['Ad spend','CAC & ROAS','Customer analysis','Unit economics']},
padel:{category:'Smart Automation',title:'We Padel Slot Watcher',description:'Automatic slot monitoring with filters and instant alerts',image:'/projects/we-padel.webp',video:'/projects/we-padel.mp4',tags:['Availability monitoring','Scheduling','Alerts','Filters']}
};
const pmodal=qs('#project-modal'),pimg=qs('#project-image'),pvideo=qs('#project-video'),play=qs('#play-demo');let activeProject=null,lastTrigger=null;
async function videoExists(url){if(!url)return false;try{const r=await fetch(url,{method:'HEAD'});return r.ok}catch{return false}}
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

// v38 — soft scroll reveals. Content stays in normal document flow; only opacity/transform animate.
const motionReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const revealGroups = [
  ['#home', ['.hero-kicker','.hero h1','.hero-copy>p','.hero-actions','.mobile-hero-signature','.hero-visual']],
  ['.statement', ['p','h2']],
  ['#expertise', ['.section-head h2','.section-head>p','.solution-tab','.solution-panel']],
  ['#clients', ['.clients-heading h2','.logo-marquee']],
  ['#work', ['.work-head h2','.work-head>p','.project']],
  ['#process', ['.process-visual','.process-content>h2','.process-content>p','.process-list article']],
  ['#contact', ['.cta-copy>span','.cta-copy>h2','.contact-actions']],
  ['footer', ['.footer-brand-full','p','.footer-email','span']]
];

const revealItems=[];
revealGroups.forEach(([rootSelector, selectors])=>{
  const root=qs(rootSelector);
  if(!root)return;
  let order=0;
  selectors.forEach(selector=>{
    qsa(selector,root).forEach(el=>{
      if(revealItems.includes(el))return;
      el.classList.add('scroll-reveal');
      el.style.setProperty('--reveal-order', String(Math.min(order,6)));
      revealItems.push(el);
      order++;
    });
  });
});

if(motionReduced || !('IntersectionObserver' in window)){
  revealItems.forEach(el=>el.classList.add('is-visible'));
}else{
  const scrollRevealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      scrollRevealObserver.unobserve(entry.target);
    });
  },{threshold:.08,rootMargin:'0px 0px -7% 0px'});
  revealItems.forEach(el=>scrollRevealObserver.observe(el));
}


const processSection=qs('#process'),processVisual=qs('.process-visual',processSection),processSteps=qsa('.process-list article',processSection);
if(processVisual&&processSteps.length){
  const setActiveStep=index=>{processSteps.forEach((step,i)=>step.classList.toggle('active',i===index));processVisual.dataset.activeStep=String(index+1)};
  setActiveStep(0);
  const processObserver=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const idx=processSteps.indexOf(visible.target);if(idx!==-1)setActiveStep(idx)},{threshold:[.35,.55,.75],rootMargin:'-12% 0px -12% 0px'});
  processSteps.forEach((step,index)=>{processObserver.observe(step);step.addEventListener('mouseenter',()=>setActiveStep(index));step.addEventListener('focusin',()=>setActiveStep(index))});
  processSection?.addEventListener('pointermove',e=>{const rect=processSection.getBoundingClientRect();const x=((e.clientX-rect.left)/rect.width-.5);const y=((e.clientY-rect.top)/rect.height-.5);processVisual.style.transform=`translate3d(${(x*10).toFixed(1)}px, ${(y*8).toFixed(1)}px, 0)`});
  processSection?.addEventListener('pointerleave',()=>{processVisual.style.transform='translate3d(0,0,0)'});
}


// v37: C4D is desktop-only. Mobile never loads or keeps the WebGL compositor.
const desktopC4DEnabled = document.documentElement.getAttribute('data-desktop-c4d') === '1';
const c4dStage=qs('#visual-stage');
let c4dLoadPromise=null;
const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const saveData=Boolean(connection?.saveData);
const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const verySlowConnection=['slow-2g','2g'].includes(connection?.effectiveType);

if(!desktopC4DEnabled){
  document.documentElement.classList.add('mobile-static-visuals');
  c4dStage?.remove();
  qsa('.mobile-scene-portal,.c4d-mobile-anchor canvas').forEach(el=>el.remove());
}

function loadC4D(){
  if(!desktopC4DEnabled||c4dLoadPromise||saveData||reducedMotion)return c4dLoadPromise;
  c4dStage?.classList.add('c4d-loading');
  c4dLoadPromise=import('/assets/c4d-scroll-engine.js?v=37')
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
  if(!desktopC4DEnabled)return;
  if(saveData||reducedMotion){c4dStage?.classList.add('c4d-fallback');return;}
  const startFromIntent=()=>setTimeout(loadC4D,40);
  const start=()=>{
    if(verySlowConnection){
      ['pointerdown','scroll'].forEach(type=>window.addEventListener(type,startFromIntent,{once:true,passive:true}));
      return;
    }
    if('requestIdleCallback' in window){requestIdleCallback(loadC4D,{timeout:1100});}
    else setTimeout(loadC4D,550);
  };
  if(document.readyState==='complete')start();
  else window.addEventListener('load',start,{once:true});
  ['pointerdown','scroll'].forEach(type=>window.addEventListener(type,startFromIntent,{once:true,passive:true}));
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
  let c4dPausedForClients=false;
  const clientsVisualObserver=new IntersectionObserver(entries=>{
    const entry=entries[0];
    const active=entry.isIntersecting&&entry.intersectionRatio>0.12;
    document.documentElement.classList.toggle('bm-clients-active',active);
    if(window.innerWidth<=700){
      if(active&&!c4dPausedForClients){pauseC4D();c4dPausedForClients=true}
      else if(!active&&c4dPausedForClients){c4dPausedForClients=false;resumeC4D()}
    }
  },{threshold:[0,.12,.35,.6]});
  clientsVisualObserver.observe(clientsSection);
}

// v39 — useful, accessible capability explorer, independent from WebGL.
const serviceExamples={
  platforms:{number:'01',title:'Workflows that actually move',description:'One clear place to track requests, approvals and ownership across your team',steps:[['Request','Capture the details'],['Approve','Route to the right person'],['Track','See what’s done']],benefit:'Clear ownership, fewer missed actions',footer:'Built to fit your team, not the other way around'},
  dashboards:{number:'02',title:'A clearer picture, every day',description:'Turn everyday data into an easy view of trends, performance and the next action',steps:[['Connect','Bring in your data'],['Measure','Find the signals'],['Decide','Share the insight']],benefit:'Answers your team can act on',footer:'The right numbers, without the clutter'},
  automation:{number:'03',title:'Less chasing, more doing',description:'Automate routine handoffs, reminders and approvals without losing control',steps:[['Trigger','A request comes in'],['Route','Notify the owner'],['Complete','Close the loop']],benefit:'Fewer repetitive follow-ups',footer:'Keep the process moving automatically'},
  apis:{number:'04',title:'Your tools, connected',description:'Connect existing systems so the same information does not have to be entered twice',steps:[['Source','Read the data'],['Connect','Map the systems'],['Sync','Keep it updated']],benefit:'More consistent data across tools',footer:'One connected workflow, not isolated apps'},
  web:{number:'05',title:'An easier way to get things done',description:'Give your team or customers a focused app that works beautifully on any screen',steps:[['Explore','Find what matters'],['Interact','Finish the task'],['Manage','Stay in control']],benefit:'A simpler experience for everyone',footer:'Built around the person using it'},
  monitoring:{number:'06',title:'Spot changes earlier',description:'Track important signals and alert the right person when attention is needed',steps:[['Watch','Track the signal'],['Detect','Match the rules'],['Alert','Reach the owner']],benefit:'Timely alerts and clearer follow-up',footer:'Know what changed and what to do next'}
};
const serviceTabs=qsa('.solution-tab');
const servicePanel=qs('#solution-panel');
function activateService(key, focus=false){
  const data=serviceExamples[key]; if(!data||!servicePanel)return;
  const activeTab=serviceTabs.find(t=>t.dataset.service===key);
  serviceTabs.forEach(t=>{const active=t===activeTab;t.classList.toggle('is-active',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});
  servicePanel.setAttribute('aria-labelledby',activeTab.id);
  const fields={
    '#solution-index':`${data.number} / 06`, '#solution-title':data.title,
    '#solution-description':data.description,'#solution-benefit':data.benefit,
    '#solution-footer':data.footer,
  };
  Object.entries(fields).forEach(([id,val])=>{const el=qs(id);if(el)el.textContent=val});
  data.steps.forEach(([title,caption],i)=>{
    const n=i+1;qs(`#solution-step-${n}`).textContent=title;
    qs(`#solution-step-caption-${n}`).textContent=caption;
  });
  servicePanel.classList.remove('solution-swapped');
  // Force animation restart only when motion is permitted.
  if(!motionReduced){void servicePanel.offsetWidth;servicePanel.classList.add('solution-swapped')}
  if(focus)activeTab.focus();
}
serviceTabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>activateService(tab.dataset.service));
  tab.addEventListener('keydown',e=>{
    const direction=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:0;
    if(direction){e.preventDefault();const next=serviceTabs[(index+direction+serviceTabs.length)%serviceTabs.length];activateService(next.dataset.service,true)}
    if(e.key==='Home'||e.key==='End'){e.preventDefault();const next=serviceTabs[e.key==='Home'?0:serviceTabs.length-1];activateService(next.dataset.service,true)}
  });
});
