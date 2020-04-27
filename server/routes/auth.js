const express = require('express');
const router = express.Router()

// validator import
const {userRegisterValidator, userLoginValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index')

// import from controllers
const {register, registerActivate, login } = require('../controllers/auth')

//This will run validators first and if no errors we will run register
router.post('/register', userRegisterValidator, runValidation, register)
router.post('/register/activate', registerActivate)
router.post('/login', userLoginValidator, runValidation, login)

module.exports = router;