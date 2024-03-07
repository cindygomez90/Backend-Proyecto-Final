
class CartRepository {
    constructor(cartDao){
        this.dao = cartDao
    }

    create = async () => await this.dao.create ()

    getCart = async (filter) => await this.dao.getBy (filter) 

    addProductToCart = async (cid, pid) => await this.dao.addProductToCart(cid, pid) 

    createCart  = async () => await this.dao.create() 

    updateCart  = async (cid, newProducts) => await this.dao.update (cid, newProducts)

    updateProductQuantity = async (cid, pid, quantity) => await this.dao.updateProductQuantity(cid, pid, quantity) 

    deleteProductFromCart  = async (cid, pid) => await this.dao.deleteProductFromCart(cid, pid)

    deleteAllProductsFromCart = async (cid) => await this.dao.deleteAllProductsFromCart(cid)
}

module.exports = CartRepository