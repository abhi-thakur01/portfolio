// GitHub stores media under public/, while Vite serves that directory at /.
// Keep this resolution independent of the content loader so the saved value is
// preserved and the browser only receives supported image locations.
export function resolveProjectImage(value) {
  if (typeof value !== "string") return "";
  const source = value.trim();
  if (!source || /[\u0000-\u001f\u007f\\]/.test(source) || source.startsWith("//")) return "";

  if (/^https?:\/\//i.test(source)) {
    try {
      const url = new URL(source);
      if (!url.hostname || url.username || url.password || /\.(?:pdf|svg)(?:$|\/)/i.test(url.pathname)) return "";
      return url.href;
    } catch {
      return "";
    }
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(source)) return "";
  const path = source.replace(/^\/?public\//, "/").replace(/^(?:\.\/)?(?=[^/])/, "/");
  if (!path.startsWith("/") || path.startsWith("//")) return "";
  try {
    const pathname = decodeURIComponent(path.split(/[?#]/)[0]);
    if (/[\u0000-\u001f\u007f\\]/.test(pathname) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(pathname)) return "";
    if (!/\.(?:png|jpe?g|webp|gif)$/i.test(pathname)) return "";
    return path;
  } catch {
    return "";
  }
}
