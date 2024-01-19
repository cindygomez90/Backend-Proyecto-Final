//importación de módulos
const { Router } = require ("express")
const viewsRouter = Router()
const { productModel} = require ("../dao/models/products.model")
const messageModel = require ("../dao/models/messages.model")

//const products = require('../../mockDB/Products.json')

//FS - ruta para home.handlebars
/*viewsRouter.get('/home', (req, res) => {
    res.render('home', { products })
})*/

//Mongo - ruta para home.handlebars
viewsRouter.get('/home', async (req, res) => {
    try {
        const products = await productModel.find ({})
        res.render('home', { products })
    } catch (error) {
        console.error(error)
        res.render('error', { message: 'Error al obtener la lista de productos.' })
    }
})

//FS - ruta para realTimeProducts.handlebars
/*viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.log(error);
        res.render('error', { message: 'Error al intentar obtener la lista de productos.' })
    }
})

viewsRouter.post('/', async (req, res) => {
    try {
        res.render('realTimeProducts', { products })
    } catch (error) {
        console.log(error);
        res.render("Error al intentar obtener la lista de productos");
        return
    }
})*/

//Mongo - ruta para realTimeProducts.handlebars
viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productModel.find ({})
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.log(error);
        res.render('error', { message: 'Error al intentar obtener la lista de productos.' })
    }
})

viewsRouter.post('/', async (req, res) => {
    try {
        const products = await productModel.find ({})
        res.render('realTimeProducts', { products })
    } catch (error) {
        console.log(error);
        res.render ("Error al intentar obtener la lista de productos");
        return
    }
})

//ruta para chat.handlebars
viewsRouter.get('/chat', async (req, res) => {
    try {
        const messages = await messageModel.find({})   
        res.render('chat', { messages })        
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.render('error', { message: 'Error al intentar obtener los mensajes.' });
    }   
})

viewsRouter.post('/api/messages/sendMessage', async (req, res) => {
    try {
        //const { user, message } = req.body
        //const result = await messageModel.create({ user, message })
        res.redirect('/chat')
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.render('error', { message: 'Error al intentar enviar el mensaje.' });
    }
})


module.exports = viewsRouter