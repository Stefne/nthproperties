# Nth Properties website

Static site for Nth Properties, built with [Eleventy](https://www.11ty.dev/) and hosted on Cloudflare Pages (free tier).

## Before launch (required)

Open `src/_data/site.js` and fill in:

| Field | What | Why |
|---|---|---|
| `brokerage` / `brokerageAddress` | Licensed firm name and office address | WA advertising rules require the firm name on all advertising |
| `email` | Public contact email | Shown in footer and contact page |
| `web3formsKey` | Free key from web3forms.com (enter the email that should receive leads) | Makes the contact and listing forms deliver to your inbox |

Also in `site.js`: `cfAnalyticsToken` (free Cloudflare Web Analytics), `social` links, and the `stats` proof band (set `showStats: true` once real numbers are in).

The build prints a warning until the required fields are filled in. Replace the bios in `src/_data/team.json`.

## Photo slots

Upload a JPG to any of these paths and it appears automatically. Until then a styled navy panel shows. Any size works; the build resizes and converts to WebP.

| Path | Where it shows | Suggested subject |
|---|---|---|
| `src/assets/img/site/hero.jpg` | Home page hero, full screen | Twilight exterior or skyline, landscape, 2400px+ wide |
| `src/assets/img/site/intro.jpg` | Home "Local knowledge" section (portrait crop) | Interior or the two of you |
| `src/assets/img/site/home-value.jpg` | Home seller section + /home-value/ hero | Classic NW home exterior |
| `src/assets/img/site/market-report.jpg` | Market report band | Aerial / water / skyline |
| `src/assets/img/site/cta.jpg` | "Considering a move" band on every page | Mount Rainier or Sound at dusk |
| `src/assets/img/site/areas/seattle.jpg` (bellevue, kent, tacoma) | Area tiles and area page heroes | Recognizable local scene |
| `src/assets/img/team/stefne.jpg`, `zach.jpg` | Team page + agent card on listings | Headshot, portrait 4:5 |

Free commercial-use stock: unsplash.com (credit optional). Your own professional photos convert better.

## Lead forms

Every form sends to the Web3Forms email with a subject that tells you the lead type: `SELLER LEAD: Home valuation request`, `BUYER LEAD: Search request`, `Showing request: <address>`, `New website inquiry`, `Market report signup`. Set an email filter on those subjects to route or prioritize them.

## Adding a listing (no coding)

1. In GitHub, open `src/listings/_TEMPLATE.md.txt`, copy its contents.
2. Create a new file in `src/listings/` named like `123-main-st-bellevue.md`, paste, fill in the fields.
3. Upload photos to `src/assets/img/listings/123-main-st-bellevue/` and list them under `photos:` (first one is the cover). Resize to about 2000px wide, JPG, under 500 KB each.
4. Commit. Cloudflare rebuilds and the listing is live in about a minute at `/listings/123-main-st-bellevue/`.

Listing fields added in v1.1: `agent:` (name from team.json, shown as the listing agent with direct phone) and `openHouses:` (dates in the past hide automatically, and the next one shows as a badge on the card).

To change status, edit `status:` (Active, Coming Soon, Pending, Sold). `featured: true` puts it on the home page. `draft: true` hides it from the live site.

The two `sample-*.md` listings and `blog/sample-post.md` are drafts for layout preview only. Delete them once real content exists.

## Sales history (Track Record page + home page map)

`src/_data/sales.csv` holds every closed sale, one row each. Keep a Google Sheet with the same columns and paste it in (File > Download > CSV), or edit the file in GitHub. Stats on the site (total volume, homes sold, average price, cities) are calculated from this file automatically, so they're always real.

Columns: `address, city, price, date, side, type, beds, baths, sqft, lat, lng, photo, draft`. `lat`/`lng` put the sale on the map: right-click the address in Google Maps and click the coordinates to copy them. `photo` is optional. The six sample rows have `draft` = `yes` and only show in local previews; delete them once real sales are in.

## Staging & Design page

Built at `/design/`, hidden on the live site until `showDesign: true` in `site.js`. Before/after pairs live in `src/_data/design.json` (drag the slider to compare).

## Searching all homes (IDX)

`idxSearchUrl` in `site.js` points the "Search all homes" links at a full-market search page (your brokerage's free IDX search or a paid IDX vendor). Blank = sends people to the buyer search request form.

## Other content

- Blog post: new `.md` file in `src/blog/` (copy `sample-post.md`, remove `draft: true`).
- Areas: `src/_data/areas.json`. Services: `src/_data/services.json`.
- Testimonials: add real quotes (with client permission) to `src/_data/testimonials.json`, then set `showTestimonials: true` in `site.js`.
- Hero photo: add `src/assets/img/hero.jpg` and set `heroImage: "/assets/img/hero.jpg"`.
- Brand colors and fonts: the `:root` block at the top of `src/assets/css/style.css`.

## Deploy to Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → select this repo.
2. Framework preset: None. Build command: `npm run build`. Output directory: `_site`.
3. Deploy, then Custom domains → add `nthproperty.com` (and `www`).

Every commit to `main` redeploys automatically. Other branches get preview URLs.

## Local preview (optional)

Requires Node 20+.

```bash
npm install
npm start
```

Opens at http://localhost:8080 with draft content visible. `npm run build` produces the production site in `_site/`.

## v1.1: MLS feed

Listing pages read from front-matter fields (price, beds, baths, sqft, city, status, photos). An NWMLS/IDX feed can populate the same fields from a data file at build time, so templates won't need to change. Vendor choice and broker approval come first.
