const SECTIONS=[
  {name:'Personal',path:'content/personal.json',desc:'Name, role, bio, contact & social links'},
  {name:'About',path:'content/about.json',desc:'About text, what you do, interests'},
  {name:'Projects',path:'content/projects.json',desc:'Portfolio projects — add, edit, delete'},
  {name:'Skills',path:'content/skills.json',desc:'Skill icons & tools list'},
  {name:'Experience',path:'content/experience.json',desc:'Work & education timeline'},
  {name:'Navigation',path:'content/nav.json',desc:'Menu links on the website'},
];
const CATEGORIES=['WordPress','React','CMS','Other'];
let files=[],active='',data=null,media=[],openIdx=null;
const root=document.getElementById('root');
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
async function api(url,opt){const r=await fetch(url,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Request failed');return d}
function status(t,c=''){const e=document.getElementById('status');if(e){e.textContent=t;e.className='status '+c}}
function slugify(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'new-item'}
function badgeClass(cat){if(cat==='WordPress')return 'badge-wp';if(cat==='React')return 'badge-react';if(cat==='CMS')return 'badge-cms';return 'badge-other'}
function field(labelText,html,hint){return `<div class="field"><div class="label">${labelText}${hint?` <span class="hint">${hint}</span>`:''}</div>${html}</div>`}
function input(key,val,ph='',type='text'){if(type==='textarea')return `<textarea class="control textarea" data-key="${key}" placeholder="${esc(ph)}">${esc(val||'')}</textarea>`;return `<input class="control" type="${type}" data-key="${key}" value="${esc(val||'')}" placeholder="${esc(ph)}">`}

function uiPersonal(){
  const d=data;
  return `<div class="section-block"><div class="section-title">Basic Info</div><div class="grid2">${field('Full Name',input('name',d.name,'Abhishek Thakur'))}${field('Role / Title',input('role',d.role,'Junior Web Designer'))}</div>${field('Greeting',input('greeting',d.greeting,"Hi, I'm"))}${field('Bio',input('bio',d.bio,'Short intro', 'textarea'))}</div>
  <div class="section-block"><div class="section-title">Contact</div><div class="grid2">${field('Email',input('email',d.email,'you@email.com','email'))}${field('Phone',input('phone',d.phone,'+91 ...'))}</div><div class="grid2">${field('Location',input('location',d.location,'India — Remote'))}${field('Availability',input('availability',d.availability,'Available for freelance'))}</div>${field('Working Hours',input('workingHours',d.workingHours,'Full-time / Remote'))}</div>
  <div class="section-block"><div class="section-title">Social & Links</div><div class="grid2">${field('GitHub',input('github',d.github,'https://github.com/...'))}${field('LinkedIn',input('linkedin',d.linkedin,'https://linkedin.com/in/...'))}</div><div class="grid2">${field('Twitter / X',input('twitter',d.twitter,'https://x.com/...'))}${field('Resume URL',input('resumeUrl',d.resumeUrl,'/media/resume.pdf'))}</div>
  ${field('Photo URL',`<div class="img-row">${d.photo?`<img class="img-preview" src="${esc(d.photo)}" onerror="this.style.opacity=.3">`:''}<div style="flex:1">${input('photo',d.photo,'https://... or /media/...')}<div style="margin-top:8px;display:flex;gap:6px"><label class="btn sm">Upload photo<input hidden type="file" accept="image/*" data-upload-key="photo"></label>${d.photo?`<button type="button" class="btn sm" data-clear-key="photo">Clear</button>`:''}</div></div></div>`)}</div>
  <div class="section-block"><div class="section-title">Buttons (CTAs)</div><div class="grid2">${field('Primary Button Text',input('ctaPrimary',d.ctaPrimary,'View My Projects'))}${field('Secondary Button Text',input('ctaSecondary',d.ctaSecondary,'Download Resume'))}</div></div>
  <div class="section-block"><div class="section-title">Stats</div>
  ${(Array.isArray(d.stats)?d.stats:[]).map((s,i)=>`<div class="item-card open" style="border-color:#1e293b;margin-bottom:8px"><div class="item-body" style="display:block;padding:12px 14px;border:0"><div class="grid2"><div class="field" style="margin:0">${field('Value',`<input class="control" data-stat="${i}.value" value="${esc(s.value||'')}" placeholder="1+">`)}</div><div class="field" style="margin:0">${field('Label',`<input class="control" data-stat="${i}.label" value="${esc(s.label||'')}" placeholder="Years Experience">`)}</div></div><div style="text-align:right;margin-top:8px"><button type="button" class="btn danger sm" data-del-stat="${i}">Delete</button></div></div></div>`).join('')}
  <button type="button" class="btn sm" id="addStat">+ Add Stat</button></div>`;
}

function uiAbout(){
  const d=data;const paras=Array.isArray(d.paragraphs)?d.paragraphs:[];const what=Array.isArray(d.whatIDo)?d.whatIDo:[];const ints=Array.isArray(d.interests)?d.interests:[];
  return `<div class="section-block"><div class="section-title">Heading</div>${field('Section Heading',input('heading',d.heading,'A little about me'))}</div>
  <div class="section-block"><div class="section-title">Paragraphs</div>
  ${paras.map((p,i)=>`<div class="item-card" style="margin-bottom:10px"><div style="padding:12px 14px"><div class="label">Paragraph ${i+1}</div><textarea class="control textarea" data-para="${i}">${esc(p)}</textarea><div style="text-align:right;margin-top:8px"><button type="button" class="btn danger sm" data-del-para="${i}">Delete</button></div></div></div>`).join('')}
  <button type="button" class="btn sm" id="addPara">+ Add Paragraph</button></div>
  <div class="section-block"><div class="section-title">What I Do</div><div class="chips">${what.map((t,i)=>`<span class="chip">${esc(t)}<button type="button" data-rm-what="${i}">×</button></span>`).join('')}</div><div class="chip-add"><input class="control" id="whatInput" placeholder="e.g. Build Responsive Websites"><button type="button" class="btn sm" id="addWhat">Add</button></div></div>
  <div class="section-block"><div class="section-title">Interests</div><div class="chips">${ints.map((t,i)=>`<span class="chip">${esc(t)}<button type="button" data-rm-int="${i}">×</button></span>`).join('')}</div><div class="chip-add"><input class="control" id="intInput" placeholder="e.g. UI/UX"><button type="button" class="btn sm" id="addInt">Add</button></div></div>`;
}

function uiProjects(){
  if(!Array.isArray(data.items))data.items=[];const items=data.items;
  let html=`<div class="item-toolbar"><div class="item-count"><strong>${items.length}</strong> project${items.length!==1?'s':''}</div><button type="button" class="btn primary" id="addProject">+ Add Project</button></div>`;
  if(!items.length){html+=`<div class="empty-state"><p>No projects yet.</p><button type="button" class="btn primary" id="addProjectEmpty">+ Add first project</button></div>`;return html}
  html+=`<div class="item-list">`;
  items.forEach((p,i)=>{
    const open=openIdx===i;const cat=p.category||'Other';const tags=Array.isArray(p.tags)?p.tags:[];
    html+=`<div class="item-card ${open?'open':''}"><div class="item-head" data-toggle="${i}"><div class="item-num">${i+1}</div><div class="item-info"><div class="item-title">${esc(p.title||'Untitled')}</div><div class="item-meta"><span class="badge ${badgeClass(cat)}">${esc(cat)}</span>${p.platform?`<span>${esc(p.platform)}</span>`:''}${p.link&&String(p.link).startsWith('http')?'<span>↗ live</span>':''}</div></div><div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-del-proj="${i}">Delete</button></div><svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
    <div class="item-body"><div class="grid2">${field('Title',`<input class="control" data-p="${i}.title" value="${esc(p.title||'')}">`)}${field('Category',`<select class="control" data-p="${i}.category">${CATEGORIES.map(c=>`<option value="${c}" ${cat===c?'selected':''}>${c}</option>`).join('')}</select>`)}</div>
    <div class="grid2">${field('Platform',`<input class="control" data-p="${i}.platform" value="${esc(p.platform||'')}" placeholder="WordPress · Elementor">`,'e.g. WordPress · Beaver Builder')}${field('Live Link',`<input class="control" data-p="${i}.link" value="${esc(p.link||'')}" placeholder="https://...">`)}</div>
    ${field('Description',`<textarea class="control textarea" data-p="${i}.description">${esc(p.description||'')}</textarea>`)}
    <div class="field"><div class="label">Tags</div><div class="chips">${tags.map((t,ti)=>`<span class="chip">${esc(t)}<button type="button" data-rm-tag="${i}.${ti}">×</button></span>`).join('')}</div><div class="chip-add"><input class="control" data-tag-in="${i}" placeholder="Add tag + Enter"><button type="button" class="btn sm" data-add-tag="${i}">Add</button></div></div>
    <div class="grid2">${field('Image URL',`<input class="control" data-p="${i}.image" value="${esc(p.image||'')}" placeholder="/media/...">`,'optional')}${field('ID',`<input class="control" data-p="${i}.id" value="${esc(p.id||'')}" placeholder="project-slug">`,'auto from title')}</div>
    <div style="text-align:right;margin-top:8px"><button type="button" class="btn danger sm" data-del-proj="${i}">Delete this project</button></div></div></div>`;
  });
  html+=`</div>`;return html;
}

function uiSkills(){
  if(!Array.isArray(data.skillIcons))data.skillIcons=[];if(!Array.isArray(data.otherTools))data.otherTools=[];
  const icons=data.skillIcons;const tools=data.otherTools;
  return `<div class="section-block"><div class="section-title">Skill Icons</div><div class="skill-grid">${icons.map((s,i)=>`<div class="skill-card"><div class="color-dot" style="background:${esc(s.color||'#3b82f6')}"></div><div style="flex:1;min-width:0"><input class="control" data-sk="${i}.name" value="${esc(s.name||'')}" placeholder="Skill name"><input class="control" data-sk="${i}.color" value="${esc(s.color||'#3b82f6')}" placeholder="#hex" style="margin-top:6px"></div><button type="button" class="btn danger sm" data-del-sk="${i}">×</button></div>`).join('')}</div><button type="button" class="btn sm" id="addSkill" style="margin-top:12px">+ Add Skill Icon</button></div>
  <div class="section-block"><div class="section-title">Other Tools</div><div class="chips">${tools.map((t,i)=>`<span class="chip">${esc(t)}<button type="button" data-rm-tool="${i}">×</button></span>`).join('')}</div><div class="chip-add"><input class="control" id="toolInput" placeholder="e.g. GitHub"><button type="button" class="btn sm" id="addTool">Add</button></div></div>`;
}

function uiExperience(){
  if(!Array.isArray(data.items))data.items=[];const items=data.items;
  let html=`<div class="item-toolbar"><div class="item-count"><strong>${items.length}</strong> entr${items.length!==1?'ies':'y'}</div><button type="button" class="btn primary" id="addExp">+ Add Entry</button></div>`;
  if(!items.length){html+=`<div class="empty-state"><p>No experience entries yet.</p></div>`;return html}
  html+=`<div class="item-list">`;
  items.forEach((e,i)=>{
    const open=openIdx===i;const tags=Array.isArray(e.tags)?e.tags:[];
    html+=`<div class="item-card ${open?'open':''}"><div class="item-head" data-toggle="${i}"><div class="item-num">${i+1}</div><div class="item-info"><div class="item-title">${esc(e.title||'Untitled')}</div><div class="item-meta"><span class="badge badge-exp">${esc(e.period||'')}</span></div></div><div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-del-exp="${i}">Delete</button></div><svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
    <div class="item-body"><div class="grid2">${field('Title',`<input class="control" data-e="${i}.title" value="${esc(e.title||'')}" placeholder="Junior Web Designer · Company">`)}${field('Period',`<input class="control" data-e="${i}.period" value="${esc(e.period||'')}" placeholder="2025 – Present">`)}</div>
    ${field('Description',`<textarea class="control textarea" data-e="${i}.description">${esc(e.description||'')}</textarea>`)}
    <div class="field"><div class="label">Tags</div><div class="chips">${tags.map((t,ti)=>`<span class="chip">${esc(t)}<button type="button" data-rm-etag="${i}.${ti}">×</button></span>`).join('')}</div><div class="chip-add"><input class="control" data-etag-in="${i}" placeholder="Add tag"><button type="button" class="btn sm" data-add-etag="${i}">Add</button></div></div></div></div>`;
  });
  html+=`</div>`;return html;
}

function uiNav(){
  if(!Array.isArray(data.links))data.links=[];const links=data.links;
  return `<div class="section-block"><div class="section-title">Menu Links</div><div class="item-list">${links.map((l,i)=>`<div class="item-card open" style="border-color:#1e293b"><div class="item-body" style="display:block;padding:12px 14px;border:0"><div class="grid2">${field('Label',`<input class="control" data-nav="${i}.label" value="${esc(l.label||'')}" placeholder="Home">`)}${field('Link (href)',`<input class="control" data-nav="${i}.href" value="${esc(l.href||'')}" placeholder="#home">`)}</div><div style="text-align:right;margin-top:8px"><button type="button" class="btn danger sm" data-del-nav="${i}">Delete</button></div></div></div>`).join('')}</div><button type="button" class="btn sm" id="addNav" style="margin-top:10px">+ Add Link</button></div>`;
}

function sectionKey(){if(active.includes('personal'))return 'personal';if(active.includes('about'))return 'about';if(active.includes('projects'))return 'projects';if(active.includes('skills'))return 'skills';if(active.includes('experience'))return 'experience';if(active.includes('nav'))return 'nav';return ''}

function renderEditor(){
  const el=document.getElementById('editor');if(!el||!data)return;
  const key=sectionKey();
  if(key==='personal')el.innerHTML=uiPersonal();
  else if(key==='about')el.innerHTML=uiAbout();
  else if(key==='projects')el.innerHTML=uiProjects();
  else if(key==='skills')el.innerHTML=uiSkills();
  else if(key==='experience')el.innerHTML=uiExperience();
  else if(key==='nav')el.innerHTML=uiNav();
  else el.innerHTML='<p class="status">Unknown section</p>';
  bindUI();
}

function markDirty(){status('Unsaved changes — click Publish to save')}

function bindUI(){
  document.querySelectorAll('[data-key]').forEach(e=>{const h=()=>{data[e.dataset.key]=e.value;markDirty()};e.oninput=h;e.onchange=h});
  document.querySelectorAll('[data-clear-key]').forEach(b=>{b.onclick=()=>{data[b.dataset.clearKey]='';markDirty();renderEditor()}});
  document.querySelectorAll('[data-upload-key]').forEach(e=>{e.onchange=async(ev)=>{const f=ev.target.files?.[0];if(!f)return;if(!/^image\//.test(f.type))return status('Only images','error');if(f.size>8*1024*1024)return status('Max 8 MB','error');status('Uploading…');const r=new FileReader();r.onload=async()=>{try{const d=await api('/api/admin/media',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:f.name,dataUrl:r.result})});data[e.dataset.uploadKey]=d.url;status('Uploaded. Publish to save.','success');renderEditor()}catch(x){status(x.message,'error')}};r.readAsDataURL(f)}});
  document.querySelectorAll('[data-stat]').forEach(e=>{e.oninput=()=>{const[i,k]=e.dataset.stat.split('.');if(!data.stats[i])return;data.stats[i][k]=e.value;markDirty()}});
  document.querySelectorAll('[data-del-stat]').forEach(b=>{b.onclick=()=>{data.stats.splice(Number(b.dataset.delStat),1);markDirty();renderEditor()}});
  const addStat=document.getElementById('addStat');if(addStat)addStat.onclick=()=>{if(!Array.isArray(data.stats))data.stats=[];data.stats.push({value:'0',label:'Label'});markDirty();renderEditor()};
  document.querySelectorAll('[data-para]').forEach(e=>{e.oninput=()=>{data.paragraphs[Number(e.dataset.para)]=e.value;markDirty()}});
  document.querySelectorAll('[data-del-para]').forEach(b=>{b.onclick=()=>{data.paragraphs.splice(Number(b.dataset.delPara),1);markDirty();renderEditor()}});
  const addPara=document.getElementById('addPara');if(addPara)addPara.onclick=()=>{if(!Array.isArray(data.paragraphs))data.paragraphs=[];data.paragraphs.push('');markDirty();renderEditor()};
  const addWhat=document.getElementById('addWhat');if(addWhat)addWhat.onclick=()=>{const inp=document.getElementById('whatInput');const v=(inp?.value||'').trim();if(!v)return;if(!Array.isArray(data.whatIDo))data.whatIDo=[];data.whatIDo.push(v);if(inp)inp.value='';markDirty();renderEditor()};
  document.querySelectorAll('[data-rm-what]').forEach(b=>{b.onclick=()=>{data.whatIDo.splice(Number(b.dataset.rmWhat),1);markDirty();renderEditor()}});
  const addInt=document.getElementById('addInt');if(addInt)addInt.onclick=()=>{const inp=document.getElementById('intInput');const v=(inp?.value||'').trim();if(!v)return;if(!Array.isArray(data.interests))data.interests=[];data.interests.push(v);if(inp)inp.value='';markDirty();renderEditor()};
  document.querySelectorAll('[data-rm-int]').forEach(b=>{b.onclick=()=>{data.interests.splice(Number(b.dataset.rmInt),1);markDirty();renderEditor()}});
  document.querySelectorAll('[data-toggle]').forEach(el=>{el.onclick=()=>{const i=Number(el.dataset.toggle);openIdx=openIdx===i?null:i;renderEditor()}});
  document.querySelectorAll('[data-p]').forEach(e=>{const h=()=>{const[i,k]=e.dataset.p.split('.');if(!data.items[i])return;data.items[i][k]=e.value;if(k==='title'&&(!data.items[i].id||String(data.items[i].id).startsWith('new-')))data.items[i].id=slugify(e.value);markDirty()};e.oninput=h;e.onchange=h});
  document.querySelectorAll('[data-del-proj]').forEach(b=>{b.onclick=(ev)=>{ev.stopPropagation();const i=Number(b.dataset.delProj);const name=data.items[i]?.title||'this project';if(!confirm(`Delete "${name}"?`))return;data.items.splice(i,1);if(openIdx===i)openIdx=null;else if(openIdx!==null&&openIdx>i)openIdx--;markDirty();renderEditor()}});
  const addProj=()=>{data.items.push({id:'new-'+Date.now(),title:'New Project',description:'',tags:[],category:'WordPress',platform:'',image:'',link:'#'});openIdx=data.items.length-1;markDirty();renderEditor()};
  const ap=document.getElementById('addProject');if(ap)ap.onclick=addProj;const ape=document.getElementById('addProjectEmpty');if(ape)ape.onclick=addProj;
  document.querySelectorAll('[data-add-tag]').forEach(b=>{b.onclick=()=>{const i=Number(b.dataset.addTag);const inp=document.querySelector(`[data-tag-in="${i}"]`);const v=(inp?.value||'').trim();if(!v)return;if(!Array.isArray(data.items[i].tags))data.items[i].tags=[];data.items[i].tags.push(v);if(inp)inp.value='';markDirty();renderEditor()}});
  document.querySelectorAll('[data-tag-in]').forEach(inp=>{inp.onkeydown=(e)=>{if(e.key!=='Enter')return;e.preventDefault();const i=Number(inp.dataset.tagIn);const v=inp.value.trim();if(!v)return;if(!Array.isArray(data.items[i].tags))data.items[i].tags=[];data.items[i].tags.push(v);inp.value='';markDirty();renderEditor()}});
  document.querySelectorAll('[data-rm-tag]').forEach(b=>{b.onclick=()=>{const[i,ti]=b.dataset.rmTag.split('.').map(Number);data.items[i].tags.splice(ti,1);markDirty();renderEditor()}});
  document.querySelectorAll('[data-sk]').forEach(e=>{e.oninput=()=>{const[i,k]=e.dataset.sk.split('.');if(!data.skillIcons[i])return;data.skillIcons[i][k]=e.value;markDirty();if(k==='color'){const card=e.closest('.skill-card');const dot=card?.querySelector('.color-dot');if(dot)dot.style.background=e.value}}});
  document.querySelectorAll('[data-del-sk]').forEach(b=>{b.onclick=()=>{data.skillIcons.splice(Number(b.dataset.delSk),1);markDirty();renderEditor()}});
  const addSkill=document.getElementById('addSkill');if(addSkill)addSkill.onclick=()=>{data.skillIcons.push({name:'New Skill',color:'#3b82f6'});markDirty();renderEditor()};
  const addTool=document.getElementById('addTool');if(addTool)addTool.onclick=()=>{const inp=document.getElementById('toolInput');const v=(inp?.value||'').trim();if(!v)return;data.otherTools.push(v);if(inp)inp.value='';markDirty();renderEditor()};
  document.querySelectorAll('[data-rm-tool]').forEach(b=>{b.onclick=()=>{data.otherTools.splice(Number(b.dataset.rmTool),1);markDirty();renderEditor()}});
  document.querySelectorAll('[data-e]').forEach(e=>{const h=()=>{const[i,k]=e.dataset.e.split('.');if(!data.items[i])return;data.items[i][k]=e.value;markDirty()};e.oninput=h;e.onchange=h});
  document.querySelectorAll('[data-del-exp]').forEach(b=>{b.onclick=(ev)=>{ev.stopPropagation();const i=Number(b.dataset.delExp);if(!confirm(`Delete "${data.items[i]?.title||'this entry'}"?`))return;data.items.splice(i,1);if(openIdx===i)openIdx=null;else if(openIdx!==null&&openIdx>i)openIdx--;markDirty();renderEditor()}});
  const addExp=document.getElementById('addExp');if(addExp)addExp.onclick=()=>{data.items.push({period:'',title:'New Role',description:'',tags:[]});openIdx=data.items.length-1;markDirty();renderEditor()};
  document.querySelectorAll('[data-add-etag]').forEach(b=>{b.onclick=()=>{const i=Number(b.dataset.addEtag);const inp=document.querySelector(`[data-etag-in="${i}"]`);const v=(inp?.value||'').trim();if(!v)return;if(!Array.isArray(data.items[i].tags))data.items[i].tags=[];data.items[i].tags.push(v);if(inp)inp.value='';markDirty();renderEditor()}});
  document.querySelectorAll('[data-rm-etag]').forEach(b=>{b.onclick=()=>{const[i,ti]=b.dataset.rmEtag.split('.').map(Number);data.items[i].tags.splice(ti,1);markDirty();renderEditor()}});
  document.querySelectorAll('[data-nav]').forEach(e=>{e.oninput=()=>{const[i,k]=e.dataset.nav.split('.');if(!data.links[i])return;data.links[i][k]=e.value;markDirty()}});
  document.querySelectorAll('[data-del-nav]').forEach(b=>{b.onclick=()=>{data.links.splice(Number(b.dataset.delNav),1);markDirty();renderEditor()}});
  const addNav=document.getElementById('addNav');if(addNav)addNav.onclick=()=>{data.links.push({href:'#',label:'New Link'});markDirty();renderEditor()};
}

async function loadFile(path){active=path;data=null;openIdx=null;render();status('Loading…');try{const d=await api('/api/admin/content?path='+encodeURIComponent(path));data=JSON.parse(d.content);renderEditor();status('Synced from GitHub','success')}catch(e){status(e.message,'error')}}
async function save(){if(!data)return;status('Publishing…');try{await api('/api/admin/content?path='+encodeURIComponent(active),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:JSON.stringify(data,null,2)})});status('Published. Vercel will rebuild automatically.','success')}catch(e){status(e.message,'error')}}
async function logout(){try{await fetch('/api/admin/logout',{method:'POST'})}catch{}document.cookie='cms_session=; Path=/; Max-Age=0';showLogin()}
async function loadMedia(){try{const d=await api('/api/admin/media');media=d.files||[]}catch{media=[]}}
function navHtml(){return `<div class="group">Website</div>`+SECTIONS.map(s=>`<button type="button" class="${s.path===active?'active':''}" data-file="${s.path}">${s.name}</button>`).join('')}
function showLogin(){root.innerHTML=`<div class="login-wrap"><section class="login-card"><h1>Portfolio <span class="blue">CMS</span></h1><p class="sub">Sign in with GitHub to edit your portfolio content.</p><a class="btn primary" href="/api/admin/login">Login with GitHub</a></section></div>`}
function currentSection(){return SECTIONS.find(s=>s.path===active)||{name:'Content',desc:''}}
function render(){
  const sec=currentSection();
  root.innerHTML=`<div class="app"><aside class="side" id="side"><div class="brand">Portfolio <span class="blue">CMS</span></div><nav class="nav">${navHtml()}<div class="group">Media</div><button type="button" data-media="1">Media Library</button><div class="group">Account</div><button type="button" id="logoutSide" style="color:#fca5a5">Logout</button></nav></aside>
  <main class="main"><div class="top"><div><button type="button" class="btn mobile" id="menu">☰</button><div class="eyebrow">Content control</div><h1>${sec.name}</h1><p class="sub">${sec.desc}</p></div>
  <div class="actions"><button type="button" class="btn" id="refresh">↻ Sync</button><a class="btn" href="/" target="_blank">View Website</a><button type="button" class="btn primary" id="publish">Publish Changes</button></div></div>
  <section class="card editor"><div class="editorhead"><div><h2>${sec.name}</h2><div id="status" class="status">Ready</div></div></div><div id="editor"></div></section></main></div>`;
  document.querySelectorAll('[data-file]').forEach(b=>b.onclick=()=>loadFile(b.dataset.file));
  document.getElementById('publish').onclick=save;
  document.getElementById('refresh').onclick=async()=>{await loadMedia();if(active)loadFile(active)};
  document.getElementById('menu').onclick=()=>document.getElementById('side').classList.toggle('open');
  document.getElementById('logoutSide').onclick=logout;
  if(data)renderEditor();
}
async function mediaView(){
  await loadMedia();
  root.innerHTML=`<div class="app"><aside class="side"><div class="brand">Portfolio <span class="blue">CMS</span></div><nav class="nav">${navHtml()}<div class="group">Account</div><button type="button" id="logoutSide" style="color:#fca5a5">Logout</button></nav></aside>
  <main class="main"><div class="top"><div><div class="eyebrow">Assets</div><h1>Media Library</h1><p class="sub">Upload images or PDF</p></div><div class="actions"><label class="btn primary">Upload file<input hidden type="file" accept="image/*,application/pdf,.pdf" id="mediaInput"></label></div></div>
  <section class="card editor"><div class="media">${media.length?media.map(m=>`<div class="asset">${m.isPdf||/\.pdf$/i.test(m.name)?'<div class="pdf-thumb">PDF</div>':`<img src="${esc(m.url)}">`}<small>${esc(m.name)}</small><button type="button" class="btn sm" data-copy="${esc(m.url)}">Copy path</button><button type="button" class="btn danger sm" data-delmedia="${esc(m.path)}">Delete</button></div>`).join(''):'<div class="status">No files yet.</div>'}</div></section></main></div>`;
  document.getElementById('mediaInput').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>8*1024*1024)return alert('Max 8 MB');const r=new FileReader();r.onload=async()=>{try{await api('/api/admin/media',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:f.name,dataUrl:r.result})});mediaView()}catch(x){alert(x.message)}};r.readAsDataURL(f)};
  document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>navigator.clipboard?.writeText(b.dataset.copy));
  document.querySelectorAll('[data-delmedia]').forEach(b=>b.onclick=async()=>{if(!confirm('Delete?'))return;try{await api('/api/admin/media?path='+encodeURIComponent(b.dataset.delmedia),{method:'DELETE'});mediaView()}catch(x){alert(x.message)}});
  document.querySelectorAll('[data-file]').forEach(b=>b.onclick=()=>loadFile(b.dataset.file));
  document.getElementById('logoutSide').onclick=logout;
}
async function start(){try{await api('/api/admin/content?path='+encodeURIComponent(SECTIONS[0].path));await loadMedia();active=SECTIONS[0].path;await loadFile(active);document.addEventListener('click',e=>{if(e.target.closest('[data-media]'))mediaView()})}catch{showLogin()}}
start();
