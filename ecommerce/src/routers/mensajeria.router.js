const { Router } = require ("express")
const mensajeriaRouter = Router ()
const { sendMail } = require ('../utils/sendMail.js')
const { sendSms } = require ('../utils/sendSms.js')

//Endpoint para enviar un mail
mensajeriaRouter.get('/mail', (req, res) => {
    try {
        const { destinatario, subject, html } = req.body 
        sendMail(destinatario, subject, html)
        res.status(200).json({ message: 'Correo electrónico enviado correctamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Ocurrió un error al enviar el correo electrónico.' })
    }
})


//Endpoint para enviar un sms
mensajeriaRouter.get('/sms', (req, res) => { 
    sendSms('Cindy', 'Gómez')
    res.send('sms enviado')
})

module.exports = mensajeriaRouter