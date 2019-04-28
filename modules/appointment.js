const promise = require('bluebird')
const shortId = require('shortid')
const request = require('request')
const asyncRequest = promise.promisify(request)
let connection = require('../db/mysql-connection').connection
const util = require('util')
const nonTransactionQuery = require('../db/mysql-connection').nonTransactionQuery

function appointment() {

}

appointment.prototype.initiateAppointmentBooking = async (data, callback) => {

    let appointmentDate = data.appointment_date
    let appointmentTime = data.appointment_time
    let venueId = data.venue_id
    let venueRegion = data.venue_region
    let venueName = data.venue_name
    let doctorId = data.doctor_id
    let doctorName = data.doctor_name
    let amount = data.amount
    let patientName = data.patient_name
    let patientAge = data.patient_age
    let patientContactNumber = data.patient_contact_number
    let userId = data.user_id
    let userName = data.user_name
    let userDistrict = data.user_district
    let userRegion = data.user_region
    let userContactNumber = data.user_contact_number
    let userEmailId = data.user_email_id
    let paymentMode = data.payment_mode
    let productId = appointmentDate + '-' + appointmentTime
    let referenceId = data.reference_id
    let paymentStatus = 'CASH'

    let bookingId = shortId.generate()
    let today = new Date()
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    let bookingDateTime = date + ' ' + time
    let result = ''


    let startTransaction = 'START TRANSACTION'
    let commitTransaction = 'COMMIT'
    let rollbackTransaction = 'ROLLBACK'
    let checkBookingStatementStatus = 'select max_cash_count, current_cash_count, max_prepaid_count, current_prepaid_count from count_status where appointment_date = "' + appointmentDate +
        '" and venue_id="' + venueId + '" and doctor_id = "' + doctorId + '" and appointment_time="' + appointmentTime + '" for update'

    let bookingStatement = "INSERT INTO booking_details VALUES('" + bookingId + "','" + bookingDateTime + "','" + venueId + "','" + venueName + "','" +
        venueRegion + "','" + appointmentDate + "','" + appointmentTime + "','" + doctorId + "','" + doctorName + "','" + userId + "','" +
        userName + "','" + userDistrict + "','" + userRegion + "','" + userContactNumber + "','" + userEmailId + "','" + patientName
        + "'," + patientAge + ",'" + patientContactNumber + "','" + paymentMode + "'," + amount + ",'" + paymentStatus + "','" + productId + "','" + referenceId + "')"

    let userToBookingStatement = "INSERT INTO user_to_booking VALUES('" + userId + "','" + appointmentDate + "','" + bookingId + "')"

    let venueToBookingStatement = "INSERT INTO venue_to_booking VALUES('" + appointmentDate + "','" + venueId + "','" + doctorId + "','" + appointmentTime + "','" + bookingId + "')"


    let query = await createConnection()

    try {
        await query(startTransaction)
        let statusResult = await query(checkBookingStatementStatus)
        let statusData = {}
        statusData.queueCount = 0

        if (paymentMode == 'CASH') {

            let maxCashCount = 0
            statusResult.forEach(element => {
                statusData.queueCount = element.current_cash_count
                maxCashCount = element.max_cash_count

            })
            if (statusData.queueCount < maxCashCount) {

                statusData.queueCount += 1

                let updateBookingStatusStatement = 'UPDATE count_status SET current_cash_count=' + statusData.queueCount + ' where appointment_date = "' + appointmentDate +
                    '" and venue_id="' + venueId + '" and doctor_id = "' + doctorId + '" and appointment_time="' + appointmentTime + '"'
                // console.log(bookingStatement)
                await query(updateBookingStatusStatement)
                result = await query(bookingStatement)
                await query(userToBookingStatement)
                await query(venueToBookingStatement)
                await query(commitTransaction)

            } else {
                await query(rollbackTransaction)
                result = 'All Seat Reserved For Cash, Try Using Any Prepaid Method'
            }
            callback(null, result)

        } else {
            let maxPrepaidCount = 0
            statusResult.forEach(element => {
                statusData.queueCount = element.current_prepaid_count
                maxPrepaidCount = element.max_prepaid_count

            })

            if (statusData.queueCount < maxPrepaidCount) {

                statusData.queueCount += 1

                let updateBookingStatusStatement = 'UPDATE count_status SET current_prepaid_count=' + statusData.queueCount + ' where appointment_date = "' + appointmentDate +
                    '" and venue_id="' + venueId + '" and doctor_id = "' + doctorId + '" and appointment_time="' + appointmentTime + '"'

                await query(startTransaction)
                await query(updateBookingStatusStatement)
                await query(commitTransaction)
                result = "Temporary Seat Reserved"

            } else {
                await query(rollbackTransaction)
                result = 'All Seat Reserved Try For Other Timing'
            }
            callback(null, result)
        }
    } catch (err) {
        await query(rollbackTransaction)
        callback(err, null)
    }

}

appointment.prototype.verifyPaymentAndBook = async (data, callback) => {


    let appointmentDate = data.appointment_date
    let appointmentTime = data.appointment_time
    let venueId = data.venue_id
    let venueRegion = data.venue_region
    let venueName = data.venue_name
    let doctorId = data.doctor_id
    let doctorName = data.doctor_name
    let amount = data.amount
    let patientName = data.patient_name
    let patientAge = data.patient_age
    let patientContactNumber = data.patient_contact_number
    let userId = data.user_id
    let userName = data.user_name
    let userDistrict = data.user_district
    let userRegion = data.user_region
    let userContactNumber = data.user_contact_number
    let userEmailId = data.user_email_id
    let paymentMode = data.payment_mode
    let productId = appointmentDate + '-' + appointmentTime
    let referenceId = data.reference_id
    let paymentStatus = 'PAID'

    let bookingId = shortId.generate()
    let today = new Date()
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    let bookingDateTime = date + ' ' + time
    let result = ''



    let startTransaction = 'START TRANSACTION'
    let commitTransaction = 'COMMIT'
    let rollbackTransaction = 'ROLLBACK'

    let checkBookingStatementStatus = 'select max_cash_count, current_cash_count, max_prepaid_count, current_prepaid_count from count_status where appointment_date = "' + appointmentDate +
        '" and venue_id="' + venueId + '" and doctor_id = "' + doctorId + '" and appointment_time="' + appointmentTime + '" for update'


    let userToBookingStatement = "INSERT INTO user_to_booking VALUES('" + userId + "','" + appointmentDate + "','" + bookingId + "')"

    let venueToBookingStatement = "INSERT INTO venue_to_booking VALUES('" + appointmentDate + "','" + venueId + "','" + doctorId + "','" + appointmentTime + "','" + bookingId + "')"


    let query = await createConnection()

    try {
        let options = {
            method: 'GET',
            url: 'https://ir-user.esewa.com.np/epay/transrec',
            qs:
            {
                rid: referenceId,
                pid: productId,
                amt: '10',
                scd: 'test-merchant' //add this to config 
            }
        }

        let responseFromEsewaVerification = await asyncRequest(options)
        let responseFromEsewaVerificationString = String(responseFromEsewaVerification.body)

        let bookingStatement = "INSERT INTO booking_details VALUES('" + bookingId + "','" + bookingDateTime + "','" + venueId + "','" + venueName + "','" +
            venueRegion + "','" + appointmentDate + "','" + appointmentTime + "','" + doctorId + "','" + doctorName + "','" + userId + "','" +
            userName + "','" + userDistrict + "','" + userRegion + "','" + userContactNumber + "','" + userEmailId + "','" + patientName
            + "'," + patientAge + ",'" + patientContactNumber + "','" + paymentMode + "'," + amount + ",'" + paymentStatus + "','" + productId + "','" + referenceId + "')"
        //start transaction session
        await query(startTransaction)

        if (responseFromEsewaVerificationString.includes('failure')) {
            let statusResult = await query(checkBookingStatementStatus)
            let statusData = {}
            statusData.queueCount = 0
            statusResult.forEach(element => {
                statusData.queueCount = element.current_prepaid_count

            })
            statusData.queueCount -= 1

            let updateBookingStatusStatement = 'UPDATE count_status SET current_prepaid_count=' + statusData.queueCount + ' where appointment_date = "' + appointmentDate +
                '" and venue_id="' + venueId + '" and doctor_id = "' + doctorId + '" and appointment_time="' + appointmentTime + '"'
            //update count_status for failed payment
            await query(updateBookingStatusStatement)
            await query(commitTransaction)
            result = 'Booking Failed Because Of Payment Failure'

        } else {
            result = await query(bookingStatement)
            await query(userToBookingStatement)
            await query(venueToBookingStatement)
            await query(commitTransaction)
            console.log('payment success')
        }



        callback(null, result)
    } catch (err) {
        await query(rollbackTransaction)
        callback(err, null)
    }

}


appointment.prototype.ignoreBook = async (bookingInfo, callback) => {
    let appointmentDate = bookingInfo.appointment_date
    let venueId = bookingInfo.venue_id
    let doctorId = bookingInfo.doctor_id
    let appointmentTime = bookingInfo.appointment_time
    let maxCashCount = bookingInfo.max_cash_count
    let currentCashCount = bookingInfo.current_cash_count
    let maxPrepaidCount = bookingInfo.max_prepaid_count
    let currentPrepaidCount = bookingInfo.current_prepaid_count

    let insertIgnoreCount = "INSERT IGNORE INTO count_status VALUES('" + appointmentDate + "','" + venueId +
        "','" + doctorId + "','" + appointmentTime + "'," + maxCashCount + "," + currentCashCount + "," +
        maxPrepaidCount + "," + currentPrepaidCount + ")"

    try {
        let result = await nonTransactionQuery(insertIgnoreCount)
        callback(null, result)

    } catch (err) {
        callback(err, null)

    }
}

appointment.prototype.showBookingDetails = async (data, callback) => {
    let userType = data.type
    let id = data.id
    let appointmentDate = data.appointment_date
    let table
    if (userType == 'hospital') {
        table = 'hospital_to_booking'
    } else {
        table = 'user_to_booking'
    }

    let showBookingIdsStatement = "SELECT * FROM " + table + " where id='" + id + "' and appointment_date='" + appointmentDate + "'"
    console.log(showBookingIdsStatement)
    try {
        let hospitalToBooking = await nonTransactionQuery(showBookingIdsStatement)
        let bookingId = []
        hospitalToBooking.forEach(element => {
            bookingId.push(element.booking_id)
        })
        let bookingIdWithCommaSeparated = bookingId.join(',')
        let inString = '\'' + bookingIdWithCommaSeparated.split(',').join('\',\'') + '\''
        let showBookingDetailsStatement = "SELECT * FROM booking_details where booking_id IN(" + inString + ")"
        let bookingDetails = await nonTransactionQuery(showBookingDetailsStatement)
        callback(null, bookingDetails)
    } catch (err) {
        console.log("showbookingDetails error", err)
        callback(err, null)
    }
}


appointment.prototype.cancelBooking = async (data, callback) => {

    let userId = data.user_id
    let bookingId = data.booking_id
    let venueId = data.venue_id
    let bookingDateTime = data.booking_date_time
    let doctorId = data.doctor_id
    let appointmentDate = data.appointment_date
    let appointmentTime = data.appointment_time
    let doctorName = data.doctor_name
    let hospitalName = data.hospital_name
    let amount = data.amount
    let userName = data.user_name
    let paymentMode = data.payment_mode
    let patientNumber = data.patient_number
    let patientName = data.patient_name
    let age = data.age
    let patientAddress = data.patientAddress
    let userPhoneNumber = data.user_phone_number
    let userEmailId = data.user_email_id
    let patientPhoneNumber = data.patient_phone_number
    let patientEmailId = data.patient_email_id
    let maxCount = data.max_count
    var today = new Date()
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    var dateTime = date + ' ' + time
    let bookingStatus = 'CANCEL'

    let deleteFromUserToBookingQuery = "DELETE FROM user_to_booking WHERE user_id = '" + userId + "'"
    let deleteFromHospitalToBookingQuery = "DELETE FROM user_to_booking WHERE venue_id = '" + venueId + "'"
    let bookingStatement = "INSERT INTO booking_details VALUES('" + bookingId + "','" + bookingDateTime + "','" + doctorId + "','" + venueId + "','" +
        userId + "','" + appointmentDate + "'," + appointmentTime + ",'" + doctorName + "','" + hospitalName + "'," + amount + ",'" + userName + "','" + paymentMode + "'," + patientNumber + ",'" +
        patientName + "'," + age + ",'" + patientAddress + "','" + userPhoneNumber + "','" + userEmailId + "','" + patientPhoneNumber + "','" + patientEmailId + "'," + maxCount + ",'" + bookingStatus + "','" + dateTime + "')"

    try {

        //if these two deleteFromHospitalToBookingQuery deleteFromUserToBookingQuery functions get succeded then execute bookingStatement
        await nonTransactionQuery(deleteFromHospitalToBookingQuery)
        await nonTransactionQuery(deleteFromUserToBookingQuery)
        await nonTransactionQuery(bookingStatement)

    } catch (err) {

    }
}

// /////////////////////CREATE CONNECTION FOR TRANSATIONAL QUERIES/////////////////////////////

function createConnection() {
    connection.getConnection((err) => {
        if (err) {
            console.log('not connected to mysql', err)
        } else {
            console.log('connected to mysql')
        }
    })

    const query = util.promisify(connection.query).bind(connection);
    return query

}


module.exports = appointment