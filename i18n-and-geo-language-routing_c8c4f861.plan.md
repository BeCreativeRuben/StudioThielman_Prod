---
name: i18n-and-geo-language-routing
overview: Add Dutch/English translations with URL-based locales (/nl and /en) and geo-based defaulting (BE/NL -> Dutch, elsewhere -> English), with a manual language switch and cookie persistence.
todos:
  - id: add-i18n-core
    content: Add i18next/react-i18next setup and initial en/nl resource files + namespaces.
    status: pending
  - id: locale-routing
    content: Refactor React Router routes to /:lang/*, add redirects from non-prefixed paths, keep /admin unprefixed.
    status: pending
  - id: geo-locale-api
    content: Implement api/locale.ts + api/locale-redirect.ts reading cookie then x-vercel-ip-country (BE/NL->nl else en), with safe fallbacks.
    status: pending
  - id: vercel-root-redirect
    content: Update vercel.json to route / through api/locale-redirect (no client flash).
    status: pending
  - id: update-links-and-switcher
    content: Update Header/Footer links to include locale prefix and add a language toggle that sets the lang cookie + navigates.
    status: pending
  - id: translate-pages
    content: Move page copy into i18n resources page-by-page (start with Header/Footer then Home/Packages/Contact).
    status: pending
isProject: false
---

## What you have today (important constraints)

- This is a **Vite + React Router** SPA (no SSR) and Vercel serves `index.html` for all non-API routes:
```1:15:c:\Users\Ruben\Desktop\StudioThielmanDeadline\StudioThielmanV_3\vercel.json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- Routes are currently **not language-prefixed**:
```31:46:c:\Users\Ruben\Desktop\StudioThielmanDeadline\StudioThielmanV_3\src\App.tsx
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/packages" element={<MainLayout><Packages /></MainLayout>} />
        <Route path="/portfolio" element={<MainLayout><Portfolio /></MainLayout>} />
        <Route path="/portfolio/:slug" element={<MainLayout><PortfolioDetail /></MainLayout>} />
        <Route path="/current-projects" element={<MainLayout><CurrentProjects /></MainLayout>} />
        <Route path="/how-it-works" element={<MainLayout><HowItWorks /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><Privacy /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
      </Routes>
    </Router>
```

- You already have Vercel Node functions in `api/`, so we can read geo headers server-side.

## Recommended approach (matches your choices)

### 1) Translations engine

- Add **`i18next` + `react-i18next`**.
- Create translation resources:
  - [`src/i18n/locales/en/*.json`](src/i18n/locales/en/*.json)
  - [`src/i18n/locales/nl/*.json`](src/i18n/locales/nl/*.json)
- Split into namespaces to keep files manageable (given `Home.tsx`/`Packages.tsx` have lots of copy): `common`, `header`, `footer`, `home`, `packages`, `contact`, etc.

### 2) URL-based locales (SEO/shareable)

- Change routing so every public page is served under **`/en/...`** or **`/nl/...`**.
- Keep `/admin` unprefixed (so existing admin links keep working).
- Add a “missing-locale” redirect route so old links like `/about` redirect to `/<detectedLang>/about`.

### 3) Geo-based default (BE/NL => Dutch)

- Add `api/locale.ts` (JSON response) and `api/locale-redirect.ts` (307 redirect).
- Logic order:

  1. **Cookie override** (if the user switched languages before)
  2. **Geo** from `x-vercel-ip-country` (BE/NL -> `nl`, else `en`)
  3. Fallback to `en` if header is missing (common in local dev; also depends on Vercel plan/settings)

- Update [`vercel.json`](vercel.json) to rewrite **`/`** to `api/locale-redirect` so first-time visitors hit the right language without a client-side flash.

4) Language switcher + consistent Links

- Add a small language toggle in [`src/components/Header.tsx`](src/components/Header.tsx).
- Ensure all `<Link to="...">` include the current locale prefix (your header currently hardcodes `/packages`, `/about`, etc.).
```56:63:c:\Users\Ruben\Desktop\StudioThielmanDeadline\StudioThielmanV_3\src\components\Header.tsx
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/packages', label: 'Packages' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/how-it-works', label: 'How we work' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]
```

- Persist selection by setting a **`lang` cookie** in the browser when the toggle is used, so server-side redirects (like `/`) respect the user’s choice.

### 5) Translate content incrementally

- Start with high-visibility global UI: header/footer/buttons.
- Then move page copy, one page at a time:
  - [`src/pages/Home.tsx`](src/pages/Home.tsx)
  - [`src/pages/Packages.tsx`](src/pages/Packages.tsx)
  - [`src/pages/Contact.tsx`](src/pages/Contact.tsx)
- For big structured blocks (like the packages + FAQ arrays), keep the structure in TS but move strings into i18n JSON (or move the whole arrays into i18n using `returnObjects`).

### 6) Optional: `.be` domain later (easy)

- If you add `studiothielman.be` later, simplest is: point it to the same Vercel project and make `/` redirect to `/nl/` (or use host-based logic in `api/locale-redirect`). This is optional; with `/nl` and `/en` URLs you already get the main SEO/share benefits.

## Notes / gotchas

- Because this is a SPA (no SSR), search engine indexing depends on JS execution. The `/en` + `/nl` URL strategy still helps sharing and organization, but it’s not equivalent to SSR i18n.
- Vercel geo headers may be unavailable locally; we’ll include a safe fallback and (optionally) a dev query param to simulate `country=BE`/`NL`.