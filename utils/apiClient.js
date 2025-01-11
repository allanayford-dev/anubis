// /utils/apiClient.js
const axios = require('axios')
const { ALPHAVANTAGE_APIKEY } = require('../config')

async function fetchStockOverview(symbol) {
	try {
		const apiUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHAVANTAGE_APIKEY}`
		const response = await axios.get(apiUrl)
		console.log(`${response.status}: ${response.data}`)

		if (response.data && response.data.Note) {
			throw new Error('API rate limit exceeded or request error')
		}

		return response.data
	} catch (error) {
		console.error(`Failed to fetch data for symbol: ${symbol}`, error.message)
		return {} // Return an empty object in case of failure to avoid crashes
	}
}

module.exports = { fetchStockOverview }
