<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>KICHOHIN | Portfolio (Retro Window)</title>
  <meta name="description" content="KICHOHIN Portfolio – シンプルで軽量なレトロ窓UIのギャラリー。" />
  <style>
    :root {
      --bg: #c0c0c0;          /* デスクトップ背景 */
      --win: #ffffff;         /* ウィンドウ背景 */
      --ink: #111111;         /* 文字色 */
      --border: #000000;      /* 外枠 */
      --shadow: #000000;      /* ドロップシャドウ */
      --title-bg: #000080;    /* タイトルバー */
      --title-fg: #ffffff;    /* タイトル文字 */
      --chrome: #d3d3d3;      /* メニューバー */
      --muted: #6b7280;       /* 補助文字 */
      --accent: #0f6bff;      /* 強調 */
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--ink);
      font-family: system-ui, -apple-system, Segoe UI, "MS Sans Serif", Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 24px;
    }

    /* ===== Window ===== */
    .window {
      width: min(1100px, 92vw);
      background: var(--win);
      border: 2px solid var(--border);
      border-radius: 8px;
      box-shadow: 6px 6px 0 var(--shadow);
      overflow: hidden;
    }

    .title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 10px;
      background: var(--title-bg);
      color: var(--title-fg);
    }
    .title-bar-text { font-weight: 700; letter-spacing: .2px; }

    .title-bar-controls { display: inline-flex; gap: 6px; }
    .ctrl {
      inline-size: 18px; block-size: 16px;
      background: var(--chrome);
      border: 1px solid #000;
      border-radius: 3px;
      display: grid; place-items: center;
      cursor: default;
      user-select: none;
      line-height: 1;
      font-size: 10px;
      color: #000;
    }

    .menu-bar {
      display: flex; gap: 12px;
      padding: 6px 8px;
      background: var(--chrome);
      border-block-end: 1px solid #9b9b9b;
      font-size: 13px;
    }
    .menu-bar button {
      background: transparent; border: 0; padding: 4px 6px; cursor: pointer;
      font: inherit; color: inherit;
    }
    .menu-bar button:focus { outline: 2px dashed #000; outline-offset: 2px; }

    /* ===== Profile ===== */
    .profile {
      display: grid; grid-template-columns: 96px 1fr; gap: 14px;
      padding: 16px;
      border-block-end: 1px solid #e5e7eb;
    }
    .avatar { inline-size: 96px; block-size: 96px; border-radius: 50%; overflow: hidden; border: 2px solid #000; background: #eee; }
    .avatar img { inline-size: 100%; block-size: 100%; object-fit: cover; display: block; }

    .username { margin: 0 0 6px; font-size: 20px; }
    .stats { display: flex; flex-wrap: wrap; gap: 14px; font-size: 14px; }
    .stats strong { font-weight: 700; }

    .actions { display: flex; gap: 8px; margin-top: 8px; }
    .btn { padding: 6px 10px; border: 1px solid #111; background: #f5f5f5; border-radius: 10px; cursor: pointer; }
    .btn.primary { background: #f0f6ff; border-color: #0f6bff; color: #0f3a9f; }

    .bio { margin: 8px 0 0; font-size: 14px; color: var(--muted); }

    /* ===== Gallery ===== */
    .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; padding: 12px; }
    .card { position: relative; aspect-ratio: 1 / 1; border: 1px solid #111; background: #eee; overflow: hidden; border-radius: 6px; }
    .card img { inline-size: 100%; block-size: 100%; object-fit: cover; display: block; }
    .caption { position: absolute; inset-inline: 0; inset-block-end: 0; padding: 6px 8px; font-size: 12px; color: #fff; background: rgb(0 0 0 / 55%); display: flex; justify-content: space-between; align-items: center; }

    /* ===== Footer ===== */
    .footer { padding: 12px; border-top: 1px solid #e5e7eb; font-size: 12px; color: var(--muted); display: flex; justify-content: space-between; }

    /* ===== Responsive tweaks ===== */
    @media (max-width: 640px) {
      .profile { grid-template-columns: 72px 1fr; }
      .username { font-size: 18px; }
    }

    /* アクセシビリティ配慮 */
    @media (prefers-reduced-motion: reduce) {
      * { scroll-behavior: auto; }
    }
  </style>
</head>
<body>
  <main class="window" aria-label="Retro Window">
    <header class="title-bar">
      <div class="title-bar-text">Instagram.exe — KICHOHIN</div>
      <div class="title-bar-controls" aria-hidden="true">
        <div class="ctrl" title="Minimize">_</div>
        <div class="ctrl" title="Maximize">□</div>
        <div class="ctrl" title="Close">×</div>
      </div>
    </header>

    <nav class="menu-bar" aria-label="Window menu">
      <button type="button">File</button>
      <button type="button">Edit</button>
      <button type="button">View</button>
      <button type="button">Help</button>
    </nav>

    <section class="profile">
      <div class="avatar">
        <!-- TODO: プロフィール画像を差し替え -->
        <img src="https://picsum.photos/seed/kicho/300/300" alt="プロフィール画像" loading="lazy" />
      </div>
      <div>
        <h1 class="username">KICHOHIN</h1>
        <div class="stats" aria-label="プロフィール統計">
          <div><strong>9</strong> posts</div>
          <div><strong>120</strong> followers</div>
          <div><strong>98</strong> following</div>
        </div>
        <div class="actions">
          <button class="btn primary" type="button">+ Follow</button>
          <a class="btn" href="mailto:hello@example.com">Contact</a>
        </div>
        <p class="bio">Web / GAS / LINE連携。軽量・即応・構造を壊さない実装を得意とします。</p>
      </div>
    </section>

    <section class="gallery" aria-label="作品ギャラリー">
      <!-- TODO: 画像は自身の /assets 配下へ置き換え。alt を必ず設定 -->
      <a class="card" href="#" aria-label="Work 01">
        <img src="https://picsum.photos/seed/w1/1200/1200" alt="Work 01 サムネイル" loading="lazy" />
        <div class="caption"><span>Work 01</span><span>2025</span></div>
      </a>
      <a class="card" href="#" aria-label="Work 02">
        <img src="https://picsum.photos/seed/w2/1200/1200" alt="Work 02 サムネイル" loading="lazy" />
        <div class="caption"><span>Work 02</span><span>2025</span></div>
      </a>
      <a class="card" href="#" aria-label="Work 03">
        <img src="https://picsum.photos/seed/w3/1200/1200" alt="Work 03 サムネイル" loading="lazy" />
        <div class="caption"><span>Work 03</span><span>2025</span></div>
      </a>
      <a class="card" href="#" aria-label="Work 04">
        <img src="https://picsum.photos/seed/w4/1200/1200" alt="Work 04 サムネイル" loading="lazy" />
        <div class="caption"><span>Work 04</span><span>2025</span></div>
      </a>
      <a class="card" href="#" aria-label="Work 05">
        <img src="https://picsum.photos/seed/w5/1200/1200" alt="Work 05 サムネイル" loading="lazy" />
        <div class="caption"><span>Work 05</span><span>2025</span></div>
      </a>
      <a class="card" href="#" aria-label="Work 06">
        <img src="https://picsum.photos/seed/w6/1200/1200" alt="Work 06 サムネイル" loading="lazy" />
        <div class="caption"><span>Work 06</span><span>2025</span></div>
      </a>
      <a class="card" href="#" aria-label="Work 07">
        <img src="https://picsum.photos/seed/w7/1200/1200" alt="Work 07 サムネイル" loading="lazy" />
        <div class="caption"><span>Work 07</span><span>2025</span></div>
      </a>
      <a class="card" href="#" aria-label="Work 08">
        <img src="https://picsum.photos/seed/w8/1200/1200" alt="Work 08 サムネイル" loading="lazy" />
        <div class="caption"><span>Work 08</span><span>2025</span></div>
      </a>
      <a class="card" href="#" aria-label="Work 09">
        <img src="https://picsum.photos/seed/w9/1200/1200" alt="Work 09 サムネイル" loading="lazy" />
        <div class="caption"><span>Work 09</span><span>2025</span></div>
      </a>
    </section>

    <div class="footer">
      <span>© 2025 KICHOHIN</span>
      <span>Retro UI / Static HTML</span>
    </div>
  </main>
</body>
</html>
