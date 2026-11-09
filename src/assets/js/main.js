const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Mobile nav
$(".nav-toggle")?.addEventListener("click", (e) => {
  const open = document.body.classList.toggle("nav-open");
  e.currentTarget.setAttribute("aria-expanded", open);
});

// Dropdown groups: tap to open on touch / mobile
$$(".nav-group > .nav-top").forEach((b) => b.addEventListener("click", () => {
  const g = b.parentElement, open = !g.classList.contains("open");
  $$(".nav-group.open").forEach((x) => x.classList.remove("open"));
  g.classList.toggle("open", open);
}));
document.addEventListener("click", (e) => { if (!e.target.closest(".nav-group")) $$(".nav-group.open").forEach((x) => x.classList.remove("open")); });

// Carousels
$$("[data-scroll]").forEach((b) => b.addEventListener("click", () => {
  const c = b.closest(".section").querySelector("[data-carousel]");
  c?.scrollBy({ left: +b.dataset.scroll * c.clientWidth * 0.8, behavior: "smooth" });
}));

// Before / after sliders
$$("[data-ba]").forEach((f) => {
  const r = $("input", f);
  r.addEventListener("input", () => f.style.setProperty("--pos", r.value + "%"));
});

// Track-record map (Leaflet + OpenStreetMap/CARTO tiles, loaded only when a map is on the page)
const maps = $$("[data-map]");
if (maps.length) {
  const css = document.createElement("link");
  css.rel = "stylesheet"; css.href = "/assets/vendor/leaflet/leaflet.css";
  document.head.append(css);
  const js = document.createElement("script");
  js.src = "/assets/vendor/leaflet/leaflet.js";
  js.onload = () => maps.forEach((el) => {
    const pts = JSON.parse(el.dataset.map).filter((s) => +s.lat && +s.lng);
    if (!pts.length) { el.innerHTML = '<p class="map-fallback">Add lat/lng to sales.csv to plot sales.</p>'; return; }
    const m = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(m);
    const icon = L.divIcon({ className: "sale-pin" });
    const fmt = (n) => "$" + Number(n).toLocaleString("en-US");
    pts.forEach((s) => L.marker([+s.lat, +s.lng], { icon }).addTo(m).bindPopup(`<strong>${s.address}</strong><br>${s.city} · ${fmt(s.price)}<br>Closed ${s.date}`));
    m.fitBounds(L.latLngBounds(pts.map((s) => [+s.lat, +s.lng])).pad(0.15));
  });
  js.onerror = () => maps.forEach((el) => (el.innerHTML = '<p class="map-fallback">Map unavailable.</p>'));
  document.head.append(js);
}

// Header border after scrolling
const header = $("[data-header]");
const onScroll = () => header?.classList.toggle("scrolled", scrollY > 60);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// Scroll reveal
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".section h2, .section .kicker, .path-card, .card, .area-tile, .area-card, .post-tile, .split-media > .media, .member, .partner-card, .stat-bar > div").forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

// Listing gallery
$$("[data-gallery]").forEach((g) => {
  const slides = $$(".gallery-main", g), thumbs = $$(".thumbs button", g);
  const show = (i) => { slides.forEach((s, j) => s.classList.toggle("on", i === j)); thumbs.forEach((t, j) => t.classList.toggle("on", i === j)); };
  thumbs.forEach((t) => t.addEventListener("click", () => show(+t.dataset.index)));
  slides[0]?.parentElement.addEventListener("click", () => show((slides.findIndex((s) => s.classList.contains("on")) + 1) % slides.length));
});

// Copy link
$$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = "Copied"; } catch { prompt("Copy this link:", b.dataset.copy); }
}));

// Listings tabs + filters
const filters = $("[data-filters]");
if (filters) {
  const cards = $$("[data-results] .card"), empty = $("[data-empty]");
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
  $$("[data-tabs] button").forEach((b) => b.addEventListener("click", () => {
    $$("[data-tabs] button").forEach((x) => x.setAttribute("aria-selected", x === b));
    filters.status.value = b.dataset.status; apply();
  }));
  const s = new URLSearchParams(location.search).get("status");
  if (s) $(`[data-tabs] button[data-status="${CSS.escape(s)}"]`)?.click();
}

// Testimonials rotator
const q = $$("[data-quotes] .quote");
if (q.length > 1) { let i = 0; setInterval(() => { q[i].classList.remove("on"); i = (i + 1) % q.length; q[i].classList.add("on"); }, 7000); }

// Prefill contact topic from ?topic=
const topic = new URLSearchParams(location.search).get("topic"), sel = $('.form select[name="topic"]');
if (topic && sel) {
  const m = [...sel.options].find((o) => [o.value, o.text].some((v) => v.toLowerCase() === topic.toLowerCase()));
  if (m) sel.value = m.value; else sel.add(new Option(topic, topic, true, true));
}
