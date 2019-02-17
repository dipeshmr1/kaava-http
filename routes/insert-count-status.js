const promise = require('bluebird')
const appointment = require('../modules/appointment')
const APPOINTMENT = new appointment()
const insertCount = promise.promisify(APPOINTMENT.ignoreBook)
const logger = require('../utils/logger')

async function insertCountStatus(req, res) {
    let data = req.body
    
    try {
        let result = await insertCount(data)
        res.status(200).send(result)

    } catch (err) {
        
        logger.error({
            ERROR_CODE: err.code,
            REFERENCE: "INSERT-COUNT-STATUS"
        })

        let errorLog = {
            ERROR_CODE: err.code,
            REFERENCE: "INSERT-COUNT-STATUS"
        }
        res.status(500).send(JSON.stringify(errorLog))

    }
}

module.exports = insertCountStatus