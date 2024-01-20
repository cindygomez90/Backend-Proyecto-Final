//importación de módulos
const { Router } = require ("express")
//const path = require ("node:path")
//const ProductManager = require("../dao/fileSystem/productsManagerFS")
//const productManager = new ProductManager(path.join(__dirname, "../../mockDB/Products.json"))
const { productModel } = require ("../dao/models/products.model")

const productsRouter = Router ()

//armado de CRUD para productos

//MÉTODO GET

//FS - Endpoint para solicitar todos los productos y soporte para recibir parámetro de límite
/*productsRouter.get('/', async (req, res)=>{  
    const {limit} = req.query
    try {
        const products = await productManager.getProducts()
        const limitedProducts = limit ? products.slice(0, parseInt(limit, 10)) : products
        res.send({ products: limitedProducts })
    } catch (error) {
        res.status(500).send("Error al obtener los productos")
    }
})*/

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

//FS - Endpoint para solicitar un producto por id
/*productsRouter.get('/:pid', async (req, res)=>{        
    const { pid } = req.params        
    const productsList = await productManager.getProducts()
    const product = productsList.find(prod => prod.pid === Number(pid)) 
    if (product) {
        res.send(product) 
    } else {
        res.status(404).send('No se encuentra el id del producto solicitado')
    }
}) */

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

//FS - Endpoint para agregar un nuevo producto
/*productsRouter.post ('/', async (req, res)=> {
    const product = req.body

    if (product.title) {
        if (product.id) {
            res.status (400).send ({
                status: "ERROR",
                message: "El id del producto debe ser generado de modo automático"
            })
        }
        if (!product.description ||
            !product.code || 
            !product.price || 
            !product.stock || 
            !product.category) 
            res.status (400).send ({
                status: "ERROR",
                message: "Falta algún campo del producto"
            })  

        const productsList = await productManager.getProducts()
        const newProductCode = productsList.find(prod => prod.code === product.code)

        if (newProductCode)
            res.status (400).send ({
                status: "ERROR",
                message: "El código del producto que intenta agregar ya existe"
            })

    productsList.push (product)
    product.status = true
    product.id = productsList.length
    
    res.status (200).send ({
        status: "succes",
        message: "El producto ha sido agregado",
        productsList
    })
    }
})*/

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

//FS - Endpoint para actualizar campos de un producto por id
/*productsRouter.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const { price, stock } = req.body
    const productsList = await productManager.getProducts()
    const productModif = productsList.find(prod => prod.pid === parseInt(pid))

    if (!productModif) {
        return res.status(404).send({
            status: 'error',
            message: 'Producto no encontrado'
        })
    }

    productModif.price = price
    productModif.stock = stock

    console.log(productsList)

    res.status(200).send({
        status: 'success',
        message: 'Producto actualizado'
    })
})*/

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

//FS - Endpoint para eliminar un producto po id
/*productsRouter.delete('/:pid', async (req, res)=>{    
    const {pid} = req.params         
    const productsList = await productManager.getProducts()
    const productsListAct = productsList.filter(prod => prod.pid !== parseInt(pid))    
    res.send(productsListAct)     
}) */

//Mongo - Endpoint para eliminar un producto po id
/*productsRouter.delete('/:pid', async (request, responses)=>{
    try {
        const {pid} = request.params
        const result = await productModel.findByIdAndDelete({_id:pid})  
        responses.send(result)
    } catch (error) {
        console.log(error)
    }
})*/
productsRouter.delete('/:pid', async (request, responses) => {
    try {
        const { pid } = request.params;
        const result = await productModel.findByIdAndDelete(pid);

        if (!result) {
            return responses.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }

        responses.json({ success: true, message: 'Producto eliminado correctamente.' });
    } catch (error) {
        console.log(error);
        responses.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
    }
})


module.exports = productsRouter

