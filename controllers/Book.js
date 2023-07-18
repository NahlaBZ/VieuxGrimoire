const Book = require('../models/Book');

exports.createBook = (req, res, next) => {

    const objectBook = JSON.parse(req.body.book);

    delete objectBook._id;

    delete objectBook._userId;

    const book = new Book({
        ...objectBook,
        userId: req.auth.userId,

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.path}`
    });

    book.save()
        .then(() => { res.status(201).json({ message: 'Livre enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};
