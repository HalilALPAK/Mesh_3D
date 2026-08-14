// ALPOTECH - ürün kataloğu
// Yeni ürün eklemek için bu diziye yeni bir nesne ekleyin.
// model.type: "stl", "obj" veya "glb"/"gltf" olabilir (obj ise model.mtl ile malzeme dosyası da verebilirsiniz).
// model alanını tamamen kaldırırsanız (ya da null yaparsanız) ürün sadece fotoğraflarla
// gösterilir, interaktif 3D kısmı olmaz — sadece görseli olan ürünler için kullanın.
// photos: ürünün gerçek basılmış hâlinin fotoğrafları (arrayin ilk elemanı kapak fotoğrafı olur).
// priceTiers: adete göre değişen fiyat kademeleri; sıralı ve artan minQty bekler.

export const CATEGORIES = [
  { id: "featured", label: "Öne Çıkanlar" },
  { id: "custom", label: "Kişiye Özel Figürler" },
  { id: "home", label: "Ev Eşyaları" },
  { id: "toys", label: "Oyuncaklar" },
  { id: "accessories", label: "Aksesuarlar" },
  { id: "industrial", label: "Endüstriyel" },
  { id: "drone", label: "Drone" },
  { id: "car", label: "Otomobil" },
];

export const PRODUCTS = [
  {
    id: "custom_figure_bebek",
    name: "Kişiye Özel Bebek Figürü",
    category: "custom",
    featured: true,
    isHero: true,
    description:
      "Gönderdiğiniz fotoğraftan yola çıkarak size veya sevdiklerinize benzeyen, tamamen kişiye özel bir 3D baskı figür üretiyoruz. Buradaki örnek figür, gönderilen bir bebek fotoğrafından üretilmiştir. Siz de kendi fotoğrafınızı sayfanın altındaki \"Kendi Modelinizi Gönderin\" alanından bize ulaştırabilirsiniz.",
    model: { type: "obj", url: "assets/models/bebek.obj" },
    color: 0xe8b88f,
    photos: [
      "assets/images/products/bebek-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 599 },
      { minQty: 2, price: 549 },
      { minQty: 4, price: 499 },
    ],
    ratingSeed: 5.0,
    reviewCountSeed: 3,
  },
  {
    id: "pet_tag",
    name: "Kişiye Özel Evcil Hayvan Künyesi",
    category: "custom",
    featured: true,
    // Bu ürünün henüz 3D modeli yok, sadece görseli var — "model" alanı olmadığında
    // ürün kartı otomatik olarak sadece fotoğraf gösterir, 3D döndürme kısmı çıkmaz.
    description:
      "Evcil hayvanınızın görseline benzeyen, anahtarlığa ya da tasmaya takılabilen kişiye özel künye/figür. Kendi dostunuzun fotoğrafını göndererek sipariş verebilirsiniz.",
    photos: [
      "assets/images/products/pet-tag-1.jpg",
      "assets/images/products/pet-tag-2.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 129 },
      { minQty: 3, price: 109 },
      { minQty: 10, price: 89 },
    ],
    ratingSeed: 5.0,
    reviewCountSeed: 4,
  },
  {
    id: "name_keychain",
    name: "Kişiye Özel İsim Anahtarlığı",
    category: "custom",
    featured: true,
    description:
      "İstediğiniz ismi çok renkli baskı ile anahtarlık hâline getiriyoruz. Uçlarında anahtar/çanta halkası deliği bulunur, isteğe bağlı kalp veya farklı uç şekilleriyle kişiselleştirilebilir.",
    photos: [
      "assets/images/products/name-keychain-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 89 },
      { minQty: 3, price: 75 },
      { minQty: 10, price: 65 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 22,
  },
  {
    id: "music_plaque",
    name: "Kişiye Özel Fotoğraf ve Müzik Plaketi",
    category: "custom",
    featured: true,
    description:
      "Gönderdiğiniz fotoğrafı ve sevdiğiniz şarkının adını bir araya getiren, masaüstünde durabilen dekoratif plaket. Yıldönümü, sevgililer günü veya doğum günü hediyesi için idealdir.",
    photos: [
      "assets/images/products/music-plaque-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 229 },
      { minQty: 3, price: 199 },
      { minQty: 10, price: 179 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 12,
  },
  {
    id: "vase",
    name: "Dekoratif Vazo",
    category: "home",
    featured: true,
    description:
      "Modern hatlara sahip, tamamen 3D baskı ile üretilen dekoratif vazo. Salon, ofis ya da hediye için idealdir. PLA/PETG seçenekleriyle özel renk taleplerinizi karşılayabiliriz.",
    // Bu STL, Z eksenini "yukarı" kabul eden bir programdan (CAD/dilimleyici) dışa
    // aktarılmış; Three.js sahnesinde Y ekseni yukarı olduğu için düzeltme rotasyonu.
    model: { type: "stl", url: "assets/models/vase.stl", rotation: [-Math.PI / 2, 0, 0] },
    photos: [
      "assets/images/products/vase-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 249 },
      { minQty: 3, price: 219 },
      { minQty: 10, price: 189 },
    ],
    ratingSeed: 4.7,
    reviewCountSeed: 18,
  },
  {
    id: "stork_frame",
    name: "Leylek Temalı Ultrason Çerçevesi",
    category: "home",
    featured: true,
    description:
      "Gagasında getirdiği bebek motifinin içine ultrason ya da bebek fotoğrafı yerleştirilen zarif çerçeve. Gebelik duyurusu ve doğum hediyesi için özel bir dekor parçası.",
    photos: [
      "assets/images/products/stork-frame-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 199 },
      { minQty: 3, price: 179 },
      { minQty: 10, price: 159 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 9,
  },
  {
    id: "balloon_lamp",
    name: "Sıcak Hava Balonu Gece Lambası",
    category: "home",
    featured: false,
    description:
      "Sepeti ve balonuyla ışık geçirgen filamentten üretilen, içine LED yerleştirilebilen dekoratif gece lambası. Çocuk odaları ve masa üstü dekor için sıcak bir aydınlatma.",
    photos: [
      "assets/images/products/balloon-lamp-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 279 },
      { minQty: 3, price: 249 },
      { minQty: 10, price: 219 },
    ],
    ratingSeed: 4.8,
    reviewCountSeed: 10,
  },
  {
    id: "pregnant_frame",
    name: "Hamile Anne Fotoğraf Çerçevesi",
    category: "home",
    featured: true,
    description:
      "Diz çökmüş anne figürünün içine yerleştirilmiş oval fotoğraf çerçevesi. Bebek beklentisi veya doğum hediyesi için duygusal ve şık bir dekor parçası.",
    photos: [
      "assets/images/products/pregnant-frame-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 189 },
      { minQty: 3, price: 169 },
      { minQty: 10, price: 149 },
    ],
    ratingSeed: 4.8,
    reviewCountSeed: 7,
  },
  {
    id: "garage_keyholder",
    name: "Garaj Kapısı Temalı Anahtarlık",
    category: "home",
    featured: false,
    description:
      "Mini garaj kapıları şeklinde, her biri ayrı bir renkte üretilebilen duvar tipi anahtarlık. Kapılardan biri açılıp küçük bir eşya/oyuncak saklamak için de kullanılabilir; araba tutkunlarına eğlenceli bir hediye.",
    photos: [
      "assets/images/products/garage-keyholder-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 249 },
      { minQty: 3, price: 219 },
      { minQty: 10, price: 189 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 5,
  },
  {
    id: "instagram_tag",
    name: "Sosyal Medya Paylaşım Etiketi",
    category: "accessories",
    featured: false,
    description:
      "Telefona yaklaştırıldığında sosyal medya profilinizi anında açan, anahtarlığa takılabilen kompakt tasarım etiket. İşletmeler ve içerik üreticileri için pratik bir tanıtım aksesuarı.",
    photos: [
      "assets/images/products/instagram-tag-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 99 },
      { minQty: 5, price: 85 },
      { minQty: 20, price: 69 },
    ],
    ratingSeed: 4.6,
    reviewCountSeed: 15,
  },
  {
    id: "servo_mount",
    name: "Servo Motor Pan-Tilt Tabanı",
    category: "industrial",
    featured: false,
    description:
      "Kamera veya sensör montajı için servo motorlu, döner mekanik taban. Robotik ve otomasyon projelerinde hızlı prototipleme için uygundur.",
    photos: [
      "assets/images/products/servo-mount-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 349 },
      { minQty: 5, price: 309 },
      { minQty: 20, price: 269 },
    ],
    ratingSeed: 4.8,
    reviewCountSeed: 6,
  },
  {
    id: "propeller_set",
    name: "Çok Amaçlı Pervane / Pal Seti",
    category: "industrial",
    featured: false,
    description:
      "Pullcopter, RC uçak, RC tekne ve PC fan gibi farklı hobi projeleri için üretilebilen pervane/pal koleksiyonu. İhtiyacınıza göre tek tek veya set hâlinde sipariş edilebilir.",
    photos: [
      "assets/images/products/propeller-set-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 79 },
      { minQty: 5, price: 65 },
      { minQty: 20, price: 55 },
    ],
    ratingSeed: 4.7,
    reviewCountSeed: 8,
  },
  {
    id: "drone_lattice",
    name: "Örgü Desenli Drone Gövdesi",
    category: "drone",
    featured: true,
    description:
      "Ağırlığı azaltmak için örgü/kafes yapıda tasarlanmış, dayanıklı FPV drone gövdesi. Motor ve elektronik yerleşimine uygun geometri.",
    photos: [
      "assets/images/products/drone-lattice-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 389 },
      { minQty: 3, price: 349 },
      { minQty: 10, price: 299 },
    ],
    ratingSeed: 4.7,
    reviewCountSeed: 21,
  },
  {
    id: "drone_racing",
    name: "Yarış Drone Gövdesi",
    category: "drone",
    featured: false,
    description:
      "X şeklinde, karbon fiber görünümlü klasik yarış drone gövdesi. Standart 5 inç pervane ve motor yerleşimine uygundur.",
    photos: [
      "assets/images/products/drone-racing-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 429 },
      { minQty: 3, price: 389 },
      { minQty: 10, price: 349 },
    ],
    ratingSeed: 4.6,
    reviewCountSeed: 5,
  },
];

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
