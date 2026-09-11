export default async function handler(req: any, res: any) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Clear CMS session cookie
  res.setHeader(
    "Set-Cookie",
    [
      "cms_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
      "cms_session=; Path=/; HttpOnly; Max-Age=0",
    ]
  );

  if (req.method === "GET") {
    res.statusCode = 302;
    res.setHeader("Location", "/admin.html");
    res.end();
    return;
  }

  return res.status(200).json({ success: true, message: "Logged out" });
}
