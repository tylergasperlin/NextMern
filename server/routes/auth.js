const express = require('express');
const router = express.Router()

// validator import
const {userRegisterValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index')

// import from controllers
const {register, registerActivate } = require('../controllers/auth')

//This will run validators first and if no errors we will run register
router.post('/register', userRegisterValidator, runValidation, register)
router.post('/register/activate', registerActivate)

module.exports = router;