require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const Expense = require('./models/Expense');

const app  = express();
const PORT = process.env.PORT || 3000;


mongoose
  .connect(process.env.MONGO_URI)
  .then(function() {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(function(err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });


app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

app.use(express.json());


app.get('/', function(req, res) {
  res.json({
    message: 'SpendSmart backend is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});


app.get('/expenses', async function(req, res) {
  try {

    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/expenses/:id', async function(req, res) {
  try {

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid expense id' });
    }
    res.status(500).json({ error: err.message });
  }
});


app.post('/expenses', async function(req, res) {
  try {

    const expense = await Expense.create({
      title:    req.body.title,
      amount:   req.body.amount,
      category: req.body.category,
      date:     req.body.date
    });

    console.log('Expense created:', expense._id);

    res.status(201).json(expense);

  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(function(e) {
        return e.message;
      });
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: err.message });
  }
});





app.delete('/expenses/:id', async function(req, res) {
  try {

    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    console.log('Expense deleted:', req.params.id);
    res.json({ message: 'Expense deleted successfully' });

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid expense id' });
    }
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, function() {
  console.log('----------------------------------');
  console.log('SpendSmart backend running');
  console.log('URL: http://localhost:' + PORT);
  console.log('----------------------------------');
});