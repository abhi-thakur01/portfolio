/* CMS */
(function(){
var i=0,n=3;
function next(){if(i>=n)return;var s=document.createElement("script");s.src="/cms"+i+".js?v="+Date.now();i++;s.onload=next;s.onerror=function(){document.getElementById("root").innerHTML="<p style=color:#f87171;padding:40px>Load fail cms"+(i-1)+"</p>";};document.head.appendChild(s);}
next();
})();
