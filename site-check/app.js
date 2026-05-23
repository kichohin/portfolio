const CONFIG = {
  // Cloudflare Worker API
  SCAN_ENDPOINT: "https://kichohin-site-check-api.kichohinkichohin.workers.dev/scan",

  // Stripe Payment Linksを作成後、ここにURLを入れてください。
  STRIPE_PRO_LINK: "https://buy.stripe.com/REPLACE_PRO_LINK",
  STRIPE_AGENCY_LINK: "https://buy.stripe.com/REPLACE_AGENCY_LINK",

  // 修正依頼を受ける先。Coconala商品URL、自社フォーム、メールフォーム等に変更してください。
  REPAIR_CONTACT_URL: "https://coconala.com/users/5218668"
};

const form = document.getElementById("scanForm");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

document.querySelectorAll("[data-stripe-link]").forEach((link) => {
  const key = link.dataset.stripeLink === "agency" ? "STRIPE_AGENCY_LINK" : "STRIPE_PRO_LINK";
  link.href = CONFIG[key];
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = document.getElementById("targetUrl").value.trim();
  const plan = document.querySelector('input[name="plan"]:checked')?.value || "free";

  if (!url) return;

  setStatus("診断しています。通常10〜30秒ほどで完了します。", false);
  resultEl.classList.add("hidden");
  resultEl.innerHTML = "";

  try {
    const response = await fetch(CONFIG.SCAN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, plan })
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "診断に失敗しました。");
    }

    renderResult(data.report, plan);
    setStatus("診断が完了しました。", false);
  } catch (error) {
    setStatus(error.message || "診断に失敗しました。URLをご確認ください。", true);
  }
});

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.remove("hidden");
  statusEl.style.borderColor = isError ? "#fecdca" : "#e5e7eb";
  statusEl.style.background = isError ? "#fef3f2" : "#f8fafc";
}

function renderResult(report, plan) {
  const template = document.getElementById("resultTemplate");
  const node = template.content.cloneNode(true);

  node.querySelector('[data-field="overallText"]').textContent = report.overall.label;
  node.querySelector('[data-field="score"]').textContent = `${report.overall.score}`;

  const categoriesEl = node.querySelector('[data-field="categories"]');
  report.categories.forEach((cat) => {
    const div = document.createElement("div");
    div.className = "category-card";
    div.innerHTML = `
      <span class="badge ${statusClass(cat.status)}">${cat.mark} ${escapeHtml(cat.statusLabel)}</span>
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

  const detailsEl = node.querySelector('[data-field="details"]');
  report.details.forEach((detail) => {
    const div = document.createElement("div");
    div.className = "detail-item";
    div.innerHTML = `
      <span class="badge ${statusClass(detail.status)}">${detail.mark} ${escapeHtml(detail.statusLabel)}</span>
      <strong>${escapeHtml(detail.title)}</strong>
      <p>${escapeHtml(detail.message)}</p>
    `;
    detailsEl.appendChild(div);
  });

  const requestText = buildRepairRequest(report, plan);
  const requestBox = node.querySelector('[data-field="requestText"]');
  requestBox.value = requestText;

  resultEl.appendChild(node);
  resultEl.classList.remove("hidden");

  resultEl.querySelector('[data-action="copy-request"]').addEventListener("click", async () => {
    await navigator.clipboard.writeText(requestText);
    alert("修正依頼文をコピーしました。");
  });

  resultEl.querySelector('[data-action="download-report"]').addEventListener("click", () => {
    const html = buildReportHtml(report);
    downloadFile(`site-check-report-${Date.now()}.html`, html, "text/html");
  });
}

function buildRepairRequest(report, plan) {
  return [
    "お世話になっております。",
    "以下URLの診断結果をもとに、修正可否とお見積りをご確認いただけますでしょうか。",
    "",
    `対象URL：${report.url}`,
    `診断日時：${report.checkedAt}`,
    `利用プラン：${plan}`,
    `総合判定：${report.overall.label}（${report.overall.score}点）`,
    "",
    "優先確認項目：",
    ...report.priorityFindings.map((item, index) => `${index + 1}. ${item}`),
    "",
    "確認したい内容：",
    "・ページ上で確認できる不備の修正",
    "・広告タグ/計測タグの設置状況確認",
    "・必要に応じた管理画面側の確認",
    "",
    "補足：",
    "本診断はページ上で確認できる範囲の結果です。広告管理画面側のCV反映、購入完了イベント、サーバーサイド計測、Meta CAPI等は別途確認が必要です。"
  ].join("\n");
}

function buildReportHtml(report) {
  const details = report.details.map(d => `
    <li>
      <strong>${escapeHtml(d.mark)} ${escapeHtml(d.title)}</strong><br>
      ${escapeHtml(d.message)}
    </li>
  `).join("");

  const priorities = report.priorityFindings.map(f => `<li>${escapeHtml(f)}</li>`).join("");

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>Kichohin Site Check Report</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans JP",sans-serif;line-height:1.8;padding:32px;color:#111827}
    .box{border:1px solid #e5e7eb;border-radius:16px;padding:20px;margin:18px 0}
    h1{font-size:28px}
  </style>
</head>
<body>
  <h1>Kichohin Site Check Report</h1>
  <div class="box">
    <p><strong>対象URL：</strong>${escapeHtml(report.url)}</p>
    <p><strong>診断日時：</strong>${escapeHtml(report.checkedAt)}</p>
    <p><strong>総合判定：</strong>${escapeHtml(report.overall.label)} / ${escapeHtml(String(report.overall.score))}点</p>
  </div>
  <h2>優先確認項目</h2>
  <ol>${priorities}</ol>
  <h2>詳細結果</h2>
  <ul>${details}</ul>
  <div class="box">
    <p>本レポートは、Webページ上で確認できる範囲のタグ・メタ情報・リンク・フォーム等を診断したものです。広告管理画面側のCV反映、購入完了イベント、サーバーサイド計測、Meta CAPI等の正常性を保証するものではありません。</p>
  </div>
</body>
</html>`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function statusClass(status) {
  if (status === "ok") return "ok";
  if (status === "warn") return "warn";
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
