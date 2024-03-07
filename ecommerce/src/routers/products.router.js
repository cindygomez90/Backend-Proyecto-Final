//importación de módulos
const { Router } = require ("express")
const ProductController = require ('../controllers/products.controller.js')

const productsRouter = Router ()
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct} = new ProductController ()


//Endpoint para solicitar todos los productos
productsRouter.get('/', getProducts)

//Endpoint para solicitar un producto por id
productsRouter.get('/:pid', getProduct) 

//Endpoint para agregar un nuevo producto
productsRouter.post('/', createProduct)

//Endpoint para actualizar campos de un producto por id
productsRouter.put('/:pid', updateProduct)

//Endpoint para eliminar un producto por id

productsRouter.delete('/:pid', deleteProduct)


module.exports = productsRouter

