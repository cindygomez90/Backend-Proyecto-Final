const { userModel }  = require ('../Mongo/models/users.model.js')

class UserDaoMongo {
    async get(limit = 10, page = 1) {
        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            lean: true
        }        
        const users = await userModel.paginate({}, options)
        return users
    }
        
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

    async getInactiveUsers() {
        const dateThreshold = new Date();
        dateThreshold.setMinutes(dateThreshold.getMinutes() - 30);

        return await userModel.find({
            last_connection: { $lt: dateThreshold },
            isActive: true
        })
    }
}

module.exports = UserDaoMongo
