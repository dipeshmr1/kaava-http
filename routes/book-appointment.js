const promise = require('bluebird')
// const query = require('../db/mysql-connection').query
const appointment = require('../modules/appointment')
const APPOINTMENT = new appointment()
const initiateAppointmentBooking = promise.promisify(APPOINTMENT.initiateAppointmentBooking)
const logger = require('../utils/logger')

async function bookAppointment(req, res) {

    let data = req.body
    try{
        let result = await initiateAppointmentBooking(data)
        res.status(200).send(result)

    }catch(err) {
        logger.error({
            ERROR_CODE: err.code,
            REFERENCE: "initiate book appointment"
        })
        let errorLog = {
            ERROR_CODE: err.code,
            REFERENCE: "initiate book appointment"
        }
        res.status(500).send(JSON.stringify(errorLog))

    }
    
}

module.exports = bookAppointment