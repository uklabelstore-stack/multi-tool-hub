# Image Tools Free

A static multi-page website for free online image tools. It uses plain HTML, CSS, and vanilla JavaScript and runs fully in the browser.

## GitHub Pages deployment

1. Push this repository to GitHub.
2. In the repository settings, open Pages.
3. Set source to `Deploy from a branch`.
4. Choose the `main` branch and the `/ (root)` folder.
5. Save and wait for the GitHub Pages deployment to finish.
6. Your site will be available at:
   `https://<username>.github.io/<repository-name>/`

## Local preview

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Project structure

- `/index.html` — homepage with all tools
- `/css/style.css` — shared styles
- `/js/common.js` — shared theme, utility, and helper logic
- `/js/*.js` — per-tool browser logic
- `/` root HTML pages — one page per target keyword

## Notes

- Files are processed entirely in-browser.
- No backend or external upload service is used.
- Your files never leave your device.
