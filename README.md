# ALPOTECH — 3D Baskı Mağazası Sitesi

Saf HTML + CSS + JavaScript (Three.js CDN üzerinden) ile hazırlanmış, build aracı
gerektirmeyen bir site. `index.html` dosyasını açan herhangi bir statik hosting'e
(cPanel, Netlify, GitHub Pages, vb.) klasörün tamamını kopyalamanız yeterli.

## Yerelde çalıştırma

Tarayıcılar `file://` üzerinden ES module ve STL/OBJ dosyalarını CORS nedeniyle
yükleyemez; bu yüzden basit bir yerel sunucu ile açmanız gerekir:

```bash
cd 3D_ALPOTECH
python -m http.server 8000
# tarayıcıda http://localhost:8000 adresini açın
```

## Klasör yapısı

```
index.html
css/style.css
js/
  config.js      -> mağaza ayarları (WhatsApp numarası vb.)
  products.js     -> ürün kataloğu ve kategoriler
  viewer.js        -> Three.js STL/OBJ 3D görüntüleyici
  cart.js           -> sepet mantığı ve arayüzü
  reviews.js         -> yorum/puan sistemi
  storage.js          -> localStorage yardımcıları
  whatsapp.js          -> WhatsApp mesaj oluşturma
  main.js               -> sayfayı birleştiren ana dosya
assets/
  models/    -> .stl / .obj / .glb ürün modelleri
  images/products/ -> basılmış ürünlerin fotoğrafları
```

## 1) WhatsApp numaranız

`js/config.js` içindeki `WHATSAPP_NUMBER` değeri ayarlı (başında `+` veya `0`
olmadan, ülke koduyla birlikte):

```js
WHATSAPP_NUMBER: "905424433025",
```

Numara değişirse aynı formatta buradan güncelleyin. Bu numara hem sepeti
onaylama, hem "kendi modelini gönder" formu, hem de sağ alt köşedeki sabit
WhatsApp butonu için kullanılır.

## 2) Ürünlerinizi ekleyin / mevcutları değiştirin

Katalogdaki tüm ürünler gerçek fotoğraflarla eklendi (bazılarının henüz 3D
modeli yok, sadece fotoğrafla listeleniyor — aşağıya bakın). Yeni ürün
eklemek için:

1. `.stl` veya `.obj` dosyanızı `assets/models/` klasörüne kopyalayın.
2. Ürünün gerçek basılmış fotoğraflarını `assets/images/products/` klasörüne koyun
   (istediğiniz sayıda; ilk fotoğraf kapak fotoğrafı olarak kullanılmaz, ok ile
   3D görünümden sonra sırayla gösterilir).
3. `js/products.js` içindeki `PRODUCTS` dizisine yeni bir ürün nesnesi ekleyin:

```js
{
  id: "benzersiz-id",
  name: "Ürün Adı",
  category: "home", // custom | home | toys | accessories | industrial | drone | car
  featured: true,     // "Öne Çıkanlar" bölümünde de gösterilsin mi?
  description: "Ürün açıklaması...",
  model: { type: "stl", url: "assets/models/dosya-adiniz.stl" },
  // OBJ + MTL kullanıyorsanız: { type: "obj", url: "...obj", mtl: "...mtl" }
  photos: [
    "assets/images/products/dosya-1.jpg",
    "assets/images/products/dosya-2.jpg",
  ],
  priceTiers: [
    { minQty: 1, price: 199 },
    { minQty: 5, price: 179 },
    { minQty: 10, price: 149 },
  ],
  ratingSeed: 4.7,       // başlangıç puanı (yorum yokken gösterilecek)
  reviewCountSeed: 10,   // başlangıç yorum sayısı
},
```

**Henüz 3D modeli olmayan, sadece fotoğrafı olan bir ürün eklemek isterseniz** `model`
alanını tamamen kaldırın (ya da `model: null` yazın). O ürün kartında 3D döndürme
kısmı ve "3D" rozeti otomatik olarak çıkar, sadece fotoğraf(lar) gösterilir. Tek
fotoğraf varsa geçiş okları da otomatik gizlenir; birden fazla fotoğraf eklerseniz
oklar yine görünür. Modeli hazır olduğunda `model` alanını normal şekilde eklemeniz
yeterli.

`isHero: true` verirseniz o ürün, arama çubuğunun hemen altındaki büyük 360°
dönen banner alanında gösterilir (yalnızca bir üründe kullanın).

Kategori listesini (etiketleri) değiştirmek isterseniz `js/products.js`
dosyasının başındaki `CATEGORIES` dizisini düzenleyin.

Bir ürünün 3D önizlemesine özel bir renk vermek isterseniz `color` alanını
onaltılık (hex) renk kodu olarak ekleyin, örn. `color: 0xe8b88f,` (belirtilmezse
varsayılan gri-mavi ton kullanılır).

### Kişiye özel figür / kampanya bannerı

Ana sayfanın en üstünde, "Fotoğrafınızı Size Özel Bir 3D Figüre Dönüştürüyoruz"
başlıklı kampanya bannerı (`assets/images/campaign-transform.jpg` arka planlı)
ve "Kişiye Özel Figürler" kategorisinde örnek bir ürün (`custom_figure_bebek`)
bulunuyor. Bu, müşterinin gönderdiği bir fotoğraftan üretilen kişiye özel
figür hizmetini tanıtmak için eklendi:

- Banner görselini değiştirmek isterseniz `assets/images/campaign-transform.jpg`
  dosyasının üzerine kendi görselinizi aynı isimle koyun, ya da
  `css/style.css` içindeki `.campaign-banner` kuralındaki dosya yolunu güncelleyin.
  Banner metni/başlığı `index.html` içinde `#campaign-banner` bölümündedir.
- Örnek figür ürününün 3D modeli `assets/models/bebek.obj` ve dönüşüm demosundaki
  `assets/models/transform-demo.glb` — bu dosyalar ham 3D tarama/fotogrametri
  çıktısı oldukları için (~1 milyon üçgen) çok büyüktü (41 MB / 22 MB), yüklenmeleri
  yavaştı. Poligon sayısını ~40.000'e indirerek (görsel kalite neredeyse aynı
  kalacak şekilde) 1,5 MB / 1,7 MB'a düşürdük — artık saniyenin altında yükleniyorlar.
  Yeni bir müşteri modeli eklerken de benzer şekilde küçültmenizi öneririz: Blender'da
  "Decimate" modifier'ı, ya da Python'da `trimesh` + `fast-simplification` paketleriyle
  `mesh.simplify_quadric_decimation(face_count=40000)` gibi bir komutla yapılabilir
  (dokulu/GLB modellerde UV'leri korumak için `fast_simplification.replay_simplification`
  kullanmak gerekir).
- 3D model önizlemeden fotoğrafa (veya tam tersi) geçerken kısa bir "dönüşüm"
  animasyonu (ışık taraması + hafif büyüme) oynatılır; bu efekt tüm ürünlerde
  otomatik çalışır, ayrıca ayar gerektirmez.

Not: "Oyuncaklar" ve "Otomobil" kategorileri şu an gerçek ürün eklenmediği için
boş — gerçek ürün fotoğrafı/modeli eklediğinizde otomatik görünür olurlar (boş
kategoriler sitede hiç gösterilmez).

## 3) Yorumlar ve sepet nerede saklanıyor?

Sepet ve kullanıcı yorumları, sunucu/veritabanı olmadığı için **kullanıcının
kendi tarayıcısında (localStorage)** saklanır. Yani bir ziyaretçinin eklediği
yorum, başka bir ziyaretçiye görünmez — sadece kendi cihazında kalır. İleride
gerçek/paylaşımlı bir yorum sistemi isterseniz basit bir backend (ör. Firebase,
Supabase) eklenmesi gerekir.

## 4) "Kendi modelini gönder" alanı nasıl çalışır?

WhatsApp'ın "tıkla ve sohbet et" linki (wa.me) sadece **metin** gönderebilir,
dosya ekleyemez. Bu yüzden form şöyle çalışır: kullanıcı görsellerini/model
dosyalarını seçer, açıklamasını yazar, "WhatsApp'tan Gönder" butonuna basınca
seçtiği dosya adlarını da içeren hazır bir mesajla WhatsApp sohbeti açılır;
kullanıcı seçtiği dosyaları o sohbete elle sürükleyip ekler. Bu, WhatsApp'ın
teknik bir sınırlamasıdır, siteden kaynaklanmıyor.

## Tarayıcı desteği

Three.js'in ES module + importmap kullanımı güncel Chrome, Edge, Firefox ve
Safari sürümlerinde sorunsuz çalışır. Çok eski tarayıcılarda 3D görüntüleyici
çalışmayabilir; bu durumda "Model yüklenemedi" uyarısı gösterilir.

## Değişiklik yaptıktan sonra hâlâ eski hâli mi görüyorsunuz?

Özellikle telefonlarda tarayıcılar `.js`/`.css` dosyalarını agresif şekilde
önbelleğe alabiliyor; bir değişiklik (örn. WhatsApp numarası) yaptıktan sonra
site hâlâ eski hâliyle açılıyorsa önce **sayfayı tamamen kapatıp yeniden
açmayı** ya da tarayıcı önbelleğini temizlemeyi deneyin. Kalıcı çözüm için
`index.html` ve `js/*.js` dosyalarındaki `?v=2` sürüm numaralarını (script/link
etiketlerinde ve `import ... from "./dosya.js?v=2"` satırlarında) her önemli
güncellemeden sonra `?v=3`, `?v=4` şeklinde artırın — bu, tarayıcının dosyayı
önbellekten değil sunucudan yeniden çekmesini garanti eder.
