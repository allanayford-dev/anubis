require('dotenv').config()

const PORT = process.env.PORT ?? 3000
const HOST = process.env.HOST ?? 'localhost'
const NODE_ENV = process.env.NODE_ENV ?? 'development'

module.exports = {
	PORT,
  HOST,
  NODE_ENV
}
