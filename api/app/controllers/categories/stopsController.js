const Line = require('../../models/lineModel');
const Stop = require('../../models/stopModel');

// ✅ GET - arret precis
const getStop = async (req, res) => {
    try {
        const stop = await Stop.findById(req.params.stopId);
        if (!stop) return res.status(404).json({ message: "Stop non trouvée" });
        res.json(stop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






module.exports = {
    getStop
};
