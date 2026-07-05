const WHATSAPP_NUMBER = "15550100";
const CURRENCY_SYMBOL = "$";
const API_BASE = "/api";

let cart = [];

function fmt(n) { return `${CURRENCY_SYMBOL}${n.toFixed(2)}`; }

const staticProducts = [{"id": 1, "name": "Jasmine Rice (25kg)", "category": "rice", "price": 34.0, "unit": "bag", "image": "/project-garlands/static/images/rice-25kg.jpg", "description": "Premium long grain"},{"id": 2, "name": "Parboiled Rice (50kg)", "category": "rice", "price": 62.0, "unit": "bag", "image": "/project-garlands/static/images/parboiled-rice-50kg.jpg", "description": "Popular wholesale pack"},{"id": 3, "name": "All-Purpose Flour (25kg)", "category": "flour", "price": 21.0, "unit": "bag", "image": "/project-garlands/static/images/flour/all-purpose-flour-25kg.jpg", "description": "Bakery and household"},{"id": 4, "name": "Whole Wheat Flour (20kg)", "category": "flour", "price": 26.0, "unit": "bag", "image": "/project-garlands/static/images/whole-wheat-flour-20kg.jpg", "description": "Health food stores"},{"id": 5, "name": "Granulated Sugar (20kg)", "category": "pantry", "price": 18.0, "unit": "bag", "image": "/project-garlands/static/images/pantry/granulated-sugar-20kg.jpg", "description": "Household bulk"},{"id": 6, "name": "Brown Sugar (10kg)", "category": "pantry", "price": 16.0, "unit": "bag", "image": "/project-garlands/static/images/pantry/brown-sugar-10kg.jpg", "description": "Bakery grade"},{"id": 7, "name": "Red Kidney Beans (25kg)", "category": "canned", "price": 30.0, "unit": "bag", "image": "/project-garlands/static/images/canned/red-kidney-beans-25kg.jpg", "description": "Rice and peas staple"},{"id": 8, "name": "Gungo Peas (25lb)", "category": "canned", "price": 22.0, "unit": "bag", "image": "/project-garlands/static/images/canned/gungo-peas-25lb.jpg", "description": "Soup and stew"},{"id": 9, "name": "Canned Mackerel (half case)", "category": "canned", "price": 48.0, "unit": "half-case", "image": "/project-garlands/static/images/canned/canned-mackerel-half-case.jpg", "description": "Tinned fish"},{"id": 10, "name": "Corned Beef (half case)", "category": "canned", "price": 54.0, "unit": "half-case", "image": "/project-garlands/static/images/canned/corned-beef-half-case.jpg", "description": "Quick meal stock"},{"id": 11, "name": "Pasta Spaghetti (20kg)", "category": "canned", "price": 27.0, "unit": "bag", "image": "/project-garlands/static/images/canned/pasta-spaghetti-20kg.jpg", "description": "Restaurant pack"},{"id": 12, "name": "Cooking Oil (20L)", "category": "oils", "price": 38.0, "unit": "tin", "image": "/project-garlands/static/images/oils/cooking-oil-20l.jpg", "description": "Frying and seasoning"},{"id": 13, "name": "Margarine (5kg)", "category": "oils", "price": 18.0, "unit": "tub", "image": "/project-garlands/static/images/oils/margarine-5kg.jpg", "description": "Bakery / household"},{"id": 14, "name": "Soy Sauce (1 gallon)", "category": "oils", "price": 14.0, "unit": "bottle", "image": "/project-garlands/static/images/oils/soy-sauce-1gallon.jpg", "description": "Food service"},{"id": 15, "name": "White Vinegar (1 gallon)", "category": "oils", "price": 10.0, "unit": "bottle", "image": "/project-garlands/static/images/oils/white-vinegar-1gallon.jpg", "description": "Pickling / cleaning"},{"id": 16, "name": "Orange Juice (24x1L)", "category": "beverages", "price": 42.0, "unit": "case", "image": "/project-garlands/static/images/beverages/orange-juice-24x1l.jpg", "description": "Retail multipack"},{"id": 17, "name": "Sparkling Water (24x330ml)", "category": "beverages", "price": 32.0, "unit": "case", "image": "/project-garlands/static/images/beverages/sparkling-water-24x330ml.jpg", "description": "Cooler stock"},{"id": 18, "name": "Energy Drink (24x500ml)", "category": "beverages", "price": 56.0, "unit": "case", "image": "/project-garlands/static/images/beverages/energy-drink-24x500ml.jpg", "description": "High turnover"},{"id": 19, "name": "Laundry Detergent (10L)", "category": "household", "price": 29.0, "unit": "bottle", "image": "/project-garlands/static/images/household/laundry-detergent-10l.jpg", "description": "Hotel / institution"},{"id": 20, "name": "Fabric Softener (4L)", "category": "household", "price": 16.0, "unit": "bottle", "image": "/project-garlands/static/images/household/fabric-softener-4l.jpg", "description": "Household"},{"id": 21, "name": "Dishwashing Liquid (5L)", "category": "household", "price": 12.0, "unit": "bottle", "image": "/project-garlands/static/images/household/dishwashing-liquid-5l.jpg", "description": "Kitchen pack"},{"id": 22, "name": "Bin Liners (100pcs)", "category": "household", "price": 11.0, "unit": "roll", "image": "/project-garlands/static/images/household/bin-liners-100pcs.jpg", "description": "Bulk essential"},{"id": 23, "name": "Paper Towels (12 pack)", "category": "household", "price": 17.0, "unit": "pack", "image": "/project-garlands/static/images/household/paper-towels-12pack.jpg", "description": "Commercial use"},{"id": 24, "name": "Bleach (4L)", "category": "household", "price": 13.0, "unit": "bottle", "image": "/project-garlands/static/images/household/bleach-4l.jpg", "description": "Cleaning"},{"id": 25, "name": "Toothpaste (12 pack)", "category": "personal-care", "price": 21.0, "unit": "pack", "image": "/project-garlands/static/images/personal-care/toothpaste-12pack.jpg", "description": "Family pack"},{"id": 26, "name": "Body Lotion (12x400ml)", "category": "personal-care", "price": 33.0, "unit": "case", "image": "/project-garlands/static/images/personal-care/body-lotion-12x400ml.jpg", "description": "Promo pack"},{"id": 27, "name": "Deodorant (24 pack)", "category": "personal-care", "price": 38.0, "unit": "pack", "image": "/project-garlands/static/images/personal-care/deodorant-24pack.jpg", "description": "Retail ready"},{"id": 28, "name": "Disposable Cups (1000pcs)", "category": "household", "price": 24.0, "unit": "pack", "image": "/project-garlands/static/images/household/disposable-cups-1000pcs.jpg", "description": "Café / shop"},{"id": 29, "name": "Aluminum Foil (10 rolls)", "category": "household", "price": 19.0, "unit": "box", "image": "/project-garlands/static/images/household/aluminum-foil-10rolls.jpg", "description": "Food service"},{"id": 30, "name": "Trash Bags (50pcs)", "category": "household", "price": 15.0, "unit": "pack", "image": "/project-garlands/static/images/household/trash-bags-50pcs.jpg", "description": "Large black"},{"id": 31, "name": "Iodized Salt (1kg)", "category": "pantry", "price": 3.5, "unit": "bag", "image": "/project-garlands/static/images/pantry/salt-1kg.jpg", "description": "Fine iodized salt for household and food service."},{"id": 32, "name": "Black Pepper (500g)", "category": "pantry", "price": 12.0, "unit": "bag", "image": "/project-garlands/static/images/pantry/black-pepper-500g.jpg", "description": "Coarsely ground black pepper, retail and resale."},{"id": 33, "name": "Baking Powder (1kg)", "category": "pantry", "price": 5.0, "unit": "bag", "image": "/project-garlands/static/images/pantry/baking-powder-1kg.jpg", "description": "Double-acting baking powder for cakes and breads."},{"id": 34, "name": "Chicken (half case)", "category": "canned", "price": 52.0, "unit": "half-case", "image": "/project-garlands/static/images/canned/canned-chicken-half-case.jpg", "description": "Premium canned chicken in brine."},{"id": 35, "name": "Tomato Ketchup (5L)", "category": "oils", "price": 18.0, "unit": "bottle", "image": "/project-garlands/static/images/oils/ketchup-5l.jpg", "description": "Restaurant-grade tomato ketchup, tangy and thick."},{"id": 36, "name": "Soap Bars (24 pack)", "category": "personal-care", "price": 15.0, "unit": "pack", "image": "/project-garlands/static/images/personal-care/soap-bars-24-pack.jpg", "description": "Bath soap bars, 24-pack multipack."},{"id": 37, "name": "Gummy Bears (2kg)", "category": "candy", "price": 28.0, "unit": "bag", "image": "/project-garlands/static/images/candy/gummy-bears-2kg.jpg", "description": "Bulk gummy bears, sweet shop wholesale."},{"id": 38, "name": "Jelly Beans (2kg)", "category": "candy", "price": 30.0, "unit": "bag", "image": "/project-garlands/static/images/candy/jelly-beans-2kg.jpg", "description": "Colorful jelly beans, party and retail packs."},{"id": 39, "name": "Lollipops (50 pack)", "category": "candy", "price": 22.0, "unit": "pack", "image": "/project-garlands/static/images/candy/lollipops-50pack.jpg", "description": "Assorted lollipops, grab-and-go sweets."},{"id": 40, "name": "Chocolate Bars (24 pack)", "category": "candy", "price": 36.0, "unit": "pack", "image": "/project-garlands/static/images/candy/chocolate-bars-24pack.jpg", "description": "Milk chocolate bars, case packed."},{"id": 41, "name": "Mint Sweets (1kg)", "category": "candy", "price": 18.0, "unit": "bag", "image": "/project-garlands/static/images/candy/mint-sweets-1kg.jpg", "description": "Hard mint sweets, after-dinner refresh."},{"id": 42, "name": "Guinness Stout (crate)", "category": "liquor", "price": 110.0, "unit": "crate", "image": "/project-garlands/static/images/liquor/guinness-crate.jpg", "description": "Foreign Extra Stout, 24-can crate."},{"id": 43, "name": "Rum (1 gallon)", "category": "liquor", "price": 95.0, "unit": "gallon", "image": "/project-garlands/static/images/liquor/rum-1gallon.jpg", "description": "White rum, wholesale gallon for bars."},{"id": 44, "name": "Red Label (1L)", "category": "liquor", "price": 88.0, "unit": "bottle", "image": "/project-garlands/static/images/liquor/red-label-1l.jpg", "description": "Blended Scotch whisky, 1 litre retail."},{"id": 45, "name": "Tequila (1L)", "category": "liquor", "price": 82.0, "unit": "bottle", "image": "/project-garlands/static/images/liquor/tequila-1l.jpg", "description": "Gold tequila, 1 litre wholesale."},{"id": 46, "name": "Vodka (1L)", "category": "liquor", "price": 78.0, "unit": "bottle", "image": "/project-garlands/static/images/liquor/vodka-1l.jpg", "description": "Neutral grain vodka, 1 litre."},{"id": 47, "name": "Beer (24 pack)", "category": "liquor", "price": 72.0, "unit": "pack", "image": "/project-garlands/static/images/liquor/beer-24pack.jpg", "description": "Lager beer 24-pack, bar and event stock."},{"id": 48, "name": "Whisky (1L)", "category": "liquor", "price": 120.0, "unit": "bottle", "image": "/project-garlands/static/images/liquor/whisky-1l.jpg", "description": "Dark rum premium blend, 1 litre."},{"id": 49, "name": "Basmati Rice (20kg)", "category": "rice", "price": 58.0, "unit": "bag", "image": "/project-garlands/static/images/rice/basmati-rice-20kg.jpg", "description": "Fragrant long grain, restaurant quality."},{"id": 50, "name": "Brown Rice (25kg)", "category": "rice", "price": 40.0, "unit": "bag", "image": "/project-garlands/static/images/rice/brown-rice-25kg.jpg", "description": "Health-food staple, brown whole grain."},{"id": 51, "name": "Self-Rising Flour (20kg)", "category": "flour", "price": 24.0, "unit": "bag", "image": "/project-garlands/static/images/flour/self-rising-flour-20kg.jpg", "description": "Bread and cake prep, ready-mixed."},{"id": 52, "name": "Cassava Flour (10kg)", "category": "flour", "price": 20.0, "unit": "bag", "image": "/project-garlands/static/images/flour/cassava-flour-10kg.jpg", "description": "Gluten-free baking and traditional bread."},{"id": 53, "name": "Pasta Macaroni (10kg)", "category": "pantry", "price": 22.0, "unit": "bag", "image": "/project-garlands/static/images/pantry/pasta-macaroni-10kg.jpg", "description": "Elbow macaroni, school and household use."},{"id": 54, "name": "Curry Powder (500g)", "category": "pantry", "price": 8.0, "unit": "tin", "image": "/project-garlands/static/images/pantry/curry-powder-500g.jpg", "description": "Jamaican-style curry blend for seasoning."},{"id": 55, "name": "Sardines (half case)", "category": "canned", "price": 45.0, "unit": "half-case", "image": "/project-garlands/static/images/canned/sardines-half-case.jpg", "description": "Tinned sardines in tomato sauce."},{"id": 56, "name": "Olive Oil (5L)", "category": "oils", "price": 28.0, "unit": "tin", "image": "/project-garlands/static/images/oils/olive-oil-5l.jpg", "description": "Pure olive oil for cooking and dressings."},{"id": 57, "name": "Coconut Oil (1L)", "category": "oils", "price": 16.0, "unit": "bottle", "image": "/project-garlands/static/images/oils/coconut-oil-1l.jpg", "description": "Cold-pressed coconut oil, food and cosmetic."},{"id": 58, "name": "Soda Cola (24x330ml)", "category": "beverages", "price": 35.0, "unit": "case", "image": "/project-garlands/static/images/beverages/soda-cola-24x330ml.jpg", "description": "Classic cola cooler stock."},{"id": 59, "name": "Chocolate Drink (24x250ml)", "category": "beverages", "price": 30.0, "unit": "case", "image": "/project-garlands/static/images/beverages/chocolate-drink-24x250ml.jpg", "description": "Sweetened chocolate milk drink cartons."},{"id": 60, "name": "Packaged Water (24x500ml)", "category": "beverages", "price": 20.0, "unit": "case", "image": "/project-garlands/static/images/beverages/packaged-water-24x500ml.jpg", "description": "Purified drinking water, event packs."},{"id": 61, "name": "Scrub Sponges (10 pack)", "category": "household", "price": 9.0, "unit": "pack", "image": "/project-garlands/static/images/household/scrub-sponges-10pack.jpg", "description": "Kitchen scrub pads, heavy duty."},{"id": 62, "name": "Shampoo (12x400ml)", "category": "personal-care", "price": 28.0, "unit": "case", "image": "/project-garlands/static/images/personal-care/shampoo-12x400ml.jpg", "description": "Family-size shampoo multipack."},{"id": 63, "name": "Razors (24 pack)", "category": "personal-care", "price": 22.0, "unit": "pack", "image": "/project-garlands/static/images/personal-care/razors-24pack.jpg", "description": "Disposable razors, retail ready."},{"id": 64, "name": "Conditioner (12x400ml)", "category": "personal-care", "price": 30.0, "unit": "case", "image": "/project-garlands/static/images/personal-care/conditioner-12x400ml.jpg", "description": "Hair conditioner multipack."},{"id": 65, "name": "Gummy Worms (2kg)", "category": "candy", "price": 29.0, "unit": "bag", "image": "/project-garlands/static/images/candy/gummy-worms-2kg.jpg", "description": "Sour and sweet gummy worms, party bulk."},{"id": 66, "name": "Hard Candy (1kg)", "category": "candy", "price": 16.0, "unit": "bag", "image": "/project-garlands/static/images/candy/hard-candy-1kg.jpg", "description": "Mixed fruit hard candies, assorted."},{"id": 67, "name": "Gin (1L)", "category": "liquor", "price": 76.0, "unit": "bottle", "image": "/project-garlands/static/images/liquor/gin-1l.jpg", "description": "London dry gin, 1 litre wholesale."}];

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

function renderBulletins() {
  const board = document.getElementById("bulletinBoard");
  const empty = document.getElementById("bulletinEmpty");
  if (!board) return;

  fetch("/api/bulletins")
    .then((r) => r.json())
    .then((items) => {
      if (!items.length) {
        board.innerHTML = "";
        if (empty) empty.classList.remove("hidden");
        return;
      }
      if (empty) empty.classList.add("hidden");
      board.innerHTML = items
        .map((b) => {
          const when = [b.starts_at, b.ends_at].filter(Boolean).join(" to ") || b.created_at;
          return `<article class="bulletin ${b.sticky ? 'bulletin--sticky' : ''}"><div class="bulletin-header"><strong>${escHtml(b.title)}</strong><span class="muted">${escHtml(when)}</span></div><p>${escHtml(b.body)}</p></article>`;
        })
        .join("");
    })
    .catch(() => {});
}

function init() {
  initYear();
  renderCatalog();
  updateCartUI();
  initCheckout();
  renderBulletins();

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
