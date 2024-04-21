const express = require('express')
const cors = require('cors')

const ApiError = require('./app/apiError')

const app = express()

const booksRouter = require('./app/routes/bookRoute')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to book management application.' })
})

app.use('/api/books', booksRouter)

// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, 'Resource not found'))
})

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error'
  })
})

module.exports = app
