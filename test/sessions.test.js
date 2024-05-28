const chai = require ('chai')
const { describe } = require('node:test')
const supertest = require ('supertest')
const { generateToken } = require ('../ecommerce/src/utils/jsonwebtoken.js')

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe('Testing para endpoints de sessions', () => {

    it('Testing del endpoint POST /api/sessions/register, debe registrar un usuario correctamente', async ()=> {
        
        let mockUser = {
            first_name: 'Valentino',
            last_name: 'Sanchez',
            email: 'v@gmail.com',
            password: '15octubre',
            role: 'ADMIN'
        }

        const { _body, ok, statusCode } = await requester.post('/api/sessions/register').send(mockUser)       

        expect(statusCode).to.equal(200)
        expect(_body).to.be.an('object')
        expect(_body).to.have.property('usersCreate') 
        expect(_body).to.have.property('token') 
    })

    it('Testing del endpoint POST /api/sessions/login, debe iniciar sesión de un usuario correctamente', async() => {
        let mockUser = {
            email: 'v@gmail.com',
            password: '15octubre'
        }

        const { _body, ok, statusCode } = await requester.get('/api/sessions/login').send(mockUser)
        
        expect(ok).to.be.true
        expect(statusCode).to.equal(200)
    })

    it('Testing del endpoint GET /api/sessions/current, debe acceder a cierta información', async () => {
        const token = generateToken({ 
            id: '65ece9c82540d110accd59ef', 
            role: 'ADMIN' 
        })
        
        const {_body, ok, statusCode } = await requester.get('/api/sessions/current').set('Cookie', `cookieToken=${token}`).send()

        expect(ok).to.be.true
        expect(statusCode).to.equal(200)
    })
})
