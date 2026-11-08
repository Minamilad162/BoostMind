const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
const pauseC4D=()=>window.dispatchEvent(new Event('boostmind:c4d-pause'));
const resumeC4D=()=>{if(!document.querySelector('dialog[open]'))window.dispatchEvent(new Event('boostmind:c4d-resume'))};
const menu=qs('#mobile-menu'), toggle=qs('#boost-menu-toggle');
toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});qsa('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));

const projects={
  cheiron:{"category":"HSE & Executive Reporting","title":"CHEIRON Executive HSE Dashboard","description":"Executive dashboards that bring together your HSE objectives, incident information and operational indicators in the views your management team needs","image":"/projects/cheiron.webp","video":"/projects/cheiron.mp4","tags":["HSE dashboards","JV reporting","KPIs & trends","Role-based access"]},
  stopcard:{"category":"HSE · Field Observations","title":"Stop Card · Safety Observations","description":"Mobile-first safety observations, HSE review, assignment to action parties, evidence and closure tracking in one tailored flow","image":"/projects/stop-card.svg","video":null,"tags":["Field observations","HSE review","Actions & evidence","Closure lifecycle"]},
  incident:{"category":"HSE · Investigations","title":"Incident Investigation","description":"A structured investigation experience covering the incident record, evidence, root-cause review and corrective actions","image":"/projects/incident-investigation.svg","video":null,"tags":["Evidence","Investigation workflow","Corrective actions","Reports"]},
  action:{"category":"Operations · Action Management","title":"Action Tracker","description":"A configurable action register that connects owners, priorities, due dates, updates and verification","image":"/projects/action-tracker.svg","video":null,"tags":["Owners & due dates","Follow-ups","Evidence","Status visibility"]},
  psm:{"category":"Process Safety · Interactive Learning","title":"3D Process Safety Management","description":"Explore Life-Saving Rules and Process Safety Fundamentals through a visual, site-focused 3D experience","image":"/projects/3d-process-safety.svg","video":null,"tags":["Life-Saving Rules","PSF","Interactive 3D","Field awareness"]},
  simulation:{"category":"Industrial · 3D Visualization","title":"3D Process Simulation","description":"An interactive 3D way to explore equipment layouts and illustrate how a process or facility operates","image":"/projects/3d-process-simulation.svg","video":null,"tags":["3D equipment","Process visualization","Interactive views","Operational context"]},
  lms:{"category":"Learning · LMS","title":"Technica Consult LMS","description":"A learning platform designed around course structures, lessons, assessments, learner progress and admin workflows","image":"/projects/technica-lms.svg","video":null,"tags":["Courses & lessons","Assessments","Learner progress","Admin tools"]},
  bowtie:{"category":"Process Safety · Risk Analysis","title":"BowTie Risk Analysis","description":"A visual way to connect threats and consequences with preventive and mitigating barriers around a top event","image":"/projects/bowtie-risk-analysis.webp","video":null,"tags":["Threats","Top event","Barriers","Consequences"]},
  moc:{"category":"Operations · Change Management","title":"MOC & Action Tracker","description":"A configurable management-of-change workflow for approvals, action owners, target dates and tracking","image":"/projects/moc-tracker.webp","video":"/projects/moc-tracker.mp4","tags":["Management of change","Approvals","Ownership","Due dates"]},
  media:{"category":"Analytics · Performance Reporting","title":"Media Buyer Analytics Studio","description":"Marketing analytics focused on the measures that matter to a team, including spend, customer acquisition and ROAS","image":"/projects/media-buyer.webp","video":"/projects/media-buyer.mp4","tags":["CAC & ROAS","Ad spend","Trends","Performance"]},
  mcdc:{"category":"Learning · Academy Operations","title":"MCDC Academy Platform","description":"A bilingual solution for academy operations, player records, tournaments and results","image":"/projects/mcdc-academy.webp","video":"/projects/mcdc-academy.mp4","tags":["Arabic & English","Operations","Tournaments","Admin tools"]},
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
  ['#expertise', ['.section-head h2','.head-sub','.tailor-tab','.tailor-panel','.tailor-ribbon']],
  ['#clients', ['.clients-heading h2','.logo-marquee']],
  ['#challenges', ['.friction-head h2','.friction-head>p','.friction-card']],
  ['#work', ['.work-head h2','.work-head .head-sub','.portfolio-filters','.project']],
  ['#process', ['.approach-heading h2','.approach-heading>p','.approach-step','.approach-preview','.tailor-proof']],
  ['#outcomes', ['.outcomes-head h2','.outcomes-grid>div']],
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


// v40 — interactive, accessible approach blueprint. No WebGL or background loops.
const approachData={
  discover:{index:'01 / 05',kicker:'DISCOVERY',title:'Start with your operation, not a template',description:'We learn how work moves between your people, where it gets stuck and what a useful system must do',steps:[['Your people','Roles and access'],['Your process','Steps and exceptions'],['Your system','Designed to fit']],result:'A shared picture of the problem we’re solving'},
  map:{index:'02 / 05',kicker:'WORKFLOW MAPPING',title:'Translate the real flow into clear logic',description:'We map forms, conditional approvals, handovers, alerts and exceptions before building',steps:[['Input','Fields and triggers'],['Rules','Approvals and routing'],['Output','Actions and records']],result:'A clear map of how your system should work'},
  shape:{index:'03 / 05',kicker:'EXPERIENCE DESIGN',title:'Give each role the screen they need',description:'We shape the pages, mobile flows, permissions and terminology around actual users',steps:[['User','Their daily task'],['Interface','Only what matters'],['Access','Right permissions']],result:'A design the team can review before development'},
  build:{index:'04 / 05',kicker:'BUILD & VALIDATE',title:'Build it, test real cases, refine it',description:'We develop and check each workflow against practical scenarios, including returns and exceptions',steps:[['Build','Working modules'],['Review','Real test cases'],['Refine','Feedback applied']],result:'A working product checked against the requirements'},
  evolve:{index:'05 / 05',kicker:'LAUNCH & EVOLVE',title:'Go live with room to change',description:'We prepare the handover, support adoption and make room for new requirements as the operation grows',steps:[['Launch','Go-live support'],['Learn','User feedback'],['Grow','New needs']],result:'A system that can evolve with the business'}
};
const approachButtons=qsa('.approach-step');
function activateApproach(key){
  const data=approachData[key];if(!data)return;
  approachButtons.forEach(b=>{const active=b.dataset.phase===key;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
  const fields={'#approach-index':data.index,'#approach-kicker':data.kicker,'#approach-title':data.title,'#approach-desc':data.description,'#approach-result':data.result};
  Object.entries(fields).forEach(([sel,val])=>{const el=qs(sel);if(el)el.textContent=val});
  data.steps.forEach(([title,sub],i)=>{const n=i+1;qs('#approach-node-'+n).textContent=title;qs('#approach-sub-'+n).textContent=sub});
  const panel=qs('#approach-preview');panel?.classList.remove('approach-swap');
  if(!motionReduced&&panel){void panel.offsetWidth;panel.classList.add('approach-swap')}
}
approachButtons.forEach(btn=>btn.addEventListener('click',()=>activateApproach(btn.dataset.phase)));

// Portfolio filters: all systems remain available in the DOM and project popup.
const portfolioFilters=qsa('.portfolio-filter'),portfolioCards=qsa('.projects-v40 .project');
portfolioFilters.forEach(button=>button.addEventListener('click',()=>{
  const group=button.dataset.filter;
  portfolioFilters.forEach(b=>{const active=b===button;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
  portfolioCards.forEach(card=>{card.hidden=!(group==='all'||card.dataset.category===group)});
}));

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

// v40 — illustrative solution scenarios make the customization possibilities concrete.
const tailorData={
  operations:{index:'01 / 04',title:'Your approvals, your way',intro:'A request can follow your exact roles, conditions and sign-off rules — not somebody else’s process',steps:[['Submit request','Your form fields'],['Review & approve','Your approval matrix'],['Close & report','Your reporting rules']],features:['Forms & fields','Approval levels','Roles & access','Notifications'],benefit:'No fixed approval chain — the logic follows your operation'},
  safety:{index:'02 / 04',title:'Safety processes that match your site',intro:'Connect observations, incident reviews and action follow-up in a flow defined by your HSE team',steps:[['Record event','Your categories'],['Assign action','Your responsibilities'],['Verify & close','Your evidence rules']],features:['HSE categories','Incident stages','Evidence','Audit history'],benefit:'Your safety rules and responsibilities stay visible end to end'},
  learning:{index:'03 / 04',title:'Learning built around your courses',intro:'Organize content, practice and exams according to how your learners and administrators work',steps:[['Build course','Your structure'],['Learn & practice','Your assessments'],['Track progress','Your reports']],features:['Course structure','Quiz logic','Roles','Subscriptions'],benefit:'The learning journey follows your training program'},
  data:{index:'04 / 04',title:'The data your team needs, connected',intro:'Bring existing information into dashboards and alerts built around your own reporting questions',steps:[['Connect source','Your systems'],['Apply rules','Your metrics'],['Act on insight','Your alerts']],features:['API integrations','Custom KPIs','Dashboards','Notifications'],benefit:'Decisions based on the measures that matter to your business'}
};
const tailorTabs=qsa('.tailor-tab');
const tailorPanel=qs('#tailor-panel');
function activateTailor(key,focus=false){
  const info=tailorData[key];if(!info||!tailorPanel)return;
  const activeTab=tailorTabs.find(tab=>tab.dataset.tailor===key);
  tailorTabs.forEach(tab=>{const active=tab===activeTab;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
  tailorPanel.setAttribute('aria-labelledby',activeTab.id);
  [['#tailor-count',info.index],['#tailor-title',info.title],['#tailor-intro',info.intro],['#tailor-benefit',info.benefit]].forEach(([sel,value])=>{const el=qs(sel);if(el)el.textContent=value});
  info.steps.forEach(([title,sub],i)=>{const n=i+1;qs('#tailor-step-'+n).textContent=title;qs('#tailor-step-sub-'+n).textContent=sub});
  const feats=qs('#tailor-features');if(feats)feats.replaceChildren(...info.features.map(label=>{const el=document.createElement('span');el.textContent=label;return el}));
  tailorPanel.classList.remove('tailor-swap');if(!motionReduced){void tailorPanel.offsetWidth;tailorPanel.classList.add('tailor-swap')}
  if(focus)activeTab.focus();
}
tailorTabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>activateTailor(tab.dataset.tailor));
  tab.addEventListener('keydown',e=>{
    const delta=(e.key==='ArrowDown'||e.key==='ArrowRight')?1:(e.key==='ArrowUp'||e.key==='ArrowLeft')?-1:0;
    if(delta){e.preventDefault();const next=tailorTabs[(i+delta+tailorTabs.length)%tailorTabs.length];activateTailor(next.dataset.tailor,true)}
    if(e.key==='Home'||e.key==='End'){e.preventDefault();const next=tailorTabs[e.key==='Home'?0:tailorTabs.length-1];activateTailor(next.dataset.tailor,true)}
  });
});
