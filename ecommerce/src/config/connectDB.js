    const dotenv = require ('dotenv')
    const { program } = require('../utils/commander')
    const MongoSingleton = require("../utils/mongoSingleton")
    //const path = require ('path')
    const { mode } = program.opts() 

    console.log('Modo:', mode)
    console.log('Ruta del archivo .env:', mode === 'development' ? './.env.development' : './.env.production')


    dotenv.config({ 
        path: mode === 'development' ? './.env.development' : './.env.production'   
    })

    /*dotenv.config({
        path: mode === 'development' ? path.join(__dirname, './.env.development') : path.join(__dirname, './.env.production')
    })*/

    const configObject = {        
        port: process.env.PORT || 8080, 
        jwt_secret_Key: process.env.JWT_SECRET_KEY,
        mongo_url: process.env.MONGO_URL,
        persistence: process.env.PERSISTENCE
        
    }

    console.log ('Configuración de la base de datos:', configObject)


    const connectBD = async () => {  
        try {
            await MongoSingleton.getInstance(configObject.mongo_url) 
            console.log('Base de datos conectada')        
        } catch (error) {
            console.error('Error de conexión a la base de datos:', error)
        }
    }

    module.exports = { connectBD, configObject }