const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const doctorSchema = mongoose.Schema({
    _id: String,
    name: String,
    birth_date: Date,
    gender: String,
    city: String,
    district: String,
    email_id: String,
    mobile: String,
    specialities: [{
        type: String
    }],
    details: String,
    clinics: [{
        _id: String,
        city: String,
        district: String,
        timing: [{
            day: Number,
            time: Number
        }],
        address_link: String,
        image_link: String,
        consultation_fee: Number,
        rating: Number


    }]

})
doctorSchema.plugin(mongoosastic)
module.exports = mongoose.model('Doctor', doctorSchema)