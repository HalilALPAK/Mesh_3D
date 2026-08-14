// ALPOTECH - localStorage yardımcı fonksiyonları

const CART_KEY = "alpotech_cart_v1";
const REVIEWS_KEY = "alpotech_reviews_v1";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn("localStorage okunamadı:", key, e);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage yazılamadı:", key, e);
  }
}

// ---- Sepet ----
// Şekil: [{ productId, qty }]
export function getCart() {
  return readJSON(CART_KEY, []);
}

export function saveCart(cart) {
  writeJSON(CART_KEY, cart);
}

// ---- Yorumlar ----
// Şekil: { [productId]: [{ id, name, rating, comment, date }] }
export function getAllReviews() {
  return readJSON(REVIEWS_KEY, {});
}

export function getReviewsFor(productId) {
  const all = getAllReviews();
  return all[productId] || [];
}

export function addReview(productId, review) {
  const all = getAllReviews();
  if (!all[productId]) all[productId] = [];
  all[productId].unshift(review);
  writeJSON(REVIEWS_KEY, all);
  return all[productId];
}
