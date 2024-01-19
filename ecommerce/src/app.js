//importación de módulos
const express = require ("express")
const handlebars  = require('express-handlebars')
const { Server }  = require('socket.io') 
const ProductManager = require("./dao/fileSystem/productsManagerFS.js")
const productManager = new ProductManager()
const router = require ("./routers/index.js")
const messageModel = require ("./dao/models/messages.model.js")

const connectBD = require ("./config/connectDB.js")

const app = express()
const PORT = 8080 || process.env.PORT
connectBD ()

//configuración de handlebars
app.engine("handlebars", handlebars.engine(
    ({runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true}
        })))
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")  

//para servir los archivos estáticos
app.use(express.static(__dirname + '/public'))

app.use(express.json())   
app.use(express.urlencoded({ extended: true }))

//llamado al archivo router
app.use (router)

//configuración socket del lado del server
const httpServer = app.listen(PORT, () => {
    console.log('Haciendo Práctica de Integración del Proyecto Final')
} )

const io = new Server (httpServer)

let messages = []

io.on('connection', async (socket) => {
    console.log('cliente conectado')
    
    socket.on("addProduct", async (data) => {
        const newProduct = {
            title: data.title,
            description: data.description,
            price: data.price,
            thumbail: data.thumbail,
            code: data.code,
            stock: data.stock,            
        }
        await productManager.addProduct(newProduct)
        
        const updatedProducts = await productManager.getProducts()
        io.emit("updateProducts", updatedProducts)
            });
    
    socket.on("deleteProduct", async (data) => {
        const pid = data.pid;
        await productManager.deleteProduct(parseInt(pid))
        const updatedProducts = await productManager.getProducts()
        io.emit("updateProducts", updatedProducts)
        })

    socket.on('message', async (data) => {
        try {
            const newMessage = {
                user: data.user,
                message: data.message
            }
    
            await messageModel.create(newMessage)    
    
            io.emit('chat', [newMessage])
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    })
})


