const { Router } = require ("express")
const bcrypt = require('bcrypt')
const UserManagerMongo = require ('../dao/Mongo/usersManagerMongo')
const sessionService = new UserManagerMongo ()
const ProductManagerMongo = require ('../dao/Mongo/productsManagerMongo')
const productService = new ProductManagerMongo ()
const passport = require ('passport')
const sessionsRouter = Router ()
const { generateToken }  = require ('../utils/jsonwebtoken')
const { passportCall}  = require ('../middleware/pasportCall')
const { authorization } = require ('../middleware/authentication')

//Endpoint para el ingreso del usuario
sessionsRouter.post ('/login', async (req, res)=>{
    const {email, password} = req.body       
    
    const user = await sessionService.getUserBy ({email})
    console.log (user)
    if (!user) {
        return res.send ({
            status: 'error', 
            error: 'Usuario con ese mail no existe'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.send({ status: 'error', error: 'Contraseña incorrecta' })
    }

    const token = generateToken({
        fullname: `${user.first_name} ${user.last_name}`, 
        id: user._id,
        email: user.email,
        role: user.role
    })
    res.cookie('cookieToken', token, {
        maxAge: 60*60*1000*24,  
        httpOnly: true 
    })

    //req.session.user = {id: user._id, username: user.first_name, role: user.role }
    //console.log ('req session user sessions', req.session.user)

    const products = await productService.getProducts()
    res.render('products', { user: user, products})
})

//validación si el usuario es administrador
/*function auth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    if (req.session.user.role === 'admin') {
        return next()
    } else {
        return res.status(403).send('Acceso denegado')
    }
}

sessionsRouter.get('/products', auth, (req, res) => {
    res.render('products', { user: req.session.user });
})
sessionsRouter.get('/products', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('products', { user: req.user });
})*/

sessionsRouter.get('/faillogin', async (req, res) => {
    res.send({error: 'falla en el register'})
})

//Endpoint para el registro del usuario
sessionsRouter.post ('/register', async (req, res)=>{
    try {        
        const {first_name, last_name, email, password, role} = req.body       
        console.log (first_name, last_name, email, password, role)
        if (first_name === '' || password === '') {
            return res.send ('Faltan llenar campos obligatorios')
        } 

        const existingUser = await sessionService.getUserBy({ email })
        if (existingUser) {
            return res.send({
                status: 'error',
                error: 'El correo electrónico ya está registrado',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
    
        const newUser = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: role || 'USER'
        }
        const result = await sessionService.createUser (newUser)
        const token = generateToken({
            id: result._id
        })
        res.cookie('cookieToken', token, {
            maxAge: 60 * 60 * 1000 * 24,       
            httpOnly: true  
        }).send({   
            status: 'success',
            usersCreate: result, 
            token   
        })
    } catch (error) {
        res.send ({status:'error', error:error.message})        
    }
})

sessionsRouter.get('/failregister', async (req, res) => {
    res.send({error: 'falla en el register'})
})

//Endpoint para acceder a current
sessionsRouter.get('/current', passportCall ('jwt'), authorization (['ADMIN']), async (req, res) => {       
    try {
        const currentUser = req.user;

        if (!currentUser) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }
        const responseData = {
            id: currentUser.id,
            email: currentUser.email
        }

        res.json(responseData)
    } catch (error) {
        console.error('Error al recuperar datos del usuario:', error);
        res.status(500).json({ status: 'error', error: 'Error del servidor' });
    }
})

//Endpoint para el cierre de sesión del usuario
/*sessionsRouter.post('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.send({ status: 'error', message: 'Logout error' })
        }
        res.redirect('/login')
    })
})*/


sessionsRouter.post('/logout', (req, res) => {
    res.clearCookie('cookieToken') 
    res.redirect('/login')
})


//Endpoint para github
sessionsRouter.get('/github', passport.authenticate('github', {scope:['user:email']}),async (req, res) => {})


/*sessionsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/api/sessions/login'} ),async (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})*/


/*sessionsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/api/sessions/login'} ),async (req, res) => {
    const token = generateToken({
        fullname: `${user.first_name} ${user.last_name}`, 
        id: user._id,
        email: user.email,
        role: user.role
    })

    res.cookie('cookieToken', token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true
    }).redirect('/products')
})*/

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback',
    passport.authenticate('github', { session: false, failureRedirect: '/api/sessions/login' }), 
    async(req, res) => {
        console.log('req.user:', req.user)
        const user = req.user.user
        const products = await productService.getProducts()
        res.render('products', { user: user, products })
    })


module.exports = sessionsRouter