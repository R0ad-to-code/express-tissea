const mongoose = require('mongoose');
const Category = require('./models/categoryModel');
const Line = require('./models/lineModel');
const Stop = require('./models/stopModel');
const User = require('./models/userModel');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🟢 Connecté à MongoDB');

        // Nettoyage de la base
        await Category.deleteMany({});
        await Line.deleteMany({});
        await Stop.deleteMany({});
        await User.deleteMany({});

        // 📌 Catégories de transport (Bus, Tramway, Métro)
        const categories = await Category.insertMany([
            { name: 'Bus' },
            { name: 'Tramway' },
            { name: 'Métro' }
        ]);

        // 📌 Lignes de transport (exemples réels)
        const lines = await Line.insertMany([
            { name: 'Ligne A', creation: new Date(1993, 6, 26), debut_activite: "05:15", fin_activite: "00:30", category: categories[2]._id },
            { name: 'Ligne B', creation: new Date(2007, 6, 30), debut_activite: "05:15", fin_activite: "00:30", category: categories[2]._id },
            { name: 'T1', creation: new Date(2010, 11, 11), debut_activite: "04:50", fin_activite: "00:30", category: categories[1]._id },
            { name: 'T2', creation: new Date(2013, 12, 14), debut_activite: "05:00", fin_activite: "00:30", category: categories[1]._id },
        ]);

        // 📌 Arrêts de transport (exemples fournis)
        const stops = await Stop.insertMany([
            { name: 'Basso Cambo', longitude: 1.3921607530687548, latitude: 43.56989557373252, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Bellefontaine', longitude: 1.3982345412854014, latitude: 43.56607910236315, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Reynerie', longitude: 1.401815277301054, latitude: 43.57094469789181, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Mirail Université', longitude: 1.4019817071092755, latitude: 43.574548525138695, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Bagatelle', longitude: 1.4117446042602746, latitude: 43.579685154659465, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Mermoz', longitude: 1.4153154253881544, latitude: 43.583499000478255, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Fontaine Lestang', longitude: 1.4184059112061367, latitude: 43.58751473180428, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Arènes', longitude: 1.4184867451556853, latitude: 43.59336026931873, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Patte d’Oie', longitude: 1.423384218872457, latitude: 43.59628727699907, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Saint Cyprien République', longitude: 1.431537417271134, latitude: 43.597958514307884, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Esquirol', longitude: 1.443925569415522, latitude: 43.600444088631534, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Capitole', longitude: 1.4454715109504963, latitude: 43.604593808601244, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Jean Jaurès', longitude: 1.4492187844488518, latitude: 43.60587122292866, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Marengo SNCF', longitude: 1.455025806097757, latitude: 43.610835082079944, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Jolimont', longitude: 1.463672939678109, latitude: 43.615376112287215, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Roseraie', longitude: 1.469397997404246, latitude: 43.61984980809889, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Argoulets', longitude: 1.477006167211908, latitude: 43.62454505532691, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' },
            { name: 'Balma Gramont', longitude: 1.4822581299681494, latitude: 43.62898180383957, finish: 't', commune_nom: 'Toulouse', commune_code_insee: '31555' }
        ]);

        // 📌 Ajout des arrêts aux lignes (relation Many-to-Many)
        await Line.updateOne({ name: 'Ligne A' }, { $push: { stops: [
            {_id: stops[0]._id, order: 1},
            {_id: stops[1]._id, order: 2},
            {_id: stops[2]._id, order: 3},
            {_id: stops[3]._id, order: 4},
            {_id: stops[4]._id, order: 5},
            {_id: stops[5]._id, order: 6},
            {_id: stops[6]._id, order: 7}
        ] } });

        await Line.updateOne({ name: 'Ligne B' }, { $push: { stops: [
            {_id: stops[6]._id, order: 1},
            {_id: stops[7]._id, order: 2},
            {_id: stops[8]._id, order: 3},
            {_id: stops[9]._id, order: 4},
            {_id: stops[10]._id, order: 5}
        ] } });

        await Line.updateOne({ name: 'T2' }, { $push: { stops: [
            {_id: stops[11]._id, order: 1},
            {_id: stops[12]._id, order: 2},
            {_id: stops[13]._id, order: 3},
            {_id: stops[14]._id, order: 4}
        ] } });

        console.log('✅ Données insérées avec succès');
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Erreur lors de l’initialisation de la BD :', error);
        mongoose.connection.close();
    }
};

seedDatabase();
