/* Portfolio CMS — self-extracting */
(async function(){
  const b64 = "PLACEHOLDER_WILL_FAIL";
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const ds = new DecompressionStream("gzip");
  const stream = new Blob([bin]).stream().pipeThrough(ds);
  const text = await new Response(stream).text();
  const s = document.createElement("script");
  s.textContent = text;
  document.head.appendChild(s);
})().catch(e => {
  const r = document.getElementById("root");
  if (r) r.innerHTML = '<p style="color:#f87171;padding:40px">CMS failed to load: '+e.message+'</p>';
  console.error(e);
});
