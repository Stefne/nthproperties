import fs from "node:fs";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const STATUS_RANK = { "Active": 0, "Coming Soon": 1, "Pending": 2, "Sold": 3 };
const REQUIRED = ["brokerage", "email", "web3formsKey"];

export default function (cfg) {
  cfg.addPassthroughCopy({ "src/assets": "assets", "src/_headers": "_headers", "src/robots.txt": "robots.txt", "node_modules/leaflet/dist": "assets/vendor/leaflet" });

  // Resizes every <img> to webp/jpeg at several widths, so 6 MB phone photos stay fast.
  cfg.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: [480, 960, 1600],
    failOnError: false,
    htmlOptions: { imgAttributes: { loading: "lazy", decoding: "async", sizes: "100vw" } },
  });

  // Files with `draft: true` show in `npm start` previews but are left out of production builds.
  cfg.addPreprocessor("drafts", "*", (data) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") return false;
  });

  cfg.addCollection("listings", (api) =>
    api.getFilteredByGlob("src/listings/*.md").sort((a, b) =>
      (STATUS_RANK[a.data.status] ?? 9) - (STATUS_RANK[b.data.status] ?? 9) ||
      new Date(b.data.listed || 0) - new Date(a.data.listed || 0)));
  cfg.addCollection("reports", (api) => api.getFilteredByGlob("src/market-reports/*.md").sort((a, b) => b.date - a.date));
  cfg.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/blog/*.md").sort((a, b) => b.date - a.date));

  cfg.addFilter("money", (n) => (n ? "$" + Number(n).toLocaleString("en-US") : "Price on request"));
  cfg.addFilter("num", (n) => Number(n).toLocaleString("en-US"));
  cfg.addFilter("longDate", (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }));
  cfg.addFilter("shortDate", (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }));
  cfg.addFilter("tel", (s) => "+1" + String(s).replace(/\D/g, "").replace(/^1/, ""));
  cfg.addFilter("head", (arr, n) => arr.slice(0, n));
  cfg.addFilter("initials", (s) => String(s).split(/\s+/).map((w) => w[0]).join(""));
  cfg.addFilter("inCity", (items, city) => items.filter((i) => i.data.city === city));
  cfg.addFilter("featured", (items) => items.filter((i) => i.data.featured && i.data.status !== "Sold"));
  cfg.addFilter("byName", (arr, name) => arr.find((m) => m.name === name));
  cfg.addFilter("slug2", (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  // Photo slots: returns the path if the file exists in src/, else "" so templates fall back to a styled panel.
  cfg.addFilter("photo", (p) => (p && fs.existsSync("src" + p) ? p : ""));
  cfg.addFilter("upcoming", (list) => (list || []).filter((o) => new Date(o.date) >= new Date(new Date().toDateString())));

  // Sales history lives in src/_data/sales.csv so it can be pasted from a spreadsheet.
  cfg.addDataExtension("csv", {
    parser: (txt) => {
      const rows = [];
      for (const line of txt.split(/\r?\n/)) {
        if (!line.trim() || line.startsWith("#")) continue;
        const cells = []; let cur = "", q = false;
        for (const ch of line) {
          if (ch === '"') q = !q; else if (ch === "," && !q) { cells.push(cur.trim()); cur = ""; } else cur += ch;
        }
        cells.push(cur.trim()); rows.push(cells);
      }
      const [head, ...body] = rows;
      const isBuild = process.env.ELEVENTY_RUN_MODE === "build";
      return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])))
        .filter((r) => !(isBuild && /^y/i.test(r.draft)))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  });
  cfg.addFilter("salesStats", (rows) => {
    const prices = rows.map((r) => +String(r.price).replace(/[^0-9.]/g, "")).filter(Boolean);
    const vol = prices.reduce((a, b) => a + b, 0);
    const short = (n) => (n >= 1e9 ? (n / 1e9).toFixed(1) + "B" : n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : Math.round(n / 1e3) + "K");
    return { count: rows.length, volume: "$" + short(vol), avg: prices.length ? "$" + short(vol / prices.length) : "", cities: new Set(rows.map((r) => r.city)).size };
  });
  cfg.addFilter("withStatus", (items, st) => items.filter((i) => i.data.status === st));
  cfg.addFilter("withoutStatus", (items, st) => items.filter((i) => i.data.status !== st));
  cfg.addFilter("jsonify", (v) => JSON.stringify(v));
  cfg.addFilter("year", (d) => new Date(d).getUTCFullYear());

  cfg.on("eleventy.before", async () => {
    const site = (await import("./src/_data/site.js?" + Date.now())).default;
    const missing = REQUIRED.filter((k) => !site[k]);
    if (missing.length) console.warn(`\n[nth] Fill in before launch (src/_data/site.js): ${missing.join(", ")}\n`);
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
