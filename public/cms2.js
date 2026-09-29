
function showLogin(){root.innerHTML=`<div class="login-wrap"><section class="login-card"><h1>Portfolio <span class="blue">CMS</span></h1><p class="sub">Sign in with GitHub to manage content.</p><a class="btn primary" href="/api/admin/login">Login with GitHub</a></section></div>`}
function render(){const sec=SECTIONS.find(s=>s.path===active)||{name:"Content",desc:""};
root.innerHTML=`<div class="app"><aside class="side" id="side"><div class="brand">Portfolio <span class="blue">CMS</span></div><nav class="nav"><div class="group">Content</div>${SECTIONS.map(s=>`<button type="button" class="${s.path===active?"active":""}" data-file="${s.path}">${s.name}</button>`).join("")}<div class="group">Account</div><button type="button" id="logoutSide" style="color:#fca5a5">Logout</button></nav></aside>
<main class="main"><div class="top"><div><button type="button" class="btn mobile" id="menu">☰</button><div class="eyebrow">Content control</div><h1>${sec.name}</h1><p class="sub">${sec.desc||""}</p></div>
<div class="actions"><a class="btn" href="/" target="_blank">Preview</a><button type="button" class="btn primary" id="publish">Publish Changes</button></div></div>
<section class="card editor"><div class="editorhead"><div><h2>${sec.name}</h2><div id="status" class="status">Ready</div></div></div><div id="editor"></div></section></main></div>`;
document.querySelectorAll("[data-file]").forEach(b=>b.onclick=()=>loadFile(b.dataset.file));
document.getElementById("publish").onclick=save;
document.getElementById("menu").onclick=()=>document.getElementById("side").classList.toggle("open");
document.getElementById("logoutSide").onclick=async()=>{try{await fetch("/api/admin/logout",{method:"POST"})}catch{}document.cookie="cms_session=; Path=/; Max-Age=0";showLogin()};
if(data)renderEditor()}
async function start(){try{await api("/api/admin/content?path="+encodeURIComponent(SECTIONS[0].path));active=SECTIONS[0].path;await loadFile(active)}catch{showLogin()}}
start();
