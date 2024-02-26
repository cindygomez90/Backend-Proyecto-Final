//estrategia de passport con jwt
const passport = require ('passport') 
const { Strategy, ExtractJwt } = require ('passport-jwt') 
const { PRIVATE_KEY, generateToken } = require ('../utils/jsonwebtoken')
const GithubStrategy = require('passport-github2') 
const UserManagerMongo = require ('../dao/Mongo/usersManagerMongo')
const sessionService = new UserManagerMongo ()


const JWTStrategy = Strategy
const ExtractJWT  = ExtractJwt

const initializePassport = () => {
    const cookieExtractor = (req) => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies['cookieToken'] 
        }
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)   
        }
    }))

    passport.use('github', new GithubStrategy({         
        clientID:'Iv1.76e1c1dcf997321f',
        clientSecret: '12ff2188ae743e78135a170c5e787393d4a866bb',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',       
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log('profile: ', profile)
        try {
            
                let user = await sessionService.getUserBy({email: profile._json.email})
                if (!user) {
                    let newUser = {
                        first_name: profile._json.login,
                        last_name: profile._json.name,
                        email: profile._json.email,
                        password: ''
                    }

                    const result = await sessionService.createUser (newUser)
                    user = result
                    }
                    const token = generateToken({
                        fullname: `${user.first_name} ${user.last_name}`, 
                        id: user._id,
                        email: user.email,
                        role: user.role
                    })
                    done(null, {token, user})
                } catch (error) {
                done(error)
            }
        }))
        
        passport.serializeUser((user, done) => {
            done(null, user.token)
        });

        passport.deserializeUser(async (token, done) => {
            try {
            done(null, { token })
        } catch (error) {
            done(error);
        }
        })
}

module.exports = { initializePassport }