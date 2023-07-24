const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {

    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;

    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.path}`
    });

    book.save()
        .then(() => { res.status(201).json({ message: 'Livre enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};



exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};



exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // vérification si l'utilisateur peut supprimer le livre
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Livre supprimé !' }) })
                        .catch(error => res.status(401).json({ error }))
                });
            }
        })
        .catch(error => { res.status(500).json({ error }) });
};

exports.modifyBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' });
            }
            else if (req.file) {
                const bookObject = {
                    ...JSON.parse(req.body.book),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.path}`
                };

                const fileToDelete = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${fileToDelete}`, () => {
                    Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                        .catch(error => { res.status(400).json({ error }) })
                });

            } else {
                const bookObject = {
                    ...req.body
                };

                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                    .catch(error => { res.status(400).json({ error }) })

            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        });
};


exports.addRating = (req, res, next) => {
    const ratingObject = req.body;
    ratingObject.grade = ratingObject.rating;
    delete ratingObject.rating;

    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                res.status(404).json({ message: 'Livre inconnu' });
            } else {

                const userRating = book.ratings.includes(rating => rating.userId == req.body.userId);
                if (userRating) {

                    res.status(404).json({ message: 'Vous avez déja noté ce livre' });
                } else {
                    Book.updateOne({ _id: req.params.id }, { $push: { ratings: ratingObject } })
                        .then(() => {
                            Book.findOne({ _id: req.params.id })
                                .then(book => {

                                    const somme = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
                                    book.averageRating = Math.round(somme / book.ratings.length);

                                    Book.updateOne({ _id: req.params.id }, { averageRating: book.averageRating })
                                        .then(() => {
                                            Book.findOne({ _id: req.params.id })
                                                .then(book => {
                                                    res.status(200).json(book)
                                                })
                                                .catch(error => res.status(404).json({ error }));
                                        })
                                        .catch(error => res.status(401).json({ error }));
                                })
                                .catch(error => res.status(404).json({ error }));
                        })
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => { res.status(500).json({ error }) });
}

exports.getBestBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3) // Limite les résultats aux 3 premiers livres
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};


