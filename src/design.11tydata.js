// The Staging & Design page only publishes when site.showDesign is true (always visible in local previews).
const show = (d) => d.site.showDesign || process.env.ELEVENTY_RUN_MODE !== "build";
export default {
  eleventyComputed: {
    permalink: (d) => (show(d) ? "/design/" : false),
    eleventyExcludeFromCollections: (d) => !show(d),
  },
};
