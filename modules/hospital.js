const shortid = require('shortid')
const Hospital = require('../models/hospital')

function hospitalDetails() {

}

hospitalDetails.prototype.writeToHospital = (data, callback) => {
    let hospital = new Hospital({
        _id: shortid.generate(),
        type: data.type,
        name: data.name,
        city: data.name,
        district: data.district,
        mobile: data.mobile,
        details: data.details,
        services: data.services,
        doctors: data.doctors,
        image_link: data.image_link,
        address_link: data.address_link,
        created: Date.now(),
        updated: Date.now()
    })

    hospital.save((err)=>{
        if(err){
            callback(err,null)
        }else{
            hospital.on('es-indexed', function (err, res) {
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

hospitalDetails.prototype.getProfile = (id, callback)=>{
    var query = { '_id' : id };

        Hospital.findOne(query, function(err, result) {
            if(err){
                callback(err, null)
            } else{
                callback(null, result)
            }
        })
}

module.exports = hospitalDetails