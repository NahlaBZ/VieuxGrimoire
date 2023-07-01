const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');

//Connexion à la base de données
mongoose.connect('mongodb+srv://benzidnahla:CmFU3hINzGPsfe6F@cluster0.uccivn5.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log('Connexion à MongoDB échouée !\n' + e.stack));

const app = express();

//Création d'utilisateur
app.post('/api/user', (req, res, next) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

//Obtenir la liste des utilisateurs
app.use('/api/users', (req, res, next) => {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }));
});

//Création d'un livre
app.post('/api/book', (req, res, next) => {
    delete req.body._id;
    const book = new Book({
        ...req.body
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

//Obtenir la liste des livres
app.use('/api/books', (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
});

module.exports = app;