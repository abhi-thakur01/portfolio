/* Portfolio CMS */
(function(){
function load(src,next){
var s=document.createElement("script");s.src=src+"?v="+Date.now();s.onload=next;s.onerror=function(){var r=document.getElementById("root");if(r)r.innerHTML="<p style=\"color:#f87171;padding:40px\">Failed: "+src+"</p>";};document.head.appendChild(s);}
load("/admin-a.js",function(){load("/admin-b.js",function(){});});
})();
