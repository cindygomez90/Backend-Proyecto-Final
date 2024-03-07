const { UserDto } = require('../dto/userDto')

class UserRepository {
    constructor (userDao) {
        this.dao = userDao
    }

    getUsers = async () => await this.dao.get()
    
    getUser = async (filter) => await this.dao.getBy(filter)

    createUser = async (newUser) => {
        const newUserDto = new UserDto(newUser)
        return await this.dao.create(newUserDto)    
    }

    updateUser = async (uid, userUpdate) => await this.dao.update(uid, userUpdate)

    deleteUser = async (uid) => await this.dao.delete({_id: uid})
}


module.exports = UserRepository