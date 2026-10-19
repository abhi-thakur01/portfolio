/* CMS extension: Process + FAQs with full field editors */
(function () {
  if (typeof S === "undefined") return;

  function ensure(name, path) {
    if (!S.some(function (x) { return x.p === path; })) {
      var idx = S.findIndex(function (x) { return x.p.indexOf("site") >= 0; });
      var item = { n: name, p: path };
      if (idx >= 0) S.splice(idx, 0, item);
      else S.push(item);
    }
  }
  ensure("Process", "content/process.json");
  ensure("FAQs", "content/faqs.json");

  var _key = key;
  key = function () {
    var a = A || "";
    if (a.indexOf("process") >= 0) return "proc";
    if (a.indexOf("faqs") >= 0) return "faq";
    return _key();
  };

  function uiProc() {
    if (!D.steps) D.steps = [];
    var list = D.steps.map(function (s, i) {
      var open = O === i ? " open" : "";
      var tags = (s.tags || []).join(", ");
      return (
        '<div class="item-card' + open + '"><div class="item-head" data-tg="' + i + '">' +
        '<div class="item-num">' + (i + 1) + '</div><div class="item-info"><div class="item-title">' +
        esc(s.phase || "") + " — " + esc(s.title || "Untitled") +
        '</div><div class="item-meta"><span class="badge badge-exp">' + esc(s.duration || "") +
        "</span></div></div>" +
        '<div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="steps.' +
        i + '">Del</button></div>' +
        '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>' +
        '<div class="item-body"><div class="grid2">' +
        F("Phase", '<input class="control" data-x="steps.' + i + '.phase" value="' + esc(s.phase || "") + '" placeholder="01">') +
        F("Duration", '<input class="control" data-x="steps.' + i + '.duration" value="' + esc(s.duration || "") + '" placeholder="Day 1–2">') +
        "</div><div class=\"grid2\">" +
        F("Title", '<input class="control" data-x="steps.' + i + '.title" value="' + esc(s.title || "") + '">') +
        F("Subtitle", '<input class="control" data-x="steps.' + i + '.sub" value="' + esc(s.sub || "") + '">') +
        "</div>" +
        F("Description", '<textarea class="control textarea" data-x="steps.' + i + '.desc">' + esc(s.desc || "") + "</textarea>") +
        F("Tags (comma separated)", '<input class="control" data-tags="steps.' + i + '.tags" value="' + esc(tags) + '" placeholder="Brand Research, Competitor Audit">') +
        F("Deliverable", '<input class="control" data-x="steps.' + i + '.deliverable" value="' + esc(s.deliverable || "") + '" placeholder="Project Brief & Sitemap">') +
        "</div></div>"
      );
    }).join("");
    return (
      '<div class="section-block"><div class="section-title">Process Steps (full detail)</div>' +
      '<p class="status" style="margin-bottom:12px">Edit every step: phase, title, subtitle, duration, description, tags, deliverable.</p></div>' +
      '<div class="item-toolbar"><div class="item-count"><strong>' + D.steps.length + "</strong> steps</div>" +
      '<button type="button" class="btn primary" id="addStep">+ Add Step</button></div><div class="item-list">' + list + "</div>"
    );
  }

  function uiFaq() {
    if (!D.faqs) D.faqs = [];
    var list = D.faqs.map(function (f, i) {
      var open = O === i ? " open" : "";
      return (
        '<div class="item-card' + open + '"><div class="item-head" data-tg="' + i + '">' +
        '<div class="item-num">' + (i + 1) + '</div><div class="item-info"><div class="item-title">' +
        esc(f.q || "Question") + "</div></div>" +
        '<div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="faqs.' +
        i + '">Del</button></div>' +
        '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>' +
        '<div class="item-body">' +
        F("Question", '<input class="control" data-x="faqs.' + i + '.q" value="' + esc(f.q || "") + '">') +
        F("Answer", '<textarea class="control textarea" data-x="faqs.' + i + '.a">' + esc(f.a || "") + "</textarea>") +
        "</div></div>"
      );
    }).join("");
    return (
      '<div class="item-toolbar"><div class="item-count"><strong>' + D.faqs.length + "</strong> FAQs</div>" +
      '<button type="button" class="btn primary" id="addFaq">+ Add FAQ</button></div><div class="item-list">' + list + "</div>"
    );
  }

  var _draw = draw;
  draw = function () {
    var el = document.getElementById("editor");
    if (!el || !D) return;
    var k = key();
    if (k === "proc") {
      el.innerHTML = uiProc();
      bindProc();
      return;
    }
    if (k === "faq") {
      el.innerHTML = uiFaq();
      bindProc();
      return;
    }
    _draw();
  };

  function bindProc() {
    document.querySelectorAll("[data-x]").forEach(function (x) {
      x.oninput = function () {
        setPath(x.getAttribute("data-x"), x.value);
        dirty();
      };
    });
    document.querySelectorAll("[data-tags]").forEach(function (x) {
      x.oninput = function () {
        var path = x.getAttribute("data-tags");
        var arr = x.value.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
        setPath(path, arr);
        dirty();
      };
    });
    document.querySelectorAll("[data-rm]").forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        if (!confirm("Delete?")) return;
        rmPath(b.getAttribute("data-rm"));
        O = null;
        dirty();
        draw();
      };
    });
    document.querySelectorAll("[data-tg]").forEach(function (x) {
      x.onclick = function () {
        var i = +x.getAttribute("data-tg");
        O = O === i ? null : i;
        draw();
      };
    });
    var asp = document.getElementById("addStep");
    if (asp)
      asp.onclick = function () {
        if (!D.steps) D.steps = [];
        var n = String(D.steps.length + 1).padStart(2, "0");
        D.steps.push({
          phase: n,
          title: "New Step",
          sub: "",
          duration: "",
          desc: "",
          tags: [],
          deliverable: "",
        });
        O = D.steps.length - 1;
        dirty();
        draw();
      };
    var afq = document.getElementById("addFaq");
    if (afq)
      afq.onclick = function () {
        if (!D.faqs) D.faqs = [];
        D.faqs.push({ q: "New question?", a: "" });
        O = D.faqs.length - 1;
        dirty();
        draw();
      };
  }
})();
