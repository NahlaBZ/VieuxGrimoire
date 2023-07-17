const express = require('express');
const router = express.Router();


router.post('/');
router.post('/:id/rating');
router.put('/:id');
router.delete('/:id');
router.get('/bestrating');
router.get('/:id');
router.get('/');

module.exports = router;