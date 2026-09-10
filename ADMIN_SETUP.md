# Portfolio Content Dashboard Setup

## Admin URL

- **GitHub Pages:** https://abhi-thakur01.github.io/portfolio/admin/
- **Vercel (later):** https://your-domain.vercel.app/admin/

## One-time GitHub OAuth setup (required for login)

1. Go to: https://github.com/settings/developers
2. **OAuth Apps** → **New OAuth App**
3. Fill:
   - **Application name:** Portfolio CMS
   - **Homepage URL:** https://abhi-thakur01.github.io/portfolio
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
4. Register → copy **Client ID**
5. Generate a **Client Secret**
6. Open: https://app.netlify.com → (free account) → Site (or create blank) → Site settings → Access control → OAuth → Install provider → GitHub → paste Client ID + Secret

(Netlify free auth proxy is used so you don't need to host a backend. Your site can still stay on GitHub Pages or Vercel.)

## How to edit content

1. Open `/admin/`
2. Login with GitHub
3. Edit:
   - **Personal Info** — name, email, phone, agency, education
   - **Projects** — add/edit work + upload images
   - **Services** — prices, descriptions
   - **FAQs** — questions & answers
4. Click **Publish** → auto commit to GitHub → site rebuilds

## Images

Upload in the admin (Projects → Cover Image). Files go to `public/uploads/`.

## Vercel later

1. Import this repo on Vercel
2. Build command: `npm run build`
3. Output: `dist`
4. Set env if needed: leave base as `/` in vite.config for root domain
5. Admin works the same at `/admin/`

## Important

After first CMS publish, `src/data/portfolioData.ts` should be kept in sync OR the app should load from `content/` JSON.  
Current site still reads from `portfolioData.ts` — next step is wiring the app to `content/` files so admin edits show live.
