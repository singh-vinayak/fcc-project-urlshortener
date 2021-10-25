const mongoose = require('mongoose')
const shortid = require('shortid')

const urlSchema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    short_url: {
        type: String,
        required: true,
        unique: true,
        default: shortid.generate
    }
})

const ShortUrl = mongoose.model('URL', urlSchema)

module.exports = ShortUrl