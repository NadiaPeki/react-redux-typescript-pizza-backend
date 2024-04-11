const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const Pizza = require('./models/pizza');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Подключение роутов для работы с пиццами
const pizzaRoutes = require('./routes/pizza-routes');
app.use(pizzaRoutes);

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('DB Connection error:', err.message);
    process.exit(1);
  });

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
