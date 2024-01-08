//importación de módulos
const { Router } = require ("express")
const path = require ("node:path")
const ProductManager = require("../managers/productsManager.js")
const productManager = new ProductManager(path.join(__dirname, "../../mockDB/Products.json"))

const productsRouter = Router ()

//MÉTODO GET

//Endpoint para solicitar todos los productos y soporte para recibir parámetro de límite
productsRouter.get('/', async (req, res)=>{  
    const {limit} = req.query
    try {
        const products = await productManager.getProducts()
        const limitedProducts = limit ? products.slice(0, parseInt(limit, 10)) : products
        res.send({ products: limitedProducts })
    } catch (error) {
        res.status(500).send("Error al obtener los productos")
    }
})


//Endpoint para solicitar un producto por id
productsRouter.get('/:pid', async (req, res)=>{        
    const { pid } = req.params        
    const productsList = await productManager.getProducts()
    const product = productsList.find(prod => prod.pid === Number(pid)) 
    if (product) {
        res.send(product) 
    } else {
        res.status(404).send('No se encuentra el id del producto solicitado')
    }
}) 

//MÉTODO POST

//Endpoint para agregar un nuevo producto
productsRouter.post ('/', async (req, res)=> {
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
})

//MÉTODO PUT

//Endpoint para actualizar campos de un producto por id
productsRouter.put('/:pid', async (req, res) => {
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
})


//MÉTODO DELETE

//Endpoint para eliminar un producto po id
productsRouter.delete('/:pid', async (req, res)=>{    
    const {pid} = req.params         
    const productsList = await productManager.getProducts()
    const productsListAct = productsList.filter(prod => prod.pid !== parseInt(pid))    
    res.send(productsListAct)     
}) 


module.exports = productsRouter