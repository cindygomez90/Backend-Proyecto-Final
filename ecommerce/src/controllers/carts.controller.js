//const CartsManagerMongo = require ('../daos/Mongo/cartsDaoMongo.js')
//const ProductManagerMongo = require ('../daos/Mongo/productsDaoMongo.js')
const { cartService, productService } = require ('../repositories/index.js')


class CartController {

    constructor () {
        this.cartService = cartService
        this.productService = productService
    }

    createCart = async (req, res)=> {
        try {
            const result = await this.cartService.createCart ()
    
            res.status(200).json ({
                status: "succes",
                payload: result
            })
        } catch (error) {
            console.error('Error al crear el carrito:', error)
            res.status(500).json ("Error al crear el carrito")
            }
        }

    getCart = async (req, res) => {
        try {
            const {cid} = req.params
            const cart = await this.cartService.getCart (cid) 
            res.send ({
                status: "succes", 
                payload: cart
            })
        } catch (error) {
            console.log (error)
            }
    }

    addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params        
            const cart = await this.cartService.getCart(cid)
    
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el carrito indicado',
                })
            }
    
            const product = await this.productService.getProduct (pid)
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el producto indicado',
                });
            }
            cart.products.push({
                product: product._id,
                quantity: 1,            
            })
            await cart.save()
    
            res.json({
                status: 'success',
                payload: cart,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: 'error',
                message: 'Error al agregar el producto al carrito',
            })
        }
    }


    updateCart = async (req, res) => {
        try {
            const { cid } = req.params
            const newProducts = req.body
            const cart = await this.cartService.updateCart(cid, newProducts)
    
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el carrito indicado',
                })
            }
            
            //cart.products = newProducts
            //await cart.save()
    
            res.json({
                status: 'success',
                payload: cart,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'error',
                message: 'Error al actualizar el carrito',
            })
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
    
            const cart = await this.cartService.updateProductQuantity(cid, pid, quantity)
    
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el carrito o el producto indicado',
                })
            }
    
            /*const product = cart.products.find((p) => p.product.equals(pid))
    
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el producto indicado en el carrito',
                });
            }
    
            product.quantity = quantity
            await cart.save()*/
    
            res.json({
                status: 'success',
                payload: cart,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'error',
                message: 'Error al actualizar la cantidad del producto',
            })
        }
    }

    deleteProductFromCart = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const cart = await this.cartService.deleteProductFromCart(cid, pid)
    
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el carrito o producto indicado',
                })
            }
    
            /*const productIndex = cart.products.findIndex(
                (product) => product.product.equals(pid)
            )
    
            if (productIndex === -1) {
                console.log('Productos en el carrito:', cart.products)
    
                return res.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el producto indicado en el carrito',
                })
            }
            
            cart.products.splice(productIndex, 1)
    
            await cart.save()*/
    
            res.json({
                status: 'success',
                payload: cart,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: 'error',
                message: 'Error al eliminar el producto del carrito',
            })
        }
    }

    deleteAllProductsFromCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await this.cartService.deleteAllProductsFromCart(cid)
    
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el carrito indicado',
                });
            }
    
            /*cart.products = []
            await cart.save()*/
    
            res.json({
                status: 'success',
                message: 'Se eliminaron todos los productos del carrito',
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'error',
                message: 'Error al eliminar todos los productos del carrito',
            })
        }
    }
}


module.exports = CartController