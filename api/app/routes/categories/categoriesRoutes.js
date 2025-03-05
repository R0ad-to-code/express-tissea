const express = require('express');
const router = express.Router();
const { getCategories, getInfosByCategory, getLinesByCategory } = require('../../controllers/categories/categoriesController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/', authMiddleware, getCategories);
router.get('/:categoryId', authMiddleware, getInfosByCategory);
router.get('/:categoryId/lines', authMiddleware, getLinesByCategory);

// Associe les routes des lignes à une catégorie
router.use('/:categoryId/lines', require('./linesRoutes'));

module.exports = router;
