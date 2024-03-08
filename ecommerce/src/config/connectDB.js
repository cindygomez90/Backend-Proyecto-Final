const dotenv = require ('dotenv')
const { program } = require('../utils/commander')
const MongoSingleton = require("../utils/mongoSingleton")

const { mode } = program.opts() 


console.log('Modo:', mode)
console.log('Ruta del archivo .env:', mode === 'development' ? './.env.development' : './.env.production')

dotenv.config({ 
    path: mode === 'development' ? './.env.development' : './.env.production'   
})


const configObject = {        
    port: process.env.PORT || 8080, 
    jwt_secret_Key: process.env.JWT_SECRET_KEY,
    mongo_url: process.env.MONGO_URL,
    persistence: process.env.PERSISTENCE,
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL 
}

console.log ('Configuración de la base de datos:', configObject)


const connectBD = async () => {  
    try {
        await MongoSingleton.getInstance(configObject.mongo_url) 
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error)
    }
}

module.exports = { connectBD, configObject }