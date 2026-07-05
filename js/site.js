const WHATSAPP_NUMBER = "15550100";
const CURRENCY_SYMBOL = "$";
const API_BASE = "/api";

let cart = [];

function fmt(n) { return `${CURRENCY_SYMBOL}${n.toFixed(2)}`; }

const staticProducts = [{"id":1,"name":"Jasmine Rice (25kg)","category":"rice","price":34.00,"unit":"bag","image":"/static/images/rice/rice-25kg.jpg","description":"Premium long grain"},{"id":2,"name":"Parboiled Rice (50kg)","category":"rice","price":62.00,"unit":"bag","image":"/static/images/rice/parboiled-rice-50kg.jpg","description":"Popular wholesale pack"},{"id":3,"name":"All-Purpose Flour (25kg)","category":"flour","price":21.00,"unit":"bag","image":"/static/images/flour/all-purpose-flour-25kg.jpg","description":"Bakery and household"},{"id":4,"name":"Whole Wheat Flour (20kg)","category":"flour","price":26.00,"unit":"bag","image":"/static/images/flour/whole-wheat-flour-20kg.jpg","description":"Health food stores"},{"id":5,"name":"Granulated Sugar (20kg)","category":"pantry","price":18.00,"unit":"bag","image":"/static/images/pantry/granulated-sugar-20kg.jpg","description":"Household bulk"},{"id":6,"name":"Brown Sugar (10kg)","category":"pantry","price":16.00,"unit":"bag","image":"/static/images/pantry/brown-sugar-10kg.jpg","description":"Bakery grade"},{"id":7,"name":"Red Kidney Beans (25kg)","category":"canned","price":30.00,"unit":"bag","image":"/static/images/canned/red-kidney-beans-25kg.jpg","description":"Rice and peas staple"},{"id":8,"name":"Gungo Peas (25lb)","category":"canned","price":22.00,"unit":"bag","image":"/static/images/canned/gungo-peas-25lb.jpg","description":"Soup and stew"},{"id":9,"name":"Canned Mackerel (half case)","category":"canned","price":48.00,"unit":"half-case","image":"/static/images/canned/canned-mackerel-half-case.jpg","description":"Tinned fish"},{"id":10,"name":"Corned Beef (half case)","category":"canned","price":54.00,"unit":"half-case","image":"/static/images/canned/corned-beef-half-case.jpg","description":"Quick meal stock"},{"id":11,"name":"Pasta Spaghetti (20kg)","category":"canned","price":27.00,"unit":"bag","image":"/static/images/canned/pasta-spaghetti-20kg.jpg","description":"Restaurant pack"},{"id":12,"name":"Cooking Oil (20L)","category":"oils","price":38.00,"unit":"tin","image":"/static/images/oils/cooking-oil-20l.jpg","description":"Frying and seasoning"},{"id":13,"name":"Margarine (5kg)","category":"oils","price":18.00,"unit":"tub","image":"/static/images/oils/margarine-5kg.jpg","description":"Bakery / household"},{"id":14,"name":"Soy Sauce (1 gallon)","category":"oils","price":14.00,"unit":"bottle","image":"/static/images/oils/soy-sauce-1gallon.jpg","description":"Food service"},{"id":15,"name":"White Vinegar (1 gallon)","category":"oils","price":10.00,"unit":"bottle","image":"/static/images/oils/white-vinegar-1gallon.jpg","description":"Pickling / cleaning"},{"id":16,"name":"Orange Juice (24x1L)","category":"beverages","price":42.00,"unit":"case","image":"/static/images/beverages/orange-juice-24x1l.jpg","description":"Retail multipack"},{"id":17,"name":"Sparkling Water (24x330ml)","category":"beverages","price":32.00,"unit":"case","image":"/static/images/beverages/sparkling-water-24x330ml.jpg","description":"Cooler stock"},{"id":18,"name":"Energy Drink (24x500ml)","category":"beverages","price":56.00,"unit":"case","image":"/static/images/beverages/energy-drink-24x500ml.jpg","description":"High turnover"},{"id":19,"name":"Laundry Detergent (10L)","category":"household","price":29.00,"unit":"bottle","image":"/static/images/household/laundry-detergent-10l.jpg","description":"Hotel / institution"},{"id":20,"name":"Fabric Softener (4L)","category":"household","price":16.00,"unit":"bottle","image":"/static/images/household/fabric-softener-4l.jpg","description":"Household"},{"id":21,"name":"Dishwashing Liquid (5L)","category":"household","price":12.00,"unit":"bottle","image":"/static/images/household/dishwashing-liquid-5l.jpg","description":"Kitchen pack"},{"id":22,"name":"Bin Liners (100pcs)","category":"household","price":11.00,"unit":"roll","image":"/static/images/household/bin-liners-100pcs.jpg","description":"Bulk essential"},{"id":23,"name":"Paper Towels (12 pack)","category":"household","price":17.00,"unit":"pack","image":"/static/images/household/paper-towels-12pack.jpg","description":"Commercial use"},{"id":24,"name":"Bleach (4L)","category":"household","price":13.00,"unit":"bottle","image":"/static/images/household/bleach-4l.jpg","description":"Cleaning"},{"id":25,"name":"Toothpaste (12 pack)","category":"personal-care","price":21.00,"unit":"pack","image":"/static/images/personal-care/toothpaste-12pack.jpg","description":"Family pack"},{"id":26,"name":"Body Lotion (12x400ml)","category":"personal-care","price":33.00,"unit":"case","image":"/static/images/personal-care/body-lotion-12x400ml.jpg","description":"Promo pack"},{"id":27,"name":"Deodorant (24 pack)","category":"personal-care","price":38.00,"unit":"pack","image":"/static/images/personal-care/deodorant-24pack.jpg","description":"Retail ready"},{"id":28,"name":"Disposable Cups (1000pcs)","category":"household","price":24.00,"unit":"pack","image":"/static/images/household/disposable-cups-1000pcs.jpg","description":"Cafe / shop"},{"id":29,"name":"Aluminum Foil (10 rolls)","category":"household","price":19.00,"unit":"box","image":"/static/images/household/aluminum-foil-10rolls.jpg","description":"Food service"},{"id":30,"name":"Trash Bags (50pcs)","category":"household","price":15.00,"unit":"pack","image":"/static/images/household/trash-bags-50pcs.jpg","description":"Large black"}];

function escHtml(str) {
  return String(str ?? "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function cartTotal() {
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

function updateCartUI() {
  const countBadge = document.getElementById("cartCount");
  const totalBadge = document.getElementById("cartTotal");
  const container = document.getElementById("cartItems");
  if (countBadge) countBadge.textContent = cart.reduce((s, c) => s + c.qty, 0);
  if (totalBadge) totalBadge.textContent = fmt(cartTotal());
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = "Cart is empty.";
    return;
  }
  container.innerHTML = cart
    .map((c) => `<div class="cart-item"><div><div style="font-weight:700">${escHtml(c.name)}</div><div style="color:#4b5d55;font-size:13px">${fmt(c.price)} each</div></div><div style="display:flex;align-items:center;gap:8px"><button class="btn-icon" onclick="changeQty(${c.id}, -1)">-</button><div>${c.qty}</div><button class="btn-icon" onclick="changeQty(${c.id}, 1)">+</button></div><button class="btn-icon" onclick="removeFromCart(${c.id})">Remove</button></div>`)
    .join("");
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");
  if (!drawer || !overlay) return;
  drawer.classList.remove("hidden");
  overlay.classList.remove("hidden");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");
  if (!drawer || !overlay) return;
  drawer.classList.add("hidden");
  overlay.classList.add("hidden");
  drawer.setAttribute("aria-hidden", "true");
}

function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { cart = cart.filter((c) => c.id !== id); }
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  updateCartUI();
}

function findProduct(id) {
  return staticProducts.find((p) => p.id === id) || null;
}

function addToCart(id, qtyOverride) {
  const product = findProduct(id);
  if (!product) return;
  const qty = Math.max(1, qtyOverride || 1);
  const existing = cart.find((c) => c.id === id);
  if (existing) { existing.qty += qty; }
  else { cart.push({ id: product.id, name: product.name, price: product.price, qty }); }
  updateCartUI();
  openCart();
}

function renderCatalog() {
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  if (!grid) return;

  let category = "";
  let search = "";
  const catEl = document.getElementById("categoryFilter");
  const searchEl = document.getElementById("searchInput");
  if (catEl) category = catEl.value || "all";
  if (searchEl) search = (searchEl.value || "").trim().toLowerCase();

  const items = staticProducts.filter((p) => {
    const matchCategory = category === "all" || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search);
    return matchCategory && matchSearch;
  });

  if (!items.length) {
    grid.innerHTML = "";
    empty?.classList.remove("hidden");
    return;
  }
  empty?.classList.add("hidden");

  grid.innerHTML = items
    .map((p) => {
      const imageSrc = p.image ? p.image : null;
      const imgTag = imageSrc ? `<img src="${imageSrc}" alt="${escHtml(p.name)}" loading="lazy" />` : `<span class="placeholder-icon">📦</span>`;
      return `<article class="product"><div class="product-media">${imgTag}</div><div class="product-body"><div class="category">${escHtml(p.category)}</div><h3>${escHtml(p.name)}</h3><div class="price">${fmt(p.price)} / ${escHtml(p.unit || 'unit')}</div></div><div class="product-footer"><input class="qty" id="qty-${p.id}" type="number" min="1" value="1" inputmode="numeric" /><button class="cta" onclick="addToCart(${p.id})">Add</button></div></article>`;
    })
    .join("");
}

function initCheckout() {
  const checkoutForm = document.getElementById("checkoutForm");
  const summary = document.getElementById("checkoutSummary");
  const itemsEl = document.getElementById("checkoutItems");
  const totalEl = document.getElementById("checkoutTotal");
  const whatsappBtn = document.getElementById("whatsappCheckoutBtn");

  if (!checkoutForm || !summary) return;

  if (itemsEl) itemsEl.innerHTML = cart.map((c) => `<div><div><strong>${escHtml(c.name)}</strong></div><div class="muted">Qty: ${c.qty} × ${fmt(c.price)}</div></div>`).join("");
  if (totalEl) totalEl.textContent = fmt(cartTotal());

  const sendOrder = () => {
    const form = new FormData(checkoutForm);
    const name = form.get("name")?.toString().trim();
    const whatsapp = form.get("whatsapp")?.toString().trim();
    const address = form.get("address")?.toString().trim();
    if (!name || !whatsapp || !address) {
      alert("Please complete the required fields.");
      return;
    }
    const orderText = [
      `*Garlands Wholesale Order*`,
      `Name: ${name}`,
      `WhatsApp: ${whatsapp}`,
      `Address: ${address}`,
      `Items: ${cart.map((c) => `${c.name} x${c.qty}`).join(", ")}`,
      `Total: ${fmt(cartTotal())}`
    ].join("\n");
    window.open(`https://wa.me/${encodeURIComponent(WHATSAPP_NUMBER)}?text=${encodeURIComponent(orderText)}`, "_blank");
  };

  if (whatsappBtn) whatsappBtn.addEventListener("click", (e) => { e.preventDefault(); sendOrder(); });
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

function init() {
  initYear();
  renderCatalog();
  updateCartUI();
  initCheckout();

  const toggle = document.getElementById("cartToggle");
  if (toggle) toggle.addEventListener("click", openCart);
  const closeBtn = document.getElementById("cartClose");
  if (closeBtn) closeBtn.addEventListener("click", closeCart);
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  const checkoutLink = document.getElementById("checkoutLink");
  if (checkoutLink) checkoutLink.addEventListener("click", closeCart);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
