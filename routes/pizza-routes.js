const express = require('express');
const router = express.Router();
const {
  getPizzas,
  getPizzaById,
  deletePizza,
  addPizza,
  updatePizza,
} = require('../controllers/pizza-controller');

router.get('/pizzas', getPizzas);
router.get('/pizzas/:id', getPizzaById);
router.delete('/pizzas/:id', deletePizza);
router.post('/pizzas', addPizza);
router.patch('/pizzas/:id', updatePizza);

module.exports = router;
