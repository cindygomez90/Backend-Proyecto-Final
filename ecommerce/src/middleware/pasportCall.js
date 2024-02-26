const passport = require ('passport') 

/*const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info){
            if (err) return next(err) 
            if (!user) return res.status(401).send({status: 'error', error: info.message ? info.message : info.toString()})  
            req.user = user
            next()
        })(req, res, next)        
    }
}*/


const passportCall = strategy => {    //acá estoy pasando la estrategia 'jwt'
    return async (req, res, next) => {  
        passport.authenticate(strategy, function (err, user, info) {   //function es lo mismo que esto: // done(null, jwt_payload, info -> passport) - done(null, false, {message: 'che no esta el usuario'})
            //info devuelve el nombre del error
            console.log(user)
            if(err) return next(err)    //valida si hay error
            if(!user) return res.status(401).send({status: 'error', error: info.message ? info.message : info.toString() }) //valida si existe usuario
            req.user = user
            next()
        })(req, res, next)
    }
}
module.exports = { passportCall }