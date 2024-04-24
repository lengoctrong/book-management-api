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

    console.log('document: ', document)

    return res.send(document)
  } catch (err) {
    next(new ApiError(400, err.message))
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
      new ApiError(500, 'An error occurred while retrieving the users')
    )
  }

  return res.send(document)
}
exports.findOne = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client)
    const document = await userService.findById(req.params.id)

    if (!document) {
      return next(new ApiError(404, 'user not found'))
    }
    return res.send(document)
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`)
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
      return next(new ApiError(404, 'user not found'))
    }
    return res.send({ message: 'user was updated successfully' })
  } catch (error) {
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`)
    )
  }
}

exports.delete = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client)
    const document = await userService.delete(req.params.id)

    if (!document) {
      return next(new ApiError(404, 'user not found'))
    }
    return res.send({ message: 'user was deleted successfully' })
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete user with id=${req.params.id}`)
    )
  }
}
exports.deleteAll = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client)
    const deletedCount = await userService.deleteAll()
    return res.send({
      message: `${deletedCount} users were deleted successfully`
    })
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while removing all users'))
  }
}
exports.findAllFavorite = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client)
    const documents = await userService.findFavorite()
    return res.send(documents)
  } catch (error) {
    return next(
      new ApiError(500, 'An error occurred while retrieving favorite users')
    )
  }
}
