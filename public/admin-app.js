const S=[
{n:"Personal",p:"content/personal.json"},
{n:"Hero",p:"content/hero.json"},
{n:"About",p:"content/about.json"},
{n:"Projects",p:"content/projects.json"},
{n:"Skills",p:"content/skills.json"},
{n:"Experience",p:"content/experience.json"},
{n:"Education",p:"content/education.json"},
{n:"Testimonials",p:"content/testimonials.json"},
{n:"Navigation",p:"content/nav.json"},
{n:"Social Links",p:"content/socials.json"},
{n:"Site Settings",p:"content/site.json"}
];
let A="",D=null,O=null;
const R=document.getElementById("root");
function esc(s){
  return String(s==null?"":s)
    .split("&").join("&")
    .split("<").join("<")
    .split(">").join(">")
    .split('"').join(""");
}
async function api(u,o){
  const r=await fetch(u,o);
  const d=await r.json().catch(function(){return {};});
  if(!r.ok)throw Error(d.error||"Request failed");
  return d;
}
function st(t,c){
  var x=document.getElementById("status");
  if(x){x.textContent=t;x.className="status "+(c||"");}
}
function dirty(){st("Unsaved changes — click Publish");}
function F(l,h){return '<div class="field"><div class="label">'+l+'</div>'+h+'</div>';}
function I(k,v,ph,ta){
  if(ta) return '<textarea class="control textarea" data-k="'+k+'">'+esc(v)+'</textarea>';
  return '<input class="control" data-k="'+k+'" value="'+esc(v)+'" placeholder="'+esc(ph||'')+'">';
}
function key(){
  var a=A;
  if(a.indexOf("personal")>=0)return "per";
  if(a.indexOf("hero")>=0)return "hero";
  if(a.indexOf("about")>=0)return "abt";
  if(a.indexOf("projects")>=0)return "prj";
  if(a.indexOf("skills")>=0)return "sk";
  if(a.indexOf("experience")>=0)return "exp";
  if(a.indexOf("education")>=0)return "edu";
  if(a.indexOf("testimonials")>=0)return "tes";
  if(a.indexOf("nav")>=0)return "nav";
  if(a.indexOf("socials")>=0)return "soc";
  if(a.indexOf("site")>=0)return "site";
  return "";
}
function uiPer(){
  var d=D;
  var stats=(d.stats||[]).map(function(s,i){
    return '<div class="item-card open" style="margin-bottom:8px"><div class="item-body" style="display:block;padding:12px"><div class="grid2">'+
      F("Value",'<input class="control" data-x="stats.'+i+'.value" value="'+esc(s.value||'')+'">')+
      F("Label",'<input class="control" data-x="stats.'+i+'.label" value="'+esc(s.label||'')+'">')+
      '</div><button type="button" class="btn danger sm" data-rm="stats.'+i+'">Delete</button></div></div>';
  }).join("");
  return '<div class="section-block"><div class="section-title">Basic Info</div><div class="grid2">'+
    F("Name",I("name",d.name||d.fullName||""))+F("Role",I("role",d.role||""))+
    '</div>'+F("Greeting",I("greeting",d.greeting||""))+F("Bio",I("bio",d.bio||"","" ,1))+'</div>'+
    '<div class="section-block"><div class="section-title">Contact</div><div class="grid2">'+
    F("Email",I("email",d.email||""))+F("Phone",I("phone",d.phone||""))+
    '</div><div class="grid2">'+F("Location",I("location",d.location||""))+F("Availability",I("availability",d.availability||""))+
    '</div></div>'+
    '<div class="section-block"><div class="section-title">Links</div><div class="grid2">'+
    F("GitHub",I("github",d.github||""))+F("LinkedIn",I("linkedin",d.linkedin||""))+
    '</div><div class="grid2">'+F("Resume URL",I("resumeUrl",d.resumeUrl||""))+F("Photo URL",I("photo",d.photo||""))+
    '</div></div>'+
    '<div class="section-block"><div class="section-title">Buttons</div><div class="grid2">'+
    F("Primary CTA",I("ctaPrimary",d.ctaPrimary||""))+F("Secondary CTA",I("ctaSecondary",d.ctaSecondary||""))+
    '</div></div>'+
    '<div class="section-block"><div class="section-title">Stats</div>'+stats+
    '<button type="button" class="btn sm" id="addStat">+ Add Stat</button></div>';
}
function uiHero(){
  var d=D;
  return '<div class="section-block"><div class="section-title">Hero Copy</div>'+
    F("Badge",I("statusPill",d.statusPill||d.badgeText||""))+
    F("Greeting",I("greeting",d.greeting||""))+
    F("Main Heading",I("mainHeading",d.mainHeading||""))+
    F("Highlight",I("bioHighlight",d.bioHighlight||d.highlightedText||""))+
    F("Tools line",I("bioTools",d.bioTools||""))+
    '<div class="grid2">'+F("Button 1 text",I("button1Text",d.button1Text||d.ctaPrimary||""))+F("Button 1 URL",I("button1Url",d.button1Url||"#projects"))+'</div>'+
    '<div class="grid2">'+F("Button 2 text",I("button2Text",d.button2Text||d.ctaSecondary||""))+F("Button 2 URL",I("button2Url",d.button2Url||"#contact"))+'</div></div>';
}
function uiAbt(){
  var p=D.paragraphs||[];
  var rows=p.map(function(x,i){
    return '<div class="item-card" style="margin-bottom:8px"><div style="padding:12px"><div class="label">Paragraph '+(i+1)+'</div>'+
      '<textarea class="control textarea" data-x="paragraphs.'+i+'">'+esc(x)+'</textarea>'+
      '<button type="button" class="btn danger sm" data-rm="paragraphs.'+i+'">Delete</button></div></div>';
  }).join("");
  return '<div class="section-block">'+F("Heading",I("heading",D.heading||""))+'</div>'+
    '<div class="section-block"><div class="section-title">Paragraphs</div>'+rows+
    '<button type="button" class="btn sm" id="addPara">+ Add Paragraph</button></div>';
}
function uiSk(){
  if(!D.skillIcons)D.skillIcons=[];
  if(!D.otherTools)D.otherTools=[];
  var cards=D.skillIcons.map(function(s,i){
    return '<div class="skill-card" style="flex-wrap:wrap">'+
      '<div class="color-dot" style="background:'+esc(s.color||"#3b82f6")+'"></div>'+
      '<div style="flex:1;min-width:120px">'+
      '<input class="control" data-x="skillIcons.'+i+'.name" value="'+esc(s.name||'')+'" placeholder="Skill name">'+
      '<div class="grid2" style="margin-top:6px;gap:6px">'+
      '<input class="control" data-x="skillIcons.'+i+'.color" value="'+esc(s.color||"#3b82f6")+'" placeholder="#hex">'+
      '<input class="control" data-x="skillIcons.'+i+'.category" value="'+esc(s.category||'')+'" placeholder="Category">'+
      '</div></div>'+
      '<button type="button" class="btn danger sm" data-rm="skillIcons.'+i+'">x</button></div>';
  }).join("");
  var tools=(D.otherTools||[]).map(function(t,i){
    return '<span class="chip">'+esc(t)+'<button type="button" data-rm="otherTools.'+i+'">x</button></span>';
  }).join("");
  return '<div class="section-block"><div class="section-title">Skill Icons</div><div class="skill-grid">'+cards+
    '</div><button type="button" class="btn sm" id="addSkill" style="margin-top:12px">+ Add Skill</button></div>'+
    '<div class="section-block"><div class="section-title">Other Tools</div><div class="chips">'+tools+
    '</div><div class="chip-add"><input class="control" id="toolIn" placeholder="e.g. Kajabi"><button type="button" class="btn sm" id="addTool">Add</button></div></div>';
}
function uiPrj(){
  if(!D.items)D.items=[];
  var list=D.items.map(function(p,i){
    var open=O===i?" open":"";
    return '<div class="item-card'+open+'"><div class="item-head" data-tg="'+i+'">'+
      '<div class="item-num">'+(i+1)+'</div><div class="item-info"><div class="item-title">'+esc(p.title||"Untitled")+'</div></div>'+
      '<div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="items.'+i+'">Del</button></div>'+
      '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>'+
      '<div class="item-body"><div class="grid2">'+
      F("Title",'<input class="control" data-x="items.'+i+'.title" value="'+esc(p.title||'')+'">')+
      F("Category",'<input class="control" data-x="items.'+i+'.category" value="'+esc(p.category||'')+'">')+
      '</div><div class="grid2">'+
      F("Platform",'<input class="control" data-x="items.'+i+'.platform" value="'+esc(p.platform||'')+'">')+
      F("Link",'<input class="control" data-x="items.'+i+'.link" value="'+esc(p.link||'')+'">')+
      '</div>'+
      F("Description",'<textarea class="control textarea" data-x="items.'+i+'.description">'+esc(p.description||'')+'</textarea>')+
      F("Image URL",'<input class="control" data-x="items.'+i+'.image" value="'+esc(p.image||'')+'">')+
      '</div></div>';
  }).join("");
  return '<div class="item-toolbar"><div class="item-count"><strong>'+D.items.length+'</strong> projects</div>'+
    '<button type="button" class="btn primary" id="addItem">+ Add Project</button></div><div class="item-list">'+list+'</div>';
}
function uiExp(){
  if(!D.items)D.items=[];
  var list=D.items.map(function(x,i){
    var open=O===i?" open":"";
    return '<div class="item-card'+open+'"><div class="item-head" data-tg="'+i+'">'+
      '<div class="item-num">'+(i+1)+'</div><div class="item-info"><div class="item-title">'+esc(x.title||"")+'</div>'+
      '<div class="item-meta"><span class="badge badge-exp">'+esc(x.period||"")+'</span></div></div>'+
      '<div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="items.'+i+'">Del</button></div>'+
      '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>'+
      '<div class="item-body"><div class="grid2">'+
      F("Title",'<input class="control" data-x="items.'+i+'.title" value="'+esc(x.title||'')+'">')+
      F("Period",'<input class="control" data-x="items.'+i+'.period" value="'+esc(x.period||'')+'">')+
      '</div>'+F("Description",'<textarea class="control textarea" data-x="items.'+i+'.description">'+esc(x.description||'')+'</textarea>')+
      '</div></div>';
  }).join("");
  return '<div class="item-toolbar"><div class="item-count"><strong>'+D.items.length+'</strong> entries</div>'+
    '<button type="button" class="btn primary" id="addItem">+ Add Entry</button></div><div class="item-list">'+list+'</div>';
}
function uiList(fields){
  if(!D.items)D.items=[];
  var list=D.items.map(function(it,i){
    var open=O===i?" open":"";
    var fieldsHtml=fields.map(function(f){
      return F(f,'<input class="control" data-x="items.'+i+'.'+f+'" value="'+esc(it[f]||'')+'">');
    }).join("");
    return '<div class="item-card'+open+'"><div class="item-head" data-tg="'+i+'">'+
      '<div class="item-num">'+(i+1)+'</div><div class="item-info"><div class="item-title">'+esc(it[fields[0]]||"Item")+'</div></div>'+
      '<div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="items.'+i+'">Del</button></div>'+
      '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>'+
      '<div class="item-body">'+fieldsHtml+'</div></div>';
  }).join("");
  return '<div class="item-toolbar"><div class="item-count"><strong>'+D.items.length+'</strong> items</div>'+
    '<button type="button" class="btn primary" id="addItem">+ Add</button></div><div class="item-list">'+list+'</div>';
}
function uiNav(){
  if(!D.links)D.links=[];
  var rows=D.links.map(function(l,i){
    return '<div class="item-card open" style="margin-bottom:8px"><div class="item-body" style="display:block;padding:12px"><div class="grid2">'+
      F("Label",'<input class="control" data-x="links.'+i+'.label" value="'+esc(l.label||'')+'">')+
      F("URL",'<input class="control" data-x="links.'+i+'.href" value="'+esc(l.href||'')+'">')+
      '</div><button type="button" class="btn danger sm" data-rm="links.'+i+'">Delete</button></div></div>';
  }).join("");
  return '<div class="section-block"><div class="section-title">Menu Links</div>'+rows+
    '<button type="button" class="btn sm" id="addNav">+ Add Link</button></div>';
}
function uiSite(){
  var d=D,v=d.sectionVisibility||{},h=d.header||{},f=d.footer||{};
  var secs=["hero","about","projects","skills","experience","contact","footer"];
  var vis=secs.map(function(s){
    return '<label class="skill-card" style="cursor:pointer"><input type="checkbox" data-vis="'+s+'" '+(v[s]!==false?"checked":"")+' style="width:18px;height:18px"> '+s+'</label>';
  }).join("");
  return '<div class="section-block"><div class="section-title">Identity</div><div class="grid2">'+
    F("Website Name",I("websiteName",d.websiteName||""))+F("Title",I("websiteTitle",d.websiteTitle||""))+
    '</div>'+F("Meta Title",I("metaTitle",d.metaTitle||""))+F("Meta Description",I("metaDescription",d.metaDescription||"","" ,1))+
    '</div><div class="section-block"><div class="section-title">Section Visibility</div><div class="skill-grid">'+vis+
    '</div></div><div class="section-block"><div class="section-title">Header / Footer</div><div class="grid2">'+
    F("Logo text",'<input class="control" data-x="header.logoText" value="'+esc(h.logoText||'')+'">')+
    F("CTA text",'<input class="control" data-x="header.ctaText" value="'+esc(h.ctaText||'')+'">')+
    '</div>'+F("Footer tagline",'<textarea class="control textarea" data-x="footer.tagline">'+esc(f.tagline||'')+'</textarea>')+
    F("Copyright",'<input class="control" data-x="footer.copyright" value="'+esc(f.copyright||'')+'">')+'</div>';
}
function setPath(path,val){
  var parts=path.split(".");
  var cur=D;
  for(var i=0;i<parts.length-1;i++){
    if(cur[parts[i]]==null)cur[parts[i]]={};
    cur=cur[parts[i]];
  }
  cur[parts[parts.length-1]]=val;
}
function rmPath(path){
  var parts=path.split(".");
  var cur=D;
  for(var i=0;i<parts.length-1;i++)cur=cur[parts[i]];
  var last=parts[parts.length-1];
  if(Array.isArray(cur))cur.splice(+last,1);
  else delete cur[last];
}
function draw(){
  var el=document.getElementById("editor");
  if(!el||!D)return;
  var k=key();
  var html="";
  if(k==="per")html=uiPer();
  else if(k==="hero")html=uiHero();
  else if(k==="abt")html=uiAbt();
  else if(k==="prj")html=uiPrj();
  else if(k==="sk")html=uiSk();
  else if(k==="exp")html=uiExp();
  else if(k==="edu")html=uiList(["institution","degree","startDate","endDate"]);
  else if(k==="tes")html=uiList(["clientName","company","text","rating"]);
  else if(k==="soc")html=uiList(["platform","label","url","icon"]);
  else if(k==="nav")html=uiNav();
  else if(k==="site")html=uiSite();
  else html='<p class="status">Unknown section</p>';
  el.innerHTML=html;
  bind();
}
function bind(){
  document.querySelectorAll("[data-k]").forEach(function(x){
    x.oninput=function(){D[x.getAttribute("data-k")]=x.value;if(x.getAttribute("data-k")==="name")D.fullName=x.value;dirty();};
  });
  document.querySelectorAll("[data-x]").forEach(function(x){
    x.oninput=function(){setPath(x.getAttribute("data-x"),x.value);dirty();};
  });
  document.querySelectorAll("[data-rm]").forEach(function(b){
    b.onclick=function(ev){ev.stopPropagation();if(!confirm("Delete?"))return;rmPath(b.getAttribute("data-rm"));O=null;dirty();draw();};
  });
  document.querySelectorAll("[data-tg]").forEach(function(x){
    x.onclick=function(){var i=+x.getAttribute("data-tg");O=O===i?null:i;draw();};
  });
  document.querySelectorAll("[data-vis]").forEach(function(x){
    x.onchange=function(){if(!D.sectionVisibility)D.sectionVisibility={};D.sectionVisibility[x.getAttribute("data-vis")]=x.checked;dirty();};
  });
  var as=document.getElementById("addStat");
  if(as)as.onclick=function(){if(!D.stats)D.stats=[];D.stats.push({value:"0",label:"Label"});dirty();draw();};
  var ap=document.getElementById("addPara");
  if(ap)ap.onclick=function(){if(!D.paragraphs)D.paragraphs=[];D.paragraphs.push("");dirty();draw();};
  var ai=document.getElementById("addItem");
  if(ai)ai.onclick=function(){
    if(!D.items)D.items=[];
    if(A.indexOf("projects")>=0)D.items.push({title:"New Project",tags:[],category:"WordPress",link:"#"});
    else D.items.push({});
    O=D.items.length-1;dirty();draw();
  };
  var ask=document.getElementById("addSkill");
  if(ask)ask.onclick=function(){D.skillIcons.push({name:"New Skill",color:"#3b82f6",category:"Frontend"});dirty();draw();};
  var at=document.getElementById("addTool");
  if(at)at.onclick=function(){var inp=document.getElementById("toolIn");var v=(inp&&inp.value||"").trim();if(!v)return;D.otherTools.push(v);if(inp)inp.value="";dirty();draw();};
  var an=document.getElementById("addNav");
  if(an)an.onclick=function(){if(!D.links)D.links=[];D.links.push({label:"New Link",href:"#"});dirty();draw();};
}
async function load(p){
  A=p;D=null;O=null;render();st("Loading...");
  try{
    var d=await api("/api/admin/content?path="+encodeURIComponent(p));
    D=JSON.parse(d.content);draw();st("Synced","success");
  }catch(err){st(err.message,"error");}
}
async function save(){
  if(!D)return;
  if(!confirm("Publish changes to GitHub?"))return;
  st("Publishing...");
  try{
    await api("/api/admin/content?path="+encodeURIComponent(A),{
      method:"PUT",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({content:JSON.stringify(D,null,2)})
    });
    st("Published. Vercel will rebuild.","success");
  }catch(err){st(err.message,"error");}
}
function login(){
  R.innerHTML='<div class="login-wrap"><section class="login-card"><h1>Portfolio <span class="blue">CMS</span></h1><p class="sub">Sign in with GitHub to manage content.</p><a class="btn primary" href="/api/admin/login">Login with GitHub</a></section></div>';
}
function render(){
  var sec=S.find(function(s){return s.p===A;})||{n:"Content"};
  var nav=S.map(function(s){
    return '<button type="button" class="'+(s.p===A?"active":"")+'" data-f="'+s.p+'">'+s.n+'</button>';
  }).join("");
  R.innerHTML='<div class="app"><aside class="side" id="side"><div class="brand">Portfolio <span class="blue">CMS</span></div><nav class="nav"><div class="group">Content</div>'+nav+
    '<div class="group">Account</div><button type="button" id="lo" style="color:#fca5a5">Logout</button></nav></aside>'+
    '<main class="main"><div class="top"><div><button type="button" class="btn mobile" id="menu">Menu</button>'+
    '<div class="eyebrow">Content control</div><h1>'+sec.n+'</h1></div>'+
    '<div class="actions"><a class="btn" href="/" target="_blank">Preview</a><button type="button" class="btn primary" id="pub">Publish Changes</button></div></div>'+
    '<section class="card editor"><div class="editorhead"><div><h2>'+sec.n+'</h2><div id="status" class="status">Ready</div></div></div><div id="editor"></div></section></main></div>';
  document.querySelectorAll("[data-f]").forEach(function(b){b.onclick=function(){load(b.getAttribute("data-f"));};});
  document.getElementById("pub").onclick=save;
  document.getElementById("menu").onclick=function(){document.getElementById("side").classList.toggle("open");};
  document.getElementById("lo").onclick=async function(){
    try{await fetch("/api/admin/logout",{method:"POST"});}catch(e){}
    document.cookie="cms_session=; Path=/; Max-Age=0";login();
  };
  if(D)draw();
}
async function start(){
  try{
    await api("/api/admin/content?path="+encodeURIComponent(S[0].p));
    A=S[0].p;
    await load(A);
  }catch(e){login();}
}
start();
