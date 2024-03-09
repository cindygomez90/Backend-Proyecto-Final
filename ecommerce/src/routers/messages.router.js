const { Router } = require ("express")
const MessageDaoMongo = require ('../daos/Mongo/messagesDaoMongo.js')
const messageService = new MessageDaoMongo ()
const messagesRouter = Router ()


const bodyParser = require('body-parser')
messagesRouter.use(bodyParser.urlencoded({ extended: true }))


//Endpoint para obtener todos los mensajes
messagesRouter.get('/', async (request, responses)=>{
    try {
        const messages = await messageService.getMessages()    
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



//Endpoint para enviar un nuevo mensaje
messagesRouter.post('/', async (req, res) => {
    try {
        const { user, message } = req.body
        const result = await messageService.saveMessage (user, message)
        
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