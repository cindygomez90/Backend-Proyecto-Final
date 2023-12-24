//importación del módulo
const express = require('express')
const getProducts = require ('../productsManager')
const app = express()

//MÉTODO GET

// Endpoint para solicitar todos los productos y soporte para recibir parámetro de límite=3
app.get('/api/products', (req, res)=>{  
    //const products = productManager.getProducts ()
    const products = getProducts ()
    const limit = req.query.limit
    const limitedProducts = limit?products.slice(0, parseInt(limit, 3)):products

    res.send({ products: limitedProducts })
})

// Endpoint para solicitar un producto
app.get('/api/products/:id', (req, res)=>{        
    const { id } = req.params        
    const productsList = getProducts ()
    const product = productsList.find(prod => prod.id === Number(id)) 
    if (product) {
        res.send(product) 
    } else {
        res.status(404).send('Producto no encontrado');
    }
}) 


app.listen(8080, ()=>{
    console.log('Haciendo desafío entregable 3')
} )