require('dotenv').config()

const PORT = process.env.PORT ?? 3000
const HOST = process.env.HOST ?? 'localhost'
const NODE_ENV = process.env.NODE_ENV ?? 'development'
const DB_URL = process.env.DB_URL ?? 'mongodb://localhost:27017'
const ALPHAVANTAGE_APIKEY = process.env.ALPHAVANTAGE_APIKEY ?? 'demo'

module.exports = {
	PORT,
	HOST,
	NODE_ENV,
	DB_URL,
	ALPHAVANTAGE_APIKEY,
}
