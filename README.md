# GreenGuard Automation Website

Company website for GreenGuard Automation - laser weed control technology.

**Live site**: [greenguardautomation.com](https://greenguardautomation.com)

## Local Development

```bash
# Start local server
python3 -m http.server 8000
# Open: http://localhost:8000
```

## Structure

```
├── index.html          # Main single-page site
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── 404.html            # Error page
├── CNAME               # Domain configuration
└── assets/
    ├── css/main.css    # Stylesheet
    ├── js/             # JavaScript files
    ├── img/            # Images (brand, team, partners)
    ├── animations/     # Technology demo GIF
    └── vendor/         # Bootstrap, AOS, etc.
```

## Deployment

Hosted via GitHub Pages. Push to `main` branch to deploy.
