const chai = require ('chai')
const { describe } = require('node:test')
const supertest = require ('supertest')
const { generateToken } = require ('../ecommerce/src/utils/jsonwebtoken.js')


const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing para endpoints de carritos', () => {
    let cid

    it('Testing del endpoint POST /api/carts, debe crear un carrito correctamente', async () => {
        const response = await requester.post('/api/carts')
        //console.log(response.body)

        expect(response.status).to.equal(200)
        expect(response.ok).to.be.true
        expect(response.body.payload).to.have.property('_id')
    })

    it('Testing del endpoint GET /api/carts/:cid, debe obtener un carrito por su ID', async () => {
        const cid = '65b189e7d6a8cbec9e0b4264'
        const response = await requester.get(`/api/carts/${cid}`)
        //console.log(response.body)  

        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('success')
        expect(response.body).to.be.an('object')
        expect(response.body.payload).to.have.property('_id').to.equal(cid)
    })

    it('Testing del endpoint POST /api/carts/:cid/products/:pid, debe agregar un producto a un carrito correctamente', async () => {
        
        const token = generateToken({ 
            id: '65c38b42e7633bc8b9ced35c', 
            role: 'USER' 
        })      
        
        const cid = '663a9e4172b4c08917c2a8ad'
        const pid = '65b15ebd9e4c274252f9d7fe'

        const response = await requester.post(`/api/carts/${cid}/products/${pid}`).set('Cookie', `cookieToken=${token}`).send({ })
        //console.log(response.body)

        expect (response.body.status).to.equal('success')
        expect (response.body).to.be.an('object')
        expect (response.body.payload).to.have.property('_id').to.equal(cid)      
    })
})
