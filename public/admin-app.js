/* Portfolio CMS loader */
(function(){
  var s=document.createElement("script");
  s.src="/admin-cms-core.js?v="+Date.now();
  s.onerror=function(){document.getElementById("root").innerHTML="<p style=\"color:#f87171;padding:40px\">Failed to load CMS core.</p>";};
  document.head.appendChild(s);
})();
