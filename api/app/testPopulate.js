require('dotenv').config(); // Si tu utilises un fichier .env
const mongoose = require('mongoose');
const Line = require('./models/lineModel'); // Assure-toi que le chemin est correct
const Stop = require('./models/stopModel'); // Assure-toi que le chemin est correct

const testPopulate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("🔌 Connecté à MongoDB");

        // Remplace "tonIdDeLigne" par un ID existant dans ta base
        const line = await Line.findById("67c56a03b60e509b9318024b").populate("stops");

        if (!line) {
            console.log("❌ Ligne non trouvée");
            return;
        }

        console.log("✅ Ligne trouvée :", JSON.stringify(line, null, 2));

        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Erreur :", error);
    }
};

testPopulate();
