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
- Existing admin/CMS related files (`api/admin/*`, `public/admin*`) left untouched so you can continue using or refining them.

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
5. Env vars (optional):
   - `RESEND_API_KEY` — from https://resend.com (free 100/day)
   - `CONTACT_TO_EMAIL` — your email (default: thakurabhi8925@gmail.com)
   - `CONTACT_FROM_EMAIL` — from address (optional)

If `RESEND_API_KEY` not set, form still works and logs to Vercel logs.

---

## 📧 Contact Form Flow

Frontend (`Contact.jsx`) → `fetch('/api/contact')` → `api/contact.ts`
- Honeypot field `website` blocks bots
- Validates name, email, message length
- If Resend key present: sends HTML email
- Else: logs to console (visible in Vercel > Logs)

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
