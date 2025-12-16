const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// =======================
// JSON "DATABASE" FILE
// =======================
const DB_PATH = path.join(__dirname, "data.json");

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]", "utf-8");
    const raw = fs.readFileSync(DB_PATH, "utf-8") || "[]";
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// =======================
// STATIC FRONTEND
// =======================
app.use(express.static(path.join(__dirname, "public")));

// Trang chủ: hiển thị UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =======================
// API
// =======================
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running!" });
});

// Lấy danh sách item đã lưu
app.get("/api/items", (req, res) => {
  const items = readDB();
  res.json(items);
});

// Thêm item mới
app.post("/api/items", (req, res) => {
  const text = (req.body?.text ?? "").toString().trim();
  if (!text) return res.status(400).json({ error: "Text is required" });

  const items = readDB();
  const newItem = {
    id: Date.now(),
    text,
    createdAt: new Date().toISOString(),
  };

  items.unshift(newItem);
  writeDB(items);
  res.status(201).json(newItem);
});

// (Tuỳ chọn) Xoá item
app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const items = readDB();
  const next = items.filter((x) => x.id !== id);
  writeDB(next);
  res.json({ ok: true });
});

// =======================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
