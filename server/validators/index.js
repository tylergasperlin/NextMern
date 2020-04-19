const {validationResult} = require('express-validator')

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    //execute callback function
    // this is how you handle errors in node 
    // application will continue if an error occurs it will not crash
    next();
}