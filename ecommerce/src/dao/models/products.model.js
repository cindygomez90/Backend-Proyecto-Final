const mongoose = require('mongoose')

const productsCollection = 'products'


const productsSchema = new mongoose.Schema({   
    title: String,
    description: String,
    price: Number,
    thumbail: String,
    code: String,
    stock: Number
}) 

const productModel = mongoose.model(productsCollection, productsSchema) 

module.exports = { productModel }

