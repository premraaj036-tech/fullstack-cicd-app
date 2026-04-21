const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let todos = [];
let nextId = 1;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Create todo
app.post('/api/todos', (req, res) => {
  const todo = { 
    id: String(nextId++), 
    title: req.body.title, 
    completed: false,
    dueDate: req.body.dueDate || 'No date',
    priority: req.body.priority || 'Medium',
    createdAt: new Date()
  };
  todos.push(todo);
  res.json(todo);
});

// Update todo
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (todo) {
    todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
    todo.title = req.body.title || todo.title;
    todo.dueDate = req.body.dueDate || todo.dueDate;
    todo.priority = req.body.priority || todo.priority;
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== req.params.id);
  res.json({ message: 'Deleted' });
});

// Email reminder endpoint
app.post('/api/send-reminder', async (req, res) => {
  const { todo, email } = req.body;
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email || 'premraaj036@gmail.com',
      subject: `🔔 Reminder: ${todo.title}`,
      html: `
        <h2>📋 Todo Reminder</h2>
        <p><strong>📌 Task:</strong> ${todo.title}</p>
        <p><strong>📅 Due Date:</strong> ${todo.dueDate}</p>
        <p><strong>⚡ Priority:</strong> ${todo.priority}</p>
        <hr>
        <p><em>🚀 Sent from CI/CD Todo App</em></p>
      `
    });
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
