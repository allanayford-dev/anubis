const corsOptions = {
	origin: (origin, callback) => {
		const allowedOrigins = ['http://example.com', 'http://another.com']
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
}

module.exports = corsOptions
