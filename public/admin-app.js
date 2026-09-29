/* Portfolio CMS loader — designed forms */
(function(){
  var n=6, loaded=0, parts=[];
  function done(){
    var code=parts.join("");
    var s=document.createElement("script");
    s.textContent=code;
    document.head.appendChild(s);
  }
  function load(i){
    var x=new XMLHttpRequest();
    x.open("GET","/cms-part-"+i+".js?v="+Date.now());
    x.onload=function(){
      try {
        (0,eval)(x.responseText);
        parts[i]=window.__CMS_PARTS[i];
        loaded++;
        if(loaded===n) done();
      } catch(e) {
        var r=document.getElementById("root");
        if(r) r.innerHTML='<p style="color:#f87171;padding:40px">CMS part '+i+' error: '+e.message+'</p>';
      }
    };
    x.onerror=function(){
      var r=document.getElementById("root");
      if(r) r.innerHTML='<p style="color:#f87171;padding:40px">Failed to load CMS part '+i+'</p>';
    };
    x.send();
  }
  for(var i=0;i<n;i++) load(i);
})();
