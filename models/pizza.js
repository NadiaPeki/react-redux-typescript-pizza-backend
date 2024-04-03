const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pizzaSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  types: [
    {
      type: Number,
      required: true,
    },
  ],
  sizes: [
    {
      type: Number,
      required: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const Pizza = mongoose.model('Pizza', pizzaSchema);

module.exports = Pizza;
