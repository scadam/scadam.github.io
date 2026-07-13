# scott-adams.ai

Repo-first portfolio for **Scott Adams** — Agent Sales Global Black Belt at
Microsoft. The site presents working reference implementations as business
transformation case studies rather than a résumé.

The homepage includes:

- A source-aligned, deterministic replay of the seven-stage autonomous journey in
	`csm-aiteammate`, using only synthetic redacted data and no external/API calls or
	side effects.
- Three guided, read-only MCP scenarios running against public Azure Container Apps
	endpoints (`retail-mcp`, `L2Q`, and the mocked Coupa server in `ess-mcp`). Each
	scenario reads the tool's `ui://` resource and renders the actual OpenAI Apps SDK
	widget in a sandboxed iframe.
- A filterable, full-size gallery of MCP App/widget surfaces.
- Transformation narratives led by `csm-aiteammate`, followed by `ess-mcp`,
	`retail-mcp`, `L2Q`, and `digital-lawyer`.
- Supporting viewpoints and professional context.

Static site — no build step. The live lab is implemented in `lab.js` using the
Streamable HTTP MCP transport directly from the browser.

## Transformation-lab safety model

- The autonomous CSM replay never calls its operational control plane. Manager,
	sponsor, identity, customer, review and mutation APIs are not in this site's CSP or
	client allowlist.
- The replay follows the repository's real seven-stage ordering and published rule
	IDs, but uses synthetic redacted inputs and disables delivery, persistence and
	mailbox actions.
- Endpoint URLs and tool calls are hard-coded in an allowlist.
- Only read-only demonstration tools are exposed.
- Arbitrary endpoint, tool, or argument entry is intentionally not available.
- Tool-delivered HTML runs without same-origin access, forms, popups, or network
	calls. The host supplies only `toolOutput` and non-mutating Apps SDK bridge methods.
- Widget follow-up prompts are displayed as previews and are not sent to an agent or
	executed as tools.
- No credentials, access keys, connection strings, SAS tokens, or bearer tokens are
	stored or requested by the site.
- Real Workday tenant data and the ServiceNow instance are not used by the public lab.
- Stateful MCP sessions are closed after each scenario where supported.
- If an endpoint cannot be reached from the current origin, the UI clearly labels and
	renders a representative preview rather than pretending it is live.
- The Coupa Container Apps environment suffix is redacted in the visible toolbar. The
	real destination necessarily remains in the static client/CSP so the browser can
	make the direct call; concealing it from source or browser developer tools would
	require a server-side proxy.

The browser allowlist is a UX boundary, not a substitute for server-side security.
Keep these endpoints limited to demonstration data. Before pointing the lab at any
non-demo system, enforce the read-only tool allowlist, origin policy, throttling, and
abuse protection at APIM or another server-side gateway.

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
