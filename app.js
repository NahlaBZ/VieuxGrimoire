const express = require('express');
const app = express();
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const path = require('path');
require('dotenv').config();
//console.log(process.env);





// connexion à ma base de données
mongoose.connect(`mongodb+srv://${process.env.MANGOOSE_USERNAME}:${process.env.MANGOOSE_PASSWORD}@${process.env.MANGOOSE_CLUSTER}/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log('Connexion à MongoDB échouée !\n' + e.stack));


// Gestion des CORS pour toutes les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/auth', userRoutes);


module.exports = app;