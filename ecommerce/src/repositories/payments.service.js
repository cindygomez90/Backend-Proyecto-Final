const { configObject } = require ('../config/connectDB.js')
const Stripe = require('stripe');

class PaymentService {
    constructor() {
        this.stripe = new Stripe(configObject.stripe_secret_key)
    }

    createPaymentIntent = async (data) => {
        return await this.stripe.paymentIntents.create(data)
    }
}

module.exports = PaymentService
