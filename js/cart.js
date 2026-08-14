// ALPOTECH - sepet durumu ve arayüzü
import { getCart, saveCart } from "./storage.js?v=3";
import { getProductById, getUnitPrice } from "./products.js?v=3";
import { CONFIG } from "./config.js?v=3";
import { openWhatsApp, buildCartMessage } from "./whatsapp.js?v=3";

let cart = getCart(); // [{ productId, qty }]
const listeners = new Set();

function notify() {
  saveCart(cart);
  listeners.forEach((fn) => fn(getCartDetails()));
}

export function onCartChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function addToCart(productId, qty = 1) {
  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, qty });
  }
  notify();
}

export function setQty(productId, qty) {
  const existing = cart.find((i) => i.productId === productId);
  if (!existing) return;
  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }
  existing.qty = qty;
  notify();
}

export function removeFromCart(productId) {
  cart = cart.filter((i) => i.productId !== productId);
  notify();
}

export function clearCart() {
  cart = [];
  notify();
}

export function getCartDetails() {
  const items = cart
    .map((entry) => {
      const product = getProductById(entry.productId);
      if (!product) return null;
      const unitPrice = getUnitPrice(product, entry.qty);
      return {
        productId: entry.productId,
        name: product.name,
        qty: entry.qty,
        unitPrice,
        lineTotal: unitPrice * entry.qty,
        photo: product.photos[0],
      };
    })
    .filter(Boolean);

  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { items, totalQty, totalPrice };
}

export function checkoutViaWhatsApp() {
  const { items } = getCartDetails();
  if (!items.length) return false;
  const message = buildCartMessage(items);
  openWhatsApp(message);
  return true;
}

// ---- Arayüz ----
export function initCartUI() {
  const badge = document.getElementById("cart-badge");
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const emptyEl = document.getElementById("cart-empty");
  const confirmBtn = document.getElementById("cart-confirm-btn");
  const openBtn = document.getElementById("cart-open-btn");
  const closeBtn = document.getElementById("cart-close-btn");

  function render(details) {
    const { items, totalQty, totalPrice } = details;
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? "flex" : "none";

    itemsEl.innerHTML = "";
    emptyEl.style.display = items.length ? "none" : "block";
    confirmBtn.disabled = items.length === 0;

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img class="cart-item-photo" src="${item.photo}" alt="${item.name}" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.unitPrice}${CONFIG.CURRENCY} / adet</div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-id="${item.productId}" aria-label="Azalt">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.productId}" aria-label="Artır">+</button>
            <button class="cart-item-remove" data-action="remove" data-id="${item.productId}">Kaldır</button>
          </div>
        </div>
        <div class="cart-item-total">${item.lineTotal}${CONFIG.CURRENCY}</div>
      `;
      itemsEl.appendChild(row);
    });

    totalEl.textContent = `${totalPrice}${CONFIG.CURRENCY}`;
  }

  itemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    const entry = cart.find((i) => i.productId === id);
    if (action === "inc" && entry) setQty(id, entry.qty + 1);
    if (action === "dec" && entry) setQty(id, entry.qty - 1);
    if (action === "remove") removeFromCart(id);
  });

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("open");
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  }

  openBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  confirmBtn.addEventListener("click", () => {
    const ok = checkoutViaWhatsApp();
    if (ok) closeDrawer();
  });

  onCartChange(render);
  render(getCartDetails());

  return { openDrawer, closeDrawer };
}
