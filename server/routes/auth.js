const express = require('express');
const router = express.Router()



router.get('/register', (req, res) => {
    res.json({
        data: 'hit you register endpoint3'
    })
})


module.exports = router;