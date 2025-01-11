const axios = require('axios')
const Ticker = require('../models/ticker')
const cron = require('node-cron')
const fetchStockOverview = require('../utils/apiClient')

cron.schedule('0 0 * * *', async () => {
	try {
		const tickers = await Ticker.find().sort({ updatedAt: -1 }).limit(2)

		for (const ticker of tickers) {
			const symbol = ticker.symbol

			const data = await fetchStockOverview(symbol)

			if (data.Symbol) {
				await Ticker.findOneAndUpdate(
					{ symbol: symbol },
					{
						companyName: data.Name,
						price: parseFloat(data.LatestPrice),
						exchange: data.Exchange,
						currency: data.Currency,
						industry: data.Industry,
						sector: data.Sector,
						marketCap: data.MarketCapitalization,
						peRatio: data.PERatio,
						dividendYield: data.DividendYield,
						eps: data.EPS,
						revenueTTM: data.RevenueTTM,
						grossProfitTTM: data.GrossProfitTTM,
						trailingPE: data.TrailingPE,
						analystTargetPrice: data.AnalystTargetPrice,
						analystRatings: {
							strongBuy: data.AnalystRatingStrongBuy || 0,
							buy: data.AnalystRatingBuy || 0,
							hold: data.AnalystRatingHold || 0,
							sell: data.AnalystRatingSell || 0,
							strongSell: data.AnalystRatingStrongSell || 0,
						},
						fiftyTwoWeekHigh: data['52WeekHigh'],
						fiftyTwoWeekLow: data['52WeekLow'],
						dividendDate: data.DividendDate,
						exDividendDate: data.ExDividendDate,
					},
					{ new: true }
				)
			} else {
				console.log(`No data found for ticker: ${symbol}`)
			}
		}
	} catch (error) {
		console.error('Error updating ticker data:', error)
	}
})
