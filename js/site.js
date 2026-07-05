const WHATSAPP_NUMBER = "15550100";
const CURRENCY_SYMBOL = "$";
const API_BASE = "/api";

let cart = [];

function fmt(n) {
  return `${CURRENCY_SYMBOL}${n.toFixed(2)}`;
}

async function loadProducts() {
  const category = document.getElementById("categoryFilter")?.value || "all";
  const search = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const url = new URL(`${API_BASE}/products`, location.origin);
  if (category && category !== "all") url.searchParams.set("category", category);
  if (search) url.searchParams.set("search", search);

  const res = await fetch(url.toString());
  const items = await res.json();
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = "";
    empty?.classList.remove("hidden");
    return;
  }
  empty?.classList.add("hidden");
  grid.innerHTML = items
    .map(
      (p) => {
        const imageSrc = p.image ? `/images/${p.image}` : null;
        const mediaStyle = imageSrc ? "" : `style="background:#f3f4f3"`;
        const imgTag = imageSrc ? `<img src="${imageSrc}" alt="${p.name}" loading="lazy" />` : `<span class="placeholder-icon">📦</span>`;
        return `
        <article class="product">
          <div class="product-media" ${mediaStyle}>
            ${imgTag}
          </div>
          <div class="product-body">
            <div class="category">${p.category}</div>
            <h3>${p.name}</h3>
            <div class="price">${fmt(p.price)} / ${p.unit || "unit"}</div>
          </div>
          <div class="product-footer">
            <input class="qty" id="qty-${p.id}" type="number" min="1" value="1" inputmode="numeric" />
            <button class="cta" onclick="addToCart(${p.id})">Add</button>
          </div>
        </article>
      `;
      }
    )
    .join("");
}

async function addToCart(id) {
  const qtyInput = document.getElementById(`qty-${id}`);
  const qty = Math.max(1, parseInt(qtyInput?.value || "1", 10));
  const res = await fetch(`${API_BASE}/products`);
  const products = await res.json();
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty });
  }
  updateCartUI();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  updateCartUI();
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
    .map(
      (c) => `
      <div class="cart-item">
        <div>
          <div style="font-weight:700">${c.name}</div>
          <div style="color:#4b5d55;font-size:13px">${fmt(c.price)} each</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button class="btn-icon" onclick="changeQty(${c.id}, -1)">-</button>
          <div>${c.qty}</div>
          <button class="btn-icon" onclick="changeQty(${c.id}, 1)">+</button>
        </div>
        <button class="btn-icon" onclick="removeFromCart(${c.id})">Remove</button>
      </div>
    `
    )
    .join("");
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartDrawer")?.setAttribute("aria-hidden", "false");
  document.getElementById("overlay")?.classList.add("show");
}

function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartDrawer")?.setAttribute("aria-hidden", "true");
  document.getElementById("overlay")?.classList.remove("show");
}

document.getElementById("cartToggle")?.addEventListener("click", openCart);
document.getElementById("cartClose")?.addEventListener("click", closeCart);
document.getElementById("overlay")?.addEventListener("click", closeCart);

document.getElementById("categoryFilter")?.addEventListener("change", loadProducts);
document.getElementById("searchInput")?.addEventListener("input", loadProducts);

document.getElementById("year").textContent = new Date().getFullYear();
loadProducts();
