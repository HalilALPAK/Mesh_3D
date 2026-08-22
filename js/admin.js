// TR33D - admin paneli
// Bu sayfa GitHub Contents API'sini doğrudan tarayıcıdan çağırarak
// data/products.json dosyasını ve ürün görsellerini günceller. Backend
// sunucumuz yok; "sunucu" burada doğrudan GitHub'ın kendisi.
//
// ÖNEMLİ GÜVENLİK NOTU: Aşağıdaki şifre ekranı yalnızca bu sayfayı yanlışlıkla
// açan ziyaretçileri engellemek içindir, gerçek bir yetkilendirme değildir
// (sayfanın kaynak kodu herkese açıktır). Gerçek yetki, GitHub erişim
// anahtarındadır — anahtarı yalnızca siz bilirsiniz ve yalnızca bu tarayıcıda
// saklanır.
import { CATEGORIES } from "./products.js?v=13";

const ADMIN_PASSWORD = "TR33D";
const REPO_OWNER = "HalilALPAK";
const REPO_NAME = "Mesh_3D";
const BRANCH = "main";
const PRODUCTS_PATH = "data/products.json";
const IMAGES_DIR = "assets/images/products";
const TOKEN_KEY = "tr33d_admin_gh_token";
const GATE_KEY = "tr33d_admin_gate_ok";

// ---------------------------------------------------------------------------
// Şifre ekranı
// ---------------------------------------------------------------------------
function initGate() {
  const gate = document.getElementById("admin-gate");
  const panel = document.getElementById("admin-panel");
  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-password");
  const error = document.getElementById("gate-error");

  function unlock() {
    gate.hidden = true;
    panel.hidden = false;
    initPanel();
  }

  if (sessionStorage.getItem(GATE_KEY) === "1") {
    unlock();
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(GATE_KEY, "1");
      unlock();
    } else {
      error.hidden = false;
      input.value = "";
      input.focus();
    }
  });
}

// ---------------------------------------------------------------------------
// GitHub Contents API yardımcıları
// ---------------------------------------------------------------------------
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsDataURL(file);
  });
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

async function ghRequest(path, options = {}) {
  const token = getToken();
  if (!token) throw new Error("Önce GitHub erişim anahtarınızı kaydedin.");
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body.message) message = body.message;
    } catch (e) {
      /* yanıt JSON değilse yut */
    }
    if (res.status === 401) message = "GitHub anahtarı geçersiz. Anahtarı kontrol edip yeniden kaydedin.";
    if (res.status === 403) message = "Yetki reddedildi (anahtarın Contents izni yok olabilir ya da GitHub istek sınırına takıldınız).";
    if (res.status === 409) message = "Depo bu sırada başka bir işlemle güncellendi, lütfen tekrar deneyin.";
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

function getFile(path) {
  return ghRequest(`contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${BRANCH}`);
}

function putFile(path, contentBase64, sha, message) {
  const body = { message, content: contentBase64, branch: BRANCH };
  if (sha) body.sha = sha;
  return ghRequest(`contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function deleteFile(path, sha, message) {
  return ghRequest(`contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
}

async function readProducts() {
  const file = await getFile(PRODUCTS_PATH);
  return { products: JSON.parse(base64ToUtf8(file.content)), sha: file.sha };
}

// ---------------------------------------------------------------------------
// Yardımcılar: slug üretimi
// ---------------------------------------------------------------------------
const TR_MAP = { ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i", ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u" };

function slugify(name) {
  const ascii = name
    .split("")
    .map((ch) => TR_MAP[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return (ascii || "urun").slice(0, 40);
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------
function initPanel() {
  initCategorySelect();
  initTierRows();
  initTokenForm();
  initAddProductForm();
  refreshProductList();
}

function initCategorySelect() {
  const select = document.getElementById("p-category");
  select.innerHTML = CATEGORIES.filter((c) => c.id !== "featured")
    .map((c) => `<option value="${c.id}">${c.label}</option>`)
    .join("");
}

function initTierRows() {
  const container = document.getElementById("tiers-container");
  document.getElementById("add-tier-btn").addEventListener("click", () => addTierRow());
  container.innerHTML = "";
  addTierRow(1, "");
}

function addTierRow(minQty = "", price = "") {
  const container = document.getElementById("tiers-container");
  const row = document.createElement("div");
  row.className = "admin-tier-row";
  row.innerHTML = `
    <input type="number" min="1" step="1" class="tier-minqty" placeholder="Adet (ör. 1)" value="${minQty}" required />
    <input type="number" min="0" step="1" class="tier-price" placeholder="Birim fiyat (₺)" value="${price}" required />
    <button type="button" class="btn btn-outline btn-sm tier-remove-btn" aria-label="Kademeyi kaldır">✕</button>
  `;
  row.querySelector(".tier-remove-btn").addEventListener("click", () => {
    if (container.children.length > 1) row.remove();
  });
  container.appendChild(row);
}

function readTiers() {
  const rows = [...document.querySelectorAll(".admin-tier-row")];
  const tiers = rows
    .map((row) => ({
      minQty: Number(row.querySelector(".tier-minqty").value),
      price: Number(row.querySelector(".tier-price").value),
    }))
    .filter((t) => t.minQty > 0 && t.price >= 0);
  tiers.sort((a, b) => a.minQty - b.minQty);
  return tiers;
}

function initTokenForm() {
  const form = document.getElementById("token-form");
  const input = document.getElementById("token-input");
  const clearBtn = document.getElementById("token-clear-btn");

  updateTokenStatus();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const token = input.value.trim();
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, token);
    input.value = "";
    updateTokenStatus();
    refreshProductList();
  });

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    updateTokenStatus();
    document.getElementById("product-list").innerHTML =
      '<p class="admin-hint">GitHub anahtarını kaydedince ürünler burada listelenir.</p>';
  });
}

function updateTokenStatus() {
  const status = document.getElementById("token-status");
  status.textContent = getToken()
    ? "Bağlantı anahtarı bu tarayıcıda kayıtlı ✓"
    : "Henüz bir GitHub erişim anahtarı girilmedi.";
}

function setAddStatus(message, isError = false) {
  const el = document.getElementById("add-status");
  el.textContent = message;
  el.classList.toggle("admin-status-error", isError);
}

function initAddProductForm() {
  const form = document.getElementById("add-product-form");
  const uploadBtn = document.getElementById("upload-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    uploadBtn.disabled = true;
    try {
      await handleAddProduct(form);
      form.reset();
      initTierRows();
    } catch (err) {
      setAddStatus("Hata: " + err.message, true);
    } finally {
      uploadBtn.disabled = false;
    }
  });
}

async function handleAddProduct(form) {
  const name = document.getElementById("p-name").value.trim();
  const category = document.getElementById("p-category").value;
  const description = document.getElementById("p-desc").value.trim();
  const files = [...document.getElementById("p-images").files];
  const tiers = readTiers();
  const visibility = form.querySelector('input[name="visibility"]:checked')?.value;

  if (!name || !category || !description) throw new Error("Lütfen tüm alanları doldurun.");
  if (files.length === 0) throw new Error("En az bir ürün görseli seçin.");
  if (tiers.length === 0) throw new Error("En az bir fiyat kademesi girin.");

  const slug = `${slugify(name)}_${Date.now().toString(36)}`;

  setAddStatus("Görseller yükleniyor...");
  const photoPaths = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${IMAGES_DIR}/${slug}-${i + 1}.${ext}`;
    const base64 = await fileToBase64(file);
    await putFile(path, base64, undefined, `Admin: "${name}" görseli eklendi`);
    photoPaths.push(path);
  }

  setAddStatus("Ürün kataloğu güncelleniyor...");
  const { products, sha } = await readProducts();

  if (visibility === "hero") {
    products.forEach((p) => {
      if (p.isHero) delete p.isHero;
    });
  }

  const newProduct = {
    id: slug,
    name,
    category,
    featured: visibility === "featured" || visibility === "hero",
    description,
    photos: photoPaths,
    priceTiers: tiers,
    ratingSeed: 5,
    reviewCountSeed: 0,
  };
  if (visibility === "hero") newProduct.isHero = true;

  products.push(newProduct);

  const newContent = utf8ToBase64(JSON.stringify(products, null, 2) + "\n");
  await putFile(PRODUCTS_PATH, newContent, sha, `Admin: "${name}" ürünü eklendi`);

  setAddStatus("Ürün eklendi. Site birkaç dakika içinde güncellenecek.");
  await refreshProductList();
}

async function handleDelete(product) {
  if (!confirm(`"${product.name}" ürününü silmek istediğinize emin misiniz?`)) return;
  const listEl = document.getElementById("product-list");
  try {
    const { products, sha } = await readProducts();
    const remaining = products.filter((p) => p.id !== product.id);
    const newContent = utf8ToBase64(JSON.stringify(remaining, null, 2) + "\n");
    await putFile(PRODUCTS_PATH, newContent, sha, `Admin: "${product.name}" ürünü silindi`);

    // Görselleri silmeyi dene; başarısız olursa (dosya zaten yoksa vb.) yok say.
    for (const photoPath of product.photos || []) {
      try {
        const imgFile = await getFile(photoPath);
        await deleteFile(photoPath, imgFile.sha, `Admin: "${product.name}" görseli silindi`);
      } catch (e) {
        /* görsel silinemezse ürün silme işlemini bozma */
      }
    }

    await refreshProductList();
  } catch (err) {
    alert("Silme sırasında hata oluştu: " + err.message);
  } finally {
    listEl.querySelectorAll("button").forEach((b) => (b.disabled = false));
  }
}

async function refreshProductList() {
  const listEl = document.getElementById("product-list");
  if (!getToken()) return;

  listEl.innerHTML = '<p class="admin-hint">Yükleniyor...</p>';
  try {
    const { products } = await readProducts();
    renderProductList(products);
  } catch (err) {
    listEl.innerHTML = `<p class="admin-status admin-status-error">Ürünler yüklenemedi: ${err.message}</p>`;
  }
}

function renderProductList(products) {
  const listEl = document.getElementById("product-list");
  if (!products.length) {
    listEl.innerHTML = '<p class="admin-hint">Henüz ürün yok.</p>';
    return;
  }
  listEl.innerHTML = "";
  products.forEach((p) => {
    const cat = CATEGORIES.find((c) => c.id === p.category);
    const thumbPath = p.photos && p.photos[0];
    const thumbUrl = thumbPath
      ? `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${thumbPath}`
      : "";
    const badge = p.isHero ? "En Öne Çıkan" : p.featured ? "Öne Çıkan" : "";
    const fromPrice = p.priceTiers && p.priceTiers[0] ? `${p.priceTiers[0].price}₺'den` : "-";

    const row = document.createElement("div");
    row.className = "admin-product-row";
    row.innerHTML = `
      ${thumbUrl ? `<img src="${thumbUrl}" alt="${p.name}" class="admin-thumb" />` : '<div class="admin-thumb admin-thumb-empty"></div>'}
      <div class="admin-row-info">
        <strong>${p.name}</strong>
        <span>${cat ? cat.label : p.category}${badge ? " · " + badge : ""}</span>
        <span>${fromPrice}</span>
      </div>
      <button type="button" class="btn btn-outline admin-delete-btn">Sil</button>
    `;
    row.querySelector(".admin-delete-btn").addEventListener("click", (e) => {
      e.currentTarget.disabled = true;
      handleDelete(p);
    });
    listEl.appendChild(row);
  });
}

initGate();
