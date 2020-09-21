const User = require('../models/user');
const Blog = require('../models/blog');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
// sendgrid
const sgMail = require('@sendgrid/mail'); // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
    console.log("n server signup");
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is Taken'
            });
        }
    })
   // console.log(user);
    const { name, email, password } = req.body;
    let userName = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${userName}`;

    let newUser = new User({ name, email, password, profile, userName });
    newUser.save((err, success) => {
        console.log("in save user call");
        console.log(err);
        if (err) {
            return res.status(400).json({
                error: err
            })
        } else {
            return res.json({
                message: 'Signup sucess ! Please Signin.'
            })
        }
    });
};

exports.signin = (req, res) => {
    //check if user exist
    const { email, password } = req.body;
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email doesnot exists,Please Signup.'
            });
        }
        //authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email/Password do not match.'
            });
        }

        //generate a json web token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { expiresIn: '1d' });
        const { _id, userName, name, role } = user;
        return res.json({
            token, 
            user: { _id, userName, name, role }
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "signout successful!"
    });
};

exports.requireSignin = expressJwt({
    secret: 'DKLSJFNWEFLIUWNKW3123KLFJIOEWI'
}),

exports.authMiddlemare = (req, res, next) => {   //to make user profile available
    console.log("in auth middleware");

    console.log(req.user);

    const authUserId = req.user._id;
    User.findById({_id: authUserId}).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    })
}

exports.adminMiddlemare = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findById({_id: adminUserId}).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if(user.role !== 1){
            return res.status(400).json({
                error: 'Admin resource, Access denied'
            });
        }
        req.profile = user;
        next();
    })
}
exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString();
        if (!authorizedUser) {
            return res.status(400).json({
                error: 'You are not authorized'
            });
        }
        next();
    });
};
exports.googleLogin = (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const idToken = req.body.tokenId;
    console.log(idToken);
    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
        console.log("in token, login");
         console.log(response);
        const { email_verified, name, email, jti } = response.payload;
        if (email_verified) {
            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                    res.cookie('token', token, { expiresIn: '1d' });
                    const { _id, email, name, role, username } = user;
                    return res.json({ token, user: { _id, email, name, role, username } });
                } else {
                    let username = shortId.generate();
                    let profile = `${process.env.CLIENT_URL}/profile/${username}`;
                    let password = jti;//for more security can use jti+process.env.JWT_SECRET
                    user = new User({ name, email, profile, username, password });
                    user.save((err, data) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            });
                        }
                        const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                        res.cookie('token', token, { expiresIn: '1d' });
                        const { _id, email, name, role, username } = data;
                        return res.json({ token, user: { _id, email, name, role, username } });
                    });
                }
            });
        } else {
            return res.status(400).json({
                error: 'Google login failed. Try again.'
            });
        }
    }).catch(err => {
        console.log("catch");
        console.log(err);
    });
};
exports.forgotPassword = (req, res) => {
    const { email } = req.body;
console.log(email);
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: 'User with that email does not exist'
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

        // email
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password reset link`,
            html: `
            <p>Please use the following link to reset your password:</p>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://seoblog.com</p>
        `
        };
        // populating the db > user > resetPasswordLink
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ error: errorHandler(err) });
            } else {
                sgMail.send(emailData).then(sent => {
                    return res.json({
                        message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
                    });
                });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: 'Expired link. Try again'
                });
            }
            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(401).json({
                        error: 'Something went wrong. Try later'
                    });
                }
                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({
                        message: `Great! Now you can login with your new password`
                    });
                });
            });
        });
    }
};
