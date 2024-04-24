const ApiError = require('../api-error')
const UserService = require('../services/userService')
const MongoDB = require('../utils/mongodbUtil')

exports.create = async (req, res, next) => {
  if (!req.body?.email || !req.body?.password) {
    return next(new ApiError(400, 'Email or password can not be empty'))
  }

  try {
    const userService = new UserService(MongoDB.client)
    const document = await userService.create(req.body)

    return res.send(document)
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while creating the book'))
  }
}
exports.findAll = async (req, res, next) => {
  let document = []

  try {
    const userService = new UserService(MongoDB.client)
    const { name } = req.query

    if (name) {
      document = await userService.findByName(name)
    } else {
      document = await userService.find({})
    }
  } catch (error) {
    return next(
      new ApiError(500, 'An error occurred while retrieving the books')
    )
  }

  return res.send(document)
}
exports.findOne = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client)
    const document = await userService.findById(req.params.id)

    if (!document) {
      return next(new ApiError(404, 'book not found'))
    }
    return res.send(document)
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    )
  }
}
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, 'Data to update can not be empty'))
  }

  try {
    const userService = new UserService(MongoDB.client)
    const document = await userService.update(req.params.id, req.body)

    if (!document) {
      return next(new ApiError(404, 'book not found'))
    }
    return res.send({ message: 'book was updated successfully' })
  } catch (error) {
    return next(
      new ApiError(500, `Error updating book with id=${req.params.id}`)
    )
  }
}

exports.delete = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client)
    const document = await userService.delete(req.params.id)

    if (!document) {
      return next(new ApiError(404, 'book not found'))
    }
    return res.send({ message: 'book was deleted successfully' })
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete book with id=${req.params.id}`)
    )
  }
}
exports.deleteAll = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client)
    const deletedCount = await userService.deleteAll()
    return res.send({
      message: `${deletedCount} books were deleted successfully`
    })
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while removing all books'))
  }
}
exports.findAllFavorite = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client)
    const documents = await userService.findFavorite()
    return res.send(documents)
  } catch (error) {
    return next(
      new ApiError(500, 'An error occurred while retrieving favorite books')
    )
  }
}
