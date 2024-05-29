//importación de módulos
const {Router} = require('express')
const router = Router()
const PaymentController = require ('../controllers/payments.controller')

const paymentsRouter = Router ()
const { createPaymentIntent } = new PaymentController ()

//Endpoint para 
paymentsRouter.post('/payment-intents', createPaymentIntent)


module.exports = paymentsRouter