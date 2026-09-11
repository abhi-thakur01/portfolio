# Abhishek Thakur — Portfolio (Vercel Edition)

Modern, fast, SEO-optimized portfolio for Junior Web Designer & WordPress/CMS Specialist.

**Live:** https://abhishekthakur.in (Vercel)  
**Stack:** React 19 + Vite 7 + Tailwind 4 + TypeScript

---

## 🚀 What was fixed (Performance + SEO + Real-world Ready)

### Removed (as requested)
- ❌ `netlify.toml` — Netlify integration removed
- ❌ `public/admin/` — Decap CMS removed
- ❌ `api/auth.ts` — GitHub OAuth for CMS removed
- ❌ `ADMIN_SETUP.md` — CMS docs removed
- ❌ `.github/workflows/deploy.yml` — GitHub Pages workflow removed (Vercel only now)

### Performance Improvements
- ✅ **Code splitting:** `React.lazy()` + `Suspense` for all below-fold sections (About, Skills, Services, Calculator, Process, Work, SEO, FAQ, Contact, Footer)
- ✅ **Manual chunks:** `vendor`, `icons`, `confetti` split from main bundle
  - Before: 290KB single chunk (86KB gzip)
  - After: 216KB main + 2-15KB lazy chunks (68KB gzip initial) — **~20% reduction**
- ✅ **content-visibility: auto** for below-fold sections
- ✅ **Font optimization:** Only 2-3 weights per family, `display=swap`, preconnect
- ✅ **GPU acceleration:** `translate3d` for marquee, `will-change` for animations
- ✅ **Prefers-reduced-motion** support for accessibility
- ✅ **Scrollbar-gutter: stable** to prevent layout shift

### SEO Improvements
- ✅ Full meta tags: title, description, keywords, author, canonical, robots
- ✅ Open Graph + Twitter Cards with `og-image.png` (1200x630)
- ✅ JSON-LD structured data: Person, ProfessionalService, FAQPage
- ✅ `robots.txt` + `sitemap.xml` + `manifest.json` + `favicon.svg`
- ✅ `theme-color`, `color-scheme`, `apple-touch-icon`
- ✅ Semantic HTML, proper heading hierarchy, `aria-labels`
- ✅ Fixed fake "Google Verified" claim → "Target Lighthouse Scores — Built For" with disclaimer

### Real-world Ready / Core Quality
- ✅ **Real contact API:** `POST /api/contact` (Vercel serverless)
  - Validation, honeypot anti-spam, rate-limit ready
  - Optional Resend integration for real emails (falls back to Vercel logs)
  - Frontend now shows loading, error, success states properly
- ✅ **Security headers** in `vercel.json`: nosniff, DENY frame, XSS protection
- ✅ **Cache headers** for assets: immutable 1 year
- ✅ **Error handling** in all forms, confetti try/catch
- ✅ **Accessibility:** focus-visible outline, aria-labels, keyboard nav, reduced motion
- ✅ **No CMS dependency** — content in `/content/*.json` directly, simple Git workflow

---

## 📁 Structure

```
content/          # All text content as JSON (easy to edit)
  personal.json
  hero.json, nav.json, skills.json, etc.
  projects/*.json
  services/*.json
public/
  favicon.svg
  og-image.png    # 1200x630 OG image
  robots.txt
  sitemap.xml
  manifest.json
src/
  components/     # Lazy-loaded below-fold
  data/portfolioData.ts  # Loads JSON
api/
  contact.ts      # Vercel serverless function
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
   - `CONTACT_FROM_EMAIL` — from address (default: portfolio@abhishekthakur.in)

If `RESEND_API_KEY` not set, form still works and logs to Vercel logs.

### Custom Domain
Add `abhishekthakur.in` in Vercel > Settings > Domains

---

## 📧 Contact Form Flow

Frontend (`Contact.tsx`) → `fetch('/api/contact')` → `api/contact.ts`
- Honeypot field `website` blocks bots
- Validates name, email, message length
- If Resend key present: sends HTML email
- Else: logs to console (visible in Vercel > Logs)

Test locally:
```bash
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello from test, this is a longer message"}'
```

---

## 🔍 SEO Checklist Done

- [x] Title 60 chars, description 155 chars
- [x] Canonical, robots, sitemap
- [x] OG + Twitter large image
- [x] JSON-LD Person + Service + FAQ
- [x] favicon.svg + manifest
- [x] No fake lighthouse claims
- [x] Real contact backend

TODO (optional future):
- [ ] Add real project screenshots in `/public/projects/`
- [ ] Add blog with MDX
- [ ] Add analytics (Plausible / GA4)

---

## 📄 License

Private portfolio — not for redistribution.
