const bannerGrid = document.getElementById("banner-grid");
const banners = __BANNER_LIST__;

if (!banners.length) {
  bannerGrid.innerHTML = '<section class="empty">No hay banners con <code>index.html</code> dentro de <code>banners/*</code>.</section>';
} else {
  const base = import.meta.env.BASE_URL;

  for (const banner of banners) {
    const card = document.createElement("section");
    card.className = "card";

    const label = document.createElement("h2");
    label.className = "label";
    label.textContent = `${banner.id} (${banner.width}x${banner.height})`;

    const wrap = document.createElement("div");
    wrap.className = "frame-wrap";

    const frame = document.createElement("iframe");
    frame.width = String(banner.width);
    frame.height = String(banner.height);
    frame.loading = "lazy";
    frame.title = `${banner.id} preview`;
    frame.src = `${base.replace(/\/$/, "")}${banner.route}`;

    wrap.appendChild(frame);
    card.appendChild(label);
    card.appendChild(wrap);
    bannerGrid.appendChild(card);
  }
}
