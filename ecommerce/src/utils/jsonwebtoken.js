const jwt = require ('jsonwebtoken') 

const PRIVATE_KEY = 'cl@v3s3cR3t@Token'


const generateToken = user => jwt.sign(user, PRIVATE_KEY, {
    expiresIn: '1d'
})


module.exports = { PRIVATE_KEY, generateToken } 