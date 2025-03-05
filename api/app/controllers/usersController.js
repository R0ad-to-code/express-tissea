const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const SECRET_KEY = process.env.SECRET_KEY;

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signup = async (req, res) => {
    try {
        const { email, password, admin } = req.body;

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = new User({ email, password: hashedPassword, admin });
        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Connexion d'un utilisateur
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }

        // Génération du token JWT
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, signup, login };
