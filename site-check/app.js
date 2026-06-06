const CONFIG = {

  SCAN_ENDPOINT: "https://kichohin-site-check-api.kichohinkichohin.workers.dev/scan",
  PAY_ENDPOINT: "https://kichohin-site-check-api.kichohinkichohin.workers.dev/pay",

  SQUARE_APP_ID: "sandbox-sq0idb-jldNnvxTyG8v1kbeGurg1w",
  SQUARE_LOCATION_ID: "L8WW7F30VAVO3",

  REPAIR_CONTACT_URL: "https://coconala.com/services/3673839",

  PRODUCTS: {
    detail_report: {
      id: "detail_report",
      name: "詳細レポート",
      priceLabel: "1,980円",
      amount: 1980,
      description: "1URLの診断結果を保存用レポートとして発行します。"
    },
    three_url_pack: {
      id: "three_url_pack",
      name: "3URLパック",
      priceLabel: "4,980円",
      amount: 4980,
      description: "無料診断済みURLに加え、追加2URLを確認したレポートを発行します。"
    }
  }
};

const form = document.getElementById("scanForm");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

let lastScanPayload = null;
let lastReport = null;
let squareCard = null;
let currentProductId = null;
let isSquareInitializing = false;

initStaticLinks();

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = document.getElementById("targetUrl").value.trim();
    const siteType = document.getElementById("siteType").value;
    const symptom = document.getElementById("symptom").value;
    const platforms = [...document.querySelectorAll('input[name="platform"]:checked')].map((input) => input.value);

    if (!url) return;

    lastScanPayload = {
      url,
      siteType,
      symptom,
      platforms,
      plan: "free"
    };

    lastReport = null;

    setStatus("CV計測リスクを確認しています。通常10〜30秒ほどで完了します。", false);
    resultEl.classList.add("hidden");
    resultEl.innerHTML = "";

    try {
      const response = await fetch(CONFIG.SCAN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastScanPayload)
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "診断に失敗しました。");
      }

      lastReport = data.report;

      sessionStorage.setItem("kichohin_last_scan_payload", JSON.stringify(lastScanPayload));
      sessionStorage.setItem("kichohin_last_report", JSON.stringify(lastReport));

      renderResult(data.report);
      setStatus("診断が完了しました。", false);
    } catch (error) {
      setStatus(error.message || "診断に失敗しました。URLをご確認ください。", true);
    }
  });
}

function initStaticLinks() {
  restoreLastScanState();

  document.querySelectorAll('[data-link="detail"]').forEach((link) => {
    setupPaymentLink(link, "detail_report", "1,980円で詳細レポート");
  });

  document.querySelectorAll('[data-link="pack"]').forEach((link) => {
    setupPaymentLink(link, "three_url_pack", "4,980円で3URLチェック");
  });

  document.querySelectorAll('[data-link="repair"]').forEach((link) => {
    setupExternalLink(link, CONFIG.REPAIR_CONTACT_URL);
  });
}

function restoreLastScanState() {
  try {
    const savedPayload = sessionStorage.getItem("kichohin_last_scan_payload");
    const savedReport = sessionStorage.getItem("kichohin_last_report");

    if (savedPayload) lastScanPayload = JSON.parse(savedPayload);
    if (savedReport) lastReport = JSON.parse(savedReport);
  } catch {
    lastScanPayload = null;
    lastReport = null;
  }
}

function setupPaymentLink(link, productId, label) {
  if (!link) return;

  link.href = "#paymentArea";
  link.textContent = label;
  link.removeAttribute("aria-disabled");

  link.addEventListener("click", async (event) => {
    event.preventDefault();
    await openPaymentArea(productId);
  });
}

function setupExternalLink(link, href) {
  if (!link) return;

  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.removeAttribute("aria-disabled");
}

async function openPaymentArea(productId) {
  const product = CONFIG.PRODUCTS[productId];

  if (!product) {
    alert("商品情報が見つかりません。");
    return;
  }

  const paymentArea = document.getElementById("paymentArea");

  if (!paymentArea) {
    alert("決済エリアがHTMLに追加されていません。index.htmlに paymentArea を追加してください。");
    return;
  }

  currentProductId = productId;

  const selectedProductBox = document.getElementById("selectedProductBox");
  const squarePayButton = document.getElementById("squarePayButton");
  const downloadArea = document.getElementById("downloadArea");
  const paymentStatus = document.getElementById("paymentStatus");
  const packExtraUrls = document.getElementById("packExtraUrls");

  paymentArea.classList.remove("hidden");

  if (downloadArea) {
    downloadArea.classList.add("hidden");
    downloadArea.innerHTML = "";
  }

  if (paymentStatus) {
    paymentStatus.classList.add("hidden");
    paymentStatus.textContent = "";
  }

  if (packExtraUrls) {
    packExtraUrls.classList.toggle("hidden", productId !== "three_url_pack");
  }

  if (selectedProductBox) {
    selectedProductBox.innerHTML = `
      <strong>${escapeHtml(product.name)}</strong><br>
      ${escapeHtml(product.priceLabel)} / ${escapeHtml(product.description)}
    `;
  }

  if (squarePayButton) {
    squarePayButton.textContent = `${product.priceLabel}で購入する`;
    squarePayButton.dataset.productId = productId;
  }

  paymentArea.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    await initSquarePaymentOnce();
  } catch (error) {
    setPaymentStatus(error.message || "Square決済フォームの初期化に失敗しました。", true);
  }
}

async function initSquarePaymentOnce() {
  if (squareCard) return;
  if (isSquareInitializing) return;

  isSquareInitializing = true;

  try {
    if (!window.Square) {
      throw new Error("Square.js の読み込みに失敗しました。");
    }

    const payments = window.Square.payments(
      CONFIG.SQUARE_APP_ID,
      CONFIG.SQUARE_LOCATION_ID
    );

    squareCard = await payments.card();
    await squareCard.attach("#card-container");
  } finally {
    isSquareInitializing = false;
  }
}

const squarePayButton = document.getElementById("squarePayButton");

if (squarePayButton) {
  squarePayButton.addEventListener("click", async () => {
    const email = document.getElementById("buyerEmail")?.value.trim() || "";
    const buyerName = document.getElementById("buyerName")?.value.trim() || "";
    const productId = squarePayButton.dataset.productId || currentProductId;
    const product = CONFIG.PRODUCTS[productId];

    if (!product) {
      setPaymentStatus("購入する商品を選択してください。", true);
      return;
    }

    if (!email) {
      setPaymentStatus("メールアドレスを入力してください。", true);
      return;
    }

    if (!isValidEmail(email)) {
      setPaymentStatus("メールアドレスの形式をご確認ください。", true);
      return;
    }

    if (!lastReport || !lastScanPayload) {
      setPaymentStatus("先に無料診断を実行してください。診断結果に基づいてレポートを作成します。", true);
      return;
    }

    const extraUrls = getExtraUrlsForProduct(productId);

    if (productId === "three_url_pack" && extraUrls.length !== 2) {
      setPaymentStatus("3URLパックでは、追加URLを2件入力してください。", true);
      return;
    }

    try {
      await initSquarePaymentOnce();

      setPaymentStatus("決済を処理しています。画面を閉じずにお待ちください。", false);
      squarePayButton.disabled = true;
      squarePayButton.textContent = "決済処理中...";

      const tokenResult = await squareCard.tokenize();

      if (tokenResult.status !== "OK") {
        throw new Error(getTokenizeErrorMessage(tokenResult));
      }

      const response = await fetch(CONFIG.PAY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: tokenResult.token,
          productId,
          locationId: CONFIG.SQUARE_LOCATION_ID,
          email,
          buyerName,
          scanPayload: {
            ...lastScanPayload,
            extraUrls
          },
          reportSnapshot: lastReport
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "決済に失敗しました。");
      }

      setPaymentStatus("決済が完了しました。ダウンロードリンクを表示します。", false);
      renderDownloadArea(data);

      setTimeout(() => {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
      }, 600);
    } catch (error) {
      console.error("Square payment flow error:", error);
      setPaymentStatus(error.message || "決済処理中にエラーが発生しました。", true);
    } finally {
      squarePayButton.disabled = false;
      squarePayButton.textContent = product ? `${product.priceLabel}で購入する` : "決済する";
    }
  });
}

function getExtraUrlsForProduct(productId) {
  if (productId !== "three_url_pack") return [];

  const extraUrl1 = document.getElementById("extraUrl1")?.value.trim() || "";
  const extraUrl2 = document.getElementById("extraUrl2")?.value.trim() || "";

  return [extraUrl1, extraUrl2].filter(Boolean);
}

function renderDownloadArea(data) {
  const downloadArea = document.getElementById("downloadArea");

  if (!downloadArea) return;

  downloadArea.classList.remove("hidden");
  downloadArea.innerHTML = `
    <h3>購入ありがとうございます</h3>
    <p>
      決済が完了しました。以下のボタンから診断レポートをダウンロードできます。
      自動で開かない場合は、ボタンを押してください。
    </p>
    <div class="result-actions">
      <a class="button primary" href="${escapeHtml(data.downloadUrl)}" target="_blank" rel="noopener noreferrer">
        レポートをダウンロードする
      </a>
    </div>
    <p style="margin-top:12px;">
      有効期限：${escapeHtml(data.expiresInLabel || "24時間")} / 最大ダウンロード回数：${escapeHtml(data.maxDownloads || 3)}回
    </p>
    <p style="margin-top:8px;">
      購入ID：${escapeHtml(data.purchaseId)}
    </p>
  `;

  downloadArea.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getTokenizeErrorMessage(tokenResult) {
  if (!tokenResult || !tokenResult.errors || !tokenResult.errors.length) {
    return "カード情報の確認に失敗しました。入力内容をご確認ください。";
  }

  return tokenResult.errors.map((error) => error.message).join(" / ");
}

function setStatus(message, isError) {
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.classList.remove("hidden");
  statusEl.style.borderColor = isError ? "#d94b34" : "#1f252b";
  statusEl.style.background = isError ? "#fef3f2" : "#fff";
}

function setPaymentStatus(message, isError) {
  const paymentStatus = document.getElementById("paymentStatus");

  if (!paymentStatus) {
    alert(message);
    return;
  }

  paymentStatus.textContent = message;
  paymentStatus.classList.remove("hidden");
  paymentStatus.style.borderColor = isError ? "#d94b34" : "#1f252b";
  paymentStatus.style.background = isError ? "#fef3f2" : "#fff";
}

function renderResult(report) {
  const template = document.getElementById("resultTemplate");

  if (!template || !resultEl) return;

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

  setupPaymentLink(resultEl.querySelector('[data-action="detail"]'), "detail_report", "1,980円で詳細レポート");
  setupPaymentLink(resultEl.querySelector('[data-action="pack"]'), "three_url_pack", "4,980円で3URLチェック");
  setupExternalLink(resultEl.querySelector('[data-action="repair"]'), CONFIG.REPAIR_CONTACT_URL);
}

function statusClass(status) {
  if (status === "ok") return "ok";
  if (status === "warn") return "warn";
  if (status === "info") return "info";
  return "ng";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
