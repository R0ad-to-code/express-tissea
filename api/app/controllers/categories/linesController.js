const Line = require('../../models/lineModel');
const Stop = require('../../models/stopModel');
const mongoose = require('mongoose');

// ✅ GET - Détails d'une ligne
const getLineDetails = async (req, res) => {
    try {
        const line = await Line.findById(req.params.lineId)
            .populate('stops._id')
            .populate('category', 'name'); // Ajout du populate pour la catégorie
        if (!line) return res.status(404).json({ message: "Ligne non trouvée" });
        
        const formattedLine = {
            _id: line._id,
            name: line.name,
            creation: line.creation,
            debut_activite: line.debut_activite,
            fin_activite: line.fin_activite,
            category: {
                id: line.category._id,
                name: line.category.name
            },
            stops: line.stops.map(stop => ({
                id: stop._id ? stop._id._id : null, // Fallback in case the stop doesn't have an _id
                name: stop._id ? stop._id.name : stop.name, // Cleaned up name
                longitude: stop._id ? stop._id.longitude : stop.longitude,
                latitude: stop._id ? stop._id.latitude : stop.latitude,
                order: stop.order
            }))
        };

        res.json(formattedLine); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ PUT - Modifier une ligne
const updateLine = async (req, res) => {
    try {
        const updatedLine = await Line.findByIdAndUpdate(req.params.lineId, req.body, { new: true });
        res.json(updatedLine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Liste détaillée des arrêts d'une ligne
const getStopsByLine = async (req, res) => {
    try {
        const line = await Line.findById(req.params.lineId).populate('stops._id');
        if (!line) return res.status(404).json({ message: "Ligne non trouvée" });

        const stops = line.stops
        .filter(stop => stop._id) 
        .map(stop => ({
            id: stop._id ? stop._id._id : null, // Fallback in case the stop doesn't have an _id
            name: stop._id ? stop._id.name : stop.name, // Cleaned up name
            longitude: stop._id ? stop._id.longitude : stop.longitude,
            latitude: stop._id ? stop._id.latitude : stop.latitude,
            order: stop.order
        }))

        res.json(stops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ POST - Ajouter un arrêt à une ligne
const addStopToLine = async (req, res) => {
    try {
        const { name, order, longitude, latitude } = req.body;
        const line = await Line.findById(req.params.lineId);
        if (!line) return res.status(404).json({ message: "Ligne non trouvée" });
        if (order > line.stops.length + 1 || !order) {
            return res.status(400).json({ message: "L'ordre spécifié est invalide" });
        }

        // Ajuste l'ordre des arrêts existants
        if (order <= line.stops.length) {
            line.stops.forEach(stop => {
                if (stop.order >= order) {
                    stop.order += 1;
                }
            });
        }

        const newStop = new Stop({ 
            name, 
            longitude, 
            latitude 
        });
        await newStop.save();

        line.stops.push({ _id: newStop._id, order });
        line.stops.sort((a, b) => a.order - b.order);
        // Sauvegarde la ligne avec le nouvel arrêt
        await line.save();
        res.status(201).json(line);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ DELETE - Supprimer un arrêt d'une ligne
// ✅ DELETE - Supprimer un arrêt d'une ligne
const deleteStopFromLine = async (req, res) => {
    try {
        const { lineId, stopId } = req.params;

        // Trouver la ligne dans la collection
        const line = await Line.findById(lineId);
        if (!line) return res.status(404).json({ message: "Ligne non trouvée" });

        // Trouver l'arrêt à supprimer
        const stopIndex = line.stops.findIndex(stop => stop._id.toString() === stopId);
        if (stopIndex === -1) return res.status(404).json({ message: "Arrêt non trouvé" });

        // Supprimer l'arrêt de la collection Stop
        await Stop.findByIdAndDelete(stopId);

        // Retirer l'arrêt de la liste des arrêts dans la ligne
        line.stops.splice(stopIndex, 1);

        // Réajuster l'ordre des arrêts après suppression
        line.stops.forEach((stop, index) => {
            stop.order = index + 1;
        });

        // Sauvegarder la ligne après modification
        await line.save();

        // Retourner la ligne mise à jour
        res.json(line);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getLineDetails,
    addStopToLine,
    updateLine,
    getStopsByLine,
    deleteStopFromLine
};
