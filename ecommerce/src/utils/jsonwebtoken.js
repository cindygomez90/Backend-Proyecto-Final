const jwt = require ('jsonwebtoken') 
const { configObject } = require ('../config/connectDB.js')


const { jwt_secret_Key } = configObject

const generateToken = user => jwt.sign(user, jwt_secret_Key, {
    expiresIn: '1d'
})


module.exports = { generateToken } 