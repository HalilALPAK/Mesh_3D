// ALPOTECH - ürün yorumları ve puanlama
import { getReviewsFor, addReview } from "./storage.js?v=3";

// Ürünün "seed" (başlangıç) puanı ile kullanıcıların taraycıda eklediği
// gerçek yorumları birleştirerek ağırlıklı ortalama puan döndürür.
export function getRatingSummary(product) {
  const reviews = getReviewsFor(product.id);
  const seedCount = product.reviewCountSeed || 0;
  const seedTotal = (product.ratingSeed || 0) * seedCount;
  const userTotal = reviews.reduce((sum, r) => sum + r.rating, 0);
  const totalCount = seedCount + reviews.length;
  const average = totalCount > 0 ? (seedTotal + userTotal) / totalCount : 0;
  return { average, count: totalCount };
}

export function renderStars(average) {
  const rounded = Math.round(average * 2) / 2; // en yakın 0.5
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i) html += "★";
    else if (rounded >= i - 0.5) html += "⯨";
    else html += "☆";
  }
  return html;
}

export function renderReviewsSection(container, product) {
  function renderList() {
    const reviews = getReviewsFor(product.id);
    const summary = getRatingSummary(product);

    container.innerHTML = `
      <div class="reviews-summary">
        <span class="stars">${renderStars(summary.average)}</span>
        <span class="reviews-avg">${summary.average.toFixed(1)}</span>
        <span class="reviews-count">(${summary.count} değerlendirme)</span>
      </div>
      <form class="review-form" id="review-form">
        <div class="review-form-row">
          <label for="review-name">Adınız</label>
          <input id="review-name" type="text" maxlength="40" required placeholder="Adınız" />
        </div>
        <div class="review-form-row">
          <label>Puanınız</label>
          <div class="star-input" id="star-input" data-value="5">
            ${[1, 2, 3, 4, 5].map((n) => `<span class="star-choice" data-value="${n}">★</span>`).join("")}
          </div>
        </div>
        <div class="review-form-row">
          <label for="review-comment">Yorumunuz</label>
          <textarea id="review-comment" maxlength="400" required placeholder="Ürün hakkındaki görüşleriniz..."></textarea>
        </div>
        <button type="submit" class="btn btn-secondary">Yorumu Gönder</button>
      </form>
      <div class="review-list">
        ${
          reviews.length
            ? reviews
                .map(
                  (r) => `
          <div class="review-item">
            <div class="review-item-head">
              <strong>${escapeHtml(r.name)}</strong>
              <span class="stars small">${renderStars(r.rating)}</span>
              <span class="review-date">${r.date}</span>
            </div>
            <p>${escapeHtml(r.comment)}</p>
          </div>`
                )
                .join("")
            : `<p class="review-empty">Henüz yorum yok. İlk yorumu siz yazın!</p>`
        }
      </div>
    `;

    const starInput = container.querySelector("#star-input");
    const starChoices = [...container.querySelectorAll(".star-choice")];
    function paintStars(value) {
      starChoices.forEach((el) => {
        el.classList.toggle("active", Number(el.dataset.value) <= value);
      });
    }
    paintStars(5);
    starChoices.forEach((el) => {
      el.addEventListener("click", () => {
        starInput.dataset.value = el.dataset.value;
        paintStars(Number(el.dataset.value));
      });
    });

    container.querySelector("#review-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = container.querySelector("#review-name").value.trim();
      const comment = container.querySelector("#review-comment").value.trim();
      const rating = Number(starInput.dataset.value);
      if (!name || !comment) return;

      addReview(product.id, {
        id: `${Date.now()}`,
        name,
        rating,
        comment,
        date: new Date().toLocaleDateString("tr-TR"),
      });
      renderList();
    });
  }

  renderList();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
