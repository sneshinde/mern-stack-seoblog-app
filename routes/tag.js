const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/tag');
const jwt = require('express-jwt');

//validators
const { runValidation } = require('../validators/index');
const { tagCreateValidator } = require('../validators/tag');
const { requireSignin, adminMiddlemare } = require('../controllers/auth');

router.post('/tag', tagCreateValidator, runValidation, requireSignin, adminMiddlemare, create);
router.get('/tags', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', requireSignin, adminMiddlemare, remove);

module.exports = router;