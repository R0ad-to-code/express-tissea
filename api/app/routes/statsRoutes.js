const express = require('express');
const router = express.Router();
const {
    getDistanceTwoStops,
    getDistanceLine
} = require('../controllers/statsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/distance/stops/:stop1Id/:stop2Id', authMiddleware, getDistanceTwoStops);
router.get('/distance/lines/:lineId', authMiddleware, getDistanceLine);

module.exports = router;
