//importación de los módulos a utilizar 
const fs = require('node:fs')
const { getPriority } = require('node:os')


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
        const productsList = await this.readFileProducts ()

        if (!product.title ||                   //validación que todos los campos sean obligatorios
        !product.description ||
        !product.price ||
        !product.thumbail ||
        !product.code ||
        !product.stock)
        {
            return "Falta algún campo del producto"
        }                 

        const result = productsList.find (prod => prod.code === product.code)  //validación de campo code
        if (result) {
            return "Existe un producto con igual código"
        }

       //creación de id autoincrementable al agregar producto
        product.id = productsList.length ? productsList.length + 1 : 1
        productsList.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(productsList, null, 2))
        return product
        
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
            const datosActuales = await this.readFileProducts();
            const nvosDatos = datosActuales.filter((product) => product.id !== id);
        
            if (nvosDatos.length === datosActuales.length) {
            return "No se encontró producto con el id indicado";
            }
        
            await fs.promises.writeFile(this.path, JSON.stringify(nvosDatos, null, 2));
            return "Se eliminó el producto con el id indicado";
        } catch (error) {
            console.error(error);
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

const product3 = {
    title: "product3", 
    description: "portalapicero", 
    price: 2000, 
    thumbail: "imagen", 
    code: "abc03", 
    stock: 5
}

const product4 = {
    title: "product4", 
    description: "bandolera animal print", 
    price: 13000, 
    thumbail: "imagen", 
    code: "abc04", 
    stock: 2
}

const product5 = {
    title: "product5", 
    description: "cartuchera", 
    price: 1500, 
    thumbail: "imagen", 
    code: "abc05", 
    stock: 15
}


const test = async () => {
    const products = new ProductManager()
    console.log(await products.addProduct(product1))
    console.log(await products.addProduct(product2))
    console.log(await products.addProduct(product3))
    console.log(await products.addProduct(product4))
    console.log(await products.addProduct(product5))
    console.log(await products.getProducts())
    console.log(await products.getProductsById(1))
    console.log(await products.updateProduct(5, "price", 20000))
    //console.log(await products.deleteProduct(1))
}

test ()

//exportación del módulo
module.exports = getProducts