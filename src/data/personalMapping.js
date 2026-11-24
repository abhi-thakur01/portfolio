export function resolvePersonalName(source = {}) {
  const displayName =
    source.displayName ||
    source.fullName ||
    source.name ||
    "Abhishek Thakur";
  const fullName = source.fullName || source.displayName || source.name || displayName;

  return {
    fullName,
    displayName,
    name: displayName,
  };
}

export function resolveHeroContent(source = {}, personal = {}) {
  return {
    statusPill: source.statusPill ?? source.badgeText ?? "",
    greeting: personal.greeting || source.greeting || "Hi, I'm",
    mainHeading: personal.name || source.mainHeading || "Abhishek Thakur",
    highlightedText: personal.role || source.highlightedText || source.bioHighlight || "",
    bio: personal.bio,
    button1Text: source.button1Text || source.ctaPrimary || personal.ctaPrimary,
    button1Url: source.button1Url || "#projects",
    button2Text: source.button2Text || source.ctaSecondary || personal.ctaSecondary,
    button2Url: personal.resumeUrl || source.button2Url || "#",
  };
}
