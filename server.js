const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

const { PORT, NODE_ENV, HOST } = require('./config')
const corsOptions = require('./config/cors')
const cspConfig = require('./config/content-security-policy')
const cronJob = require('./cron/updateTickers')
const dbConnect = require('./config/db')

const app = express()

// Middleware
app.use(helmet())
app.use(helmet.contentSecurityPolicy(cspConfig))
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

dbConnect()

app.use('/api/v1', require('./routes/v1'))

app.use((req, res, next) => {
	res.status(404).json({ error: 'Route not found' })
})

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal Server Error',
	})
})

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://${HOST}:${PORT} in ${NODE_ENV} mode`)
})
