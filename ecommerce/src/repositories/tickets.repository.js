
class TicketRepository {
    constructor (ticketDao) {
        this.dao = ticketDao
    }

    createTicket  = async (ticketData) => await this.dao.create(ticketData)

    getTicket = async (tid) => await this.dao.getBy(tid)

}


module.exports = TicketRepository