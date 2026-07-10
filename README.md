# scott-adams.ai

Personal brand site for **Scott Adams** — Director, AI Workforce Solutions at Microsoft.
A clean, minimal, monochrome single-page site that showcases GitHub work and links out to LinkedIn.

Static site — no build step. Just `index.html`, `styles.css`, and a `CNAME`.

---

## Deploy to GitHub Pages

### 1. Create the repo
The simplest setup is a **user site**, which serves from the repo named exactly after your account:

```bash
cd scott-adams-ai
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/scadam/scadam.github.io.git
git push -u origin main
```

> Using `scadam.github.io` publishes at the root domain automatically. Alternatively use any repo name (e.g. `site`) and set the Pages source in step 2 — the custom domain works either way.

### 2. Turn on Pages
1. Repo → **Settings** → **Pages**
2. **Source**: Deploy from a branch → `main` / `/ (root)` → **Save**
3. Under **Custom domain**, enter `scott-adams.ai` → **Save** (the included `CNAME` file already sets this)
4. Once DNS verifies, tick **Enforce HTTPS**

### 3. Configure DNS (at your domain registrar for scott-adams.ai)

**Apex domain** `scott-adams.ai` → add four A records to GitHub's IPs:

| Type | Name | Value           |
|------|------|-----------------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |

(Optional, IPv6 AAAA records: `2606:50c0:8000::153`, `...8001::153`, `...8002::153`, `...8003::153`)

**www subdomain** (recommended redirect):

| Type  | Name | Value                |
|-------|------|----------------------|
| CNAME | www  | scadam.github.io     |

DNS can take up to an hour (sometimes longer) to propagate. GitHub will then issue a free TLS certificate automatically.

---

## Local preview

```bash
# any static server works, e.g.
python -m http.server 8000
# then open http://localhost:8000
```

## Updating content

Repo cards live directly in `index.html` under the `#work` section. Edit the
`<a class="card">` blocks to add, remove, or reorder projects. Colours and
spacing are controlled by the CSS variables at the top of `styles.css`
(light and dark modes both included).
