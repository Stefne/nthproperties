// Edit this file to change company-wide details. Empty strings show a warning at build time.
export default {
  name: "Nth Properties",
  tagline: "Local knowledge. Long-term thinking.",
  description: "Nth Properties is a boutique Greater Seattle real estate team helping clients buy, sell, invest, and manage property across King County and the South Sound.",
  url: "https://nthproperty.com",
  phone: "(206) 351-5268",
  email: "",            // TODO: lead/contact email shown on site
  brokerage: "",        // TODO: licensed firm name, required by WA advertising rules (WAC 308-124B-210)
  brokerageAddress: "", // TODO: firm office address
  web3formsKey: "",     // TODO: free key from https://web3forms.com (sends form leads to your email)
  cfAnalyticsToken: "", // Cloudflare dashboard > Web Analytics > Add site > copy the token from the snippet
  idxSearchUrl: "",     // "Search all homes" link: your brokerage IDX search page (free) or an IDX vendor page. Blank = buyer search form.
  showDesign: false,    // Staging & Design page; flip to true once Stephanie signs off
  responsePromise: "We reply within one business day.",

  // Proof band on the home page. Only real, defensible numbers. Set showStats: true once filled.
  showStats: false,
  stats: [
    { value: "", label: "Years in Puget Sound real estate" },
    { value: "", label: "Homes sold" },
    { value: "", label: "In sales volume" },
    { value: "", label: "Average client rating" },
  ],

  showTestimonials: false, // flip to true once src/_data/testimonials.json holds real client quotes

  // Photo slots. Drop a JPG at each path and it appears automatically; until then a styled panel shows.
  photos: {
    hero: "/assets/img/site/hero.jpg",
    intro: "/assets/img/site/intro.jpg",
    valuation: "/assets/img/site/home-value.jpg",
    report: "/assets/img/site/market-report.jpg",
    cta: "/assets/img/site/cta.jpg",
  },

  social: { instagram: "", facebook: "", linkedin: "", google: "" }, // full URLs; blank ones are hidden
  year: new Date().getFullYear(),
};
