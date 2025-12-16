const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ====== JSON DB ======
const DB_PATH = path.join(__dirname, "data.json");

// ====== API ======
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running!" });
});

app.get("/api/hello", (req, res) => {
  res.json({ msg: "Hello from Render backend 🚀" });
});

app.get("/api/db", (req, res) => {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====== Serve Frontend dist (nếu bạn build dist và đưa lên repo) ======
const FRONTEND_DIST = path.join(__dirname, "..", "frontend", "dist");
const INDEX_HTML = path.join(FRONTEND_DIST, "index.html");

if (fs.existsSync(INDEX_HTML)) {
  app.use(express.static(FRONTEND_DIST));

  // IMPORTANT: dùng REGEX, tránh "/*"
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(INDEX_HTML);
  });
} else {
  // nếu không có dist thì root trả trang hướng dẫn
  app.get("/", (req, res) => {
    res.send(`
      <h2>Backend is running 🚀</h2>
      <ul>
        <li><a href="/api/health">/api/health</a></li>
        <li><a href="/api/hello">/api/hello</a></li>
        <li><a href="/api/db">/api/db</a></li>
      </ul>
    `);
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port", PORT));
