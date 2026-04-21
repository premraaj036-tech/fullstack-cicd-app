const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (MongoDB ki jagah)
let todos = [];
let nextId = 1;

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const todo = { 
    _id: String(nextId++), 
    title: req.body.title, 
    completed: false,
    createdAt: new Date()
  };
  todos.push(todo);
  res.json(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t._id === req.params.id);
  if (todo) {
    todo.completed = req.body.completed;
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t._id !== req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
