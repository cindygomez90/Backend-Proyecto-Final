//importación del módulo
const express = require('express')
const ProductManager = require ('./productsManager')
const app = express()
const productManager = new ProductManager (__dirname + '/../mockDB/Products.json')  

//MÉTODO GET

// Endpoint para solicitar todos los productos y soporte para recibir parámetro de límite=3
app.get('/api/products', async (req, res)=>{  
    const {limit} = req.query
    try {
        const products = await productManager.getProducts()
        const limitedProducts = limit ? products.slice(0, parseInt(limit, 3)) : products
        res.send({ products: limitedProducts })
    } catch (error) {
        res.status(500).send("Error al obtener los productos")
    }
})

// Endpoint para solicitar un producto
app.get('/api/products/:id', async (req, res)=>{        
    const { id } = req.params        
    const productsList = await productManager.getProducts()
    const product = productsList.find(prod => prod.id === Number(id)) 
    if (product) {
        res.send(product) 
    } else {
        res.status(404).send('No se encuentra el id del producto solicitado');
    }
}) 

app.listen(8080, () => {
    console.log('Haciendo desafío entregable 3')
} )