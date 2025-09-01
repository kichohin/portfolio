 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/index.html
index 0000000000000000000000000000000000000000..3fcd5f6792e735ff95872e57a3d297cc3d6cd06b 100644
--- a//dev/null
+++ b/index.html
@@ -0,0 +1,50 @@
+<!DOCTYPE html>
+<html lang="ja">
+<head>
+  <meta charset="UTF-8">
+  <title>Portfolio</title>
+  <link rel="stylesheet" href="styles.css">
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
 
EOF
)
