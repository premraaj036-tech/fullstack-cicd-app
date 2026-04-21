import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('All');

  // LocalStorage se load karo
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // LocalStorage mein save karo
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      title: newTodo,
      completed: false,
      dueDate: dueDate || 'No date',
      priority: priority,
      createdAt: new Date().toLocaleString()
    };
    setTodos([...todos, todo]);
    setNewTodo('');
    setDueDate('');
    setPriority('Medium');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const saveEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, title: editText } : todo
    ));
    setEditingId(null);
  };

  const sendReminder = (todo) => {
    alert(`📧 Reminder: "${todo.title}" is due on ${todo.dueDate} (Priority: ${todo.priority})\n\n[This would send an actual email using Nodemailer in production]`);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Advanced Todo App</h1>
        <p>CI/CD Enabled | Full Stack | MongoDB Ready</p>
      </header>

      <div className="stats">
        <span>📊 Total: {stats.total}</span>
        <span>✅ Done: {stats.completed}</span>
        <span>⏳ Pending: {stats.pending}</span>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('Active')} className={filter === 'Active' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
      </div>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button type="submit">Add Todo</button>
      </form>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={`priority-${todo.priority.toLowerCase()}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(todo.id)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                  autoFocus
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
              </>
            ) : (
              <>
                <span className={todo.completed ? 'completed' : ''}>
                  {todo.title}
                </span>
                <span className="due-date">📅 {todo.dueDate}</span>
                <span className={`priority-badge priority-${todo.priority.toLowerCase()}`}>
                  {todo.priority}
                </span>
              </>
            )}
            
            <div className="actions">
              {editingId !== todo.id && (
                <>
                  <button onClick={() => startEdit(todo)} className="edit-btn">✏️</button>
                  <button onClick={() => sendReminder(todo)} className="email-btn">📧</button>
                </>
              )}
              <button onClick={() => deleteTodo(todo.id)} className="delete-btn">🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty">No todos yet. Add one above! 👆</p>}
    </div>
  );
}

export default App;
