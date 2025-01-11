const express = require('express')
const {
	addTicker,
	getAllTickers,
	getTickerById,
	updateTicker,
	deleteTicker,
} = require('../../controllers/tickerController')

const router = express.Router()

router.post('/', addTicker)
router.get('/', getAllTickers)
router.get('/:id', getTickerById)
router.put('/:id', updateTicker)
router.delete('/:id', deleteTicker)

module.exports = router
