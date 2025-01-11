const express = require('express')
const app = express()
const { PORT, NODE_ENV, HOST } = require('./config')

// Middleware to parse JSON
app.use(express.json())

app.get('/', (req, res) => {
	res.send('Welcome to my API.')
})

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://${HOST}:${PORT} in ${NODE_ENV}`)
})
