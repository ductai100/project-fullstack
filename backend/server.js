const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// =======================
// MongoDB
// =======================
const MONGO_URI = process.env.MONGO_URI; // set trên Render

if (!MONGO_URI) {
  console.warn("⚠️ Missing MONGO_URI env var");
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connect error:", err.message));

const TodoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    done: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);

// =======================
// API
// =======================
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running!" });
});

// list todos
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// add todo
app.post("/api/todos", async (req, res) => {
  const text = (req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "text is required" });

  const todo = await Todo.create({ text });
  res.json(todo);
});

// toggle done
app.patch("/api/todos/:id/toggle", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ error: "not found" });

  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
});

// delete
app.delete("/api/todos/:id", async (req, res) => {
  const deleted = await Todo.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "not found" });
  res.json({ ok: true });
});

// =======================
// Serve React build (dist)
// =======================
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port", PORT));
