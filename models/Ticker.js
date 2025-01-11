const mongoose = require('mongoose')

const tickerSchema = new mongoose.Schema(
	{
		symbol: { type: String, required: true, unique: true },
		companyName: String,
		price: Number,
		exchange: String,
		currency: String,
		industry: String,
		sector: String,
		marketCap: String,
		peRatio: String,
		dividendYield: String,
		eps: String,
		revenueTTM: String,
		grossProfitTTM: String,
		trailingPE: String,
		analystTargetPrice: String,
		analystRatings: {
			strongBuy: { type: Number, default: 0 },
			buy: { type: Number, default: 0 },
			hold: { type: Number, default: 0 },
			sell: { type: Number, default: 0 },
			strongSell: { type: Number, default: 0 },
		},
		fiftyTwoWeekHigh: String,
		fiftyTwoWeekLow: String,
		dividendDate: String,
		exDividendDate: String,
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
)

// Use the model if it exists, otherwise create a new one
const Ticker = mongoose.models.Ticker || mongoose.model('Ticker', tickerSchema)

module.exports = Ticker
