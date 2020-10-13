const mongoose = require('mongoose')

const Schema = mongoose.Schema

const instaSchema = new Schema ({
    postId: String,
})

const Instarun = mongoose.model('Instarun', instaSchema)

module.exports = Instarun