/* Portfolio CMS — form UI loader */
(function(){
var s=document.createElement("script");
s.src="/admin-ui.js?v="+Date.now();
s.onerror=function(){var r=document.getElementById("root");if(r)r.innerHTML='<p style="color:#f87171;padding:40px">Failed to load CMS UI</p>';};
document.head.appendChild(s);
})();
