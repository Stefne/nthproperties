# Nth Properties website

Static site for Nth Properties, built with [Eleventy](https://www.11ty.dev/) and hosted on Cloudflare Pages (free tier).

## Before launch (required)

Open `src/_data/site.js` and fill in:

| Field | What | Why |
|---|---|---|
| `brokerage` / `brokerageAddress` | Licensed firm name and office address | WA advertising rules require the firm name on all advertising |
| `email` | Public contact email | Shown in footer and contact page |
| `web3formsKey` | Free key from web3forms.com (enter the email that should receive leads) | Makes the contact and listing forms deliver to your inbox |

The build prints a warning until these are filled in. Also replace the bios in `src/_data/team.json` and add headshots (`photo: "/assets/img/team/stefne.jpg"`).

## Adding a listing (no coding)

1. In GitHub, open `src/listings/_TEMPLATE.md.txt`, copy its contents.
2. Create a new file in `src/listings/` named like `123-main-st-bellevue.md`, paste, fill in the fields.
3. Upload photos to `src/assets/img/listings/123-main-st-bellevue/` and list them under `photos:` (first one is the cover). Resize to about 2000px wide, JPG, under 500 KB each.
4. Commit. Cloudflare rebuilds and the listing is live in about a minute at `/listings/123-main-st-bellevue/`.

To change status, edit `status:` (Active, Coming Soon, Pending, Sold). `featured: true` puts it on the home page. `draft: true` hides it from the live site.

The two `sample-*.md` listings and `blog/sample-post.md` are drafts for layout preview only. Delete them once real content exists.

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
