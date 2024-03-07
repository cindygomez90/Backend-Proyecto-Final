
class ProductRepository {
    constructor (productDao) {
        this.dao = productDao
    }

    getProducts    = async () => await this.dao.get()  

    getProduct     = async (filter) => await this.dao.getBy(filter)

    createProduct  = async (productNew) => await this.dao.create(productNew)

    updateProduct  = async (pid, productToUpdate) => await this.dao.update(pid, productToUpdate)

    deleteProduct  = async (pid) => await this.dao.delete(pid)
}

module.exports = ProductRepository