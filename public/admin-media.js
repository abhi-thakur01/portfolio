/* Shared image management for the existing CMS and /api/admin/media endpoint. */
var CMSMedia = (function () {
  var state = { loading: false, busy: false, message: "", error: false, listError: "", search: "", type: "all", reports: [] };
  var dialog = null;
  var projectsBusy = new Set();
  var projectMessages = new WeakMap();
  var accept = ".png,.jpg,.jpeg,.webp,.gif,.pdf,application/pdf,image/png,image/jpeg,image/webp,image/gif";
  var imageAccept = ".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif";
  var types = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif", pdf: "application/pdf" };

  function isImage(m) { return /\.(png|jpe?g|webp|gif)$/i.test(m.name); }
  function imagePath(value) {
    if (typeof value !== "string") return "";
    var v = value.trim();
    if (!v || /[\u0000-\u001f\u007f\\]/.test(v) || v.startsWith("//")) return "";
    if (/^https?:\/\//i.test(v)) {
      try {
        var u = new URL(v);
        return u.hostname && !u.username && !u.password && !/\.(pdf|svg)(?:$|\/)/i.test(u.pathname) ? u.href : "";
      } catch (_) { return ""; }
    }
    if (/^[a-z][a-z\d+.-]*:/i.test(v)) return "";
    v = v.replace(/^\/?public\//, "/").replace(/^(?:\.\/)?(?=[^/])/, "/");
    if (!v.startsWith("/") || v.startsWith("//")) return "";
    try {
      var decoded = decodeURIComponent(v.split(/[?#]/)[0]);
      if (/[\u0000-\u001f\u007f\\]/.test(decoded) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(decoded)) return "";
      return /\.(png|jpe?g|webp|gif)$/i.test(decoded) ? v : "";
    } catch (_) { return ""; }
  }
  function previewUrl(value) {
    var path = imagePath(value);
    if (!path.startsWith("/media/")) return path;
    var m = MEDIA_FILES.find(function (f) { return f.url === path; });
    return m && m.previewUrl || "/api/admin/media?path=" + encodeURIComponent("public" + path.split(/[?#]/)[0]);
  }
  function sizeText(n) {
    if (typeof n !== "number") return "Size unavailable";
    return n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(1) + " KiB" : (n / 1048576).toFixed(2) + " MiB";
  }
  function metadata(m) { return (m.mime || types[(m.name.split(".").pop() || "").toLowerCase()] || "File") + " · " + sizeText(m.size); }
  function notify(message, error) {
    state.message = message; state.error = !!error;
    var node = document.getElementById("mediaStatus");
    if (node) { node.textContent = message; node.className = "status " + (error ? "error" : "success"); }
  }
  function repaint() { if (MEDIA_MODE) draw(); if (dialog && dialog.kind === "select") drawDialog(); }
  function busy(value) { state.busy = value; repaint(); }
  function validate(file, imagesOnly) {
    var ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!types[ext] || (imagesOnly && ext === "pdf") || (file.type && file.type !== types[ext])) {
      throw Error(imagesOnly ? "Use a PNG, JPEG, WebP, or GIF image. SVG and PDF cannot be project images." : "Use PNG, JPEG, WebP, GIF, or PDF. SVG uploads are disabled.");
    }
    if (!file.size) throw Error("The selected file is empty.");
    if (file.size > MEDIA_MAX_BYTES) throw Error("File exceeds the 3 MiB per-file upload limit.");
    return types[ext];
  }
  function readFile(file, mime) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve("data:" + mime + ";base64," + String(reader.result).split(",")[1]); };
      reader.onerror = function () { reject(Error("Unable to read the selected file.")); };
      reader.onabort = function () { reject(Error("File reading cancelled.")); };
      reader.readAsDataURL(file);
    });
  }
  async function refresh() {
    state.loading = true; state.listError = ""; repaint();
    try { await loadMedia(); }
    catch (error) { state.listError = error.message; throw error; }
    finally { state.loading = false; repaint(); }
  }
  async function upload(file, options) {
    options = options || {};
    var mime = validate(file, options.imagesOnly);
    var payload = { name: file.name, dataUrl: await readFile(file, mime) };
    if (options.replace) {
      payload.replacePath = options.replace.path;
      payload.sha = options.replace.sha;
      payload.confirmReplace = true;
    }
    var result = await api("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!result.success || !result.url || !result.path) throw Error("Media API did not confirm the upload. Refresh the library before retrying.");
    var record = Object.assign({ name: result.path.split("/").pop(), size: file.size, mime: mime }, result);
    MEDIA_FILES = MEDIA_FILES.filter(function (m) { return m.path !== record.path; }).concat(record);
    return record;
  }
  function sanitizedName(name) {
    return name.normalize("NFKC").replace(/[^A-Za-z0-9._-]/g, "-").replace(/\.{2,}/g, "-").replace(/^[-.]+|[-.]+$/g, "").slice(0, 120);
  }
  async function uploadBatch(files, replacing) {
    if (state.busy || !files.length) return;
    busy(true); state.reports = [];
    var uploaded = 0;
    try {
      // GitHub content writes are serialized; each request carries one file only.
      await loadMedia();
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        try {
          validate(file, false);
          var existing = replacing || MEDIA_FILES.find(function (m) { return m.name.replace(/^\d+-/, "") === sanitizedName(file.name); });
          if (existing && !confirm('Replace "' + existing.name + '"? All references to this media file will use the replacement.')) {
            state.reports.push({ name: file.name, message: "Cancelled", error: false }); continue;
          }
          notify("Uploading " + (i + 1) + " of " + files.length + ": " + file.name + " to GitHub…");
          await upload(file, { replace: existing }); uploaded++;
          state.reports.push({ name: file.name, message: "Saved to GitHub", error: false });
        } catch (error) { state.reports.push({ name: file.name, message: error.message, error: true }); }
        repaint();
      }
      var failures = state.reports.filter(function (r) { return r.error; });
      var summary = uploaded + " of " + files.length + " files saved to GitHub.";
      if (failures.length) summary += " " + failures.map(function (r) { return r.name + ": " + r.message; }).join(" ");
      if (uploaded) summary += " Public URLs become available after Vercel rebuilds.";
      notify(summary, failures.length > 0);
    } catch (error) { notify(error.message, true); }
    finally { busy(false); }
  }
  function thumbnail(m) {
    return isImage(m) ? '<img src="' + esc(m.previewUrl || previewUrl(m.url)) + '" alt="' + esc(m.name) + '" loading="lazy" decoding="async">' : '<span class="media-file">PDF</span>';
  }
  function cards(files, selecting) {
    return files.map(function (m) {
      return '<article class="media-card"><button type="button" class="media-preview" ' + (selecting ? 'data-selectmedia' : 'data-previewmedia') + '="' + esc(m.path) + '" aria-label="' + (selecting ? 'Select ' : 'Preview ') + esc(m.name) + '">' + thumbnail(m) + '</button>' +
        '<div class="media-name" title="' + esc(m.name) + '">' + esc(m.name) + '</div><div class="status">' + esc(metadata(m)) + '</div><div class="media-url">' + esc(m.url) + '</div>' +
        (selecting ? '<button type="button" class="btn primary sm" data-selectmedia="' + esc(m.path) + '">Select image</button>' : '<div class="media-actions"><button type="button" class="btn sm" data-copy="' + esc(m.url) + '">Copy image URL</button><button type="button" class="btn sm" data-replacemedia="' + esc(m.path) + '"' + (state.busy ? ' disabled' : '') + '>Replace</button><button type="button" class="btn sm danger" data-delmedia="' + esc(m.path) + '" data-delsha="' + esc(m.sha || '') + '"' + (state.busy ? ' disabled' : '') + '>Delete</button></div>') + '</article>';
    }).join("");
  }
  function bindThumbnails(scope) {
    scope.querySelectorAll(".media-preview img").forEach(function (img) {
      img.onerror = function () { var text = document.createElement("span"); text.className = "status"; text.textContent = "Preview unavailable"; img.replaceWith(text); };
    });
  }
  function libraryHtml() {
    var files = MEDIA_FILES.filter(function (m) { return m.name.toLowerCase().includes(state.search.toLowerCase()) && (state.type === "all" || (state.type === "images" ? isImage(m) : m.isPdf)); });
    return '<div class="section-block"><div class="media-toolbar"><button type="button" class="btn primary" id="mediaUploadLabel"' + (state.busy ? ' disabled' : '') + '>Upload Media</button><input type="file" id="mediaFile" accept="' + accept + '" multiple hidden><button type="button" class="btn" id="refreshMedia"' + (state.busy || state.loading ? ' disabled' : '') + '>Refresh media library</button></div><p class="status">PNG, JPEG, WebP, GIF and PDF · maximum 3 MiB per file. SVG uploads are disabled.</p><div id="mediaDropZone" class="media-drop" tabindex="0" role="button" aria-label="Drop files or choose media">Drag and drop files here, or click to choose files</div><p id="mediaStatus" role="status" aria-live="polite" class="status ' + (state.error ? 'error' : 'success') + '">' + esc(state.message) + '</p><ul class="media-reports" aria-live="polite">' + state.reports.map(function (r) { return '<li class="status ' + (r.error ? 'error' : 'success') + '">' + esc(r.name + ': ' + r.message) + '</li>'; }).join("") + '</ul></div><div class="section-block"><div class="media-toolbar"><label class="media-search">Search by filename<input class="control" id="mediaSearch" type="search" value="' + esc(state.search) + '"></label><label>Media type<select class="control" id="mediaTypeFilter"><option value="all">All media</option><option value="images"' + (state.type === 'images' ? ' selected' : '') + '>Images</option><option value="pdf"' + (state.type === 'pdf' ? ' selected' : '') + '>PDF</option></select></label></div><p class="status">' + files.length + ' files' + (state.loading ? ' · Loading media…' : '') + '</p><div class="media-grid">' + (cards(files, false) || '<p class="status">' + (state.loading ? 'Loading media…' : state.listError ? 'Unable to load media. Refresh to try again.' : MEDIA_FILES.length ? 'No matching files.' : 'No files yet. Upload Media to get started.') + '</p>') + '</div></div>';
  }
  function preserveSearch(id, callback) {
    var input = document.getElementById(id); var pos = input && input.selectionStart;
    callback(); input = document.getElementById(id);
    if (input) { input.focus(); if (input.type === "search") input.setSelectionRange(pos, pos); }
  }
  function bindLibrary() {
    var input = document.getElementById("mediaFile");
    document.getElementById("mediaUploadLabel").onclick = function () { input.click(); };
    input.onchange = function () { var files = Array.from(input.files || []); input.value = ""; uploadBatch(files); };
    var drop = document.getElementById("mediaDropZone");
    drop.onclick = function () { if (!state.busy) input.click(); };
    drop.onkeydown = function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); drop.click(); } };
    drop.ondragover = function (ev) { ev.preventDefault(); drop.classList.add("dragover"); };
    drop.ondragleave = function () { drop.classList.remove("dragover"); };
    drop.ondrop = function (ev) { ev.preventDefault(); drop.classList.remove("dragover"); uploadBatch(Array.from(ev.dataTransfer.files || [])); };
    document.getElementById("refreshMedia").onclick = async function () {
      try { await refresh(); notify("Media library refreshed."); repaint(); } catch (error) { notify(error.message, true); repaint(); }
    };
    document.getElementById("mediaSearch").oninput = function (ev) { state.search = ev.target.value; preserveSearch("mediaSearch", repaint); };
    document.getElementById("mediaTypeFilter").onchange = function (ev) { state.type = ev.target.value; repaint(); };
    document.querySelectorAll("[data-copy]").forEach(function (button) {
      button.onclick = async function () {
        try {
          var url = new URL(button.dataset.copy, location.origin).href;
          if (!navigator.clipboard) throw Error("Clipboard unavailable. Copy the displayed media path manually.");
          await navigator.clipboard.writeText(url); notify("Image URL copied.");
        } catch (error) { notify(error.message, true); }
      };
    });
    document.querySelectorAll("[data-previewmedia]").forEach(function (button) { button.onclick = function () { openDialog({ kind: "preview", media: MEDIA_FILES.find(function (m) { return m.path === button.dataset.previewmedia; }) }); }; });
    document.querySelectorAll("[data-replacemedia]").forEach(function (button) {
      button.onclick = function () {
        var m = MEDIA_FILES.find(function (f) { return f.path === button.dataset.replacemedia; });
        var picker = document.createElement("input"); picker.type = "file"; picker.accept = "." + m.name.split(".").pop();
        picker.onchange = function () { uploadBatch(Array.from(picker.files || []), m); }; picker.click();
      };
    });
    document.querySelectorAll("[data-delmedia]").forEach(function (button) {
      button.onclick = async function () {
        if (state.busy || !confirm("Delete this file from GitHub? Referenced media cannot be deleted.")) return;
        busy(true);
        var path = button.dataset.delmedia, sha = button.dataset.delsha;
        try {
          await api("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({path:path,sha:sha}) });
          MEDIA_FILES = MEDIA_FILES.filter(function (m) { return m.path !== path; }); notify("Media deleted from GitHub.");
        } catch (error) { notify(error.message, true); }
        finally { busy(false); }
      };
    });
    bindThumbnails(document.getElementById("editor"));
  }
  function closeDialog() {
    var node = document.getElementById("mediaDialog");
    if (node) { node.close(); node.remove(); }
    var focus = dialog && dialog.focus; dialog = null;
    if (focus && focus.isConnected) focus.focus();
  }
  function drawDialog() {
    if (!dialog) return;
    var node = document.getElementById("mediaDialog");
    var m = dialog.media;
    var selecting = dialog.kind === "select";
    var files = MEDIA_FILES.filter(function (f) { return isImage(f) && f.name.toLowerCase().includes((dialog.search || "").toLowerCase()); });
    node.innerHTML = '<div class="media-toolbar"><h2>' + (selecting ? 'Select from Media Library' : 'Media preview') + '</h2><button type="button" class="btn" id="closeMediaDialog" aria-label="Close media dialog">Close</button></div>' + (selecting ? '<label>Search images<input type="search" class="control" id="mediaDialogSearch" value="' + esc(dialog.search || '') + '"></label><p class="status" role="status">' + esc(dialog.error || (state.loading ? 'Loading images…' : files.length + ' images available')) + '</p><button type="button" class="btn sm" id="refreshDialogMedia">Refresh images</button><div class="media-grid">' + (cards(files, true) || '<p class="status">No matching images. Upload an image from the project editor.</p>') + '</div>' : '<p>' + esc(m.name) + '</p><p class="status">' + esc(metadata(m)) + '</p>' + (isImage(m) ? '<img class="media-full-preview" src="' + esc(m.previewUrl || previewUrl(m.url)) + '" alt="' + esc(m.name) + '">' : '<p>PDF document</p><a class="btn" href="' + esc(m.previewUrl || m.url) + '" target="_blank" rel="noopener">Open PDF</a>'));
    node.querySelector("#closeMediaDialog").onclick = closeDialog;
    var fullPreview = node.querySelector(".media-full-preview");
    if (fullPreview) fullPreview.onerror = function () {
      var error = document.createElement("p"); error.className = "status error";
      error.textContent = "Unable to load this preview. Close the dialog and refresh the media library.";
      fullPreview.replaceWith(error);
    };
    if (selecting) {
      node.querySelector("#mediaDialogSearch").oninput = function (ev) { dialog.search = ev.target.value; preserveSearch("mediaDialogSearch", drawDialog); };
      node.querySelector("#refreshDialogMedia").onclick = refreshDialog;
      node.querySelectorAll("[data-selectmedia]").forEach(function (button) {
        button.onclick = function () {
          var selected = MEDIA_FILES.find(function (f) { return f.path === button.dataset.selectmedia; });
          dialog.select(selected); closeDialog();
        };
      });
      bindThumbnails(node);
    }
  }
  async function refreshDialog() {
    if (!dialog) return;
    var current = dialog; current.error = "";
    try { await refresh(); } catch (error) { current.error = error.message; }
    if (dialog === current) drawDialog();
  }
  function openDialog(options) {
    closeDialog(); dialog = Object.assign({ focus: document.activeElement }, options);
    var node = document.createElement("dialog"); node.id = "mediaDialog"; node.className = "media-dialog"; node.setAttribute("aria-label", options.kind === "select" ? "Select project image" : "Media preview");
    document.body.appendChild(node); drawDialog(); node.showModal();
    node.oncancel = function (ev) { ev.preventDefault(); closeDialog(); };
    node.onclick = function (ev) { if (ev.target === node) { var r = node.getBoundingClientRect(); if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) closeDialog(); } };
    if (options.kind === "select") refreshDialog();
  }
  function projectSection(project, index) {
    var locked = projectsBusy.has(project);
    var message = projectMessages.get(project) || {};
    return '<section class="section-block project-image" data-project-image="' + index + '"><h3 class="section-title">Project Image</h3><div class="project-image-preview" data-project-preview="' + index + '"></div><div class="media-toolbar"><button type="button" class="btn primary" data-project-upload="' + index + '"' + (locked ? ' disabled' : '') + '>Upload Image</button><button type="button" class="btn" data-project-select="' + index + '"' + (locked ? ' disabled' : '') + '>Select from Media Library</button><button type="button" class="btn" data-project-replace="' + index + '"' + (locked ? ' disabled' : '') + '>Replace Image</button><button type="button" class="btn danger" data-project-remove="' + index + '"' + (locked || !project.image ? ' disabled' : '') + '>Remove Image</button></div><input type="file" data-project-file="' + index + '" accept="' + imageAccept + '" hidden><label class="field project-image-label">External Image URL or media path<input class="control" data-project-url="' + index + '" value="' + esc(project.image || '') + '" placeholder="https://example.com/screenshot.png or /media/image.png"' + (locked ? ' disabled' : '') + '></label><label class="field project-image-label">Image Alt Text<input class="control" data-project-alt="' + index + '" value="' + esc(project.imageAlt || '') + '"></label><p class="status ' + (message.error ? 'error' : '') + '" data-project-status="' + index + '" role="status" aria-live="polite">' + esc(message.text || 'PNG, JPEG, WebP or GIF · maximum 3 MiB. Publish Changes to save the assigned image.') + '</p></section>';
  }
  function projectStatus(project, text, error) {
    projectMessages.set(project, { text: text, error: !!error });
    if (!D || !D.items) return;
    var index = D.items.indexOf(project); var node = document.querySelector('[data-project-status="' + index + '"]');
    if (node) { node.textContent = text; node.className = "status " + (error ? "error" : "success"); }
  }
  function projectPreview(project, index) {
    var node = document.querySelector('[data-project-preview="' + index + '"]');
    if (!node) return;
    node.replaceChildren();
    var path = imagePath(project.image);
    if (!path) { node.textContent = project.image ? "Invalid image URL. Use a local path or an HTTPS/HTTP image URL." : "No image assigned. The public card will show its placeholder."; return; }
    var img = document.createElement("img"); img.src = previewUrl(path); img.alt = project.imageAlt || project.title || "Project image";
    img.onerror = function () { if (node.contains(img)) node.textContent = "Image preview unavailable. Check the image URL or refresh the media library."; };
    node.appendChild(img);
  }
  function bindProjects() {
    var documentData = D;
    document.querySelectorAll("[data-project-image]").forEach(function (section) {
      var index = Number(section.dataset.projectImage); var project = D.items[index];
      function assign(value, message) {
        if (D !== documentData || !D.items.includes(project)) return;
        project.image = value; dirty();
        var currentIndex = D.items.indexOf(project); var input = document.querySelector('[data-project-url="' + currentIndex + '"]');
        if (input) input.value = value;
        var remove = document.querySelector('[data-project-remove="' + currentIndex + '"]'); if (remove) remove.disabled = !value;
        projectPreview(project, currentIndex); projectStatus(project, message);
      }
      projectPreview(project, index);
      var file = section.querySelector("[data-project-file]");
      section.querySelector("[data-project-upload]").onclick = section.querySelector("[data-project-replace]").onclick = function () { file.click(); };
      file.onchange = async function () {
        var selected = file.files && file.files[0]; file.value = ""; if (!selected || projectsBusy.has(project)) return;
        try { validate(selected, true); } catch (error) { projectStatus(project, error.message, true); return; }
        projectsBusy.add(project); projectStatus(project, "Uploading " + selected.name + " to GitHub…");
        section.querySelectorAll("button, [data-project-url]").forEach(function (button) { button.disabled = true; });
        try {
          // Project replacement assigns a new file, preserving media used by other projects.
          var result = await upload(selected, { imagesOnly: true });
          assign(result.url, "Image uploaded to GitHub and assigned. Unsaved changes: click Publish Changes. Public image updates after Vercel rebuilds.");
        } catch (error) { projectStatus(project, error.message, true); }
        finally { projectsBusy.delete(project); if (D === documentData && D.items.includes(project)) draw(); }
      };
      section.querySelector("[data-project-select]").onclick = function () { openDialog({ kind: "select", select: function (m) { assign(m.url, "Image selected. Click Publish Changes to save."); } }); };
      section.querySelector("[data-project-remove]").onclick = function () { assign("", "Image removed from this project. Click Publish Changes to save."); };
      section.querySelector("[data-project-url]").oninput = function (ev) {
        var value = ev.target.value.trim();
        assign(value, !value || imagePath(value) ? "Image updated. Click Publish Changes to save." : "Invalid image URL. Use a local image path or an HTTP/HTTPS image URL.");
        if (value && !imagePath(value)) projectStatus(project, "Invalid image URL. Use a local image path or an HTTP/HTTPS image URL.", true);
      };
      section.querySelector("[data-project-alt]").oninput = function (ev) { project.imageAlt = ev.target.value; dirty(); projectPreview(project, index); };
    });
  }
  window.addEventListener("beforeunload", function (ev) { if (state.busy || projectsBusy.size) { ev.preventDefault(); ev.returnValue = ""; } });
  return { libraryHtml: libraryHtml, bindLibrary: bindLibrary, projectSection: projectSection, bindProjects: bindProjects,
    isBusy: function () { return state.busy || projectsBusy.size > 0; },
    validateProjects: function () { return !D || !D.items || D.items.every(function (p) { return !p.image || !!imagePath(p.image); }); },
    openLibrary: async function () {
      if (cmsNavigationLocked()) return;
      if (IS_DIRTY && !confirm("You have unsaved changes. Leave this section?")) return;
      MEDIA_MODE = true; A = ""; D = null; BASE_SHA = ""; markClean(); state.message = ""; state.error = false; state.search = ""; state.type = "all"; state.reports = []; render();
      try { await refresh(); notify("Media library synced with GitHub."); } catch (error) { notify(error.message, true); repaint(); }
    }
  };
})();

function uiMedia() { return CMSMedia.libraryHtml(); }
function bindMedia() { CMSMedia.bindLibrary(); }
async function loadMedia() { var data = await api("/api/admin/media"); if (!Array.isArray(data.files)) throw Error("Invalid media list received. Refresh to try again."); MEDIA_FILES = data.files; }
async function openMedia() { await CMSMedia.openLibrary(); }
