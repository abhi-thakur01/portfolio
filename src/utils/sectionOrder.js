export const DEFAULT_SECTION_ORDER = [
  "hero",
  "about",
  "projects",
  "skills",
  "experience",
  "process",
  "faqs",
  "contact",
];

export const KNOWN_SECTION_IDS = new Set([
  "hero",
  "about",
  "projects",
  "services",
  "skills",
  "experience",
  "case-studies",
  "process",
  "blog",
  "testimonials",
  "faqs",
  "contact",
]);

export function getVisibleSectionOrder(sectionOrder, visibility) {
  const configured = Array.isArray(sectionOrder) ? sectionOrder : [];
  const order = configured.length ? configured : DEFAULT_SECTION_ORDER;
  const seen = new Set();
  const result = [];

  order.forEach((key) => {
    if (typeof key !== "string" || seen.has(key) || !KNOWN_SECTION_IDS.has(key)) return;
    seen.add(key);
    if (visibility?.[key] !== false) result.push(key);
  });

  DEFAULT_SECTION_ORDER.forEach((key) => {
    if (seen.has(key)) return;
    seen.add(key);
    if (visibility?.[key] !== false) result.push(key);
  });

  return result;
}
