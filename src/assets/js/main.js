// Mobile nav
const toggle = document.querySelector(".nav-toggle"), nav = document.getElementById("nav");
toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

// Listing gallery thumbnails
document.querySelectorAll("[data-gallery]").forEach((g) => {
  const main = g.querySelector(".gallery-main");
  g.querySelectorAll(".thumbs button").forEach((b) => b.addEventListener("click", () => {
    main.src = b.dataset.src;
    g.querySelector(".thumbs .on")?.classList.remove("on");
    b.classList.add("on");
  }));
});

// Listings filters
const filters = document.querySelector("[data-filters]");
if (filters) {
  const cards = [...document.querySelectorAll("[data-results] .card")];
  const empty = document.querySelector("[data-empty]");
  const apply = () => {
    const f = Object.fromEntries(new FormData(filters));
    let shown = 0;
    cards.forEach((c) => {
      const ok = (!f.status || c.dataset.status === f.status) && (!f.city || c.dataset.city === f.city) &&
        +c.dataset.beds >= +f.beds && (!+f.price || +c.dataset.price <= +f.price);
      c.hidden = !ok; shown += ok;
    });
    empty.hidden = shown > 0;
  };
  filters.addEventListener("change", apply);
}

// Prefill contact topic from ?topic=
const topic = new URLSearchParams(location.search).get("topic");
const sel = document.querySelector('.form select[name="topic"]');
if (topic && sel) {
  const match = [...sel.options].find((o) => o.value.toLowerCase() === topic.toLowerCase() || o.text.toLowerCase() === topic.toLowerCase());
  if (match) sel.value = match.value; else sel.add(new Option(topic, topic, true, true));
}
