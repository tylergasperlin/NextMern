const express = require('express')

const app = express();

app.get('/api/register', (req, res) => {
    res.json({
        data: 'hit you register endpoint2'
    })
})

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`API is running on port ${port}`));



