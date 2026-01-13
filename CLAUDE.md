# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GreenGuard Automation** company website - a critical asset for investors, grant evaluators, and partners. This is a static site hosted on GitHub Pages.

**Company**: Tractor-mounted laser weeding systems for organic/conventional agriculture. 5-6x cheaper than US alternatives.

## Development

```bash
# Local server (required - don't open HTML files directly)
python3 -m http.server 8000
# Open: http://localhost:8000
```

Deployment: Push to `main` branch triggers GitHub Pages deploy.

## Architecture

Static single-page site built on Bootstrap (Axis template).

- `index.html` - Main page with sections: Hero, Mission, Technology, Team, Contact, Supporters
- `assets/css/main.css` - All custom styles
- `assets/js/main.js` - Core interactions (mobile nav, scroll effects, animations)
- `assets/js/hero-network.js` - Interactive neural network canvas visualization
- `assets/js/hero-animation.js` - Hero section parallax effects
- `assets/vendor/` - Bootstrap 5, AOS (scroll animations), GLightbox, Swiper

## Multi-AI Workflow

When opened at `20GGA_AREAS/` level, private context is available:

```
20GGA_AREAS/
├── GreenGuard-website/   ← This repo (public)
└── _gga-internal/        ← Private context
    └── _context/
        ├── ai_context.md     # Company info, tech status
        ├── text_context.md   # Approved website copy
        └── image_context.md  # Media registry
```

Read context files before making content changes.

## Contact Information

| Field | Value |
|-------|-------|
| Email | contact@greenguardautomation.com |
| Website | greenguardautomation.com |
| Address | Universitetsbyen 76, 8000 Aarhus N |
| Phone (Thomas) | 42 56 88 48 |
| Phone (Benjamin) | 22 86 23 23 |
| LinkedIn | https://www.linkedin.com/company/greenguard-automation |

## Team

- **Benjamin Tvorup** - Commercial, partnerships
- **Thomas Bjerrum** - Optics, laser control
- **Christian Dragkilde** - Mechanical, prototyping
- **Thue Tonnesen** - Tech infrastructure

## Constraints

- Keep Bootstrap template attribution in footer (license requirement)
- No "Europe's first" or unverified superlatives
- No technology video/GIF display (patent concerns)
- No degrees (M.Sc., B.Sc.) in team descriptions
- Partners section labeled "Supported By" (not "Investors")
- English only
