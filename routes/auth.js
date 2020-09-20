//import express from 'express';
//import { time } from '../controllers/blog';
const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin, googleLogin, forgotPassword, resetPassword } = require('../controllers/auth');
const jwt = require('express-jwt');

//validators
const { runValidation } = require('../validators/index');
const { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup); //if validations are passed then only the signup controller is called
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);

router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

// google login
router.post('/google-login', googleLogin);
// router.get('/secret', requireSignin, (req, res)=>{
//     res.json({
//         message: req.user
//     });
// });

module.exports = router;