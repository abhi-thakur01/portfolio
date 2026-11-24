/* CMS extensions: Services + Testimonials */
(function () {
  if (typeof S === "undefined") return;

  var _key = key;
  key = function () {
    var a = A || "";
    if (a.indexOf("/services/") >= 0) return "service";
    if (a.indexOf("testimonials") >= 0) return "testimonials";
    return _key();
  };

  function uiService() {
    if (!D.deliverables) D.deliverables = [];
    if (!D.tags) D.tags = [];
    return (
      '<div class="section-block"><div class="section-title">Service details</div>' +
      '<div class="grid2">' +
      F("ID", '<input class="control" data-x="id" value="' + esc(D.id || "") + '">') +
      F("Icon", '<input class="control" data-x="icon" value="' + esc(D.icon || "") + '" placeholder="Globe, LayoutGrid, Smartphone, RefreshCw">') +
      "</div>" +
      F("Title", '<input class="control" data-x="title" value="' + esc(D.title || "") + '">') +
      F("Starting price", '<input class="control" data-x="startingPrice" value="' + esc(D.startingPrice || "") + '">') +
      F("Description", '<textarea class="control textarea" data-x="desc">' + esc(D.desc || "") + "</textarea>") +
      F("Tags (comma separated)", '<input class="control" data-tags="tags" value="' + esc(D.tags.join(", ")) + '">') +
      F("Features / deliverables (one per line)", '<textarea class="control textarea" data-lines="deliverables">' + esc(D.deliverables.join("\n")) + "</textarea>") +
      "</div>"
    );
  }

  function uiTestimonials() {
    if (!D.items) D.items = [];
    if (D.sectionTitle == null) D.sectionTitle = "What Clients Say";
    if (D.sectionSubtitle == null) D.sectionSubtitle = "Testimonials";
    if (D.description == null) D.description = "";
    var list = D.items.map(function (t, i) {
      var open = O === i ? " open" : "";
      return (
        '<div class="item-card' + open + '">' +
        '<div class="item-head" data-tg="' + i + '">' +
        '<div class="item-num">' + (i + 1) + '</div>' +
        '<div class="item-info"><div class="item-title">' + esc(t.name || "Testimonial") + "</div></div>" +
        '<div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="items.' + i + '">Del</button></div>' +
        '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>' +
        '<div class="item-body"><div class="grid2">' +
        F("ID", '<input class="control" data-x="items.' + i + '.id" value="' + esc(t.id || "") + '">') +
        F("Name", '<input class="control" data-x="items.' + i + '.name" value="' + esc(t.name || "") + '">') +
        "</div><div class=\"grid2\">" +
        F("Role", '<input class="control" data-x="items.' + i + '.role" value="' + esc(t.role || "") + '">') +
        F("Company", '<input class="control" data-x="items.' + i + '.company" value="' + esc(t.company || "") + '">') +
        "</div>" +
        F("Quote", '<textarea class="control textarea" data-x="items.' + i + '.quote">' + esc(t.quote || "") + "</textarea>") +
        F("Image URL", '<input class="control" data-x="items.' + i + '.image" value="' + esc(t.image || "") + '">') +
        '<div class="grid2">' +
        F("Active", '<input type="checkbox" data-active="items.' + i + '.active"' + (t.active !== false ? " checked" : "") + ' style="width:18px;height:18px">') +
        F("Order", '<input class="control" data-num="items.' + i + '.order" value="' + esc(t.order != null ? t.order : i + 1) + '" type="number">') +
        "</div></div></div>"
      );
    }).join("");
    return (
      '<div class="section-block"><div class="section-title">Section copy</div>' +
      F("Title", I("sectionTitle", D.sectionTitle || "")) +
      F("Subtitle", I("sectionSubtitle", D.sectionSubtitle || "")) +
      F("Description", I("description", D.description || "", "", 1)) +
      '</div><div class="item-toolbar"><div class="item-count"><strong>' + D.items.length + "</strong> testimonials</div>" +
      '<button type="button" class="btn primary" id="addTestimonial">+ Add Testimonial</button></div><div class="item-list">' + list + "</div>"
    );
  }

  var _draw = draw;
  draw = function () {
    var el = document.getElementById("editor");
    if (!el || !D) return _draw();
    var k = key();
    if (k === "service") {
      el.innerHTML = uiService();
      bind();
      bindService();
      return;
    }
    if (k === "testimonials") {
      el.innerHTML = uiTestimonials();
      bind();
      bindTestimonials();
      return;
    }
    _draw();
  };

  function bindTestimonials() {
    document.querySelectorAll("[data-active]").forEach(function (x) {
      x.onchange = function () { setPath(x.getAttribute("data-active"), x.checked); dirty(); };
    });
    document.querySelectorAll("[data-num]").forEach(function (x) {
      x.oninput = function () { setPath(x.getAttribute("data-num"), Number(x.value) || 0); dirty(); };
    });
    var add = document.getElementById("addTestimonial");
    if (add) add.onclick = function () {
      D.items.push({ id: "testimonial-" + Date.now(), name: "New testimonial", role: "", company: "", quote: "", image: "", active: true, order: D.items.length + 1 });
      O = D.items.length - 1;
      dirty();
      draw();
    };
  }

  function bindService() {
    document.querySelectorAll("[data-tags]").forEach(function (x) {
      x.oninput = function () {
        setPath(x.getAttribute("data-tags"), x.value.split(",").map(function (t) { return t.trim(); }).filter(Boolean));
        dirty();
      };
    });
    document.querySelectorAll("[data-lines]").forEach(function (x) {
      x.oninput = function () {
        setPath(x.getAttribute("data-lines"), x.value.split("\n").map(function (t) { return t.trim(); }).filter(Boolean));
        dirty();
      };
    });
  }
})();
