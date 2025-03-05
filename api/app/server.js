// Import des modules
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const connectDB = require('./config/db')

// Couleur dans la console
const colors = require('colors')

// connecter à MongoDB
connectDB()

// Init d'express
const app = express()

// authorisation du FE
app.use(cors({
    origin: 'http://localhost:8080', // Remplace par l'URL de ton front-end
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// accepter données envoyées par formulaire
app.use(express.json())
app.use(express.urlencoded())

app.use('/api/categories', require('./routes/categories/categoriesRoutes'))
app.use('/api/stats', require('./routes/statsRoutes'))
app.use('/api/users', require('./routes/usersRoutes'))

// Lancement server
app.listen(port, () => {
    console.log(`Server started on ${port}`)
})