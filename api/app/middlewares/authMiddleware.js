const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });

        // Vérifier et décoder le token
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        req.user = decoded; // Ajoute l'utilisateur décodé à la requête
        next();
    } catch (error) {
        res.status(403).json({ message: "Token invalide ou expiré." });
    }
};

module.exports = authMiddleware;
