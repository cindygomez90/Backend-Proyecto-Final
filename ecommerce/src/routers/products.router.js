//importación de módulos
const { Router } = require ("express")
const { productModel } = require ("../dao/models/products.model")

const productsRouter = Router ()

//armado de CRUD para productos

//MÉTODO GET

//Mongo - Endpoint para solicitar todos los productos
productsRouter.get('/', async (req, res)=>{  
    try {
        const products = await productModel.find({}) 
        res.json({
            status: 'success',
            result: products
        })
    } catch (error) {
        console.log(error)
    }
})


//Mongo - Endpoint para solicitar un producto por id
productsRouter.get('/:pid', async (req, res)=>{  
    try {      
        const { pid } = req.params        
        const product = await productModel.findOne ({_id: pid})
        res.json({
            status: 'success',
            result: product
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el producto por ID.'
        })
    }
}) 

//MÉTODO POST

//Mongo - Endpoint para agregar un nuevo producto
productsRouter.post('/', async (request, responses)=>{                
    try {                               
        const { body } = request
        const result = await productModel.create(body)

        responses.send({
            status: 'success',
            result
        })
    } catch (error) {
        console.log(error)
    }
})


//MÉTODO PUT

//Mongo - Endpoint para actualizar campos de un producto por id
productsRouter.put('/:pid', async (req, res)=>{
    try {
    const { pid } = req.params
    const productToUpdate = req.body
    const product = await productModel.findOneAndUpdate({_id: pid}, productToUpdate, {new: true})
    
    res.status(200).send({
        status: 'success',
        message: product
    })
    } catch (error) {
        console.log(error)
    }
})

//MÉTODO DELETE

productsRouter.delete('/:pid', async (request, responses) => {
    try {
        const { pid } = request.params
        const result = await productModel.findByIdAndUpdate(pid, {status: false} )

        if (!result) {
            return responses.status(404).json({ success: false, message: 'Producto no encontrado.' })
        }
        responses.json({ success: true, message: 'Producto eliminado correctamente.' })
    } catch (error) {
        console.log(error);
        responses.status(500).json({ success: false, message: 'Error al eliminar el producto.' })
    }
})


module.exports = productsRouter

