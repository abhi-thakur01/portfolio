/* Patch Skills CMS: add Image URL field on each skill */
(function () {
  if (typeof uiSk !== "function") return;
  var _uiSk = uiSk;
  uiSk = function () {
    if (!D.skillIcons) D.skillIcons = [];
    if (!D.otherTools) D.otherTools = [];
    if (!D.categories) D.categories = [];
    if (!D.categories.length) {
      D.categories = [
        { id: "Frontend", label: "Frontend", order: 1 },
        { id: "CMS", label: "CMS & Builders", order: 2 },
        { id: "Tools", label: "Tools", order: 3 },
      ];
    }

    var catRows = D.categories
      .map(function (c, i) {
        return (
          '<div class="item-card open" style="margin-bottom:8px"><div class="item-body" style="display:block;padding:12px">' +
          '<div class="grid2">' +
          F(
            "Tab ID (used on skills)",
            '<input class="control" data-x="categories.' +
              i +
              '.id" value="' +
              esc(c.id || "") +
              '" placeholder="e.g. Design">'
          ) +
          F(
            "Tab label (shown on site)",
            '<input class="control" data-x="categories.' +
              i +
              '.label" value="' +
              esc(c.label || "") +
              '" placeholder="e.g. Design Tools">'
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
          '">Delete tab</button></div>' +
          "</div></div></div>"
        );
      })
      .join("");

    var cards = D.skillIcons
      .map(function (s, i) {
        var catSelect = '<select class="control" data-x="skillIcons.' + i + '.category">';
        D.categories.forEach(function (c) {
          catSelect +=
            '<option value="' +
            esc(c.id) +
            '"' +
            (s.category === c.id ? " selected" : "") +
            ">" +
            esc(c.label || c.id) +
            "</option>";
        });
        if (s.category && !D.categories.some(function (c) { return c.id === s.category; })) {
          catSelect +=
            '<option value="' +
            esc(s.category) +
            '" selected>' +
            esc(s.category) +
            " (custom)</option>";
        }
        catSelect += "</select>";

        var preview = s.image
          ? '<img src="' +
            esc(s.image) +
            '" alt="" style="width:28px;height:28px;object-fit:contain;border-radius:6px;background:#0a0e1a;padding:2px">'
          : '<div class="color-dot" style="background:' + esc(s.color || "#3b82f6") + '"></div>';

        return (
          '<div class="skill-card" style="flex-wrap:wrap;align-items:flex-start;flex-direction:column;gap:8px">' +
          '<div style="display:flex;gap:10px;width:100%;align-items:flex-start">' +
          '<div style="margin-top:6px">' +
          preview +
          "</div>" +
          '<div style="flex:1;min-width:160px">' +
          '<input class="control" data-x="skillIcons.' +
          i +
          '.name" value="' +
          esc(s.name || "") +
          '" placeholder="Skill name">' +
          '<div class="grid2" style="margin-top:6px;gap:6px">' +
          '<input class="control" data-x="skillIcons.' +
          i +
          '.color" value="' +
          esc(s.color || "#3b82f6") +
          '" placeholder="#hex">' +
          catSelect +
          "</div>" +
          F(
            "Image URL (logo)",
            '<input class="control" data-x="skillIcons.' +
              i +
              '.image" value="' +
              esc(s.image || "") +
              '" placeholder="https://...png or /media/logo.svg">'
          ) +
          "</div>" +
          '<button type="button" class="btn danger sm" data-rm="skillIcons.' +
          i +
          '">x</button>' +
          "</div></div>"
        );
      })
      .join("");

    var tools = (D.otherTools || [])
      .map(function (t, i) {
        return (
          '<span class="chip">' +
          esc(t) +
          '<button type="button" data-rm="otherTools.' +
          i +
          '">x</button></span>'
        );
      })
      .join("");

    return (
      '<div class="section-block"><div class="section-title">Tabs (categories on site)</div>' +
      '<p class="status" style="margin-bottom:12px">Add a new tab here, then assign skills to it below. Tab ID must match the skill category.</p>' +
      catRows +
      '<button type="button" class="btn primary sm" id="addCat">+ Add Tab</button></div>' +
      '<div class="section-block"><div class="section-title">Skill Icons</div>' +
      '<p class="status" style="margin-bottom:10px">Image URL optional — paste logo link (SVG/PNG). Empty = 2-letter fallback.</p>' +
      '<div class="skill-grid">' +
      cards +
      "</div>" +
      '<button type="button" class="btn sm" id="addSkill" style="margin-top:12px">+ Add Skill</button></div>' +
      '<div class="section-block"><div class="section-title">Other Tools</div><div class="chips">' +
      tools +
      '</div><div class="chip-add"><input class="control" id="toolIn" placeholder="e.g. Kajabi"><button type="button" class="btn sm" id="addTool">Add</button></div></div>'
    );
  };

  var _bind = bind;
  bind = function () {
    _bind();
    var ask = document.getElementById("addSkill");
    if (ask)
      ask.onclick = function () {
        var defCat = (D.categories && D.categories[0] && D.categories[0].id) || "Frontend";
        D.skillIcons.push({ name: "New Skill", color: "#3b82f6", category: defCat, image: "" });
        dirty();
        draw();
      };
  };
})();
