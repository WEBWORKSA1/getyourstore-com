# GetYourStore.com — Phase-wise Build Prompts

Concept: **the free "launch your online store" hub and done-for-you store-build lead engine.** Free tools and guides bring the traffic, AdSense earns on every page, and the "Get Your Store Built" funnel turns visitors into high-value leads.

Each phase below is a self-contained prompt. Run them in order. Every phase inherits the **Global rules**.

---

## Global rules (apply to every phase)

- Domain: GetYourStore.com. Static site; Jekyll on GitHub Pages (free plan, `main` branch, root folder). No server code, no build step beyond GitHub Pages' native Jekyll.
- AdSense publisher ID `ca-pub-6620975821265271`. Put this exact tag in the `<head>` of every page (via the shared layout):
  `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`
  Use Auto ads. Never place ads inside forms, near buttons, or in a way that could cause accidental clicks. Add `ads.txt` with `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.
- On top of every page, a full-width strip: "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership", linked to `https://web.works/contact`.
- The only contact address is the owner's Gmail. It must never appear in HTML, text, JSON or sitemap. Store it XOR-encoded and reversed in JavaScript, decode it only at click/submit time, and use it for `mailto:` buttons and as the FormSubmit AJAX endpoint (`https://formsubmit.co/ajax/<address>`).
- Every form: honeypot field, consent checkbox linked to the Privacy Policy, inline success/error state, and a `_subject` that names the form.
- Trademark-safe: present the brand as the descriptive domain "GetYourStore.com". Never use ™/® on it, never use third-party logos, and mention platform names only for factual comparison. Add a Trademark & Copyright Disclosure page and a footer disclosure line.
- AdSense approval checklist: original long-form content (12+ guides), About, Contact, Privacy Policy (with Google advertising cookies and opt-out links), Terms, Cookie Policy, Disclaimer, clear navigation, no empty pages, no "coming soon", no fake testimonials or stats, a cookie-consent banner, a mobile-first layout, fast loads.
- Accessibility: semantic HTML, labels on every input, focus states, `prefers-reduced-motion`, WCAG AA contrast, light and dark themes.
- SEO: unique title and meta description per page, canonical, Open Graph, JSON-LD (Organization, WebSite, Article, FAQPage, HowTo where it fits), `sitemap.xml`, `robots.txt`, clean internal linking.

---

## Phase 1 — Foundation and design system

> Build the Jekyll skeleton for GetYourStore.com: `_config.yml`, `_layouts/default.html`, `_layouts/guide.html`, `_includes/` (header, footer, lead band, cookie banner), `assets/css/site.css`, `assets/js/main.js`, favicon SVG, `site.webmanifest`, `CNAME` (getyourstore.com), `ads.txt`, `robots.txt`, `404.html`.
> Design: warm paper background, deep ink text, a commerce-green brand colour with a tangerine accent, rounded cards, receipt/price-tag motifs, Bricolage Grotesque headings with Inter body text. Include a dark-mode toggle that remembers the choice.
> Header: logo, nav (Start, Compare, Tools ▾, Guides, Videos, News), search button, theme toggle, a "Get It Built" primary CTA and a mobile drawer. Footer: four link columns, disclosure line, auto-updating year. Add a sticky mobile "Free quote" CTA.

## Phase 2 — Homepage that converts

> Hero: "Get your store live — the right way." Interactive live storefront preview: the visitor types a store name, picks a niche and a colour, and a mock storefront card updates instantly with the name, a generated tagline and sample products. CTAs: "Get my store built" and "Find my platform (60-sec quiz)".
> Sections: three paths (I have an idea / I have products / I already sell offline), a tools grid, a 10-step roadmap preview, a seasonal selling countdown (auto-computes the next Black Friday, Cyber Monday, Christmas, Valentine's Day, Mother's Day and back-to-school dates), a tip of the day (rotates by date), latest guides, a featured video, a lead-gen block with a short form, contest/support/careers teasers, latest news (from `data/news.json`), and an FAQ with FAQPage schema.

## Phase 3 — Free tools (traffic engine)

> Create `/tools/` hub plus 8 client-side tools, each on its own SEO page with an explainer, FAQ and a "want this done for you?" CTA:
> 1. Platform Picker quiz (6 questions, weighted scoring across 10+ platforms, shows top 3 with reasons)
> 2. Store Name Generator (keywords + style → 30 brandable names, favourites, copy, domain-check links, premium-domain inquiry CTA)
> 3. Profit Margin Calculator (cost, price, shipping, fee %, ad cost → margin, markup, profit/unit, price for a target margin)
> 4. Startup Cost Estimator (editable line items, lean/standard/pro presets → first-year total and monthly run-rate)
> 5. Platform Fee Calculator (compare 3 user-defined plans by effective fee rate at your sales volume)
> 6. Break-even & ROAS Calculator (units to break even, break-even ROAS, max cost per acquisition)
> 7. Launch Checklist (40+ items, progress saved in localStorage, printable)
> 8. Product Description Writer (template-based: name, features, audience, tone → 3 description variants)

## Phase 4 — Content for AdSense approval and SEO

> Write 12+ original, genuinely useful guides (700–1,200 words each) in `/guides/`, using the guide layout (reading time, table of contents, last-reviewed date, related tools, CTA, Article schema). Topics: how to start an online store, choosing a platform, Shopify vs WooCommerce, dropshipping vs inventory vs print-on-demand, naming and domains, product photography on a budget, product pages that convert, pricing, payments/shipping/taxes basics, the first 100 customers, ecommerce SEO, legal pages for stores, selling digital products.
> Add `/start.html` (interactive 10-step launch roadmap with saved progress), `/compare.html` (filterable comparison of 12 platforms using stable, qualitative criteria and editorial ratings, with links to official pricing pages rather than hard-coded prices), `/resources.html` (curated free official resources).

## Phase 5 — Video and auto-updating content

> `/videos.html`: a verified YouTube tutorial library with privacy-friendly click-to-load embeds (youtube-nocookie), category filters and "more on YouTube" search links.
> `/news.html` + `data/news.json`: a GitHub Actions workflow (`.github/workflows/update-content.yml`, daily cron + manual run) runs `scripts/update_news.py` (Python standard library only) to pull ecommerce news RSS feeds, dedupe, keep the latest 30 items and commit the JSON. The page and homepage widget render it client-side with a graceful fallback.
> Other self-updating elements: seasonal countdowns, the monthly contest deadline, tip of the day, footer year, site search built from a Jekyll-generated `search.json`.

## Phase 6 — Lead generation (core revenue)

> `/get-your-store-built.html`: a high-converting landing page with a value proposition, what's included, a 4-step process, deliverables, an FAQ, and a **multi-step brief form** (progress bar, saved draft):
> Step 1 — what you sell and your current stage; Step 2 — platform preference, product count, features needed; Step 3 — budget range and timeline; Step 4 — name, email, phone (optional), country, current website, notes, consent. Show a success screen with next steps.
> Also add a one-field **Free Store Audit** form (URL + email) and a sitewide "free 30-day launch plan" email capture. Every tool and guide ends with a contextual CTA into this funnel.

## Phase 7 — Community and monetization pages

> `/support.html`: one-time preset amounts and monthly supporter tiers, an allocation picker (operations, promotions, marketing, hiring talent, contest prizes), an optional message and a supporter wall opt-in. The pledge form emails the owner, who replies with a secure payment link (no payment data is collected on the site).
> `/contests.html`: the Monthly Store Launch Challenge, with a countdown to the end of the current month, prizes, judging criteria, an entry form, official rules (no purchase necessary, void where prohibited, eligibility, privacy) and a "sponsor a prize" CTA.
> `/careers.html`: open roles (store developers, designers, writers, video creators, SEO, community moderators) and an expert-network application form.
> `/advertise.html`: sponsorship packages (homepage spotlight, tool sponsor, guide sponsor, contest title sponsor, newsletter), an audience description, an inquiry form and the web.works link.

## Phase 8 — Trust, legal and compliance

> `/about.html` (mission, editorial policy, how we rate), `/contact.html` (form + hidden-address email button + web.works link), `/privacy.html` (Google AdSense cookies, personalised-ads opt-out, FormSubmit processing, YouTube nocookie, Google Fonts, localStorage, GDPR/CCPA rights), `/terms.html`, `/cookies.html`, `/disclaimer.html` (no professional advice, affiliate and sponsorship disclosure), `/trademark.html` (independence from any similarly named business, third-party marks belong to their owners, copyright notice, takedown contact).

## Phase 9 — QA, deploy, publish

> Check: AdSense tag on every page, the top contact strip on every page, zero occurrences of the address in the repo except the encoded array, all internal links resolve, forms submit, it works at 360px width, dark mode works, there are no console errors, and `sitemap.xml`/`robots.txt`/`ads.txt` are correct.
> Push to `WEBWORKSA1/getyourstore-com` on `main`. Enable GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root). Point DNS: apex A records 185.199.108.153, .109.153, .110.153, .111.153 and `www` CNAME → `webworksa1.github.io`. Then enable "Enforce HTTPS". Activate FormSubmit via the one-time email it sends on the first submission. Apply to AdSense once the domain resolves.

## Phase 10 — Growth (post-launch)

> Add 4 guides a month targeting "X vs Y" and "how to sell X online" queries; add affiliate links with disclosure once approved; publish monthly contest winners; build a newsletter; add a sponsor slot to each tool; localize the top guides (FR/ES/HI); add a "store teardown" video series.
