/* CMS extensions: Education, Certifications, Roles, and Addresses */
(function () {
  if (typeof S === "undefined") return;

  var _key = key;
  key = function () {
    var a = A || "";
    if (a.indexOf("education") >= 0) return "education";
    if (a.indexOf("certifications") >= 0) return "certifications";
    if (a.indexOf("roles") >= 0) return "roles";
    if (a.indexOf("addresses") >= 0) return "addresses";
    return _key();
  };

  function uiEducation() {
    if (!Array.isArray(D.items)) D.items = [];
    var list = D.items.map(function (e, i) {
      var open = O === i ? " open" : "";
      var duration = [e.startDate, e.endDate].filter(Boolean).join(" - ");
      return (
        '<div class="item-card' + open + '">' +
        '<div class="item-head" data-tg="' + i + '">' +
        '<div class="item-num">' + (i + 1) + '</div>' +
        '<div class="item-info"><div class="item-title">' + esc(e.degree || e.course || "Education") + '</div>' +
        '<div class="item-meta"><span class="badge badge-exp">' + esc(duration) + '</span></div></div>' +
        '<div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="items.' + i + '">Del</button></div>' +
        '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>' +
        '<div class="item-body"><div class="grid2">' +
        F("Degree", '<input class="control" data-x="items.' + i + '.degree" value="' + esc(e.degree || "") + '">') +
        F("Institution", '<input class="control" data-x="items.' + i + '.institution" value="' + esc(e.institution || "") + '">') +
        '</div><div class="grid2">' +
        F("Course", '<input class="control" data-x="items.' + i + '.course" value="' + esc(e.course || "") + '">') +
        F("Location", '<input class="control" data-x="items.' + i + '.location" value="' + esc(e.location || "") + '">') +
        '</div><div class="grid2">' +
        F("Start date", '<input class="control" data-x="items.' + i + '.startDate" value="' + esc(e.startDate || "") + '">') +
        F("End date", '<input class="control" data-x="items.' + i + '.endDate" value="' + esc(e.endDate || "") + '">') +
        '</div>' +
        F("Description", '<textarea class="control textarea" data-x="items.' + i + '.description">' + esc(e.description || "") + "</textarea>") +
        '<div class="grid2">' +
        F("Grade", '<input class="control" data-x="items.' + i + '.grade" value="' + esc(e.grade || "") + '">') +
        F("Certificate URL", '<input class="control" data-x="items.' + i + '.certificateUrl" value="' + esc(e.certificateUrl || "") + '">') +
        '</div>' +
        F("Certificate image", '<input class="control" data-x="items.' + i + '.certificateImage" value="' + esc(e.certificateImage || "") + '" placeholder="Upload in Media Library">') +
        '<div class="grid2">' +
        F("Active", '<input type="checkbox" data-active="items.' + i + '.active"' + (e.active !== false ? " checked" : "") + ' style="width:18px;height:18px">') +
        F("Order", '<input class="control" data-num="items.' + i + '.order" value="' + esc(e.order != null ? e.order : i + 1) + '" type="number">') +
        "</div></div></div>"
      );
    }).join("");
    return '<div class="item-toolbar"><div class="item-count"><strong>' + D.items.length + '</strong> education records</div><button type="button" class="btn primary" id="addEducation">+ Add Education</button></div><div class="item-list">' + list + '</div>';
  }

  function uiCertifications() {
    if (!Array.isArray(D.items)) D.items = [];
    var list = D.items.map(function (c, i) {
      var open = O === i ? " open" : "";
      return (
        '<div class="item-card' + open + '">' +
        '<div class="item-head" data-tg="' + i + '">' +
        '<div class="item-num">' + (i + 1) + '</div>' +
        '<div class="item-info"><div class="item-title">' + esc(c.title || "Certificate") + '</div>' +
        '<div class="item-meta"><span class="badge badge-exp">' + esc(c.organization || c.issuer || "") + '</span></div></div>' +
        '<div class="item-actions" onclick="event.stopPropagation()"><button type="button" class="btn danger sm" data-rm="items.' + i + '">Del</button></div>' +
        '<svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>' +
        '<div class="item-body"><div class="grid2">' +
        F("Title", '<input class="control" data-x="items.' + i + '.title" value="' + esc(c.title || "") + '">') +
        F("Issuing organization", '<input class="control" data-x="items.' + i + '.organization" value="' + esc(c.organization || c.issuer || "") + '">') +
        '</div><div class="grid2">' +
        F("Issue date", '<input class="control" data-x="items.' + i + '.issueDate" value="' + esc(c.issueDate || c.date || "") + '">') +
        F("Expiry date", '<input class="control" data-x="items.' + i + '.expiryDate" value="' + esc(c.expiryDate || "") + '">') +
        '</div>' +
        F("Credential ID", '<input class="control" data-x="items.' + i + '.credentialId" value="' + esc(c.credentialId || "") + '">') +
        F("Verification URL", '<input class="control" data-x="items.' + i + '.verificationUrl" value="' + esc(c.verificationUrl || c.url || "") + '">') +
        F("Certificate image", '<input class="control" data-x="items.' + i + '.image" value="' + esc(c.image || c.certificateImage || "") + '" placeholder="Upload in Media Library">') +
        '<div class="grid2">' +
        F("Active", '<input type="checkbox" data-active="items.' + i + '.active"' + (c.active !== false ? " checked" : "") + ' style="width:18px;height:18px">') +
        F("Order", '<input class="control" data-num="items.' + i + '.order" value="' + esc(c.order != null ? c.order : i + 1) + '" type="number">') +
        "</div></div></div>"
      );
    }).join("");
    return '<div class="item-toolbar"><div class="item-count"><strong>' + D.items.length + '</strong> certifications</div><button type="button" class="btn primary" id="addCertification">+ Add Certification</button></div><div class="item-list">' + list + '</div>';
  }

  function uiRoles() {
    if (!Array.isArray(D.roles)) D.roles = [];
    var chips = D.roles.map(function (role, i) {
      return '<span class="chip">' + esc(role) + '<button type="button" data-rm="roles.' + i + '">x</button></span>';
    }).join("");
    return '<div class="section-block"><div class="section-title">Professional roles and keywords</div><div class="chips">' + chips + '</div><div class="chip-add"><input class="control" id="roleIn" placeholder="e.g. Frontend Developer"><button type="button" class="btn sm" id="addRole">Add</button></div></div>';
  }

  function uiAddresses() {
    if (!Array.isArray(D.addresses)) D.addresses = [];
    var chips = D.addresses.map(function (address, i) {
      return '<span class="chip">' + esc(address) + '<button type="button" data-rm="addresses.' + i + '">x</button></span>';
    }).join("");
    return '<div class="section-block"><div class="section-title">Domain records</div><p class="status" style="margin-bottom:12px">Manage the existing domain/name records without interpreting them as physical addresses.</p><div class="chips">' + chips + '</div><div class="chip-add"><input class="control" id="addressIn" placeholder="example.com"><button type="button" class="btn sm" id="addAddress">Add</button></div></div>';
  }

  var _draw = draw;
  draw = function () {
    var el = document.getElementById("editor");
    if (!el || !D) return _draw();
    var k = key();
    if (k === "education") { el.innerHTML = uiEducation(); bindRemaining(); return; }
    if (k === "certifications") { el.innerHTML = uiCertifications(); bindRemaining(); return; }
    if (k === "roles") { el.innerHTML = uiRoles(); bindRemaining(); return; }
    if (k === "addresses") { el.innerHTML = uiAddresses(); bindRemaining(); return; }
    _draw();
  };

  function bindRemaining() {
    document.querySelectorAll("[data-x]").forEach(function (x) {
      x.oninput = function () { setPath(x.getAttribute("data-x"), x.value); dirty(); };
    });
    document.querySelectorAll("[data-active]").forEach(function (x) {
      x.onchange = function () { setPath(x.getAttribute("data-active"), x.checked); dirty(); };
    });
    document.querySelectorAll("[data-num]").forEach(function (x) {
      x.oninput = function () { setPath(x.getAttribute("data-num"), Number(x.value) || 0); dirty(); };
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
      x.onclick = function () { var i = +x.getAttribute("data-tg"); O = O === i ? null : i; draw(); };
    });
    var addEducation = document.getElementById("addEducation");
    if (addEducation) addEducation.onclick = function () {
      D.items.push({ id: "education-" + Date.now(), degree: "New degree", institution: "", course: "", description: "", startDate: "", endDate: "", grade: "", location: "", certificateUrl: "", certificateImage: "", active: true, order: D.items.length + 1 });
      O = D.items.length - 1; dirty(); draw();
    };
    var addCertification = document.getElementById("addCertification");
    if (addCertification) addCertification.onclick = function () {
      D.items.push({ id: "certificate-" + Date.now(), title: "New Certificate", organization: "", issueDate: "", expiryDate: "", credentialId: "", verificationUrl: "", image: "", active: true, order: D.items.length + 1 });
      O = D.items.length - 1; dirty(); draw();
    };
    var addRole = document.getElementById("addRole");
    if (addRole) addRole.onclick = function () {
      var inp = document.getElementById("roleIn");
      var value = (inp && inp.value || "").trim();
      if (!value) return;
      D.roles.push(value); dirty(); draw();
    };
    var addAddress = document.getElementById("addAddress");
    if (addAddress) addAddress.onclick = function () {
      var inp = document.getElementById("addressIn");
      var value = (inp && inp.value || "").trim();
      if (!value) return;
      D.addresses.push(value); dirty(); draw();
    };
  }
})();
