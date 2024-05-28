const { ticketService } = require ('../repositories/index.js')


class TicketController {

    constructor () {
        this.ticketService = ticketService
    }

    createTicket = async (req, res)=> {
        try {
            console.log("Creando ticket...")
            const result = await this.ticketService.createTicket()
            console.log("Ticket creado exitosamente:", result)

            res.status(200).json ({
                status: "succes",
                payload: result
            })
        } catch (error) {         
            console.error('Error al crear el ticket:', error)   
            res.status(500).json ('Error al crear el ticket:', error)
            }
        }
    
    getTicket = async (req, res)=> {
        const { tid } = req.params
        const ticket = await this.ticketService.getTicket (tid)
                res.json({
                    status: 'success',
                    result: ticket
                })
        }
}


module.exports = TicketController