const UserRepository = require("./users.respository")
const ProductRepository = require("./products.respository")
const CartRepository = require ('./carts.respository')

const { UserDao, ProductDao, CartDao } = require("../daos/factory")



const userService = new UserRepository(new UserDao())
const productService = new ProductRepository(new ProductDao())
const cartService = new CartRepository(new CartDao())

module.exports = { userService, productService, cartService }