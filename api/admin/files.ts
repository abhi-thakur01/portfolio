export default function handler(_req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.status(410).json({
    error: "This retired CMS file-management API is no longer available. Use /admin/ and /api/admin/content.",
    code: "ENDPOINT_RETIRED",
  });
}
