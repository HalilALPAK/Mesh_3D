// ALPOTECH - genel site ayarları
// WhatsApp numarasını ülke koduyla, başında + veya 0 olmadan yazın (örn. Türkiye: 905XXXXXXXXX)
export const CONFIG = {
  STORE_NAME: "ALPOTECH",
  WHATSAPP_NUMBER: "905424433025",
  CURRENCY: "₺",
  DEFAULT_WHATSAPP_GREETING:
    "Merhaba ALPOTECH! Ürünleriniz hakkında bilgi almak istiyorum.",
};

// GitHub Pages her dosyayı sadece 10 dakika önbellekte tutuyor (Cache-Control:
// max-age=600), bu yüzden büyük 3D model/görsel dosyaları bazen hızlı bazen
// yavaş yükleniyordu. jsDelivr, aynı GitHub deposunu çok daha uzun süre (7 gün+)
// ve dünya genelinde tutarlı biçimde önbellekleyen ücretsiz bir CDN olduğu için
// (three.js kütüphanesini zaten buradan çekiyoruz), ürün model/fotoğraflarını da
// canlı sitede buradan servis ediyoruz. Yerelde (localhost) test ederken jsDelivr
// henüz push edilmemiş dosyaları göremeyeceği için otomatik olarak yerel/göreli
// yola geri dönüyor.
const IS_LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
export const ASSET_BASE = IS_LOCAL
  ? ""
  : "https://cdn.jsdelivr.net/gh/HalilALPAK/Mesh_3D@main/";

// products.js içindeki tüm yollar depo köküne göre görelidir (örn.
// "assets/models/vase.stl"); bu fonksiyon canlıda otomatik olarak jsDelivr
// CDN adresine, yerelde ise olduğu gibi bırakır.
export function assetUrl(path) {
  return path ? ASSET_BASE + path : path;
}
