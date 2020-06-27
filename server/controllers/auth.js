const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { registerEmailParams, forgotPasswordEmailParams } = require('../helpers/email');
const shortId = require('shortId');
const expressJwt = require('express-jwt');

AWS.config.update({
    accessKeyId: process.env.AWS_SECRET_ACCESSS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
    region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
    console.log([process.env.EMAIL_TO]);
    const { name, email, password } = req.body;
    // check if user exists in our db

    User.findOne({ email }).exec((err, user) => {
        if (err) {
            console.log(`Email taken: ${err}`);
            return res.status(400).json({
                error: 'This email is already in use.',
            });
        }
        // generate token with user name and password
        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '10m',
        });

        const params = registerEmailParams(email, token);

        const sendEmailOnRegister = ses.sendEmail(params).promise();

        sendEmailOnRegister
            .then((data) => {
                console.log('Email submitted to SES', data);
                res.json({
                    message: `Email has been sent to ${email}. Follow the instructions to complete your registration.`,
                });
            })
            .catch((error) => {
                console.log('ses email on register', error);
                res.json({
                    message: `We could not verify your email. Please try again.`,
                });
            });
    });
};

exports.registerActivate = (req, res) => {
    const { token } = req.body;
    // console.log(token)
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                error: 'Expired link. Try again.',
            });
        }

        const { name, email, password } = jwt.decode(token);

        const username = shortId.generate();

        User.findOne({ email }).exec((err, user) => {
            if (user) {
                return res.status(401).json({
                    error: 'The email is entered is already taken.',
                });
            }

            // Register new user
            const newUser = new User({ username, name, email, password });
            newUser.save((err, result) => {
                if (err)
                    ({
                        error: 'Error saving user to database. Try again later.',
                    });

                return res.json({
                    message: 'Registration success. Please login',
                });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).exec((err, user) => {
        // handle find user
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please register',
            });
        }

        //athenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match',
            });
        }

        //generate token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role },
        });
    });
};

exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET });

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findOne({ _id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found',
            });
        }
        req.profile = user;
        next();
    });
};

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findOne({ _id: adminUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found',
            });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'This is an Admin resource. Access denied',
            });
        }

        req.profile = user;
        next();
    });
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    //check if user exists with that email
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist',
            });
        }

        // generate token and email to user
        const token = jwt.sign({ name: user.name }, process.env.JWT_RESET_PASSWORD, {
            expiresIn: '10m',
        });

        // send email
        const params = forgotPasswordEmailParams(email, token);

        // populate the db > user  > resetpasswordlink
        return user.updateOne({ resetPassword: token }, (err, success) => {
            if (err) {
                return res.status(400).json({
                    error: 'Password reset failed. Try again later.',
                });
            }

            const sendEmail = ses.sendEmail(params).promise();
            sendEmail
                .then((data) => {
                    console.log('ses reset pw success', data);
                    return res.json({
                        message: `Email has been sent to ${email}. Click on the link to reset your password`
                    })
                })
                .catch((error) => {
                    console.log('ses reset pw failed', error);
                    return res.json({
                        message: `We could not verify your email. Try again later`
                    })
                });
        });
    });
};

exports.resetPassword = (req, res) => {
    //
};
