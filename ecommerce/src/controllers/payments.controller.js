const { paymentService, productService, cartService } = require('../repositories/index.js')

class PaymentController {
    constructor() {
        this.paymentService = paymentService
        this.cartService = cartService
        this.productService = productService
    }

    createPaymentIntent = async (req, res) => {
        try {
            const cartId = req.body.cartId;
            console.log('Received cartId:', cartId)

            const cart = await this.cartService.getCart(cartId)
            if (!cart) return res.status(404).send({ status: "error", error: 'Carrito no encontrado' });

            console.log('Cart products:', cart.products)
            /*// Calcular el total
            const total = cart.products.reduce((acc, cartProduct) => {
                return acc + (cartProduct.product.price * cartProduct.quantity);
            }, 0)

            //const totalAmount = cart.products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
            console.log('Total amount:', total)
*/

        const total = await Promise.all(cart.products.map(async (cartProduct) => {
            const productDetails = await productService.getProduct(cartProduct._id);
            
            if (productDetails && productDetails.price) {
                const subtotal = productDetails.price * cartProduct.quantity;
                return subtotal;
            } else {
                return 0;
            }
        }));

        const totalPrice = total.reduce((acc, subtotal) => acc + subtotal, 0);


            const paymentIntentInfo = {
                amount: totalPrice,
                currency: 'usd',
                metadata: {
                    userId: 'Id.autogenerado-por-mongo',
                    orderDetail: JSON.stringify(cart.products.map(item => ({
                        //title: item.product.title,
                        //quantity: item.quantity,
                        //price: item.product.price
                    })), null, '\t'),
                    address: JSON.stringify({
                        street: 'Calle de prueba',
                        postalCode: '08191',
                        externalNumber: '131321321'
                    }, null, '\t')
                }
            };

            let result = await this.paymentService.createPaymentIntent(paymentIntentInfo);

            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }
}

module.exports = PaymentController;

