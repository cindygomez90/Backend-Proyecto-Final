const mongoose = require('mongoose')

const cartsCollection = 'carts'


const cartsSchema = new mongoose.Schema({   
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products' 
            },
            quantity: Number
        }
    ] 
}) 

const cartModel = mongoose.model(cartsCollection, cartsSchema) 

module.exports = { cartModel }