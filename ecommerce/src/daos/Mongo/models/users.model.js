const mongoose = require ('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const usersCollection = 'users'

const usersSchema = new mongoose.Schema ({
    first_name: {
        type: String,
        index: true      
    },
    last_name: String,
    email: {
        type: String,
        required: false, //se coloca "false" para que funcione la estrategia de github
        unique: true
    },
    age: Number,
    password: {
        type: String,
        required: false //se coloca "false" para que funcione la estrategia de github
    },
    isActive: {
        type: Boolean,
        default: true
    },
    cartID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum :['USER', 'USER_PREMIUM', 'ADMIN'],
        default: 'USER'
    },
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    profiles: [
        {
            name: String,
            reference: String
        }
    ],
    products: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: {
        type: Date,
        default: Date.now
    }
})

usersSchema.plugin(mongoosePaginate)
const userModel = mongoose.model(usersCollection, usersSchema) 

module.exports = { userModel }