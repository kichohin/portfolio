const CONFIG = {
  // Cloudflare Worker API
  SCAN_ENDPOINT: "https://kichohin-site-check-api.kichohinkichohin.workers.dev/scan",

  STRIPE_DETAIL_LINK: "https://buy.stripe.com/REPLACE_DETAIL_REPORT_LINK",
  STRIPE_PACK_LINK: "https://buy.stripe.com/REPLACE_3URL_PACK_LINK",

  // 既存の勝ち筋商品へ接続
  REPAIR_CONTACT_URL: "https://coconala.com/services/3673839"
};

const form = document.getElementById("scanForm");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

initStaticLinks();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = document.getElementById("targetUrl").value.trim();
  const siteType = document.getElementById("siteType").value;
  const symptom = document.getElementById("symptom").value;
  const platforms = [...document.querySelectorAll('input[name="platform"]:checked')].map((input) => input.value);

  if (!url) return;

  setStatus("CV計測リスクを確認しています。通常10〜30秒ほどで完了します。", false);
  resultEl.classList.add("hidden");
  resultEl.innerHTML = "";

  try {
    const response = await fetch(CONFIG.SCAN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, siteType, symptom, platforms, plan: "free" })
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "診断に失敗しました。");
    }

    renderResult(data.report);
    setStatus("診断が完了しました。", false);
  } catch (error) {
    setStatus(error.message || "診断に失敗しました。URLをご確認ください。", true);
  }
});

function initStaticLinks() {
  document.querySelectorAll('[data-link="detail"]').forEach((link) => setupLink(link, CONFIG.STRIPE_DETAIL_LINK, "詳細レポートの決済リンクが未設定です。app.js の STRIPE_DETAIL_LINK を差し替えてください。"));
  document.querySelectorAll('[data-link="pack"]').forEach((link) => setupLink(link, CONFIG.STRIPE_PACK_LINK, "3URLパックの決済リンクが未設定です。app.js の STRIPE_PACK_LINK を差し替えてください。"));
  document.querySelectorAll('[data-link="repair"]').forEach((link) => setupLink(link, CONFIG.REPAIR_CONTACT_URL, ""));
}

function setupLink(link, href, missingMessage) {
  const isMissing = !href || /REPLACE_/.test(href);
  if (isMissing) {
    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (missingMessage) alert(missingMessage);
    });
    return;
  }

  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.removeAttribute("aria-disabled");
}

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.remove("hidden");
  statusEl.style.borderColor = isError ? "#d94b34" : "#1f252b";
  statusEl.style.background = isError ? "#fef3f2" : "#fff";
}

function renderResult(report) {
  const template = document.getElementById("resultTemplate");
  const node = template.content.cloneNode(true);

  node.querySelector('[data-field="overallText"]').textContent = report.overall.label;
  node.querySelector('[data-field="overallMessage"]').textContent = report.overall.message;
  node.querySelector('[data-field="score"]').textContent = `${report.overall.score}`;

  const categoriesEl = node.querySelector('[data-field="categories"]');
  report.categories.forEach((cat) => {
    const div = document.createElement("div");
    div.className = "category-card";
    div.innerHTML = `
      <span class="badge ${statusClass(cat.status)}">${escapeHtml(cat.mark)} ${escapeHtml(cat.statusLabel)}</span>
      <strong>${escapeHtml(cat.name)}</strong>
      <small>${escapeHtml(cat.summary)}</small>
    `;
    categoriesEl.appendChild(div);
  });

  const priorityEl = node.querySelector('[data-field="priority"]');
  report.priorityFindings.forEach((finding) => {
    const li = document.createElement("li");
    li.textContent = finding;
    priorityEl.appendChild(li);
  });

  node.querySelector('[data-field="nextAction"]').textContent = report.nextAction;
  node.querySelector('[data-field="offerTitle"]').textContent = report.offer.title;
  node.querySelector('[data-field="offerMessage"]').textContent = report.offer.message;

  const detailsEl = node.querySelector('[data-field="details"]');
  report.details.forEach((detail) => {
    const div = document.createElement("div");
    div.className = "detail-item";
    div.innerHTML = `
      <span class="badge ${statusClass(detail.status)}">${escapeHtml(detail.mark)} ${escapeHtml(detail.statusLabel)}</span>
      <strong>${escapeHtml(detail.title)}</strong>
      <p>${escapeHtml(detail.message)}</p>
    `;
    detailsEl.appendChild(div);
  });

  resultEl.appendChild(node);
  resultEl.classList.remove("hidden");

  setupLink(resultEl.querySelector('[data-action="detail"]'), CONFIG.STRIPE_DETAIL_LINK, "詳細レポートの決済リンクが未設定です。app.js の STRIPE_DETAIL_LINK を差し替えてください。");
  setupLink(resultEl.querySelector('[data-action="pack"]'), CONFIG.STRIPE_PACK_LINK, "3URLパックの決済リンクが未設定です。app.js の STRIPE_PACK_LINK を差し替えてください。");
  setupLink(resultEl.querySelector('[data-action="repair"]'), CONFIG.REPAIR_CONTACT_URL, "");
}

function statusClass(status) {
  if (status === "ok") return "ok";
  if (status === "warn") return "warn";
  if (status === "info") return "info";
  return "ng";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
