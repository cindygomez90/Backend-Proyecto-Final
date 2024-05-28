const { userModel }  = require ('../Mongo/models/users.model.js')

class UserDaoMongo {
    async get(limit = 10, page = 1) {
        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            lean: true
        }
        //const users = await userModel.paginate({}, { limit, page, lean: true });
        const users = await userModel.paginate({}, options)
        return users
    }
        
    //async get () {
    //    return await userModel.find ({})
    //}

    async getBy (filter) {
        return await userModel.findOne (filter)
    }

    async create (newUser) {
        return await userModel.create (newUser)
    }

    async update (uid, userUpdate) {
        return await userModel.findOneAndUpdate({_id: uid}, userUpdate, {new: true})
    }

    async delete (uid) {
        return await userModel.findByIdAndDelete (uid)
    }

    async getInactiveUsers(days) {
        //const thresholdDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const thresholdDate = new Date(Date.now() - minutes * 60 * 1000)    //para recibir minutos
        return await userModel.findOne({ lastConnection: { $lt: thresholdDate } });
    }
}

module.exports = UserDaoMongo
