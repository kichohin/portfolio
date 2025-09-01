diff --git a//dev/null b/index.html
index 0000000000000000000000000000000000000000..44ebe90bb8bec2135b1a12f7c9332374a638126f 100644
--- a//dev/null
+++ b/index.html
@@ -0,0 +1,125 @@
+<!DOCTYPE html>
+<html lang="ja">
+<head>
+  <meta charset="UTF-8">
+  <title>Portfolio</title>
+  <style>
+    body {
+      background: #c0c0c0;
+      font-family: 'MS Sans Serif', sans-serif;
+      display: flex;
+      justify-content: center;
+      padding: 20px;
+    }
+
+    .window {
+      width: 360px;
+      border: 2px solid #000;
+      background: #ffffff;
+      box-shadow: 4px 4px 0 #000;
+    }
+
+    .title-bar {
+      background: #000080;
+      color: #ffffff;
+      display: flex;
+      justify-content: space-between;
+      align-items: center;
+      padding: 2px 4px;
+    }
+
+    .title-bar-controls button {
+      width: 16px;
+      height: 14px;
+      margin-left: 2px;
+    }
+
+    .menu-bar {
+      background: #c0c0c0;
+      padding: 2px;
+    }
+
+    .menu-bar button {
+      background: none;
+      border: none;
+      margin-right: 4px;
+      font-size: 12px;
+    }
+
+    .profile {
+      display: flex;
+      padding: 8px;
+    }
+
+    .avatar {
+      width: 80px;
+      height: 80px;
+      background: #000;
+      border-radius: 50%;
+      margin-right: 8px;
+    }
+
+    .stats span {
+      margin-right: 8px;
+    }
+
+    .follow {
+      margin-top: 4px;
+    }
+
+    .gallery {
+      display: grid;
+      grid-template-columns: repeat(3, 1fr);
+      gap: 2px;
+      padding: 2px;
+    }
+
+    .thumb {
+      background: #999;
+      padding-bottom: 100%;
+    }
+  </style>
+</head>
+<body>
+  <div class="window">
+    <div class="title-bar">
+      <div class="title-bar-text">Instagram.exe</div>
+      <div class="title-bar-controls">
+        <button aria-label="Minimize"></button>
+        <button aria-label="Maximize"></button>
+        <button aria-label="Close"></button>
+      </div>
+    </div>
+    <div class="menu-bar">
+      <button>File</button>
+      <button>Edit</button>
+      <button>View</button>
+      <button>Help</button>
+    </div>
+    <div class="profile">
+      <div class="avatar"></div>
+      <div class="details">
+        <h1 class="username">username</h1>
+        <div class="stats">
+          <span>0 posts</span>
+          <span>0 followers</span>
+          <span>0 following</span>
+        </div>
+        <button class="follow">+ Follow</button>
+        <p class="bio">Your profile description here</p>
+      </div>
+    </div>
+    <div class="gallery">
+      <div class="thumb"></div>
+      <div class="thumb"></div>
+      <div class="thumb"></div>
+      <div class="thumb"></div>
+      <div class="thumb"></div>
+      <div class="thumb"></div>
+      <div class="thumb"></div>
+      <div class="thumb"></div>
+      <div class="thumb"></div>
+    </div>
+  </div>
+</body>
+</html>
