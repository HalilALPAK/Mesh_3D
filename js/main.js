// Kardem3D - ana uygulama mantığı
import { CONFIG, assetUrl } from "./config.js?v=11";
import { icon } from "./icons.js?v=11";
import { CATEGORIES, PRODUCTS, getProductById, getUnitPrice } from "./products.js?v=11";
import { mountLazyViewer } from "./viewer.js?v=11";
import { addToCart, initCartUI } from "./cart.js?v=11";
import { getRatingSummary, renderStars, renderReviewsSection } from "./reviews.js?v=11";
import { openWhatsApp, buildCustomModelMessage } from "./whatsapp.js?v=11";

// ---------------------------------------------------------------------------
// Medya görüntüleyici: 3D model <-> basılmış ürün fotoğrafları arasında
// ok butonlarıyla geçiş yapılabilen tekrar kullanılabilir bileşen.
// ---------------------------------------------------------------------------
function createMediaViewer(product, { autoRotate = true } = {}) {
  const hasModel = !!product.model;
  const modes = hasModel ? ["3d", ...product.photos.map((_, i) => `photo${i}`)] : product.photos.map((_, i) => `photo${i}`);
  let modeIndex = 0;
  let lazyHandle = null;

  const root = document.createElement("div");
  root.className = "media";
  root.innerHTML = `
    <div class="media-stage">
      ${hasModel ? '<div class="media-3d"></div>' : ""}
      <img class="media-photo" alt="${product.name}" />
      ${hasModel ? '<span class="media-badge">3D</span>' : ""}
    </div>
    <button type="button" class="media-arrow media-arrow-left" aria-label="Önceki görünüm">${icon("chevronLeft")}</button>
    <button type="button" class="media-arrow media-arrow-right" aria-label="Sonraki görünüm">${icon("chevronRight")}</button>
    <div class="media-dots"></div>
  `;

  const mount3d = root.querySelector(".media-3d");
  const imgEl = root.querySelector(".media-photo");
  const badge = root.querySelector(".media-badge");
  const dotsEl = root.querySelector(".media-dots");
  const leftArrow = root.querySelector(".media-arrow-left");
  const rightArrow = root.querySelector(".media-arrow-right");

  modes.forEach(() => {
    const dot = document.createElement("span");
    dot.className = "media-dot";
    dotsEl.appendChild(dot);
  });

  if (modes.length <= 1) {
    // Tek görünüm varsa (3D yok, tek fotoğraf) geçiş oklarına gerek yok.
    leftArrow.style.display = "none";
    rightArrow.style.display = "none";
    dotsEl.style.display = "none";
  }

  function update() {
    const mode = modes[modeIndex];
    [...dotsEl.children].forEach((d, i) => d.classList.toggle("active", i === modeIndex));
    const viewer = lazyHandle && lazyHandle.getViewer();
    if (mode === "3d") {
      mount3d.style.display = "";
      imgEl.style.display = "none";
      badge.style.display = "";
      if (viewer) viewer.setPaused(false);
    } else {
      if (mount3d) mount3d.style.display = "none";
      imgEl.style.display = "block";
      if (badge) badge.style.display = "none";
      const photoIdx = Number(mode.replace("photo", ""));
      imgEl.src = assetUrl(product.photos[photoIdx]);
      if (viewer) viewer.setPaused(true);
    }
  }

  const stageEl = root.querySelector(".media-stage");
  function playTransformEffect() {
    stageEl.classList.remove("transforming");
    void stageEl.offsetWidth; // animasyonu yeniden başlatmak için reflow tetikle
    stageEl.classList.add("transforming");
    setTimeout(() => stageEl.classList.remove("transforming"), 700);
  }

  leftArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    modeIndex = (modeIndex - 1 + modes.length) % modes.length;
    playTransformEffect();
    update();
  });
  rightArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    modeIndex = (modeIndex + 1) % modes.length;
    playTransformEffect();
    update();
  });

  if (hasModel) {
    const viewerOpts = { autoRotate };
    if (product.color) viewerOpts.color = product.color;
    const resolvedModel = {
      ...product.model,
      url: assetUrl(product.model.url),
      mtl: assetUrl(product.model.mtl),
    };
    lazyHandle = mountLazyViewer(mount3d, resolvedModel, viewerOpts);
  }
  update();

  return {
    el: root,
    dispose: () => {
      if (lazyHandle) lazyHandle.dispose();
    },
  };
}

// ---------------------------------------------------------------------------
// Ürün kartı
// ---------------------------------------------------------------------------
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  const cat = CATEGORIES.find((c) => c.id === product.category);
  if (cat && cat.color) card.style.setProperty("--cat-color", cat.color);

  const media = createMediaViewer(product, { autoRotate: true });

  const summary = getRatingSummary(product);
  const basePrice = getUnitPrice(product, 1);

  const info = document.createElement("div");
  info.className = "product-card-info";
  info.innerHTML = `
    <h3>${product.name}</h3>
    <div class="product-rating">
      <span class="stars">${renderStars(summary.average)}</span>
      <span class="rating-count">(${summary.count})</span>
    </div>
    <div class="product-price">${basePrice}${CONFIG.CURRENCY}<span class="price-from"> adetten itibaren</span></div>
    <button type="button" class="btn btn-primary btn-block add-to-cart-btn">Sepete Ekle</button>
  `;

  card.appendChild(media.el);
  card.appendChild(info);

  info.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product.id, 1);
    const btn = e.currentTarget;
    const original = btn.textContent;
    btn.textContent = "Sepete Eklendi ✓";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1000);
  });

  card.addEventListener("click", () => openProductModal(product.id));

  return { el: card, dispose: media.dispose };
}

// ---------------------------------------------------------------------------
// Kategori bölümleri
// ---------------------------------------------------------------------------
function productsForCategory(catId) {
  if (catId === "featured") return PRODUCTS.filter((p) => p.featured);
  return PRODUCTS.filter((p) => p.category === catId);
}

function renderCategorySections() {
  const container = document.getElementById("category-sections");
  container.innerHTML = "";

  CATEGORIES.forEach((cat) => {
    const products = productsForCategory(cat.id);
    if (!products.length) return;

    const section = document.createElement("section");
    section.className = "product-section";
    section.id = `cat-${cat.id}`;

    const heading = document.createElement("h2");
    heading.innerHTML = cat.icon ? `${icon(cat.icon, "cat-icon")}<span>${cat.label}</span>` : cat.label;
    if (cat.color) heading.style.setProperty("--cat-color", cat.color);
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "product-grid";
    products.forEach((p) => grid.appendChild(createProductCard(p).el));
    section.appendChild(grid);

    container.appendChild(section);
  });
}

function renderCategoryNav() {
  const nav = document.getElementById("category-nav");
  nav.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    if (!productsForCategory(cat.id).length) return;
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "category-pill";
    pill.innerHTML = cat.icon ? `${icon(cat.icon, "cat-icon")}<span>${cat.label}</span>` : cat.label;
    if (cat.color) pill.style.setProperty("--cat-color", cat.color);
    pill.addEventListener("click", () => {
      const target = document.getElementById(`cat-${cat.id}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    nav.appendChild(pill);
  });
}

// ---------------------------------------------------------------------------
// Hero (üst banner) - sürekli dönen öne çıkan ürün
// ---------------------------------------------------------------------------
function renderHero() {
  const heroProduct = PRODUCTS.find((p) => p.isHero) || PRODUCTS[0];
  const mount = document.getElementById("hero-viewer");
  const hint = document.getElementById("hero-hint");

  if (heroProduct.model) {
    // Ürünün kendi rengi tanımlıysa (örn. gerçek doku/renkli bir figür) onu kullan;
    // tanımlı değilse marka rengiyle (turuncu) göster.
    const resolvedHeroModel = {
      ...heroProduct.model,
      url: assetUrl(heroProduct.model.url),
      mtl: assetUrl(heroProduct.model.mtl),
    };
    mountLazyViewer(mount, resolvedHeroModel, {
      autoRotate: true,
      autoRotateSpeed: 3.2,
      color: heroProduct.color || 0xff6a3d,
    });
    hint.textContent = "Modeli fareyle / parmağınızla sürükleyerek her yönden inceleyebilirsiniz.";
    hint.hidden = false;
  } else {
    const img = document.createElement("img");
    img.className = "hero-viewer-photo";
    img.src = assetUrl(heroProduct.photos[0]);
    img.alt = heroProduct.name;
    mount.appendChild(img);
    hint.hidden = true;
  }

  document.getElementById("hero-name").textContent = heroProduct.name;
  document.getElementById("hero-desc").textContent = heroProduct.description;
  const price = getUnitPrice(heroProduct, 1);
  document.getElementById("hero-price").textContent = `${price}${CONFIG.CURRENCY}'den başlayan fiyatlarla`;

  document.getElementById("hero-add-btn").addEventListener("click", () => {
    addToCart(heroProduct.id, 1);
  });
  document.getElementById("hero-detail-btn").addEventListener("click", () => {
    openProductModal(heroProduct.id);
  });
}

// ---------------------------------------------------------------------------
// Ürün detay modalı
// ---------------------------------------------------------------------------
let modalMediaDispose = null;

function buildTierList(product, activeQty) {
  const tiers = product.priceTiers;
  return tiers
    .map((tier, i) => {
      const next = tiers[i + 1];
      const rangeLabel = next ? `${tier.minQty}-${next.minQty - 1} adet` : `${tier.minQty}+ adet`;
      const isActive = activeQty >= tier.minQty && (!next || activeQty < next.minQty);
      return `<div class="tier-row ${isActive ? "active" : ""}">
        <span>${rangeLabel}</span>
        <span>${tier.price}${CONFIG.CURRENCY} / adet</span>
      </div>`;
    })
    .join("");
}

function openProductModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  if (modalMediaDispose) {
    modalMediaDispose();
    modalMediaDispose = null;
  }

  const inner = document.getElementById("product-modal-inner");
  inner.innerHTML = "";

  const media = createMediaViewer(product, { autoRotate: true });
  media.el.classList.add("media-large");
  modalMediaDispose = media.dispose;

  const summary = getRatingSummary(product);
  const info = document.createElement("div");
  info.className = "product-modal-info";
  info.innerHTML = `
    <h2>${product.name}</h2>
    <div class="product-rating">
      <span class="stars">${renderStars(summary.average)}</span>
      <span class="rating-count">(${summary.count} değerlendirme)</span>
    </div>
    <p class="product-description">${product.description}</p>

    <div class="tier-list" id="tier-list"></div>

    <div class="qty-selector">
      <label for="qty-input">Adet</label>
      <div class="qty-controls">
        <button type="button" class="qty-btn" id="qty-dec">−</button>
        <input type="number" id="qty-input" min="1" value="1" />
        <button type="button" class="qty-btn" id="qty-inc">+</button>
      </div>
    </div>

    <div class="modal-total-row">
      <span>Toplam</span>
      <strong id="modal-total"></strong>
    </div>

    <button type="button" class="btn btn-primary btn-block" id="modal-add-btn">Sepete Ekle</button>

    <hr class="divider" />
    <h3>Değerlendirmeler</h3>
    <div id="modal-reviews"></div>
  `;

  const tierListEl = info.querySelector("#tier-list");
  const qtyInput = info.querySelector("#qty-input");
  const totalEl = info.querySelector("#modal-total");

  function refreshPricing() {
    let qty = parseInt(qtyInput.value, 10);
    if (!Number.isFinite(qty) || qty < 1) qty = 1;
    qtyInput.value = qty;
    const unit = getUnitPrice(product, qty);
    totalEl.textContent = `${unit * qty}${CONFIG.CURRENCY} (${unit}${CONFIG.CURRENCY} x ${qty})`;
    tierListEl.innerHTML = buildTierList(product, qty);
  }

  info.querySelector("#qty-dec").addEventListener("click", () => {
    qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
    refreshPricing();
  });
  info.querySelector("#qty-inc").addEventListener("click", () => {
    qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + 1;
    refreshPricing();
  });
  qtyInput.addEventListener("input", refreshPricing);

  info.querySelector("#modal-add-btn").addEventListener("click", (e) => {
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    addToCart(product.id, qty);
    const btn = e.currentTarget;
    const original = btn.textContent;
    btn.textContent = "Sepete Eklendi ✓";
    setTimeout(() => (btn.textContent = original), 1000);
  });

  refreshPricing();

  inner.appendChild(media.el);
  inner.appendChild(info);

  renderReviewsSection(info.querySelector("#modal-reviews"), product);

  document.getElementById("product-overlay").classList.add("open");
  document.getElementById("product-modal").classList.add("open");
}

function closeProductModal() {
  document.getElementById("product-overlay").classList.remove("open");
  document.getElementById("product-modal").classList.remove("open");
  if (modalMediaDispose) {
    modalMediaDispose();
    modalMediaDispose = null;
  }
}

// ---------------------------------------------------------------------------
// Arama
// ---------------------------------------------------------------------------
let searchDisposers = [];

function disposeSearchCards() {
  searchDisposers.forEach((fn) => fn());
  searchDisposers = [];
}

function runSearch(query) {
  const heroSection = document.getElementById("hero-section");
  const categorySections = document.getElementById("category-sections");
  const searchSection = document.getElementById("search-results-section");
  const searchGrid = document.getElementById("search-results-grid");
  const searchEmpty = document.getElementById("search-empty");
  const clearBtn = document.getElementById("search-clear");

  const q = query.trim().toLocaleLowerCase("tr");

  if (!q) {
    searchSection.hidden = true;
    heroSection.style.display = "";
    categorySections.style.display = "";
    clearBtn.hidden = true;
    disposeSearchCards();
    return;
  }

  clearBtn.hidden = false;
  heroSection.style.display = "none";
  categorySections.style.display = "none";
  searchSection.hidden = false;

  disposeSearchCards();
  searchGrid.innerHTML = "";

  const matches = PRODUCTS.filter((p) => {
    const haystack = `${p.name} ${p.description}`.toLocaleLowerCase("tr");
    return haystack.includes(q);
  });

  searchEmpty.hidden = matches.length > 0;
  matches.forEach((p) => {
    const card = createProductCard(p);
    searchGrid.appendChild(card.el);
    searchDisposers.push(card.dispose);
  });
}

function initSearch() {
  const input = document.getElementById("search-input");
  const clearBtn = document.getElementById("search-clear");
  let debounceTimer = null;

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runSearch(input.value), 200);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    runSearch("");
    input.focus();
  });
}

// ---------------------------------------------------------------------------
// Özel model / görsel yükleme -> WhatsApp
// ---------------------------------------------------------------------------
function initCustomOrderForm() {
  const fileInput = document.getElementById("custom-files");
  const fileDrop = document.getElementById("file-drop");
  const preview = document.getElementById("file-preview");
  const form = document.getElementById("custom-order-form");
  const descInput = document.getElementById("custom-desc");
  const dropText = fileDrop.querySelector(".file-drop-text");
  const attachHint = document.getElementById("file-attach-hint");

  function setFiles(files) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    fileInput.files = dt.files;
    renderPreview();
  }

  function extensionOf(name) {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "";
  }

  function renderPreview() {
    preview.innerHTML = "";
    const files = [...fileInput.files];
    dropText.textContent = files.length
      ? `${files.length} dosya seçildi`
      : "Görsel veya model dosyası seçmek için tıklayın";
    attachHint.hidden = files.length === 0;

    files.forEach((file, index) => {
      const thumb = document.createElement("div");
      thumb.className = "file-thumb";

      const box = document.createElement("div");
      box.className = "file-thumb-box";
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        box.appendChild(img);
      } else {
        const iconEl = document.createElement("span");
        iconEl.className = "file-thumb-icon";
        iconEl.innerHTML = icon("cube");
        box.appendChild(iconEl);
        const ext = document.createElement("span");
        ext.className = "file-thumb-ext";
        ext.textContent = extensionOf(file.name);
        box.appendChild(ext);
      }

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "file-thumb-remove";
      removeBtn.setAttribute("aria-label", "Dosyayı kaldır");
      removeBtn.innerHTML = icon("close");
      removeBtn.addEventListener("click", () => {
        const remaining = [...fileInput.files].filter((_, i) => i !== index);
        setFiles(remaining);
      });
      box.appendChild(removeBtn);

      const name = document.createElement("span");
      name.className = "file-thumb-name";
      name.textContent = file.name;
      name.title = file.name;

      thumb.appendChild(box);
      thumb.appendChild(name);
      preview.appendChild(thumb);
    });
  }

  fileInput.addEventListener("change", renderPreview);

  fileDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileDrop.classList.add("dragover");
  });
  fileDrop.addEventListener("dragleave", () => fileDrop.classList.remove("dragover"));
  fileDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    fileDrop.classList.remove("dragover");
    setFiles([...e.dataTransfer.files]);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fileNames = [...fileInput.files].map((f) => f.name);
    const message = buildCustomModelMessage({ description: descInput.value.trim(), fileNames });
    openWhatsApp(message);
  });
}

// ---------------------------------------------------------------------------
// Genel
// ---------------------------------------------------------------------------
function initFloatingWhatsApp() {
  const btn = document.getElementById("whatsapp-float");
  btn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIG.DEFAULT_WHATSAPP_GREETING)}`;
}

function initModalClose() {
  document.getElementById("product-modal-close").addEventListener("click", closeProductModal);
  document.getElementById("product-overlay").addEventListener("click", closeProductModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProductModal();
  });
}

function initCampaignBanner() {
  document.getElementById("campaign-cta-btn").addEventListener("click", () => {
    document.getElementById("custom-order").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function initTransformDemo() {
  const mount = document.getElementById("transform-demo-viewer");
  mountLazyViewer(
    mount,
    { type: "glb", url: assetUrl("assets/models/transform-demo.glb") },
    { autoRotate: true, autoRotateSpeed: 2.6 }
  );
}

function init() {
  document.getElementById("footer-year").textContent = new Date().getFullYear();
  renderHero();
  renderCategoryNav();
  renderCategorySections();
  initSearch();
  initCustomOrderForm();
  initFloatingWhatsApp();
  initModalClose();
  initCampaignBanner();
  initTransformDemo();
  initCartUI();
}

document.addEventListener("DOMContentLoaded", init);
