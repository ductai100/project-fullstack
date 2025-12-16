const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ================= API =================
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

// ví dụ api test
app.get("/api/hello", (req, res) => {
  res.json({ msg: "Hello from backend" });
});

// ================= FRONTEND (React build) =================
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

// ⚠️ QUAN TRỌNG: fallback cho React (KHÔNG dùng "*")
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ================= START =================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
