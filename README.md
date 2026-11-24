# Abhishek Thakur — Portfolio (Vercel Edition)

Modern, fast, SEO-optimized portfolio for Junior Web Designer & WordPress/CMS Specialist.

**Live:** https://abhi-thakur-web.vercel.app  
**Stack:** React 19 + Vite 7 + Tailwind 4

---

## Latest Improvements (2026-10-19)

**Backup branch created before changes:** `backup-before-improvements-2026-10-19`

### What was added
- ✅ **Services** section (WordPress, CMS, Design-to-Code, Responsive, Maintenance)
- ✅ **Process** section (6-step workflow with timeline)
- ✅ **FAQ** accordion section
- ✅ Updated navigation links for new sections
- ✅ Improved content loading (`src/data/content.js`) for services / process / faqs
- ✅ Projects already have graceful image placeholders (add real screenshots later in `content/projects.json` + `/public/`)

### CMS / Admin
- The canonical CMS is available at `/admin/`.
- Legacy CMS entry points redirect to `/admin/`.

### Still recommended later
- Add real project screenshots (`image` field in projects.json)
- Add profile photo (`photo` in personal.json)
- Fill testimonials when you have client feedback
- Optional: light/dark toggle, analytics, custom domain

---

## 🚀 Previous fixes (Performance + SEO + Real-world Ready)

### Removed (as requested earlier)
- ❌ `netlify.toml` — Netlify integration removed
- ❌ Decap CMS related auth & docs cleaned in previous iteration
- ❌ GitHub Pages workflow removed (Vercel only now)

### Performance Improvements
- ✅ Code splitting & manual chunks
- ✅ content-visibility, font optimization, GPU acceleration
- ✅ Prefers-reduced-motion support

### SEO Improvements
- ✅ Full meta tags, Open Graph + Twitter Cards
- ✅ JSON-LD structured data
- ✅ robots.txt + sitemap.xml + manifest.json

### Real-world Ready
- ✅ Real contact API (`POST /api/contact`) with honeypot + validation
- ✅ Security headers in `vercel.json`
- ✅ Content driven by `/content/*.json` (easy Git workflow)

---

## 📁 Structure

```
content/          # All text content as JSON (easy to edit)
  personal.json
  projects.json, skills.json, experience.json, etc.
  services/*.json
  process.json, faqs.json, sections.json
public/
  favicon.svg
  og-image.png
  robots.txt, sitemap.xml, manifest.json
  media/          # resume PDF etc.
  admin/
    index.html     # canonical CMS shell
src/
  components/     # Hero, About, Projects, Skills, Experience, Services, Process, FAQ, Contact, Footer
  data/content.js # Loads all JSON
api/
  contact.ts      # Vercel serverless function
  admin/          # existing admin endpoints (kept)
```

---

## 🛠 Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview dist
```

---

## 🌐 Deploy to Vercel

1. Import repo on Vercel: https://vercel.com/new
2. Framework: Vite
3. Build command: `npm run build`
4. Output: `dist`
5. Required **server-only** contact environment variables (see [.env.example](./.env.example)):

   | Variable | Purpose |
   | --- | --- |
   | `RESEND_API_KEY` | Resend API key with permission to send email. |
   | `CONTACT_TO_EMAIL` | Inbox that receives portfolio enquiries. |
   | `CONTACT_FROM_EMAIL` | Sender address on a domain verified with Resend; optionally `Portfolio <address@domain>`. |
   | `CONTACT_ALLOWED_ORIGIN` | Exact permitted website origin, e.g. `https://abhi-thakur-web.vercel.app`, without a trailing slash or path. |
   | `UPSTASH_REDIS_REST_URL` | HTTPS REST endpoint of an Upstash Redis database shared by the API instances. |
   | `UPSTASH_REDIS_REST_TOKEN` | Read/write REST token for that database. |

Set these in the appropriate Vercel environment. Never use a `VITE_` prefix for secrets, embed them in browser code, or commit real values. Missing settings return an unavailable response; messages are not silently logged or forwarded to another email service.

### GitHub OAuth setup

1. Create a GitHub OAuth App.
2. Set the Homepage URL to `https://abhi-thakur-web.vercel.app/`.
3. Set the Authorization callback URL to `https://abhi-thakur-web.vercel.app/api/admin/callback`.
4. Configure `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `CMS_SESSION_SECRET`, `CMS_GITHUB_USERNAME`, `GITHUB_REPO`, and `GITHUB_BRANCH` in Vercel.
5. For preview deployments, configure a separate OAuth App or exact preview callback URL if live OAuth testing is required there.

### Resend and Redis setup

1. Create a Resend API key and verify the sending domain.
2. Set `CONTACT_FROM_EMAIL` to a sender on the verified domain.
3. Set `CONTACT_TO_EMAIL` to the destination inbox.
4. Set `CONTACT_ALLOWED_ORIGIN` to the exact public origin without a trailing slash.
5. Create an Upstash Redis database and configure its HTTPS REST URL and read/write token.

CMS and GitHub publishing variables:

| Variable | Purpose |
| --- | --- |
| `GITHUB_OAUTH_CLIENT_ID` | GitHub OAuth App client ID used by `/api/admin/login`. |
| `GITHUB_OAUTH_CLIENT_SECRET` | GitHub OAuth App client secret used only by server callbacks. |
| `CMS_SESSION_SECRET` | Long random server-only secret used to encrypt CMS session cookies. |
| `CMS_GITHUB_USERNAME` | Exact GitHub username allowed to access `/admin/`. |
| `GITHUB_REPO` | Optional repository in `owner/name` form; defaults to `abhi-thakur01/portfolio`. |
| `GITHUB_BRANCH` | Required for consistent reads/writes; typically `main`. | Missing settings return an unavailable response; messages are not silently logged or forwarded to another email service.

Setup references: [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email), [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi).

---

## 📧 Contact Form Flow

Frontend ([Contact.jsx](./src/components/Contact.jsx)) → `POST /api/contact` → [contact.ts](./api/contact.ts) → Resend.

- Browser and API validate trimmed names (2–100 characters), email addresses (up to 254 characters), and required messages (10–5,000 characters).
- The API accepts JSON only, limits request size to 32 KiB, and rejects malformed/non-string fields.
- The hidden `website` honeypot returns a generic success without sending email.
- Only `CONTACT_ALLOWED_ORIGIN` is accepted. Other or missing browser origins are rejected; CORS is not an authentication mechanism for non-browser clients.
- A Redis Lua operation atomically enforces **5 valid submission attempts per IP per 10-minute fixed window** across instances. Attempts are counted before delivery, including provider failures. Preflight, invalid input and honeypot requests do not consume email quota.
- Limited requests return `429` with `Retry-After`. Missing configuration or unavailable rate limiting returns `503`; sending is never allowed without the limiter.
- The limiter uses a keyed hash instead of storing raw IPs. In Vercel it trusts the platform-managed `x-forwarded-for` header; locally it uses the socket IP. See [Vercel request headers](https://vercel.com/docs/headers/request-headers).
- Resend must confirm acceptance with an email ID before success is returned. Provider failures return a generic error without exposing credentials or provider response bodies. There is no FormSubmit fallback.
- The existing form shows loading, success, and error states, prevents duplicate in-flight submissions, and retains entered text after errors.

### Local verification

`npm run dev` and `npm run preview` serve the Vite frontend only; they do not execute Vercel's API functions. To try the full form locally, run the project with Vercel CLI's `vercel dev`, provide the server environment variables, and set `CONTACT_ALLOWED_ORIGIN` to the exact local origin shown by that server (commonly `http://localhost:3000`). Use an isolated Redis database/environment for local testing.

Run the focused contact tests, TypeScript check, and production build:

```bash
node --test tests/contact*.test.mjs
node node_modules/typescript/bin/tsc --noEmit
npm run build
```

The tests mock Resend and Redis; they do not send email or require real secrets. Real delivery still requires the configured Resend sender/domain and Redis database.

---

## 🔍 SEO Checklist

- [x] Title, description, canonical, robots, sitemap
- [x] OG + Twitter large image
- [x] JSON-LD Person + Service + FAQ
- [x] favicon.svg + manifest
- [x] Real contact backend

TODO (optional future):
- [ ] Add real project screenshots in `/public/projects/`
- [ ] Add blog with MDX
- [ ] Add analytics (Plausible / GA4)

---

## 📄 License

Private portfolio — not for redistribution.
