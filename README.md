# GetYourStore.com

The free "launch your online store" hub: 8 browser-based tools, 13 guides, a platform comparison, a video library, a news feed that updates itself daily, and a done-for-you store-build lead funnel. Monetized with Google AdSense, lead generation, sponsorships and supporter contributions.

- **Stack:** Jekyll (native GitHub Pages build), vanilla JS/CSS, no build step.
- **Hosting:** GitHub Pages, free plan, `main` branch, `/` root.
- **Forms:** FormSubmit AJAX. The destination address is XOR-encoded in `assets/js/main.js` and never appears in page source.
- **Automation:** the news page and homepage widget pull fresh headlines live in the browser whenever `data/news.json` is older than 48 hours. `automation/update-content.yml` is a ready-made GitHub Actions job that refreshes `data/news.json` daily (see step 5 below). Countdowns, contest deadlines, the tip of the day and the footer year update on the client side.
- **Docs:** `RESEARCH.md` (37-site niche study and concept), `BUILD-PROMPTS.md` (phase-wise build prompts).

## Go-live checklist

1. Settings → Pages → Source: **Deploy from a branch**, `main`, `/ (root)`.
2. DNS at the registrar for getyourstore.com: A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` CNAME → `webworksa1.github.io`. Then tick **Enforce HTTPS**.
3. Submit any form once and click **Activate** in the FormSubmit confirmation email.
4. Add the site in AdSense (`ca-pub-6620975821265271`); `ads.txt` is already at the root.
5. Optional daily news job: in GitHub, click **Add file → Create new file**, name it `.github/workflows/update-content.yml`, paste the contents of `automation/update-content.yml` and commit. Then set Settings → Actions → General → Workflow permissions to **Read and write**.

© GetYourStore.com. Third-party names are trademarks of their respective owners. See `/trademark.html`.
