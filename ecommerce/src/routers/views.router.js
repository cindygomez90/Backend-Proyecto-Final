//importación de módulos
const { Router } = require ("express")
const viewsRouter = Router()
const CartsDaoMongo = require ('../daos/Mongo/cartsDaoMongo.js')
const cartService = new CartsDaoMongo ()
const ProductDaoMongo = require ('../daos/Mongo/productsDaoMongo.js')
const productService = new ProductDaoMongo ()
const MessageDaoMongo = require ('../daos/Mongo/messagesDaoMongo.js')
const messageService = new MessageDaoMongo ()
const TicketDaoMongo = require ('../daos/Mongo/ticketsDaoMongo.js')
const ticketService = new TicketDaoMongo ()
const UserDaoMongo = require ('../daos/Mongo/usersDaoMongo.js')
const userService = new UserDaoMongo()
const { productModel} = require ('../daos/Mongo/models/products.model.js')
const { cartModel} = require ('../daos/Mongo/models/carts.model.js')
const { authorization } = require ('../middleware/authentication.js') 
const { passportCall } = require ('../middleware/pasportCall.js') 

//vista para home
viewsRouter.get('/home', async (req, res) => {
    try {
        const products = await productService.get()
        res.render('home', { products })
    } catch (error) {
        console.error(error)
        res.render('error', { message: 'Error al obtener la lista de productos.' })
    }
})


//vista para realTimeProducts
viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productService.get()
        res.render('realTimeProducts', { products })
        
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Error al intentar obtener la lista de productos.' })
    }
})

viewsRouter.post('/', async (req, res) => {
    try {
        const products = await productService.get()
        res.render('realTimeProducts', { products })
    } catch (error) {
        console.log(error);
        res.render ("Error al intentar obtener la lista de productos");
        return
    }
})

//vista para chat
viewsRouter.get('/chat', async (req, res) => {
    try {
        const messages = await messageService.getMessages()   
        res.render('chat', { messages })        
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.render('error', { message: 'Error al intentar obtener los mensajes.' });
    }   
})

viewsRouter.post('/api/messages/sendMessage', async (req, res) => {
    try {
        res.redirect('/chat')
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.render('error', { message: 'Error al intentar enviar el mensaje.' });
    }
})

//vista para products
viewsRouter.get('/products', async (req, res) => {    
    const {limit = 10, pageQuery = 1, category, order, status} = req.query   
    
    const filter = {}
        if (category) {
            filter.category = category;
        }
    
        if (status !== undefined) {
            filter.status = status === 'true' ? true : status === 'false' ? false : undefined
        }

    const sortOptions = {}
    if (order === 'asc') {
        sortOptions.price = 1
    } else {
        sortOptions.price = -1
    }

    const {     
    docs,
    hasPrevPage, 
    hasNextPage,
    prevPage, 
    nextPage,
    page,
    totalPages
    } = await productModel.paginate(filter, {limit, page: pageQuery, sort: sortOptions, lean: true})

    res.render('products', {
        products: docs,
        totalPages: totalPages,
        hasPrevPage, 
        hasNextPage,
        prevPage, 
        nextPage,
        page
    })
})

//vista para detailsproducts
viewsRouter.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productService.getBy(pid);
        res.render('detailsproducts', { product });
    } catch (error) {
        console.error('Error al obtener el detalle del producto:', error);
        res.render('error', { message: 'Error al obtener el detalle del producto.' });
    }
})

//vista para detailscart
viewsRouter.get('/carts/:cid/detailscart', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findOne({_id: cid}).populate('products.product')
        if (!cart) {
            return res.render('error', { message: 'El carrito no existe.' });
        }

        const total = cart.products.reduce((acc, cartProduct) => {
            return acc + (cartProduct.product.price * cartProduct.quantity);
        }, 0)

        const isEmpty = cart.products.length === 0;

        res.render('detailscart', { cart, total, isEmpty })
    } catch (error) {
        console.error('Error al obtener el detalle del carrito:', error);
        res.render('error', { message: 'Error al obtener el detalle del carrito.' });
    }
})

//vista para ticket de compra
viewsRouter.get('/tickets/:tid', async (req, res) => {
    try {
        const { tid } = req.params
        const ticket = await ticketService.getBy(tid)
        
        if (!ticket) {
            return res.render('error', { message: 'Ticket no encontrado.' })
        }
        res.render('ticket', { ticket })
    } catch (error) {
        console.error('Error al obtener el ticket:', error)
        res.render('error', { message: 'Error al obtener el ticket.' })
    }
})

//vista para pasarela de pagos Stripe
//viewsRouter.get('/pagar-con-stripe', async (req, res) => {
//    const urlPagoStripe = 'https://stripe.com'
//    res.redirect(urlPagoStripe);
//})


//vista para cart por id
viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartModel.findOne({_id:cid})        
        res.render('cart', { cart })
    } catch (error) {
        console.error(error)
        res.render('error', { message: 'Error al obtener detalle del carrito.' })
    }
})

//vista para login
viewsRouter.get ('/login', (req, res) => {
    res.render ('login')
})

//vista para register
viewsRouter.get ('/register', (req, res) => {
    res.render ('register')
})

//vista para formulario de recuperación de contraseña
viewsRouter.get('/forgot-password', (req, res) => {
    res.render('forgotPassword')
})

//vista para formulario para crear una nueva contraseña
viewsRouter.get('/reset-password', (req, res) => {
    const token = req.query.token
    res.render('resetPassword', { token })
})

//vista para usuarios
viewsRouter.get('/users', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const { docs: users, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await userService.get(Number(limit), Number(page));
    
        res.render('users', {
            users,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        });
    } catch (error) {
        res.render('error', { message: 'Error al obtener la lista de usuarios.' });
    }
})

//vista para administrar usuarios por el administrador
viewsRouter.get('/admin/users', passportCall('jwt'), authorization(['ADMIN']), async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const { docs: users, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await userService.get(Number(limit), Number(page));
        
        const enhancedUsers = users.map(user => ({
            ...user,
            isUser: user.role === 'USER',
            isPremiumUser: user.role === 'USER_PREMIUM',
            isAdmin: user.role === 'ADMIN',
            uid: user._id
        }))

        res.render('adminusers', {
            users: enhancedUsers,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            totalPages
        });
    } catch (error) {
        res.render('error', { message: 'Error al obtener la lista de usuarios.' });
    }
})

//vista para administrar usuarios por el administrador
viewsRouter.get('/profile', passportCall('jwt'), authorization(['USER', 'USER_PREMIUM']), async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.user);
        const user = req.user; // `req.user` contiene la información del usuario autenticado
        if (!user) {
            return res.status(401).json({ status: 'error', error: 'Unauthorized' });
        }
        console.log('UID:', user.id); // Asegúrate de que el ID del usuario esté presente aquí
        res.render('profile', { uid: user.id }); // Usa `user.id` en lugar de `user._id`
    } catch (error) {
        console.error('Error al renderizar la vista de perfil:', error);
        res.render('error', { message: 'Error al renderizar la vista de perfil.' });
    }
});


module.exports = viewsRouter