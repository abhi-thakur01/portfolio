/* CMS: Projects — dynamic tabs + full project fields */
(function () {
  if (typeof uiPrj !== "function") return;

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
          '">Del</button></div><svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div><div class="item-body">' +
          '<div class="grid2">' +
          F("Title", '<input class="control" data-x="items.' + i + '.title" value="' + esc(p.title || "") + '">') +
          F("Category / Tab", catSelect) +
          "</div><div class=\"grid2\">" +
          F("Platform", '<input class="control" data-x="items.' + i + '.platform" value="' + esc(p.platform || "") + '">') +
          F("Link", '<input class="control" data-x="items.' + i + '.link" value="' + esc(p.link || "") + '">') +
          "</div>" +
          F("Description", '<textarea class="control textarea" data-x="items.' + i + '.description">' + esc(p.description || "") + "</textarea>") +
          F("Image URL", '<input class="control" data-x="items.' + i + '.image" value="' + esc(p.image || "") + '" placeholder="Paste from Media Library">') +
          F("Tags (comma separated)", '<input class="control" data-tags="items.' + i + '.tags" value="' + esc(tagsVal) + '">') +
          F("Order", '<input class="control" data-x="items.' + i + '.order" value="' + esc(p.order != null ? p.order : i + 1) + '" type="number">') +
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
          tags: [],
          category: defCat,
          platform: "",
          image: "",
          link: "#",
          order: D.items.length + 1,
        });
        O = D.items.length - 1;
        dirty();
        draw();
      };
  };
})();
