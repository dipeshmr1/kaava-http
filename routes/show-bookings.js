const promise = require('bluebird')
const appointment = require('../modules/appointment')
const APPOINTMENT = new appointment()
const showBookingDetails = promise.promisify(APPOINTMENT.showBookingDetails)

async function showBooking(req, res){
    let type = req.query.type
    let data = req.body
    data.type = type

    try{
        result = await showBookingDetails(data)
        sendResponse(result)
        
    } catch(err){
        result = err
        sendResponse(result)
    }

    function sendResponse(result) {
        res.status(200).send(JSON.stringify(result))
    }
}

module.exports = showBooking