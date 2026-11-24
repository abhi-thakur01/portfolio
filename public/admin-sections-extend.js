/* CMS: Section Headings (sections.json) + SEO features */
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
  ensure("Section Headings", "content/sections.json");
  ensure("SEO Features", "content/seo.json");

  var _key = key;
  key = function () {
    var a = A || "";
    if (a.indexOf("sections") >= 0) return "sec";
    if (a.indexOf("seo") >= 0) return "seo";
    return _key();
  };

  function fieldInput(path, val, multi) {
    if (multi)
      return '<textarea class="control textarea" data-x="' + path + '">' + esc(val || "") + "</textarea>";
    return '<input class="control" data-x="' + path + '" value="' + esc(val || "") + '">';
  }

  function uiSec() {
    var blocks = ["skills", "services", "process", "work", "experience", "faqs", "contact", "footer"];
    var html = "";
    blocks.forEach(function (b) {
      if (!D[b]) D[b] = {};
      var s = D[b];
      html += '<div class="section-block"><div class="section-title">' + b.toUpperCase() + "</div>";
      if (b === "footer") {
        html += '<p class="status">Footer tagline and copyright are managed in Site Settings.</p>';
      } else {
        var defaults = {
          skills: { heading: "Technologies &", headingHighlight: "Tools", description: "Frontend code, CMS platforms, and version control tools I use daily." },
          services: { heading: "Services Built for", headingHighlight: "Real Business Growth", description: "End-to-end web design and CMS development tailored to help your brand look polished, load instantly, and turn visitors into clients." },
          process: { heading: "How I Build", headingHighlight: "Excellence", description: "A battle-tested workflow shaped by real client projects — keeping you informed, on schedule, and thrilled with the final website." },
          work: { heading: "Featured", headingHighlight: "Projects", description: "Live client sites and personal builds across WordPress, CMS platforms and React." },
          experience: { heading: "Experience &", headingHighlight: "Education", description: "Professional work and academic background — where I've grown and what I've delivered." },
          faqs: { heading: "Frequently Asked", headingHighlight: "Questions", description: "Everything you need to know about working together, project delivery, and post-launch support." },
          contact: { heading: "Let's Connect", headingHighlight: "About Opportunities", description: "Open to full-time roles. Hiring managers and recruiters can reach me here." }
        };
        var fallback = defaults[b] || {};
        html += F("Label", fieldInput(b + ".label", s.label || ""));
        html += '<div class="grid2">' +
          F("Heading", fieldInput(b + ".heading", s.heading || fallback.heading)) +
          F("Heading highlight", fieldInput(b + ".headingHighlight", s.headingHighlight || fallback.headingHighlight)) +
          "</div>";
        html += F("Description", fieldInput(b + ".description", s.description || fallback.description, 1));
        if (b === "skills") {
          html += F("Tag cloud label", fieldInput(b + ".tagCloudLabel", s.tagCloudLabel || "Interactive Tech Tags (Click to Highlight)"));
          html += F("Other tools label", fieldInput(b + ".toolsLabel", s.toolsLabel || "Platforms & Technologies I Build On"));
        }
        if (b === "services") {
          html += F("Request button", fieldInput(b + ".ctaLabel", s.ctaLabel || "Request This Service"));
          html += F("Deliverables label", fieldInput(b + ".deliverablesLabel", s.deliverablesLabel || "Deliverables:"));
        }
        if (b === "work") {
          html += F("Hire CTA", fieldInput(b + ".hireCta", s.hireCta || "Hire for Your Team"));
        }
        if (b === "experience") {
          html += F("CTA title", fieldInput(b + ".ctaTitle", s.ctaTitle || "Let's Work Together"));
          html += F("CTA heading", fieldInput(b + ".ctaHeading", s.ctaHeading || "Have a project in mind?"));
          html += F("CTA description", fieldInput(b + ".ctaDescription", s.ctaDescription || "I'm always open to new opportunities, collaborations or just a friendly chat.", 1));
          html += F("CTA button", fieldInput(b + ".ctaButton", s.ctaButton || "Get In Touch"));
        }
        if (b === "contact") {
          html += F("Sidebar title", fieldInput(b + ".sidebarTitle", s.sidebarTitle));
          html += F("Availability text", fieldInput(b + ".availabilityText", s.availabilityText, 1));
          html += F("Submit button", fieldInput(b + ".submitLabel", s.submitLabel));
          html += F("Success title", fieldInput(b + ".successTitle", s.successTitle));
          html += F("Success message", fieldInput(b + ".successMessage", s.successMessage, 1));
        }
        if (b === "faqs" && Array.isArray(s.trustItems)) {
          html += F("Trust items (one per line)", '<textarea class="control textarea" data-trust="faqs.trustItems">' + esc((s.trustItems || []).join("\n")) + "</textarea>");
        }
      }
      html += "</div>";
    });
    return html;
  }

  function uiSeo() {
    if (!D.features) D.features = [];
    var list = D.features
      .map(function (f, i) {
        var open = O === i ? " open" : "";
        return (
          '<div class="item-card' +
          open +
          '"><div class="item-head" data-tg="' +
          i +
          '"><div class="item-num">' +
          (i + 1) +
          '</div><div class="item-info"><div class="item-title">' +
          esc(f.title || "Feature") +
          '</div></div><div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="features.' +
          i +
          '">Del</button></div><svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div><div class="item-body">' +
          F("Title", '<input class="control" data-x="features.' + i + '.title" value="' + esc(f.title || "") + '">') +
          F("Badge", '<input class="control" data-x="features.' + i + '.badge" value="' + esc(f.badge || "") + '">') +
          F("Icon", '<input class="control" data-x="features.' + i + '.icon" value="' + esc(f.icon || "") + '" placeholder="Zap, Search, Target...">') +
          F("Description", '<textarea class="control textarea" data-x="features.' + i + '.desc">' + esc(f.desc || "") + "</textarea>") +
          "</div></div>"
        );
      })
      .join("");
    return (
      '<p class="status" style="margin-bottom:12px">CMS-only content: these feature records are not rendered by the public portfolio or used as SEO metadata.</p><div class="item-toolbar"><div class="item-count"><strong>' +
      D.features.length +
      '</strong> features</div><button type="button" class="btn primary" id="addSeoFeat">+ Add Feature</button></div><div class="item-list">' +
      list +
      "</div>"
    );
  }

  var _draw = draw;
  draw = function () {
    if (typeof MEDIA_MODE !== "undefined" && MEDIA_MODE) return _draw();
    var el = document.getElementById("editor");
    if (!el || !D) return _draw();
    var k = key();
    if (k === "sec") {
      el.innerHTML = uiSec();
      bindSec();
      return;
    }
    if (k === "seo") {
      el.innerHTML = uiSeo();
      bindSec();
      return;
    }
    _draw();
  };

  function bindSec() {
    document.querySelectorAll("[data-x]").forEach(function (x) {
      x.oninput = function () {
        setPath(x.getAttribute("data-x"), x.value);
        dirty();
      };
    });
    document.querySelectorAll("[data-trust]").forEach(function (x) {
      x.oninput = function () {
        var arr = x.value.split("\n").map(function (t) { return t.trim(); }).filter(Boolean);
        setPath(x.getAttribute("data-trust"), arr);
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
    var add = document.getElementById("addSeoFeat");
    if (add)
      add.onclick = function () {
        if (!D.features) D.features = [];
        D.features.push({ icon: "Zap", title: "New Feature", desc: "", badge: "" });
        O = D.features.length - 1;
        dirty();
        draw();
      };
  }
})();
