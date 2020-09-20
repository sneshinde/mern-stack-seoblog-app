const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/category');
const jwt = require('express-jwt');

//validators
const { runValidation } = require('../validators/index');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddlemare } = require('../controllers/auth');

router.post('/category', categoryCreateValidator, runValidation, requireSignin, adminMiddlemare, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, adminMiddlemare, remove);

module.exports = router;