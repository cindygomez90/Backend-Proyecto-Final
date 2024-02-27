const { userModel }  = require ("../models/users.model")

class UserManagerMongo {
    async getUsersPaginate(limit = 10, page = 1) {
        return await userModel.paginate({}, {limit, page, lean:true})
    }
        
    async getUsers () {
        return await userModel.find ({})
    }

    async getUserBy (filter) {
        return await userModel.findOne (filter)
    }

    async createUser (newUser) {
        return await userModel.create (newUser)
    }

    async updateUser (uid, userUpdate) {
        return await userModel.findOneAndUpdate({_id: uid}, userUpdate)
    }
    
    async deleteUser (uid) {
        return await userModel.findByIdAndDelete ({_id:uid})
    }
}

module.exports = UserManagerMongo
