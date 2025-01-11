const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Ticker = require('../models/Ticker') // Assuming Ticker is your Mongoose model

beforeAll(async () => {
	// Connect to the test database before running the tests
	await mongoose.connect('mongodb://localhost:27017/stock_tracker_test', {
	})
})

afterAll(async () => {
	// Clean up database and close connection after tests
	await mongoose.connection.dropDatabase()
	await mongoose.connection.close()
})

describe('Stock Ticker API', () => {
	let tickerId

	test('should fetch all tickers (GET /api/v1/tickers)', async () => {
		const response = await request(app).get('/api/v1/tickers')
		expect(response.status).toBe(200)
		expect(Array.isArray(response.body)).toBe(true)
	})

	test('should add a new ticker (POST /api/v1/tickers)', async () => {
		const newTicker = {
			name: 'AAPL',
			companyName: 'Apple Inc.',
			price: 150.0,
			exchange: 'NASDAQ',
			currency: 'USD',
			industry: 'Technology',
		}

		const response = await request(app)
			.post('/api/v1/tickers')
			.send(newTicker)
			.set('Accept', 'application/json')

		expect(response.status).toBe(201)
		expect(response.body.name).toBe('AAPL')

		// Save the tickerId for later use in the update and delete tests
		tickerId = response.body._id
	})

	test('should update a ticker (PUT /api/v1/tickers/:id)', async () => {
		const updatedTicker = {
			name: 'AAPL Updated',
			companyName: 'Apple Inc.',
			price: 155.0,
			exchange: 'NASDAQ',
			currency: 'USD',
			industry: 'Technology',
		}

		const response = await request(app)
			.put(`/api/v1/tickers/${tickerId}`)
			.send(updatedTicker)
			.set('Accept', 'application/json')

		expect(response.status).toBe(200)
		expect(response.body.name).toBe('AAPL Updated')
	})

	test('should delete a ticker (DELETE /api/v1/tickers/:id)', async () => {
		const response = await request(app)
			.delete(`/api/v1/tickers/${tickerId}`)
			.set('Accept', 'application/json')

		expect(response.status).toBe(200)
		expect(response.body.message).toBe('Ticker deleted successfully!')
	})
})
