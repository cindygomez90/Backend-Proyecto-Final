//importación de módulos
const { Router } = require ('express') 
const UserController = require('../controllers/users.controller.js')
const { passportCall } = require ('../middleware/pasportCall.js') 
const { authorization } = require ('../middleware/authentication.js') 

const usersRouter = Router()
const { getUsers, getUserBy, createUser, updateUser, deleteUser} = new UserController ()


//Endpoint para solicitar todos los usuarios
usersRouter.get('/', passportCall('jwt'), authorization(['ADMIN']), getUsers)

//Endpoint para solicitar un usuario
usersRouter.get('/:uid', getUserBy)

//Endpoint para crear un usuario
usersRouter.post('/', createUser)

//Endpoint para modificar un usuario
usersRouter.put('/:uid', updateUser)

//Endpoint para eliminar un usuario
usersRouter.delete('/:uid', deleteUser)


module.exports = usersRouter