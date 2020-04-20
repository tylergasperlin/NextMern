const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_SECRET_ACCESSS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
    region: process.env.AWS_REGION,

})

const ses = new AWS.SES({ apiVersion: '2010-12-01' })

exports.register =  (req, res) => {
    console.log( [process.env.EMAIL_TO])
    const {name, email, password} = req.body
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            Body: {
                Html:{
                    Charset: 'UTF-8',
                    Data: `<html><body><h1 style="color:green">${name}!</h1></body></html>`
                }
            }, 
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete your registration'
            }
        }
    }

    const sendEmailOnRegister = ses.sendEmail(params).promise()

    sendEmailOnRegister
        .then(data => {
            console.log('Email submitted to SES', data)
            res.send('Email sent')
        })
        .catch(error => {
            console.log('ses email on register', error);
            res.send('Email failed')
        })

}

