class PaymentRepository {
    constructor(paymentService) {
        this.service = paymentService;
    }

    createPaymentIntent = async (data) => await this.service.createPaymentIntent(data);
}

module.exports = PaymentRepository

