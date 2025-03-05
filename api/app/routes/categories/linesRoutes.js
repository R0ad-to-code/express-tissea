const express = require('express');
const router = express.Router();
const { getLineDetails, getStopsByLine, updateLine, addStopToLine, deleteStopFromLine } = require('../../controllers/categories/linesController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/:lineId', authMiddleware, getLineDetails);
router.get('/:lineId/stops', authMiddleware, getStopsByLine);
router.put('/:lineId', authMiddleware, updateLine);
router.post('/:lineId/stops', authMiddleware, addStopToLine); 
router.delete('/:lineId/stops/:stopId', authMiddleware, deleteStopFromLine); // Supprimer un arrêt d'une ligne


// Associe les arrêts à une ligne spécifique
router.use('/:lineId/stops', require('./stopsRoutes'));

module.exports = router;
