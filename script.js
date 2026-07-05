const WHATSAPP_NUMBER = "15550100"; // Change this to your WhatsApp line
const CURRENCY = "USD";
const CURRENCY_SYMBOL = "$";

const products = [
  { id: 1, name: "Basmati Rice (25kg)", category: "pantry", price: 28.50, unit: "bag", image: "#fdf6e3" },
  { id: 2, name: "Olive Oil (5L)", category: "pantry", price: 34.90, unit: "tin", image: "#f5efe0" },
  { id: 3, name: "Granulated Sugar (10kg)", category: "pantry", price: 12.40, unit: "bag", image: "#fff3e4" },
  { id: 4, name: "All-Purpose Flour (25kg)", category: "pantry", price: 18.20, unit: "bag", image: "#f7f3e6" },
  { id: 5, name: "Red Onions (10kg)", category: "produce", price: 9.60, unit: "box", image: "#fce8e8" },
  { id: 6, name: "Potatoes (15kg)", category: "produce", price: 11.75, unit: "bag", image: "#f3eedf" },
  { id: 7, name: "Bananas (13kg)", category: "produce", price: 10.20, unit: "box", image: "#fbf3c8" },
  { id: 8, name: "Tomatoes (10kg)", category: "produce", price: 13.50, unit: "box", image: "#fde2c8" },
  { id: 9, name: "Still Water (24x1.5L)", category: "beverages", price: 16.80, unit: "case", image: "#e6f4ff" },
  { id: 10, name: "Orange Juice (12x1L)", category: "beverages", price: 21.00, unit: "case", image: "#fff1d6" },
  { id: 11, name: "Sparkling Water (24x330ml)", category: "beverages", price: 15.40, unit: "case", image: "#e9f9ff" },
  { id: 12, name: "Laundry Detergent (10L)", category: "household", price: 22.00, unit: "bottle", image: "#e8f3ff" },
  { id: 13, name: "Dish Soap (5L)", category: "household", price: 9.90, unit: "bottle", image: "#fff7d6" },
  { id: 14, name: "Bin Liners (100pcs)", category: "household", price: 7.50, unit: "roll", image: "#ececec" },
  { id: 15, name: "Paper Towels (12 rolls)", category: "household", price: 14.20, unit: "pack", image: "#f7f7f7" },
];

let cart = [];

function fmt(n) {
  return `${CURRENCY_SYMBOL}${n.toFixed(2)}`;
}

function renderCatalog() {
  const category = document.getElementById("categoryFilter").value;
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const grid = document.getElementById("productGrid");
  const items = products.filter((p) => {
    const matchCategory = category === "all" || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search);
    return matchCategory && matchSearch;
  });
  grid.innerHTML = items
    .map(
      (p) => `
      <article class="product">
        <div class="product-media" style="background:${p.image};"></div>
        <div class="product-body">
          <div class="category">${p.category}</div>
          <h3>${p.name}</h3>
          <div class="price">${fmt(p.price)} / ${p.unit}</div>
        </div>
        <div class="product-footer">
          <input class="qty" id="qty-${p.id}" type="number" min="1" value="1" inputmode="numeric" />
          <button class="cta" onclick="addToCart(${p.id})">Add</button>
        </div>
      </article>
    `
    )
    .join("") || '<p class="empty-state">No products match.</p>';
}

function addToCart(id) {
  const qtyInput = document.getElementById(`qty-${id}`);
  const qty = Math.max(1, parseInt(qtyInput?.value || "1", 10));
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
  document.getElementById("cartCount").textContent = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById("cartTotal").textContent = fmt(cartTotal());
  const container = document.getElementById("cartItems");
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
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
  document.getElementById("overlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
  document.getElementById("overlay").classList.remove("show");
}

function openCheckout() {
  if (!cart.length) {
    alert("Add items before checkout.");
    return;
  }
  closeCart();
  document.getElementById("checkoutSection").scrollIntoView({ behavior: "smooth" });
}

function submitCheckout(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form).entries());

  const lines = cart.map((c) => `• ${c.qty}x ${c.name} — ${fmt(c.price * c.qty)}`);
  const summary = [
    "🛒 *New Wholesale Order*",
    "",
    `Name: ${data.name}`,
    `WhatsApp: ${data.whatsapp}`,
    `Delivery: ${data.delivery}`,
    `Address: ${data.address}`,
    "",
    "Items:",
    ...lines,
    "",
    `Total: ${fmt(cartTotal())}`,
  ].join("\n");

  const encoded = encodeURIComponent(summary);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  document.getElementById("checkoutNote").textContent = "Opening WhatsApp with your order...";
  window.open(url, "_blank");
  cart = [];
  updateCartUI();
  form.reset();
}

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.getElementById("checkoutForm").addEventListener("submit", submitCheckout);

document.getElementById("year").textContent = new Date().getFullYear();
renderCatalog();
