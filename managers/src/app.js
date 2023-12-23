//importación del módulo
const express = require('express')
const ProductManager = require ('../productsManager')
const productManager = new ProductManager
const app = express()

//MÉTODO GET
// Endpoint para solicitar todos los productos y soporte para recibir parámetro de límite=3
app.get('/products', (req, res)=>{  
    const products = productManager.getProducts ()
    const limit = req.query.limit;
    const limitedProducts = limit?products.slice(0, parseInt(limit, 3)):products

    res.send({ products: limitedProducts })
})


// Endpoint para solicitar un producto
app.get('/api/products/:id', (req, res)=>{        
    const { id } = req.params        
    const products = productManager.getProducts ()      
    const product = products.find(prod => prod.id === Number(id)) 
    // console.log(req.params)
    res.send(product)                          
}) 


app.listen(8080, ()=>{
    console.log('Haciendo desafío entregable 3')
} )