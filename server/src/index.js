const nodemailer = require('nodemailer');

// Email endpoint
app.post('/api/send-reminder', async (req, res) => {
  const { todo, email } = req.body;
  
  // Transporter setup (Gmail example)
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
      to: email || 'teacher@college.com',
      subject: `Reminder: ${todo.title}`,
      text: `Your task "${todo.title}" is due on ${todo.dueDate} (Priority: ${todo.priority})`
    });
    res.json({ success: true, message: 'Email sent!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
