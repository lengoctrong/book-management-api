const { ObjectId } = require('mongodb')

class UserService {
  constructor(client) {
    this.User = client.db().collection('users')
  }

  extractUserData(payload) {
    const user = {
      email: payload.email,
      password: payload.password
    }

    // Remove undefined fields
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    )

    return user
  }

  async create(payload) {
    const { email, password, type } = payload
    const user = this.extractUserData({ email, password })

    const existingUser = await this.User.findOne({
      email: user.email
    })

    try {
      if (type == 'signup') {
        if (existingUser) throw new Error('Người dùng đã tồn tại')
        const result = await this.User.insertOne(user)
        const currentUser = result.ops?.[0]
        return currentUser
      }

      if (type == 'login') {
        if (!existingUser) throw new Error('Người dùng chưa tồn tại')
        const isPasswordMatch = existingUser.password === user.password
        if (!isPasswordMatch) throw new Error('Mật khẩu không chính xác')

        return existingUser
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async find(filter) {
    const cursor = await this.User.find(filter)
    return await cursor.toArray()
  }

  async findByName(name) {
    return await this.User.find({
      name: { $regex: new RegExp(name), $options: 'i' }
    })
  }

  async findById(id) {
    return await this.User.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    })
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    }
    const update = this.extractUserData(payload)
    const result = await this.User.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: 'after' }
    )

    return result.value
  }

  async delete(id) {
    const result = await this.User.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    })
    return result.value
  }

  async findFavorite() {
    return await this.find({ favorite: true })
  }

  async deleteAll() {
    const result = await this.User.deleteMany({})
    return result.deletedCount
  }
}
module.exports = UserService
