const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')

const userSchema = mongoose.Schema({
    _id: String,
    firstName: String,
    lastName: String,
    gender: String,
    birth_date: Date,
    city: String,
    district: String,
    mobile: String,
    email_id: String,
    created: Date,
    updated: Date,
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

})
userSchema.plugin(mongoosastic)
module.exports = mongoose.model('User', userSchema)



