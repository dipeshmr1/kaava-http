const mongoClient = require('../db/mongo-connection')
const shortid = require('shortid')
const User = require('../models/user')
function userDetails() {

}

userDetails.prototype.writeToUser = (data, callback) => {

    let user = new User({
        _id: shortid.generate(),
        name: data.name,
        gender: data.gender,
        birth_date: data.birth_date,
        city: data.city,
        District: data.district,
        mobile: data.mobile,
        email_id: data.email_id,
        created: Date.now(),
        updated: Date.now()
    })

    
    user.save((err) => {
        if (err) {
            callback(err, null)
        } else {
            user.on('es-indexed', function (err, res) {
                if (err) {
                    callback(err, null)

                } else {
                    console.log(res)
                    callback(null, "gotyou")
                }
            })

        }


    })

}

userDetails.prototype.getProfile = (id, callback)=>{
    var query = { '_id' : id }

        User.findOne(query, function(err, result) {
            if(err){
                callback(err, null)
            } else{
                callback(null, result)
            }
        })
}

module.exports = userDetails