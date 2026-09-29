const SECTIONS=[
  {name:'Personal',path:'content/personal.json',desc:'Name, role, bio, contact & social links'},
  {name:'About',path:'content/about.json',desc:'About heading and paragraphs'},
  {name:'Projects',path:'content/projects.json',desc:'Portfolio projects'},
  {name:'Skills',path:'content/skills.json',desc:'Skill icons & tools'},
  {name:'Experience',path:'content/experience.json',desc:'Work timeline'},
  {name:'Navigation',path:'content/nav.json',desc:'Menu links'},
  {name:'Site Settings',path:'content/site.json',desc:'SEO, visibility, header, footer'},
  {name:'Social Links',path:'content/socials.json',desc:'Social profiles'},
  {name:'Hero',path:'content/hero.json',desc:'Hero section'},
  {name:'Education',path:'content/education.json',desc:'Education entries'},
  {name:'Testimonials',path:'content/testimonials.json',desc:'Client testimonials'},
  {name:'Certifications',path:'content/certifications.json',desc:'Certificates'}
];
let active='',data=null;
const root=document.getElementById('root');
const esc=s=>String(s??'').replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
async function api(url,opt){const r=await fetch(url,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Request failed');return d}
function status(t,c=''){const e=document.getElementById('status');if(e){e.textContent=t;e.className='status '+c}}
function field(label,html){return `<div class="field"><div class="label">${label}</div>${html}</div>`}
function input(key,val,ph=''){const multi=String(val||'').length>80;return multi?`<textarea class="control textarea" data-key="${key}">${esc(val||'')}</textarea>`:`<input class="control" data-key="${key}" value="${esc(val||'')}" placeholder="${esc(ph)}">`}
function renderEditor(){
  const el=document.getElementById('editor');if(!el||!data)return;
  if(Array.isArray(data.items)||Array.isArray(data.links)||Array.isArray(data.skillIcons)||Array.isArray(data.features)||Array.isArray(data.steps)||Array.isArray(data.faqs)){
    el.innerHTML='<pre class="control" style="white-space:pre-wrap;min-height:300px;font-size:12px" contenteditable="true" id="jsonEdit">'+esc(JSON.stringify(data,null,2))+'</pre><p class="status">JSON editor — edit carefully then Publish</p>';
    const je=document.getElementById('jsonEdit');
    if(je)je.oninput=()=>{try{data=JSON.parse(je.innerText);status('Unsaved changes')}catch{status('Invalid JSON','error')}};
    return;
  }
  el.innerHTML=Object.keys(data).map(k=>{
    const v=data[k];
    if(v!==null&&typeof v==='object')return field(k,`<pre class="control" style="white-space:pre-wrap;font-size:12px" contenteditable="true" data-obj="${k}">${esc(JSON.stringify(v,null,2))}</pre>`);
    return field(k,input(k,v));
  }).join('');
  document.querySelectorAll('[data-key]').forEach(e=>{e.oninput=()=>{data[e.dataset.key]=e.value;status('Unsaved changes')}});
  document.querySelectorAll('[data-obj]').forEach(e=>{e.oninput=()=>{try{data[e.dataset.obj]=JSON.parse(e.innerText);status('Unsaved changes')}catch{status('Invalid JSON in '+e.dataset.obj,'error')}}});
}
async function loadFile(path){active=path;data=null;render();status('Loading…');try{const d=await api('/api/admin/content?path='+encodeURIComponent(path));data=JSON.parse(d.content);renderEditor();status('Synced','success')}catch(e){status(e.message,'error')}}
async function save(){if(!data)return;if(!confirm('Publish to GitHub?'))return;status('Publishing…');try{await api('/api/admin/content?path='+encodeURIComponent(active),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:JSON.stringify(data,null,2)})});status('Published. Vercel will rebuild.','success')}catch(e){status(e.message,'error')}}
function showLogin(){root.innerHTML=`<div class="login-wrap"><section class="login-card"><h1>Portfolio <span class="blue">CMS</span></h1><p class="sub">Sign in with GitHub to manage content.</p><a class="btn primary" href="/api/admin/login">Login with GitHub</a></section></div>`}
function render(){
  const sec=SECTIONS.find(s=>s.path===active)||{name:'Content',desc:''};
  root.innerHTML=`<div class="app"><aside class="side" id="side"><div class="brand">Portfolio <span class="blue">CMS</span></div><nav class="nav"><div class="group">Content</div>${SECTIONS.map(s=>`<button type="button" class="${s.path===active?'active':''}" data-file="${s.path}">${s.name}</button>`).join('')}<div class="group">Account</div><button type="button" id="logoutSide" style="color:#fca5a5">Logout</button></nav></aside><main class="main"><div class="top"><div><button type="button" class="btn mobile" id="menu">☰</button><div class="eyebrow">Content control</div><h1>${sec.name}</h1><p class="sub">${sec.desc||''}</p></div><div class="actions"><a class="btn" href="/" target="_blank">Preview</a><button type="button" class="btn primary" id="publish">Publish Changes</button></div></div><section class="card editor"><div class="editorhead"><div><h2>${sec.name}</h2><div id="status" class="status">Ready</div></div></div><div id="editor"></div></section></main></div>`;
  document.querySelectorAll('[data-file]').forEach(b=>b.onclick=()=>loadFile(b.dataset.file));
  document.getElementById('publish').onclick=save;
  document.getElementById('menu').onclick=()=>document.getElementById('side').classList.toggle('open');
  document.getElementById('logoutSide').onclick=async()=>{try{await fetch('/api/admin/logout',{method:'POST'})}catch{}document.cookie='cms_session=; Path=/; Max-Age=0';showLogin()};
  if(data)renderEditor();
}
async function start(){try{await api('/api/admin/content?path='+encodeURIComponent(SECTIONS[0].path));active=SECTIONS[0].path;await loadFile(active)}catch{showLogin()}}
start();
