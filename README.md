# Aura

A modern, responsive commerce landing page inspired by Shopify's homepage —
built with plain HTML, CSS, and JavaScript (no build step required).

## Features

- Sticky header with blur backdrop and scroll-aware shadow
- Animated hero with floating cards and a morphing gradient blob
- Trusted-by logo strip
- 6-up feature grid
- Dark "built to scale" showcase with stat tiles
- 3-tier pricing section with a highlighted plan
- Gradient call-to-action band
- Full footer with link columns
- Mobile menu and fully responsive layout

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Page markup and sections |
| `styles.css` | Design tokens, layout, and responsive rules |
| `script.js`  | Header scroll state, mobile menu, form feedback |
