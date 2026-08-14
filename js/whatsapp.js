// ALPOTECH - WhatsApp entegrasyon yardımcıları
import { CONFIG } from "./config.js?v=4";

export function openWhatsApp(message) {
  const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

export function buildCartMessage(items) {
  // items: [{ name, qty, unitPrice, lineTotal }]
  const lines = [`Merhaba ALPOTECH! Aşağıdaki ürünleri sipariş etmek istiyorum:`, ""];
  let grandTotal = 0;
  items.forEach((item, i) => {
    grandTotal += item.lineTotal;
    lines.push(
      `${i + 1}) ${item.name} — ${item.qty} adet — birim ${item.unitPrice}${CONFIG.CURRENCY} — ara toplam ${item.lineTotal}${CONFIG.CURRENCY}`
    );
  });
  lines.push("");
  lines.push(`Toplam: ${grandTotal}${CONFIG.CURRENCY}`);
  lines.push("");
  lines.push("Sipariş ve teslimat detayları için bilgi verir misiniz?");
  return lines.join("\n");
}

export function buildCustomModelMessage({ description, fileNames }) {
  const lines = [
    "Merhaba ALPOTECH! Özel bir model/ürün oluşturmanızı istiyorum.",
    "",
  ];
  if (description) {
    lines.push("Açıklama:");
    lines.push(description);
    lines.push("");
  }
  if (fileNames && fileNames.length) {
    lines.push(`Bu sohbete eklemek istediğim ${fileNames.length} görsel/dosya var:`);
    fileNames.forEach((name) => lines.push(`- ${name}`));
    lines.push("");
    lines.push("(Dosyaları birazdan bu WhatsApp sohbetine ekleyeceğim.)");
  } else {
    lines.push("Görsellerimi bu sohbete birazdan ekleyeceğim.");
  }
  return lines.join("\n");
}
