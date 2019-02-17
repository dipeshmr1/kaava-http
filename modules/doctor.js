const shortid = require('shortid')
const Doctor = require('../models/doctor')

function doctorDetails(){

}

doctorDetails.prototype.writeToDoctor = (data, callback) => {
    let doctor = new Doctor({
        _id: shortid.generate(),
        name: data.name,
        birth_date: data.birth_date,
        gender: data.gender,
        city: data.city,
        district: data.district,
        email_id: data.email_id,
        mobile: data.mobile,
        specialities: data.specialities,
        details: data.details,
        clinics: data.clinics
    })
    doctor.save((err)=>{
        if(err){
            callback(err,null)
        }else{
            doctor.on('es-indexed', function (err, res) {
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

doctorDetails.prototype.getProfile = (id, callback)=>{
    var query = { '_id' : id }
    console.log(query)

    Doctor.findOne(query, function(err, result) {
            if(err){
                callback(err, null)
            } else{
                callback(null, result)
            }
        })
}

module.exports = doctorDetails