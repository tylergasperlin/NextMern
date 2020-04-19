const express = require('express');
const router = express.Router()

// validator import
const {userRegisterValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index')

// import from controllers
const {register } = require('../controllers/auth')

//This will run validators first and if no errors we will run register
router.post('/register', userRegisterValidator, runValidation, register)

module.exports = router;