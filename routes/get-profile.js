const promise = require('bluebird')
const userDetails = require('../modules/user.js')
const user = new userDetails()
const doctorDetails = require('../modules/doctor')
const doctor = new doctorDetails()
const hospitalDetails = require('../modules/hospital')
const hospital = new hospitalDetails()
const getUserProfile = promise.promisify(user.getProfile)
const getDoctorProfile = promise.promisify(doctor.getProfile)
const getHospitalProfile = promise.promisify(hospital.getProfile)



async function getProfile(req, res){

    let type = req.query.type
    let id = req.query.id
    let result
    console.log(id,type)
    try{
        if(type == 'user'){
            result = await getUserProfile(id)
        } else if(type == 'doctor'){
            console.log('doctortype')
            result = await getDoctorProfile(id)
        } else{
            result = await getHospitalProfile(id)
        }
        sendResponse(result)
    } catch(err){
        result = err
    }
    function sendResponse(result) {
        res.status(200).send(JSON.stringify(result))
    }
}

module.exports = getProfile