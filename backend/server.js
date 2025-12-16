const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "data.json");

// API
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/todos", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  res.json(data);
});

app.post("/api/todos", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  data.push({ id: Date.now(), text: req.body.text });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

// Serve frontend
const FRONTEND_DIST = path.join(__dirname, "../frontend/dist");
app.use(express.static(FRONTEND_DIST));

app.get("/*", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running"));
