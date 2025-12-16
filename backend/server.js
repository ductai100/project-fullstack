const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// ===== MongoDB connect =====
const MONGODB_URI = process.env.MONGODB_URI; // set trên Render
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connect error:", err.message));

// ===== Model =====
const TodoSchema = new mongoose.Schema(
  { text: { type: String, required: true } },
  { timestamps: true }
);
const Todo = mongoose.model("Todo", TodoSchema);

// ===== Routes =====
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running!" });
});

app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const text = (req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "text is required" });

  const created = await Todo.create({ text });
  res.json(created);
});

app.delete("/api/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Root route cho Render
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port", PORT));
