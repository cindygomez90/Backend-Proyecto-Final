//importación de módulos
const { Router } = require ("express")
const CartsManager = require ('../../src/managers/cartsManager.js')
const cartsService = new CartsManager

const cartsRouter = Router ()
const carts = []


//MÉTODO GET

// Endpoint para solicitar un carrito por id
cartsRouter.get ('/:cid', async (req, res) => {
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
})

//MÉTODO POST

// Endpoint para crear un carrito
cartsRouter.post ('/', async (req, res)=> {
    try {
        const result = await cartsService.createCart ()
        res.send ({
            status: "succes",
            payload: result
        })
    } catch (error) {
        res.status (500).send ("Error de server")
        }
    })

// Endpoint para agregar producto a un carrito
cartsRouter.post ('/:cid/products/:pid', async (req, res)=> {       
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
    })


module.exports = cartsRouter