//importación de módulos
const { Router } = require ("express")
//const path = require("node:path")
//const CartsManager = require("../dao/fileSystem/cartsManagerFS")
//const cartsService = new CartsManager (path.join(__dirname, "../../mockDB/Carts.json"))
const { cartModel } = require ("../dao/models/carts.model")
const { productModel } = require ("../dao/models/products.model")

const cartsRouter = Router ()
//const carts = []


//MÉTODO GET

//FS - Endpoint para solicitar un carrito por id
/*cartsRouter.get ('/:cid', async (req, res) => {
    try {
        const {cid} = req.params
        const cart = await cartsService.getCartById (parseInt(cid)) 
        res.send ({
            status: "succes", 
            payload: cart
        })
    } catch (error) {
        console.log (error)
        }
})*/

//Mongo - Endpoint para solicitar un carrito por id
cartsRouter.get ('/:cid', async (req, res) => {
    try {
        const {cid} = req.params
        const cart = await cartModel.findOne ({_id: cid}) 
        res.send ({
            status: "succes", 
            payload: cart
        })
    } catch (error) {
        console.log (error)
        }
})


//MÉTODO POST

//FS - Endpoint para crear un carrito
/*cartsRouter.post ('/', async (req, res)=> {
    try {
        const result = await cartsService.createCart ()
        res.send ({
            status: "succes",
            payload: result
        })
    } catch (error) {
        res.status (500).send ("Error de server")
        }
    })*/

//Mongo - Endpoint para crear un carrito
cartsRouter.post ('/', async (req, res)=> {
    try {
        const result = await cartModel.create({ products:[] })

        res.status(200).send ({
            status: "succes",
            payload: result
        })
    } catch (error) {
        console.error('Error al crear el carrito:', error)
        res.status (500).send ("Error al crear el carrito")
        }
    })

//FS - Endpoint para agregar producto a un carrito
/*cartsRouter.post ('/:cid/products/:pid', async (req, res)=> {       
    try {
        const {cid, pid} = req.params
        const result = await cartsService.addProductToCart (Number(cid), Number(pid))
            res.send ({
                status: "succes",
                payload:  result
            })
    } catch (error) {
        console.log (error)
        }       
    })*/

//Mongo - Endpoint para agregar producto a un carrito
cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params        
        const cart = await cartModel.findOne ({_id: cid})

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el carrito indicado',
            })
        }

        const product = await productModel.findOne({_id: pid})
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
})


module.exports = cartsRouter