import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTodos() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo() {
    const t = text.trim();
    if (!t) return;

    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t })
      });

      if (!res.ok) throw new Error("Add failed");
      setText("");
      await loadTodos();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTodo(id) {
    await fetch(`/api/todos/${id}/toggle`, { method: "PATCH" });
    await loadTodos();
  }

  async function removeTodo(id) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    await loadTodos();
  }

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>Project Fullstack (Render 1 link)</h1>

      <h3>Thông tin sinh viên</h3>
      <p><b>Họ tên:</b> Nguyễn Đức Tài</p>
      <p><b>MSSV:</b> DH52201386</p>
      <p><b>Lớp:</b> D22_TH09</p>

      <hr />

      <h2>Todo (CRUD + MongoDB)</h2>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập nội dung..."
          style={{ flex: 1, padding: 10 }}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button onClick={addTodo} disabled={loading} style={{ padding: "10px 14px" }}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <ul style={{ marginTop: 16 }}>
        {todos.map((t) => (
          <li key={t._id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
            <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t._id)} />
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
            <button onClick={() => removeTodo(t._id)} style={{ marginLeft: "auto" }}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
