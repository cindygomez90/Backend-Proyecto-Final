//importación del módulo
const express = require ("express")
const productsRouter = require ("./routers/products.router")
const cartsRouter = require ("./routers/carts.router.js")
const app = express()
const PORT = 8080


app.use(express.json())   
app.use(express.urlencoded({ extended: true }))

//Llamado a los archivos routers
app.use ('/api/products', productsRouter)
app.use ('/api/carts', cartsRouter)

app.listen(PORT, () => {
    console.log('Haciendo Primera Entrega de Proyecto Final')
} )


