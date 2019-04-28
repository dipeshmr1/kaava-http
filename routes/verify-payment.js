const promise = require('bluebird')
// const query = require('../db/mysql-connection').query
const appointment = require('../modules/appointment')
const APPOINTMENT = new appointment()
const verifyPaymentAndBook = promise.promisify(APPOINTMENT.verifyPaymentAndBook)

async function verifyPayment(req, res) {

    let data = req.body
    try{
        let result = await verifyPaymentAndBook(data)
        res.status(200).send(result)

    }catch(err) {
        logger.error({
            ERROR_CODE: err.code,
            REFERENCE: "verify payment"
        })
        let errorLog = {
            ERROR_CODE: err.code,
            REFERENCE: "verify payment"
        }
        res.status(500).send(JSON.stringify(errorLog))
    }
    
}

module.exports = verifyPayment