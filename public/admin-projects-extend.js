/* CMS: Projects — dynamic tabs + full project fields */
(function () {
  if (typeof uiPrj !== "function") return;

  var ORIGINAL_PROJECT_IDS = {
    "integr8-human-ai": true,
    "ascension-aminos": true,
    "service-resource-sr-gc": true,
    "matt-says": true,
    "ime-transcriptions": true,
    "revived-kansas": true,
    "melanie-hoggan": true,
    "project-1793702974768": true
  };
  var PERSISTED_PROJECT_IDS = Object.create(null);

  function rememberProjectIds(items) {
    PERSISTED_PROJECT_IDS = Object.create(null);
    (items || []).forEach(function (item) {
      if (item && item.id) PERSISTED_PROJECT_IDS[item.id] = true;
    });
  }

  var _loadProjects = load;
  load = async function (path) {
    await _loadProjects(path);
    if (path === "content/projects.json" && A === path && D) {
      rememberProjectIds(D.items);
      draw();
    }
  };

  window.addEventListener("cms-content-published", function (event) {
    if (event.detail.path !== "content/projects.json") return;
    rememberProjectIds(event.detail.content.items);
    draw();
  });

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-rm]");
    if (!button || !/^categories\.\d+$/.test(button.getAttribute("data-rm") || "")) return;
    var match = button.getAttribute("data-rm").match(/^categories\.(\d+)$/);
    var category = D && D.categories && D.categories[Number(match[1])];
    if (!category) return;
    var entries = A.indexOf("projects") >= 0 ? D.items : A.indexOf("skills") >= 0 ? D.skillIcons : [];
    if ((entries || []).some(function (item) { return item.category === category.id; })) {
      event.preventDefault();
      event.stopImmediatePropagation();
      alert("Move the items out of this category before deleting it.");
    }
  }, true);

  var _uiPrj = uiPrj;
  uiPrj = function () {
    if (!D.items) D.items = [];
    if (!D.categories) D.categories = [];
    if (!D.categories.length) {
      D.categories = [
        { id: "WordPress", label: "WordPress", order: 1 },
        { id: "CMS", label: "CMS", order: 2 },
      ];
    }

    var catRows = D.categories
      .map(function (c, i) {
        return (
          '<div class="item-card open" style="margin-bottom:8px"><div class="item-body" style="display:block;padding:12px">' +
          '<div class="grid2">' +
          F(
            "Tab ID",
            '<input class="control" data-x="categories.' +
              i +
              '.id" value="' +
              esc(c.id || "") +
              '" placeholder="e.g. React">'
          ) +
          F(
            "Tab label",
            '<input class="control" data-x="categories.' +
              i +
              '.label" value="' +
              esc(c.label || "") +
              '" placeholder="e.g. React Apps">'
          ) +
          "</div><div class=\"grid2\">" +
          F(
            "Order",
            '<input class="control" data-x="categories.' +
              i +
              '.order" value="' +
              esc(c.order != null ? c.order : i + 1) +
              '" type="number">'
          ) +
          '<div class="field"><div class="label">&nbsp;</div><button type="button" class="btn danger sm" data-rm="categories.' +
          i +
          '">Delete tab</button></div></div></div></div>'
        );
      })
      .join("");

    var list = D.items
      .map(function (p, i) {
        var open = O === i ? " open" : "";
        var catSelect = '<select class="control" data-x="items.' + i + '.category">';
        D.categories.forEach(function (c) {
          catSelect +=
            '<option value="' +
            esc(c.id) +
            '"' +
            (p.category === c.id ? " selected" : "") +
            ">" +
            esc(c.label || c.id) +
            "</option>";
        });
        if (p.category && !D.categories.some(function (c) { return c.id === p.category; })) {
          catSelect +=
            '<option value="' +
            esc(p.category) +
            '" selected>' +
            esc(p.category) +
            "</option>";
        }
        catSelect += "</select>";

        var tagsVal = Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "";
        var detailTagsVal = Array.isArray(p.detailTags) ? p.detailTags.join(", ") : p.detailTags || "";
        var highlightsVal = Array.isArray(p.highlights) ? p.highlights.join("\n") : "";
        var featuresVal = Array.isArray(p.features) ? p.features.join("\n") : "";
        var metric = p.metrics && typeof p.metrics === "object" ? p.metrics : { label: "", value: "" };

        return (
          '<div class="item-card' +
          open +
          '"><div class="item-head" data-tg="' +
          i +
          '"><div class="item-num">' +
          (i + 1) +
          '</div><div class="item-info"><div class="item-title">' +
          esc(p.title || "Untitled") +
          '</div><div class="item-meta"><span class="badge badge-exp">' +
          esc(p.category || "") +
          '</span></div></div><div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="items.' +
          i +
          ((ORIGINAL_PROJECT_IDS[p.id] || PERSISTED_PROJECT_IDS[p.id]) ? '" disabled title="Published project IDs are protected">Protected</button></div>' : '">Del</button></div>') +
          '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div><div class="item-body">' +
          '<div class="grid2">' +
          F("Title", '<input class="control" data-x="items.' + i + '.title" value="' + esc(p.title || "") + '">') +
          F("Category / Tab", catSelect) +
          "</div><div class=\"grid2\">" +
          F("Platform", '<input class="control" data-x="items.' + i + '.platform" value="' + esc(p.platform || "") + '">') +
          F("Link", '<input class="control" data-x="items.' + i + '.link" value="' + esc(p.link || "") + '">') +
          "</div>" +
          '<div class="grid2">' +
          F("Project ID", ORIGINAL_PROJECT_IDS[p.id] || PERSISTED_PROJECT_IDS[p.id]
            ? '<input class="control" value="' + esc(p.id || "") + '" readonly>'
            : '<input class="control" data-x="items.' + i + '.id" value="' + esc(p.id || "") + '">') +
          F("Display URL", '<input class="control" data-x="items.' + i + '.url" value="' + esc(p.url || "") + '" placeholder="example.com">') +
          "</div>" +
          '<div class="grid2">' +
          F("Active", '<input type="checkbox" data-active="items.' + i + '.active"' + (p.active !== false ? " checked" : "") + ' style="width:18px;height:18px">') +
          F("Order", '<input class="control" data-num="items.' + i + '.order" value="' + esc(p.order != null ? p.order : i + 1) + '" type="number">') +
          "</div>" +
          F("Description", '<textarea class="control textarea" data-x="items.' + i + '.description">' + esc(p.description || "") + "</textarea>") +
          F("Detail description", '<textarea class="control textarea" data-x="items.' + i + '.detailDescription">' + esc(p.detailDescription || "") + "</textarea>") +
          CMSMedia.projectSection(p, i) +
          F("Tags (comma separated)", '<input class="control" data-tags="items.' + i + '.tags" value="' + esc(tagsVal) + '">') +
          F("Detail tags (comma separated)", '<input class="control" data-detail-tags="items.' + i + '.detailTags" value="' + esc(detailTagsVal) + '">') +
          F("Detail category", '<input class="control" data-x="items.' + i + '.detailCategory" value="' + esc(p.detailCategory || "") + '">') +
          F("Highlights (one per line)", '<textarea class="control textarea" data-lines="items.' + i + '.highlights">' + esc(highlightsVal) + "</textarea>") +
          '<div class="grid2">' +
          F("Metric label", '<input class="control" data-x="items.' + i + '.metrics.label" value="' + esc(metric.label || "") + '">') +
          F("Metric value", '<input class="control" data-x="items.' + i + '.metrics.value" value="' + esc(metric.value || "") + '">') +
          "</div>" +
          F("Preview color", '<input class="control" data-x="items.' + i + '.previewColor" value="' + esc(p.previewColor || "") + '" placeholder="from-blue-500/20 via-cyan-500/10 to-transparent">') +
          F("Features (one per line)", '<textarea class="control textarea" data-lines="items.' + i + '.features">' + esc(featuresVal) + "</textarea>") +
          "</div></div>"
        );
      })
      .join("");

    return (
      '<div class="section-block"><div class="section-title">Project Tabs (filters on site)</div>' +
      '<p class="status" style="margin-bottom:12px">Add tabs here (e.g. React, Shopify). Then assign each project to a tab below. "All" always shows automatically.</p>' +
      catRows +
      '<button type="button" class="btn primary sm" id="addPrjCat">+ Add Tab</button></div>' +
      '<div class="item-toolbar"><div class="item-count"><strong>' +
      D.items.length +
      '</strong> projects</div><button type="button" class="btn primary" id="addItem">+ Add Project</button></div><div class="item-list">' +
      list +
      "</div>"
    );
  };

  var _bind = bind;
  bind = function () {
    _bind();
    if (A === "content/projects.json") CMSMedia.bindProjects();
    document.querySelectorAll("[data-active]").forEach(function (x) {
      x.onchange = function () {
        setPath(x.getAttribute("data-active"), x.checked);
        dirty();
      };
    });
    document.querySelectorAll("[data-num]").forEach(function (x) {
      x.oninput = function () {
        var value = Number(x.value);
        setPath(x.getAttribute("data-num"), Number.isFinite(value) ? value : 0);
        dirty();
      };
    });
    document.querySelectorAll("[data-tags]").forEach(function (x) {
      x.oninput = function () {
        var path = x.getAttribute("data-tags");
        var arr = x.value
          .split(",")
          .map(function (t) {
            return t.trim();
          })
          .filter(Boolean);
        setPath(path, arr);
        dirty();
      };
    });
    document.querySelectorAll("[data-detail-tags]").forEach(function (x) {
      x.oninput = function () {
        var arr = x.value
          .split(",")
          .map(function (t) { return t.trim(); })
          .filter(Boolean);
        setPath(x.getAttribute("data-detail-tags"), arr);
        dirty();
      };
    });
    document.querySelectorAll("[data-lines]").forEach(function (x) {
      x.oninput = function () {
        var arr = x.value
          .split("\n")
          .map(function (t) { return t.trim(); })
          .filter(Boolean);
        setPath(x.getAttribute("data-lines"), arr);
        dirty();
      };
    });
    var ac = document.getElementById("addPrjCat");
    if (ac)
      ac.onclick = function () {
        if (!D.categories) D.categories = [];
        var n = D.categories.length + 1;
        D.categories.push({ id: "Tab" + n, label: "New Tab", order: n });
        dirty();
        draw();
      };
    var ai = document.getElementById("addItem");
    if (ai && A && A.indexOf("projects") >= 0)
      ai.onclick = function () {
        if (!D.items) D.items = [];
        var defCat = (D.categories && D.categories[0] && D.categories[0].id) || "WordPress";
        D.items.push({
          id: "project-" + Date.now(),
          title: "New Project",
          description: "",
          detailDescription: "",
          url: "",
          detailCategory: "",
          tags: [],
          detailTags: [],
          category: defCat,
          platform: "",
          image: "",
          imageAlt: "",
          link: "#",
          active: true,
          order: D.items.length + 1,
          highlights: [],
          metrics: { label: "", value: "" },
          previewColor: "",
          features: [],
        });
        O = D.items.length - 1;
        dirty();
        draw();
      };
  };
})();
