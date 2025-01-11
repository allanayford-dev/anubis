const db = require('../models')
const { fetchStockOverview } = require('../utils/apiClient')
const Ticker = db.Ticker

exports.addTicker = async (req, res) => {
	try {
		const { symbol } = req.body

		if (!symbol) {
			return res.status(400).json({ error: 'Symbol is required' })
		}

		const ticker = new Ticker({
			symbol,
		})

		await ticker.save()
		res.status(201).json(ticker)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

exports.getAllTickers = async (req, res) => {
	try {
		const tickers = await Ticker.find().sort({ lastUpdated: -1 })
		res.status(200).json(tickers)
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch tickers' })
	}
}

exports.getTickerById = async (req, res) => {
	try {
		const ticker = await Ticker.findById(req.params.id)
		if (!ticker) {
			return res.status(404).json({ error: 'Ticker not found' })
		}
		res.status(200).json(ticker)
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch ticker' })
	}
}

exports.updateTicker = async (req, res) => {
	const tickerId = req.params.id

	try {
		const ticker = await Ticker.findById(tickerId)
		if (!ticker) {
			return res.status(404).json({ message: 'Ticker not found.' })
		}

		console.log(`Ticker: ${ticker}`)

		const symbol = ticker.symbol
		const data = await fetchStockOverview(symbol).catch((err) => {
			return res.status(500).json({
				message: 'Failed to fetch stock data',
				error: err.message,
			})
		})

		console.log(`Ticker Data: ${data}`)

		if (!data || !data.Symbol) {
			return res
				.status(404)
				.json({ message: `No data found for ticker: ${symbol}` })
		}

		const price = parseFloat(data.LatestPrice ?? 0)
		console.log(`Price: ${price}`)
		const marketCap = parseFloat(data.MarketCapitalization)
		console.log(`MarketCap: ${marketCap}`)
		const peRatio = parseFloat(data.PERatio)
		console.log(`peRatio: ${peRatio}`)

		if (isNaN(price) || isNaN(marketCap) || isNaN(peRatio)) {
			return res.status(400).json({ message: 'Invalid market data' })
		}

		// Parse dates
		const dividendDate = new Date(data.DividendDate)
		const exDividendDate = new Date(data.ExDividendDate)

		const analystRatings = {
			strongBuy: data.AnalystRatingStrongBuy || 0,
			buy: data.AnalystRatingBuy || 0,
			hold: data.AnalystRatingHold || 0,
			sell: data.AnalystRatingSell || 0,
			strongSell: data.AnalystRatingStrongSell || 0,
		}

		const updatedTicker = await Ticker.findOneAndUpdate(
			{ _id: tickerId },
			{
				companyName: data.Name,
				price,
				exchange: data.Exchange,
				currency: data.Currency,
				industry: data.Industry,
				sector: data.Sector,
				marketCap,
				peRatio,
				dividendYield: data.DividendYield,
				eps: data.EPS,
				revenueTTM: data.RevenueTTM,
				grossProfitTTM: data.GrossProfitTTM,
				trailingPE: data.TrailingPE,
				analystTargetPrice: data.AnalystTargetPrice,
				analystRatings,
				fiftyTwoWeekHigh: data['52WeekHigh'],
				fiftyTwoWeekLow: data['52WeekLow'],
				dividendDate,
				exDividendDate,
				lastUpdated: new Date(), // Add a lastUpdated field
			},
			{ new: true }
		)

		res.status(200).json({
			message: 'Ticker updated successfully',
			ticker: updatedTicker, // Return the updated ticker
		})
	} catch (error) {
		console.error('Error updating ticker data:', error)
		res.status(500).json({
			message: 'Failed to update ticker',
			error: error.message,
		})
	}
}

exports.deleteTicker = async (req, res) => {
	try {
		const ticker = await Ticker.findByIdAndDelete(req.params.id)
		if (!ticker) {
			return res.status(404).json({ error: 'Ticker not found' })
		}
		res.status(200).json({ message: 'Ticker deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete ticker' })
	}
}
