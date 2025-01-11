const express = require('express')
const router = express.Router()

router.use('/tickers', require('./ticker'))

module.exports = router
