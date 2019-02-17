const promise = require('bluebird')
// const query = require('../db/mysql-connection').query
const appointment = require('../modules/appointment')
const APPOINTMENT = new appointment()
const initiateAppointmentBooking = promise.promisify(APPOINTMENT.initiateAppointmentBooking)

async function bookAppointment(req, res) {

    let data = req.body
    let result
    let isBooked
    try{
        isBooked = await initiateAppointmentBooking(data)
        console.log("booking route",isBooked)

    }catch(err) {
        console.log("not available")
        // console.log(err)
        isBooked=err
    }
    
    sendResponse(isBooked)

    function sendResponse(result) {
        res.status(200).send(result)
    }
}

module.exports = bookAppointment