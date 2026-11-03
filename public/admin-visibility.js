(function () {
  if (typeof render !== "function" || typeof api !== "function") return;

  var VIS_MAP = {
    "content/hero.json": "hero",
    "content/about.json": "about",
    "content/projects.json": "projects",
    "content/skills.json": "skills",
    "content/experience.json": "experience",
    "content/process.json": "process",
    "content/faqs.json": "faqs",
  };
  var SITE = null;

  function visOn(key) {
    if (!SITE || !SITE.sectionVisibility) return true;
    return SITE.sectionVisibility[key] !== false;
  }

  function switchHtml(key) {
    var on = visOn(key);
    return (
      '<button type="button" class="switch' +
      (on ? " on" : "") +
      '" data-toggle="' +
      key +
      '" title="' +
      (on ? "Hide on website" : "Show on website") +
      '"><i></i></button>'
    );
  }

  async function loadSite() {
    try {
      var d = await api("/api/admin/content?path=" + encodeURIComponent("content/site.json"));
      SITE = JSON.parse(d.content);
      if (!SITE.sectionVisibility) SITE.sectionVisibility = {};
    } catch (e) {
      SITE = { sectionVisibility: {} };
    }
  }

  async function toggleVis(key) {
    if (!SITE) await loadSite();
    var next = SITE.sectionVisibility[key] === false;
    SITE.sectionVisibility[key] = next;
    if (typeof A !== "undefined" && A === "content/site.json" && D) {
      if (!D.sectionVisibility) D.sectionVisibility = {};
      D.sectionVisibility[key] = next;
      SITE = D;
    }
    render();
    st(next ? "Showing section..." : "Hiding section...");
    try {
      var payload = typeof A !== "undefined" && A === "content/site.json" && D ? D : SITE;
      await api("/api/admin/content?path=" + encodeURIComponent("content/site.json"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify(payload, null, 2) }),
      });
      st(
        next ? "Section is visible. Site will rebuild." : "Section is hidden. Site will rebuild.",
        "success"
      );
    } catch (err) {
      st(err.message, "error");
    }
  }

  var _render = render;
  render = function () {
    _render();
    var nav = document.querySelector(".nav");
    if (!nav) return;

    nav.querySelectorAll("[data-f]").forEach(function (btn) {
      var key = VIS_MAP[btn.getAttribute("data-f")];
      if (!key) return;
      var row = document.createElement("div");
      row.className = "nav-row";
      btn.classList.add("navbtn");
      btn.parentNode.insertBefore(row, btn);
      row.appendChild(btn);
      row.insertAdjacentHTML("beforeend", switchHtml(key));
    });

    var assets = null;
    nav.querySelectorAll(".group").forEach(function (g) {
      if (g.textContent.trim() === "Assets") assets = g;
    });
    if (assets) {
      assets.insertAdjacentHTML(
        "beforebegin",
        '<div class="nav-row"><span class="navlabel">Contact</span>' +
          switchHtml("contact") +
          '</div><div class="nav-row"><span class="navlabel">Footer</span>' +
          switchHtml("footer") +
          "</div>"
      );
    }

    var pageKey = VIS_MAP[typeof A === "undefined" ? "" : A];
    var h1 = document.querySelector(".top h1");
    if (pageKey && h1) {
      h1.insertAdjacentHTML(
        "afterend",
        '<div class="page-vis"><span>Show on website</span>' + switchHtml(pageKey) + "</div>"
      );
    }

    document.querySelectorAll("[data-toggle]").forEach(function (b) {
      b.onclick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        toggleVis(b.getAttribute("data-toggle"));
      };
    });
  };

  var _load = load;
  load = async function (p) {
    await _load(p);
    if (p === "content/site.json" && D) SITE = D;
  };

  loadSite().then(function () {
    if (document.querySelector(".nav")) render();
  });
})();
