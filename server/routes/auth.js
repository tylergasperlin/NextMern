const express = require('express');
const router = express.Router()

// validator import
const {userRegisterValidator, userLoginValidator, forgotPasswordValidator, resetPasswordValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index')

// import from controllers
const {register, registerActivate, login, requireSignin, forgotPassword, resetPassword } = require('../controllers/auth')

//This will run validators first and if no errors we will run register
router.post('/register', userRegisterValidator, runValidation, register)
router.post('/register/activate', registerActivate)
router.post('/login', userLoginValidator, runValidation, login)
router.get('/secret', requireSignin, (req, res) => {
    res.json({
        data: 'This is secret page for logged in users only'
    })
}) 
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword )
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword )

module.exports = router; 