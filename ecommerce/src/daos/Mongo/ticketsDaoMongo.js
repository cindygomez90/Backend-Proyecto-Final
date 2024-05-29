const { ticketModel } = require('../Mongo/models/tickets.model.js')
const { productModel } = require ('../Mongo/models/products.model.js')

class TicketDaoMongo {

    async create (ticketData) {        
        const ticket = await ticketModel.create(ticketData)
        return ticket
    }

    async getBy(tid) { 
        return await ticketModel.findOne ({_id: tid}).populate('purchasedProducts','title price')
    }

}

module.exports = TicketDaoMongo