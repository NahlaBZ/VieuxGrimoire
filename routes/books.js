const express = require('express');
const router = express.Router();
const Ctrlbooks = require('../controllers/Book');
const auth = require('../middleware/auth');

router.post('/', auth, Ctrlbooks.createBook);
router.post('/:id/rating');
router.put('/:id');
router.delete('/:id');
router.get('/bestrating');
router.get('/:id');
router.get('/');

module.exports = router;