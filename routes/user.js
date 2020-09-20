const express = require('express');
const router = express.Router();
const { requireSignin, authMiddlemare } = require('../controllers/auth');
const { read, publicProfile, update, photo } = require('../controllers/user');

router.get('/user/profile', requireSignin, authMiddlemare, read);
router.get('/user/:userName', publicProfile);
router.put('/user/update', requireSignin, authMiddlemare, update);
router.get('/user/photo/:userName', photo);

module.exports = router;