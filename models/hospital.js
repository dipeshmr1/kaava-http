const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const hospitalSchema = mongoose.Schema({
    _id: String,
    type: String,
    name: String,
    city: String,
    district: String,
    mobile: String,
    details: String,
    services: [{
        type: String
    }],
    doctors: [{
        type: String
    }],
    image_link: String,
    address_link: String,
    created: Date,
    updated: Date
})
hospitalSchema.plugin(mongoosastic)
module.exports = mongoose.model('Hospital', hospitalSchema)