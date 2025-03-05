const Stop = require('../models/stopModel');
const Line = require('../models/lineModel');

// 📌 Fonction pour calculer la distance avec la formule de Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km

    // Vérification si les latitudes et longitudes sont valides
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        console.error('Invalid latitude or longitude');
        return 0; // Retourne 0 si l'un des paramètres est invalide
    }

    // Si une latitude ou longitude est manquante, on la remplace par 0
    lat1 = lat1 || 0;
    lon1 = lon1 || 0;
    lat2 = lat2 || 0;
    lon2 = lon2 || 0;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en kilomètres
}


// ✅ GET - Distance entre deux arrêts
const getDistanceTwoStops = async (req, res) => {
    try {
        const stop1 = await Stop.findById(req.params.stop1Id);
        const stop2 = await Stop.findById(req.params.stop2Id);

        if (!stop1 || !stop2) return res.status(404).json({ message: "Arrêt non trouvé" });

        const distance = calculateDistance(stop1.latitude, stop1.longitude, stop2.latitude, stop2.longitude);
        res.json({ distance: distance.toFixed(2) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET - Distance totale d'une ligne
const getDistanceLine = async (req, res) => {
    try {
        const line = await Line.findById(req.params.lineId).populate('stops._id');
        if (!line) return res.status(404).json({ message: "Ligne non trouvée" });

        let totalDistance = 0;
        for (let i = 0; i < line.stops.length - 1; i++) {
            const stop1 = line.stops[i]._id;
            const stop2 = line.stops[i + 1]._id;
            totalDistance += calculateDistance(stop1.latitude, stop1.longitude, stop2.latitude, stop2.longitude);
        }

        res.json({ distance: totalDistance.toFixed(2)});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDistanceTwoStops,
    getDistanceLine
};
