const Category = require('../../models/categoryModel');
const Line = require('../../models/lineModel');

// ✅ GET - Liste de toutes les catégories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        const formattedCategories = categories.map(category => ({
            id : category._id,
            name : category.name,
            version : category.__v
        }));
        res.json(formattedCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET - Liste des infos par catégory
const getInfosByCategory = async (req, res) => {
    try {
        const categories = await Category.find({_id : req.params.categoryId});
        const formattedCategories = categories.map(category => ({
            id : category._id,
            name : category.name,
            version : category.__v
        }));
        res.json(formattedCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Liste des lignes par catégory
const getLinesByCategory = async (req, res) => {
    try {
        const lines = await Line.find({ category: req.params.categoryId })
            .populate('stops._id')
            .populate('category', 'name'); // Ajout du populate pour la catégorie
        // Formater les lignes et les arrêts correctement
        const formattedLines = lines.map(line => ({
            id: line._id,
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
        }));

        res.json(formattedLines); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories, getInfosByCategory, getLinesByCategory
};
