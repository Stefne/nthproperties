const STATUS_RANK = { "Active": 0, "Coming Soon": 1, "Pending": 2, "Sold": 3 };
const REQUIRED = ["brokerage", "email", "web3formsKey"];

export default function (cfg) {
  cfg.addPassthroughCopy({ "src/assets": "assets", "src/_headers": "_headers", "src/robots.txt": "robots.txt" });

  // Files with `draft: true` show in `npm start` previews but are left out of production builds.
  cfg.addPreprocessor("drafts", "*", (data) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") return false;
  });

  cfg.addCollection("listings", (api) =>
    api.getFilteredByGlob("src/listings/*.md").sort((a, b) =>
      (STATUS_RANK[a.data.status] ?? 9) - (STATUS_RANK[b.data.status] ?? 9) ||
      new Date(b.data.listed || 0) - new Date(a.data.listed || 0)));
  cfg.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/blog/*.md").sort((a, b) => b.date - a.date));

  cfg.addFilter("money", (n) => (n ? "$" + Number(n).toLocaleString("en-US") : "Price on request"));
  cfg.addFilter("num", (n) => Number(n).toLocaleString("en-US"));
  cfg.addFilter("longDate", (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }));
  cfg.addFilter("initials", (s) => String(s).split(/\s+/).map((w) => w[0]).join(""));
  cfg.addFilter("head", (arr, n) => arr.slice(0, n));
  cfg.addFilter("inCity", (items, city) => items.filter((i) => i.data.city === city));
  cfg.addFilter("featured", (items) => items.filter((i) => i.data.featured && i.data.status !== "Sold"));
  cfg.addFilter("slug2", (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));

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
