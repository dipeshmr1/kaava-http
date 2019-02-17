const promise = require('bluebird')
const userDetails = require('../modules/user.js')
const user = new userDetails()
const doctorDetails = require('../modules/doctor')
const doctor = new doctorDetails()
const hospitalDetails = require('../modules/hospital')
const hospital = new hospitalDetails()
const writeUserRecord = promise.promisify(user.writeToUser)
const writeDoctorRecord = promise.promisify(doctor.writeToDoctor)
const writeHospitalRecord = promise.promisify(hospital.writeToHospital)

async function writeToMongo(req, res) {
    
    let result
    try{
        if(req.query.type == 'user'){
            res.status(200).send(JSON.stringify(req.body))
            result = await writeUserRecord(req.body)

        } else if(req.query.type == 'doctor'){
            // res.status(200).send(JSON.stringify(req.body))
            result = await writeDoctorRecord(req.body)
        } else {
            result = await writeHospitalRecord(req.body)
        }
        // sendResponse()
    } catch(e){
        console.log(e)
    }
    function sendResponse() {
        res.status(200).send('success')
    }
}



module.exports = writeToMongo