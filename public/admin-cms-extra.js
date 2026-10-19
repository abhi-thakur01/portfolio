/* Extra CMS sections: Case Studies + Blog */
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
  ensure("Case Studies", "content/case-studies.json");
  ensure("Blog", "content/blog.json");

  var _key = typeof key === "function" ? key : null;
  key = function () {
    var a = A || "";
    if (a.indexOf("case-studies") >= 0) return "cs";
    if (a.indexOf("blog") >= 0) return "blog";
    return _key ? _key() : "";
  };

  function uiCS() {
    if (!D.items) D.items = [];
    if (D.sectionTitle == null) D.sectionTitle = "Case Studies";
    if (D.sectionSubtitle == null) D.sectionSubtitle = "Deep Dives";
    if (D.description == null) D.description = "";
    var list = D.items.map(function (it, i) {
      var open = O === i ? " open" : "";
      var tags = (it.tags || []).join(", ");
      var process = (it.process || []).join("\n");
      var results = (it.results || []).join("\n");
      var metrics = (it.metrics || []).map(function (m) {
        return (m.label || "") + ":" + (m.value || "");
      }).join(", ");
      return (
        '<div class="item-card' + open + '">' +
        '<div class="item-head" data-tg="' + i + '">' +
        '<div class="item-num">' + (i + 1) + '</div>' +
        '<div class="item-info"><div class="item-title">' + esc(it.title || "Untitled") + '</div>' +
        '<div class="item-meta"><span class="badge badge-exp">' + esc(it.category || "") + '</span></div></div>' +
        '<div class="item-actions" onclick="event.stopPropagation()">' +
        '<button type="button" class="btn danger sm" data-rm="items.' + i + '">Del</button></div>' +
        '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>' +
        '<div class="item-body">' +
        '<div class="grid2">' +
        F("ID", '<input class="control" data-x="items.' + i + '.id" value="' + esc(it.id || "") + '">') +
        F("Year", '<input class="control" data-x="items.' + i + '.year" value="' + esc(it.year || "") + '">') +
        '</div><div class="grid2">' +
        F("Title", '<input class="control" data-x="items.' + i + '.title" value="' + esc(it.title || "") + '">') +
        F("Client", '<input class="control" data-x="items.' + i + '.client" value="' + esc(it.client || "") + '">') +
        '</div><div class="grid2">' +
        F("Role", '<input class="control" data-x="items.' + i + '.role" value="' + esc(it.role || "") + '">') +
        F("Category", '<input class="control" data-x="items.' + i + '.category" value="' + esc(it.category || "") + '">') +
        '</div>' +
        F("Excerpt", '<textarea class="control textarea" data-x="items.' + i + '.excerpt">' + esc(it.excerpt || "") + '</textarea>') +
        F("Problem", '<textarea class="control textarea" data-x="items.' + i + '.problem">' + esc(it.problem || "") + '</textarea>') +
        F("Solution", '<textarea class="control textarea" data-x="items.' + i + '.solution">' + esc(it.solution || "") + '</textarea>') +
        F("Process (one per line)", '<textarea class="control textarea" data-lines="items.' + i + '.process">' + esc(process) + '</textarea>') +
        F("Results (one per line)", '<textarea class="control textarea" data-lines="items.' + i + '.results">' + esc(results) + '</textarea>') +
        F("Metrics (Label:Value, comma sep)", '<input class="control" data-metrics="items.' + i + '.metrics" value="' + esc(metrics) + '">') +
        F("Tags (comma)", '<input class="control" data-tags="items.' + i + '.tags" value="' + esc(tags) + '">') +
        F("Cover image URL", '<input class="control" data-x="items.' + i + '.coverImage" value="' + esc(it.coverImage || "") + '">') +
        F("Live URL", '<input class="control" data-x="items.' + i + '.liveUrl" value="' + esc(it.liveUrl || "") + '">') +
        F("Order", '<input class="control" data-x="items.' + i + '.order" value="' + esc(it.order != null ? it.order : i + 1) + '">') +
        '</div></div>'
      );
    }).join("");
    return (
      '<div class="section-block"><div class="section-title">Section copy</div>' +
      F("Title", I("sectionTitle", D.sectionTitle || "")) +
      F("Subtitle", I("sectionSubtitle", D.sectionSubtitle || "")) +
      F("Description", I("description", D.description || "", "", 1)) +
      '</div>' +
      '<div class="item-toolbar"><div class="item-count"><strong>' + D.items.length + '</strong> case studies</div>' +
      '<button type="button" class="btn primary" id="addCS">+ Add Case Study</button></div>' +
      '<div class="item-list">' + list + '</div>'
    );
  }

  function uiBlog() {
    if (!D.posts) D.posts = [];
    if (D.sectionTitle == null) D.sectionTitle = "Tips & Insights";
    if (D.sectionSubtitle == null) D.sectionSubtitle = "Blog";
    if (D.description == null) D.description = "";
    var list = D.posts.map(function (p, i) {
      var open = O === i ? " open" : "";
      var tags = (p.tags || []).join(", ");
      return (
        '<div class="item-card' + open + '">' +
        '<div class="item-head" data-tg="' + i + '">' +
        '<div class="item-num">' + (i + 1) + '</div>' +
        '<div class="item-info"><div class="item-title">' + esc(p.title || "Untitled") + '</div></div>' +
        '<div class="item-actions" onclick="event.stopPropagation()">' +
        '<button type="button" class="btn danger sm" data-rm="posts.' + i + '">Del</button></div>' +
        '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>' +
        '<div class="item-body">' +
        '<div class="grid2">' +
        F("ID", '<input class="control" data-x="posts.' + i + '.id" value="' + esc(p.id || "") + '">') +
        F("Slug", '<input class="control" data-x="posts.' + i + '.slug" value="' + esc(p.slug || "") + '">') +
        '</div>' +
        F("Title", '<input class="control" data-x="posts.' + i + '.title" value="' + esc(p.title || "") + '">') +
        F("Excerpt", '<textarea class="control textarea" data-x="posts.' + i + '.excerpt">' + esc(p.excerpt || "") + '</textarea>') +
        F("Content", '<textarea class="control textarea" data-x="posts.' + i + '.content" style="min-height:140px">' + esc(p.content || "") + '</textarea>') +
        '<div class="grid2">' +
        F("Category", '<input class="control" data-x="posts.' + i + '.category" value="' + esc(p.category || "") + '">') +
        F("Author", '<input class="control" data-x="posts.' + i + '.author" value="' + esc(p.author || "") + '">') +
        '</div><div class="grid2">' +
        F("Date", '<input class="control" data-x="posts.' + i + '.date" value="' + esc(p.date || "") + '">') +
        F("Read time", '<input class="control" data-x="posts.' + i + '.readTime" value="' + esc(p.readTime || "") + '">') +
        '</div>' +
        F("Tags (comma)", '<input class="control" data-tags="posts.' + i + '.tags" value="' + esc(tags) + '">') +
        F("Cover image URL", '<input class="control" data-x="posts.' + i + '.coverImage" value="' + esc(p.coverImage || "") + '">') +
        F("Order", '<input class="control" data-x="posts.' + i + '.order" value="' + esc(p.order != null ? p.order : i + 1) + '">') +
        '</div></div>'
      );
    }).join("");
    return (
      '<div class="section-block"><div class="section-title">Section copy</div>' +
      F("Title", I("sectionTitle", D.sectionTitle || "")) +
      F("Subtitle", I("sectionSubtitle", D.sectionSubtitle || "")) +
      F("Description", I("description", D.description || "", "", 1)) +
      '</div>' +
      '<div class="item-toolbar"><div class="item-count"><strong>' + D.posts.length + '</strong> posts</div>' +
      '<button type="button" class="btn primary" id="addPost">+ Add Post</button></div>' +
      '<div class="item-list">' + list + '</div>'
    );
  }

  var _draw = draw;
  draw = function () {
    var el = document.getElementById("editor");
    if (!el || !D) return;
    var k = key();
    if (k === "cs") {
      el.innerHTML = uiCS();
      bindExtra();
      return;
    }
    if (k === "blog") {
      el.innerHTML = uiBlog();
      bindExtra();
      return;
    }
    _draw();
  };

  function bindExtra() {
    document.querySelectorAll("[data-k]").forEach(function (x) {
      x.oninput = function () {
        D[x.getAttribute("data-k")] = x.value;
        dirty();
      };
    });
    document.querySelectorAll("[data-x]").forEach(function (x) {
      x.oninput = function () {
        setPath(x.getAttribute("data-x"), x.value);
        dirty();
      };
    });
    document.querySelectorAll("[data-tags]").forEach(function (x) {
      x.oninput = function () {
        var arr = x.value.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
        setPath(x.getAttribute("data-tags"), arr);
        dirty();
      };
    });
    document.querySelectorAll("[data-lines]").forEach(function (x) {
      x.oninput = function () {
        var arr = x.value.split("\n").map(function (t) { return t.trim(); }).filter(Boolean);
        setPath(x.getAttribute("data-lines"), arr);
        dirty();
      };
    });
    document.querySelectorAll("[data-metrics]").forEach(function (x) {
      x.oninput = function () {
        var arr = x.value.split(",").map(function (p) {
          var parts = p.split(":");
          return { label: (parts[0] || "").trim(), value: (parts[1] || "").trim() };
        }).filter(function (m) { return m.label || m.value; });
        setPath(x.getAttribute("data-metrics"), arr);
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
    var acs = document.getElementById("addCS");
    if (acs)
      acs.onclick = function () {
        D.items.push({
          id: "case-" + Date.now(),
          title: "New Case Study",
          client: "",
          year: "2026",
          role: "Web Designer",
          category: "WordPress",
          coverImage: "",
          excerpt: "",
          problem: "",
          solution: "",
          process: [],
          results: [],
          metrics: [],
          tags: [],
          liveUrl: "#",
          active: true,
          order: D.items.length + 1,
        });
        O = D.items.length - 1;
        dirty();
        draw();
      };
    var ap = document.getElementById("addPost");
    if (ap)
      ap.onclick = function () {
        D.posts.push({
          id: "post-" + Date.now(),
          title: "New Post",
          slug: "new-post",
          excerpt: "",
          content: "",
          coverImage: "",
          category: "WordPress",
          tags: [],
          author: "Abhishek Thakur",
          date: new Date().toISOString().slice(0, 10),
          readTime: "3 min",
          featured: false,
          active: true,
          order: D.posts.length + 1,
        });
        O = D.posts.length - 1;
        dirty();
        draw();
      };
  }
})();
