# Attribution

This file was added by the distributor and is not an upstream Creative Tim document.

## Upstream source

- Product page: https://www.creative-tim.com/product/material-dashboard-shadcn
- Demo: https://demos.creative-tim.com/material-dashboard-shadcn/
- Repository: https://github.com/creativetimofficial/material-dashboard-shadcn
- Pinned commit: `e51aefd09b59452c4dacdaf3de88bed91e9b911e`

## License

Upstream `LICENSE.md` is MIT:

```
MIT License
Copyright (c) 2025 Creative Tim (https://www.creative-tim.com)
```

Keep that copyright notice with the software.
This distribution does not invent a different copyright holder.

## What changed in this distribution

- Replaced runtime Unsplash portrait URLs with local SVG avatars under `client/public/images/avatars/`.
- Neutralized auth form credential logging and network submit; forms show a local accessible demo status.
- Neutralized subscription plan, contact sales, upgrade, payment, and invoice actions so they stay demo-only with no payment, mailto, or live sales navigation.
- Google and GitHub auth buttons stay local and do not navigate to live OAuth.
- Footer Creative Tim attribution is kept; `_ga` and other tracking query params were stripped; external links use `rel="noopener noreferrer"`.
- Auth page links now use `react-router-dom` to match the app `HashRouter` instead of unused `wouter`.
- Production Vite base is `/` (`package.json` `homepage` and `build:client`) so owned preview is not stuck under `/material-dashboard-shadcn/`.
- Added `vercel.json` for a static Vite build to `dist/public`.
- Added a local `favicon.ico` / `favicon.svg` so the hosted preview does not 404 on the browser's default favicon request.
- Kept Express/Neon/Passport scaffold files.
- Removed two Replit-only Vite plugins because their pinned npm metadata did not identify license terms or source repositories.
- Kept bundled `material-persons.jpg` and `texture-background.jpg`.
- Preserved Creative Tim branding and Material Shadcn UI without restyling.

See `21ST-IMPORT.md`, `THIRD_PARTY_NOTICES.md`, and `modifications.json` for run instructions, dependency notices, and a machine-readable change list.
