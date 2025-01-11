const mongoose = require('mongoose')

const db = {}

db.mongoose = mongoose

db.Ticker = require('./Ticker')

module.exports = db
