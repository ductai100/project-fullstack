import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then(res => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    location.reload();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Project Fullstack</h1>
      <p>Họ tên: Nguyễn Đức Tài</p>
      <p>MSSV: DH52201386</p>

      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(t => <li key={t.id}>{t.text}</li>)}
      </ul>
    </div>
  );
}
