// Kardem3D - ürün kataloğu
// Yeni ürün eklemek için bu diziye yeni bir nesne ekleyin.
// model.type: "stl", "obj" veya "glb"/"gltf" olabilir (obj ise model.mtl ile malzeme dosyası da verebilirsiniz).
// model alanını tamamen kaldırırsanız (ya da null yaparsanız) ürün sadece fotoğraflarla
// gösterilir, interaktif 3D kısmı olmaz — sadece görseli olan ürünler için kullanın.
// photos: ürünün gerçek basılmış hâlinin fotoğrafları (arrayin ilk elemanı kapak fotoğrafı olur).
// priceTiers: adete göre değişen fiyat kademeleri; sıralı ve artan minQty bekler.

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

export const PRODUCTS = [
  {
    id: "custom_figure_bebek",
    name: "Kişiye Özel Bebek Figürü",
    category: "custom",
    featured: true,
    isHero: true,
    description:
      "Gönderdiğiniz fotoğraftan yola çıkarak size veya sevdiklerinize benzeyen, tamamen kişiye özel bir 3D baskı figür üretiyoruz. Buradaki örnek figür, gönderilen bir bebek fotoğrafından üretilmiştir. Siz de kendi fotoğrafınızı sayfanın altındaki \"Kendi Modelinizi Gönderin\" alanından bize ulaştırabilirsiniz.",
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
  {
    id: "deadpool_stand",
    name: "Deadpool Kulaklık Standı",
    category: "accessories",
    featured: true,
    description:
      "Deadpool maskesi formunda, masaüstünde yer kaplamayan kulaklık standı. Oyun/bilgisayar masaları için eğlenceli ve dayanıklı bir aksesuar.",
    photos: [
      "assets/images/products/deadpool-stand-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 599 },
      { minQty: 3, price: 549 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 8,
  },
  {
    id: "coffee_friends",
    name: "Kahve Dostları Figür Seti",
    category: "home",
    featured: true,
    description:
      "Kahve makinesi, fincan, kahve çekirdeği ve termos karakterlerinden oluşan, kenara oturan minik dekor figürleri. Mutfak tezgahı veya raf kenarları için sevimli bir detay.",
    photos: [
      "assets/images/products/coffee-friends-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 39 },
      { minQty: 4, price: 35 },
      { minQty: 10, price: 29 },
    ],
    ratingSeed: 4.8,
    reviewCountSeed: 19,
  },
  {
    id: "thor_hammer",
    name: "Thor'un Çekici (Mjolnir)",
    category: "toys",
    featured: true,
    description:
      "Standlı, gerçekçi detaylara sahip Mjolnir replikası. Koleksiyoncular ve süper kahraman hayranları için etkileyici bir masaüstü parçası.",
    photos: [
      "assets/images/products/thor-hammer-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 699 },
      { minQty: 3, price: 649 },
    ],
    ratingSeed: 5.0,
    reviewCountSeed: 6,
  },
  {
    id: "besiktas_frame",
    name: "Beşiktaş Aydınlatmalı Forma Çerçevesi",
    category: "home",
    featured: true,
    description:
      "LED aydınlatmalı forma temalı duvar çerçevesi; takım, oyuncu adı ve imza baskısı ile kişiselleştirilebilir. Taraftarlar için özel bir hediye/dekor parçası.",
    photos: [
      "assets/images/products/besiktas-frame-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 999 },
      { minQty: 3, price: 929 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 11,
  },
  {
    id: "baby_yoda",
    name: "Baby Yoda (Grogu) Figürü",
    category: "toys",
    featured: true,
    description:
      "El boyaması detaylarla üretilen, standlı Baby Yoda koleksiyon figürü. Star Wars severler için sevimli bir raf/masa dekoru.",
    photos: [
      "assets/images/products/baby-yoda-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 399 },
      { minQty: 3, price: 369 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 14,
  },
  {
    id: "car_figure",
    name: "Minyatür Araba Figürü",
    category: "car",
    featured: false,
    description:
      "Gerçek otomobilin küçük ölçekli, detaylı baskı figürü. Anahtarlık, çanta süsü ya da koleksiyon parçası olarak kullanılabilir; talebe göre farklı araç modelleri üretilebilir.",
    photos: [
      "assets/images/products/car-figure-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 199 },
      { minQty: 3, price: 179 },
      { minQty: 10, price: 149 },
    ],
    ratingSeed: 4.7,
    reviewCountSeed: 10,
  },
  {
    id: "dragon_pair",
    name: "İkiz Ejderha Figürü (Dişsiz & Işık Öfkesi)",
    category: "toys",
    featured: true,
    description:
      "Kanatları hareketli, siyah ve beyaz renk seçenekli ejderha çifti figürü. Tek tek ya da çift set olarak sipariş edilebilir.",
    photos: [
      "assets/images/products/dragon-pair-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 399 },
      { minQty: 2, price: 369 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 17,
  },
  {
    id: "dumbbell_keychain",
    name: "Mini Dambıl Anahtarlığı",
    category: "accessories",
    featured: false,
    description:
      "Spor severler için minik dambıl formunda anahtarlık. Pembe ve siyah renk seçenekleriyle üretilebilir; spor çantasına takmak için ideal.",
    photos: [
      "assets/images/products/dumbbell-keychain-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 89 },
      { minQty: 3, price: 75 },
      { minQty: 10, price: 65 },
    ],
    ratingSeed: 4.8,
    reviewCountSeed: 9,
  },
  {
    id: "guitar_keychain",
    name: "Gitar Anahtarlığı",
    category: "accessories",
    featured: false,
    description:
      "Elektro ya da akustik gitar formunda, farklı renk ve model seçenekleriyle üretilebilen anahtarlık. Müzisyen dostlarınıza hediye için idealdir.",
    photos: [
      "assets/images/products/guitar-keychain-1.jpg",
      "assets/images/products/guitar-keychain-2.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 99 },
      { minQty: 3, price: 85 },
      { minQty: 10, price: 75 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 13,
  },
  {
    id: "tennis_keychain",
    name: "Tenis Raketi Anahtarlığı",
    category: "accessories",
    featured: false,
    description:
      "Pastel renk seçenekleriyle üretilen minyatür tenis raketi anahtarlığı. Spor çantası ya da anahtarlar için şık bir aksesuar.",
    photos: [
      "assets/images/products/tennis-keychain-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 89 },
      { minQty: 3, price: 75 },
      { minQty: 10, price: 65 },
    ],
    ratingSeed: 4.7,
    reviewCountSeed: 6,
  },
  {
    id: "spiderman_keychain",
    name: "Örümcek Kahraman Mini Figür Anahtarlığı",
    category: "toys",
    featured: false,
    description:
      "Sevilen örümcek kahramanın mini figür anahtarlığı. Çanta ya da anahtarlıklarınıza takarak taşıyabilirsiniz.",
    photos: [
      "assets/images/products/spiderman-keychain-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 119 },
      { minQty: 3, price: 105 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 21,
  },
  {
    id: "basketball_keychain",
    name: "Basketbol Topu Anahtarlığı",
    category: "accessories",
    featured: false,
    description:
      "Gerçekçi doku detaylarına sahip minyatür basketbol topu anahtarlığı. Basketbol severler için sevimli bir aksesuar.",
    photos: [
      "assets/images/products/basketball-keychain-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 79 },
      { minQty: 3, price: 69 },
      { minQty: 10, price: 59 },
    ],
    ratingSeed: 4.8,
    reviewCountSeed: 11,
  },
  {
    id: "plate_keychain",
    name: "Özelleştirilebilir Plaka Anahtarlığı",
    category: "custom",
    featured: true,
    description:
      "Araç plakanız ve isminizle kişiselleştirilen, gerçek plaka görünümlü anahtarlık. Sürücüler için hem şık hem pratik bir hediye.",
    photos: [
      "assets/images/products/plate-keychain-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 119 },
      { minQty: 3, price: 105 },
      { minQty: 10, price: 89 },
    ],
    ratingSeed: 5.0,
    reviewCountSeed: 8,
  },
  {
    id: "football_keychain",
    name: "Futbol Topu Anahtarlığı",
    category: "accessories",
    featured: false,
    description:
      "Klasik siyah-beyaz ya da renkli desenli futbol topu anahtarlığı; farklı boy seçenekleriyle üretilebilir. Futbolseverler için pratik bir hediye.",
    photos: [
      "assets/images/products/football-keychain-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 79 },
      { minQty: 3, price: 69 },
      { minQty: 10, price: 59 },
    ],
    ratingSeed: 4.8,
    reviewCountSeed: 15,
  },
  {
    id: "gumball_keychain",
    name: "Esnek Mini Karakter Anahtarlığı",
    category: "toys",
    featured: false,
    description:
      "Esnek, hareketli eklemlere sahip sevimli karakter anahtarlığı. Çocuklar ve koleksiyoncular için eğlenceli bir aksesuar.",
    photos: [
      "assets/images/products/gumball-keychain-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 129 },
      { minQty: 3, price: 115 },
    ],
    ratingSeed: 4.7,
    reviewCountSeed: 7,
  },
  {
    id: "ironman_keychain",
    name: "Zırhlı Kahraman Mini Figür Anahtarlığı",
    category: "toys",
    featured: false,
    description:
      "Detaylı boyalı, mini figür formunda zırhlı kahraman anahtarlığı. Süper kahraman hayranları için koleksiyonluk bir aksesuar.",
    photos: [
      "assets/images/products/ironman-keychain-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 119 },
      { minQty: 3, price: 105 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 18,
  },
  {
    id: "spiderman_shelfsitter",
    name: "Örümcek Kahraman Raf Figürü",
    category: "toys",
    featured: true,
    description:
      "Raf, kitaplık ya da masa kenarına tırmanır pozisyonda oturan dekoratif kahraman figürü. Oda ve ofis dekoru için eğlenceli bir detay.",
    photos: [
      "assets/images/products/spiderman-shelfsitter-1.jpg",
    ],
    priceTiers: [
      { minQty: 1, price: 179 },
      { minQty: 3, price: 159 },
    ],
    ratingSeed: 4.9,
    reviewCountSeed: 12,
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
