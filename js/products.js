// TR33D - ürün kataloğu
// Ürün listesi artık bu dosyada değil, data/products.json içinde tutuluyor
// (admin panelinin tarayıcıdan güvenle okuyup/yazabilmesi için düz JSON).
// Yeni ürün eklemek/silmek için admin.html kullanın; kategori tanımları
// (renk/ikon) değişmediği için burada, kodun içinde kalmaya devam ediyor.

// color: kategori sekmesinin/başlığının rengi (hex). icon: js/icons.js içindeki
// ICONS anahtarlarından biri (emoji değil, temiz çizgi ikon). Her ikisi de
// belirtilmezse marka turuncusu ve genel bir ikon kullanılır.
export const CATEGORIES = [
  { id: "featured", label: "Öne Çıkanlar", color: "#ff6a3d", icon: "star" },
  { id: "custom", label: "Kişiye Özel Figürler", color: "#a8447a", icon: "gift" },
  { id: "home", label: "Ev Eşyaları", color: "#4f9d69", icon: "home" },
  { id: "toys", label: "Oyuncaklar", color: "#e0a527", icon: "blocks" },
  { id: "accessories", label: "Aksesuarlar", color: "#2f8f8a", icon: "sliders" },
  { id: "industrial", label: "Endüstriyel", color: "#8a6a4f", icon: "gear" },
  { id: "drone", label: "Drone", color: "#3b6ea5", icon: "drone" },
  { id: "car", label: "Otomobil", color: "#c23b3b", icon: "car" },
];

// PRODUCTS, data/products.json yüklenene kadar boştur; main.js init() içinde
// loadProducts() tamamlanmasını bekledikten sonra render işlemleri başlar.
// "let" + canlı ES modül bağlama (live binding) sayesinde bu diziyi import
// eden diğer dosyalar (main.js, cart.js) yeniden atama sonrasını da görür.
export let PRODUCTS = [];

let loadPromise = null;

// GitHub Pages'in ~10 dakikalık önbelleği admin panelinden yapılan
// güncellemeleri geciktirmesin diye products.json her zaman cache-bust
// query parametresiyle ve doğrudan siteden (jsDelivr CDN'den değil) çekilir.
export function loadProducts() {
  if (!loadPromise) {
    loadPromise = fetch(`data/products.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        PRODUCTS.length = 0;
        PRODUCTS.push(...data);
        return PRODUCTS;
      });
  }
  return loadPromise;
}

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// Bir ürünün, seçilen adete göre birim fiyatını döndürür.
export function getUnitPrice(product, qty) {
  const tiers = product.priceTiers;
  let price = tiers[0].price;
  for (const tier of tiers) {
    if (qty >= tier.minQty) price = tier.price;
  }
  return price;
}
