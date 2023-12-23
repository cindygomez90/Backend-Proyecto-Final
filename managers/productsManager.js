//importación de los módulos a utilizar 
const fs = require('node:fs')


//creación de clase
class ProductManager {
    constructor () {
        this.path = './mockDB/Products.json'
        this.products = []
    }

//método para leer el archivo de productos
    async readFileProducts(){                  
        try {
            if (fs.existsSync (this.path)) {
                const ProductsData = await fs.promises.readFile(this.path, 'utf-8')    
                const ProductsJs = await JSON.parse(ProductsData)                          
                return ProductsJs
            }        
        } catch (error) {
            return []               
        }
    }
    

//método para agregar un producto al array de productos inicial
    async addProduct(product){             
        try {
            let ProductsList = await this.readFileProducts ()
            let ProductsJson = JSON.stringify (this.products, null, 2)
            let ProductsJs = JSON.parse (ProductsJson)
            console.log(product)
            console.log(ProductsList)
        

            if (!product.title ||                   //validación que todos los campos sean obligatorios
            !product.description ||
            !product.price ||
            !product.thumbail ||
            !product.code ||
            !product.stock)
            {
                return "Falta algún campo del producto"
            }                 

            const result = this.products.find (prod => prod.code === product.code)  //validación de campo code
            if (result) {
                return "Existe un producto con igual código"
            }

           //creación de id autoincrementable al agregar producto
            if (this.products.length === 0) {             
                product.id = 1
                this.products.push (product)
            } else {
                product.id = this.products.length + 1     
                this.products.push (product)                
            }

            await fs.promises.writeFile(this.path, JSON.stringify (ProductsJs, null, 2))   
            return console.log ("Producto agregado")
            
        } catch (error) {
            console.log(error)
        }
    }

//método para devolver array con los productos existentes
    async getProducts (){
        try {
            const ProductsJson = await fs.promises.readFile (this.path)
            const ProductsJs = JSON.parse (ProductsJson)
            console.log (ProductsJs)
            
        } catch (error) {
            console.log(error)
        }
        
    } 

//método para buscar en array producto por el id
    async getProductsById (id) {
        try {
            await this.readFileProducts ()    
            const buscarId = this.products.find (product => product.id === id)
            if (buscarId) {
                return buscarId
            } else {
                return "Not found"
        }
        } catch (error) {
            console.log(error)
        }
        
    }

    //método para actualizar campo en archivo según id
    async updateProduct (id, price, newValue) {
        try {
            const datosActuales = await this.readFileProducts () 
            const elemActualizar = datosActuales.find(product => product.id === id)
            if (elemActualizar) {
                elemActualizar [price] = newValue
                await this.addProduct (datosActuales)
            } else {
                console.log ("No se encontró el id indicado")
        }
        } catch (error) {
            console.log(error)
        }
    }

    //método para eliminar producto en archivo según id
    async deleteProduct (id) {
        try {
            const datosActuales = await this.readFileProducts () 
            const nvosDatos = datosActuales.filter(product => product.id !== id)
            if (nvosDatos.length > datosActuales.length) {
                await this.addProduct (datosActuales)
                console.log ("Se eliminó el producto con el id indicado")
            } else {
                console.log ("No se encontró producto con el id indicado")
        }
        } catch (error) {
            console.log(error)
        }
    }

}


//creación de productos 
const product1 = {
    title: "product1", 
    description: "cartera de cuero", 
    price: 15000, 
    thumbail: "imagen", 
    code: "abc01", 
    stock: 30
}

const product2 = {
    title: "product2", 
    description: "billetera de cuero", 
    price: 3000, 
    thumbail: "imagen", 
    code: "abc02", 
    stock: 10
}

const products = new ProductManager ()
console.log (products.addProduct(product1))
console.log (products.addProduct(product2))
console.log (products.getProducts())
console.log (products.getProductsById(1))
console.log (products.updateProduct (1, "price", 20000))
//console.log (products.deleteProduct (1))


//exportación del módulo
module.exports = ProductManager
