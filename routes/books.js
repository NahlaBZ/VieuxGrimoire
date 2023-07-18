const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/Book');
const auth = require('../middleware/auth');

router.post('/', auth, booksCtrl.createBook);
router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks);

module.exports = router;