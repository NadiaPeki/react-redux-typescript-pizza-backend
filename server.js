const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pizza = require('./models/pizza');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
const URL = 'mongodb+srv://napekarskaya:nadia060290i@cluster0.e3cmski.mongodb.net/pizzasbase';

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
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('DB Connection error:', err.details);
    process.exit(1); // Завершаем процесс с ошибкой
  });

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
