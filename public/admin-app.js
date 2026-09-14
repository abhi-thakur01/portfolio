fetch('https://cdn.jsdelivr.net/gh/abhi-thakur01/portfolio@e1b6e3d19cdd0dd81faeeab7917c15ff147d35ab/public/admin-app.js')
  .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
  .then(code => {
    code = code.replace(
      "data.skillIcons.push({name:'New Skill',color:'#3b82f6'})",
      "data.skillIcons.push({name:'New Skill',color:'#3b82f6',category:'Frontend'})"
    );
    const oldCard = '<input class="control" data-sk="${i}.color" value="${esc(s.color||\'#3b82f6\')}" placeholder="#hex" style="margin-top:6px">';
    const newCard = '<input class="control" data-sk="${i}.color" value="${esc(s.color||\'#3b82f6\')}" placeholder="#hex" style="margin-top:6px"><select class="control" data-sk="${i}.category" style="margin-top:6px"><option value="Frontend" ${(s.category||\'Other\')===\'Frontend\'?\'selected\':\''}>Frontend</option><option value="CMS" ${(s.category||\'Other\')===\'CMS\'?\'selected\':\''}>CMS</option><option value="Tools" ${(s.category||\'Other\')===\'Tools\'?\'selected\':\''}>Tools</option><option value="Other" ${(s.category||\'Other\')===\'Other\'?\'selected\':\''}>Other</option></select>';
    if (code.includes(oldCard)) code = code.replace(oldCard, newCard);
    code = code.replace(
      "document.querySelectorAll('[data-sk]').forEach(e=>{e.oninput=()=>{const[i,k]=e.dataset.sk.split('.');if(!data.skillIcons[i])return;data.skillIcons[i][k]=e.value;markDirty();if(k==='color'){const card=e.closest('.skill-card');const dot=card?.querySelector('.color-dot');if(dot)dot.style.background=e.value}}});",
      "document.querySelectorAll('[data-sk]').forEach(e=>{const h=()=>{const[i,k]=e.dataset.sk.split('.');if(!data.skillIcons[i])return;data.skillIcons[i][k]=e.value;markDirty();if(k==='color'){const card=e.closest('.skill-card');const dot=card?.querySelector('.color-dot');if(dot)dot.style.background=e.value}};e.oninput=h;e.onchange=h;});"
    );
    eval(code);
  })
  .catch(err => {
    const root = document.getElementById('root');
    if (root) root.innerHTML = '<div style="padding:40px;color:#f87171;font-family:system-ui,sans-serif"><h2>CMS load error</h2><p>Please refresh. If it persists, contact support.</p><pre style="color:#94a3b8">' + String(err) + '</pre></div>';
  });
