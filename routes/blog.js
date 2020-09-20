const express = require('express');
const router = express.Router();
const { create, list, listAllBlogsCategoriesTags, read, remove, update, photo, listRelated, listSearch, listByUser } = require('../controllers/blog');
const { requireSignin, adminMiddlemare, authMiddlemare, canUpdateDeleteBlog } = require('../controllers/auth');

router.post('/blog', requireSignin, adminMiddlemare, create);
router.get('/blogs', list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', read);
router.delete('/blog/:slug', requireSignin, adminMiddlemare, remove);
router.put('/blog/:slug', requireSignin, adminMiddlemare, update);
router.get('/blog/photo/:slug', photo);
router.post('/blogs/related', listRelated);
router.get('/blogs/search', listSearch);

// auth user blog crud
router.post('/user/blog', requireSignin, authMiddlemare, create);
router.get('/:userName/blogs', listByUser);
router.delete('/user/blog/:slug', requireSignin, authMiddlemare, canUpdateDeleteBlog, remove);
router.put('/user/blog/:slug', requireSignin, authMiddlemare, canUpdateDeleteBlog, update);

module.exports = router;