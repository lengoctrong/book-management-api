const { ObjectId } = require('mongodb')

class BookService {
  constructor(client) {
    this.Book = client.db().collection('books')
  }

  extractBookData(payload) {
    const book = {
      title: payload.title,
      author: payload.author,
      years: payload.years,
      image: payload.image,
      quantity: payload.quantity,
      borrow: payload.borrow,
      category: payload.category
    }

    // Remove undefined fields
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    )

    return book
  }

  async create(payload) {
    const book = this.extractBookData(payload)
    const result = await this.Book.insertOne(book)
    const newBook = result.ops?.[0]
    return newBook
  }

  async find(filter) {
    const cursor = await this.Book.find(filter)
    return await cursor.toArray()
  }

  async findByName(name) {
    return await this.Book.find({
      name: { $regex: new RegExp(name), $options: 'i' }
    })
  }

  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? id : new ObjectId(id)
    })
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    }
    const update = this.extractBookData(payload)
    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: 'after' }
    )

    return result.value
  }

  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    })
    return result.value
  }

  async findFavorite() {
    return await this.find({ favorite: true })
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({})
    return result.deletedCount
  }
}
module.exports = BookService
