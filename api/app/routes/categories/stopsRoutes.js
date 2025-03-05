const express = require('express');
const router = express.Router();
const {
    getStop,
} = require('../../controllers/categories/stopsController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/:stopId', authMiddleware, getStop); // arret precis

module.exports = router;
