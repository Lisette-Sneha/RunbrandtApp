const mongoose = require('mongoose')

const Schema = mongoose.Schema

const runSchema = new Schema ({
    name: String,
    kilometers: String,
    location: String
})

const Run = mongoose.model('Run', runSchema)

module.exports = Run