const mongoose = require('mongoose');
const Pizza = require('../models/pizza');

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ error });
};

const getPizzas = async (req, res) => {
  try {
    let query = Pizza.find();

    if (req.query.category) {
      query = query.where('category').equals(req.query.category.toLowerCase());
    }

    if (req.query.sort && req.query.order) {
      const sortField = req.query.sort;
      const sortOrder = req.query.order === 'asc' ? 1 : -1;
      query = query.sort({ [sortField]: sortOrder });
    } else {
      query = query.sort({ title: 1 });
    }

    if (req.query.search) {
      console.log('Search query:', req.query.search);

      const searchTerm = new RegExp(req.query.search, 'i');
      query = query.where({ $or: [{ title: searchTerm }] });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let totalQuery = Pizza.find();

    if (req.query.category) {
      totalQuery = totalQuery.where('category').equals(req.query.category.toLowerCase());
    }

    const total = await totalQuery.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const pizzas = await query.exec();

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      hasPrevPage: startIndex > 0,
      hasNextPage: endIndex < total,
    };

    res.status(200).json({ pizzas, pagination });
  } catch (err) {
    console.error('Error fetching pizzas:', err instanceof Error ? err : err.toString());
    handleError(res, err);
  }
};

const getPizzaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pizza = await Pizza.findOne({ id: parseInt(id) });

    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }

    return res.json(pizza);
  } catch (error) {
    console.error('Error fetching pizza:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const deletePizza = (req, res) => {
  Pizza.findByIdAndDelete(req.params.id)
    .then((pizza) => {
      if (!pizza) {
        console.error('Pizza not found for deletion');
        return res.status(404).json({ error: 'Pizza not found' });
      }
      res.status(200).json(pizza);
    })
    .catch((err) => {
      console.error('Error deleting pizza:', err);
      handleError(res, err);
    });
};

const addPizza = (req, res) => {
  const pizza = new Pizza(req.body);
  pizza
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error('Error adding pizza:', err);
      handleError(res, err);
    });
};

const updatePizza = async (req, res) => {
  try {
    const pizzaId = req.params.id;
    const updateData = req.body;

    const pizza = await Pizza.findByIdAndUpdate(pizzaId, updateData, { new: true });

    if (!pizza) {
      console.error('Pizza not found for update');
      return res.status(404).json({ error: 'Pizza not found' });
    }

    res.status(200).json(pizza);
  } catch (error) {
    console.error('Error updating pizza:', error);
    handleError(res, error);
  }
};

module.exports = {
  getPizzas,
  getPizzaById,
  deletePizza,
  addPizza,
  updatePizza,
};
