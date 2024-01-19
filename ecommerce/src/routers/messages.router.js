const { Router } = require ("express")
const messageModel = require ("../dao/models/messages.model")
const messagesRouter = Router ()


const bodyParser = require('body-parser')
messagesRouter.use(bodyParser.urlencoded({ extended: true }))

//MÉTODO GET
//Mongo - Endpoint para obtener todos los mensajes
messagesRouter.get('/', async (request, responses)=>{
    try {
        const messages = await messageModel.find({})    
        responses.json({
            status: 'success',
            result: messages
        })
    } catch (error) {
        console.log(error)
        responses.status(500).json({
            status: 'error',
            message: 'Error al obtener los mensajes.'
        })
    }
})


//MÉTODO POST
//Mongo - Endpoint para enviar un nuevo mensaje
messagesRouter.post('/', async (req, res) => {
    try {
        const { user, message } = req.body
        const result = await messageModel.create({ user, message })
        
        res.json({
            status: 'success',
            result         
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Error al intentar guardar el mensaje.'
        })
    }
})



module.exports = messagesRouter