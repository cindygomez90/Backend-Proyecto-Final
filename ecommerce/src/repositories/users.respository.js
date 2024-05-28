const { UserDto } = require('../dto/userDto.js')

class UserRepository {
    constructor (userDao) {
        this.dao = userDao
    }

    getUsers = async (limit, page) => await this.dao.get(Number(limit), Number(page))
    
    getUser = async (filter) => await this.dao.getBy(filter)

    createUser = async (newUser) => {
        const newUserDto = new UserDto(newUser)
        return await this.dao.create(newUserDto)    
    }

    updateUser = async (uid, userUpdate) => await this.dao.update(uid, userUpdate)

    deleteUser = async (uid) => await this.dao.delete({_id: uid})

    //getInactiveUsers = async (days) => await this.dao.getInactiveUsers(days) //para días
    getInactiveUsers = async (minutes) => await this.dao.getInactiveUsers(minutes)  //para minutos
}


module.exports = UserRepository