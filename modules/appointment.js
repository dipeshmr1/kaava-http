const promise = require('bluebird')
// const query = require('../db/mysql-connection').query
let connection = require('../db/mysql-connection').connection
const util = require('util')
const nonTransactionQuery = require('../db/mysql-connection').nonTransactionQuery


function appointment() {

}

appointment.prototype.initiateAppointmentBooking = async (data, callback) => {

    let appointmentDate = data.appointment_date
    let venueId = data.venue_id
    let doctorId = data.doctor_id
    let appointmentTime = data.appointment_time
    let maxCashCount = data.max_cash_count
    let hospitalName = data.hospital_name
    let doctorName = data.doctor_name
    let amount = data.amount
    let paymentMode = data.payment_mode
    let patientNumber
    let patientName = data.patient_name
    let age = data.patient_age
    let patientAddress = data.patient_address
    let userId = data.user_id
    let userName = data.user_name
    let userPhoneNumber = data.user_phone_number
    let userEmailId = data.user_email_id
    let patientPhoneNumber = data.patient_phone_number
    let patientEmailId = data.patient_email_id
    
    let bookingId = '1003'
    var today = new Date()
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    var bookingDateTime = date + ' ' + time
    let bookingStatus = 'BOOKED'
    let dateTime = bookingDateTime
    
    let startTransaction = 'start transaction'
    let checkBookingStatementStatus = 'select max_cash_count, current_cash_count, max_prepaid_count, current_prepaid_count from count_status where appointment_date = "' + appointmentDate +
        '" and venue_id="' + venueId + '" and doctor_id = "' + doctorId + '" and appointment_time="' + appointmentTime + '" for update'

    // let bookingStatement = "INSERT INTO booking_details VALUES('" + bookingId + "','" + bookingDateTime + "','" + doctorId + "','" + venueId + "','" +
    //                 userId + "','" + appointmentDate + "'," + appointmentTime + ",'" + doctorName + "','" + hospitalName + "'," + amount + ",'" + userName + "','" + paymentMode + "'," + patientNumber + ",'" +
    //                 patientName + "'," + age + ",'" + patientAddress + "','" + userPhoneNumber + "','" + userEmailId + "','" + patientPhoneNumber + "','" + patientEmailId + "',"+maxCount+",'"+bookingStatus+"','"+dateTime+"')"
    
    let userToBookingStatement = "INSERT INTO user_to_booking VALUES('" + userId + "','" + appointmentDate + "','" + bookingId + "')"
    
    let venueToBookingStatement = "INSERT INTO venue_to_booking VALUES('" + appointmentDate + "','" + venueId + "','" + doctorId + "','" + appointmentTime +  "','" + bookingId + "')"
               

    // let executeBookingStatement = 'INSERT INTO booking_table values('+"'"+bookingId+"','"++","+

    if (paymentMode == 'cash') {
        let query = await createConnection()

        try {
            let statusResult = await query(checkBookingStatementStatus)
            let statusData = {}
            statusData.queueCount = 0
            statusResult.forEach(element => {
                statusData.queueCount = element.current_cash_count
    
            })
            if (statusData.queueCount < maxCashCount) {

                statusData.queueCount += 1

                let updateBookingStatusStatement = 'UPDATE count_status SET current_cash_count=' + statusData.queueCount + ' where appointment_date = "' + appointmentDate +
                '" and venue_id="' + venueId + '" and doctor_id = "' + doctorId + '" and appointment_time="' + appointmentTime + '"'
    
                await query(startTransaction)
                await query(updateBookingStatusStatement)
                await query('commit')
                // await nonTransactionQuery(bookingStatement)
                await nonTransactionQuery(userToBookingStatement)
                await nonTransactionQuery(venueToBookingStatement)
                result ="booked"
    
            } else {
                await query('rollback')
                result = 'queue full'
            }
            // console.log("query result", )
            // result = null
            callback(null, result)
    
        } catch (err) {
            await query('rollback')
            console.log("query error", err)
            callback(err, null)
        }

    }


    

}


appointment.prototype.ignoreBook = async (bookingInfo, callback) => {
    let appointmentDate = bookingInfo.appointment_date
    let venueId = bookingInfo.venue_id
    let doctorId = bookingInfo.doctor_id
    let appointmentTime = bookingInfo.appointment_time
    let maxCashCount = bookingInfo.max_cash_count
    let currentCashCount = bookingInfo.current_cash_count
    let maxTotalCount = bookingInfo.max_total_count
    let currentTotalCount = bookingInfo.current_total_count

    let insertIgnoreCount = "INSERT IGNORE INTO count_status VALUES('" + appointmentDate + "','" + venueId +
        "','" + doctorId + "','" + appointmentTime + "'," + maxCashCount + "," + currentCashCount + "," + 
        maxTotalCount + ","+ currentTotalCount + ")"

    // let insertIgnoreCount = "select * from count_status where appointment_date='2018-01-13' and venue_id='venue-1' and doctor_id='doctor-1' and appointment_time='630' for update"
    try {
        // let query = await createConnection()
        // await query('start transaction')
        console.log(insertIgnoreCount)
        let result = await nonTransactionQuery(insertIgnoreCount)
        callback(null, result)
    } catch (err) {
        callback(err, null)
    }

}

appointment.prototype.showBookingDetails = async(data, callback) =>{
    let userType = data.type
    let id = data.id
    let appointmentDate = data.appointment_date
    let table
    if(userType == 'hospital'){
        table = 'hospital_to_booking'
    } else{
        table = 'user_to_booking'
    }

    let showBookingIdsStatement = "SELECT * FROM "+table+" where id='"+id+"' and appointment_date='"+appointmentDate+"'"
    try{
        let hospitalToBooking = await query(showBookingIdsStatement)
        let bookingId = []
        hospitalToBooking.forEach(element => {
            bookingId.push(element.booking_id)
        })
        let inString = bookingId.join(',')
        let showBookingDetailsStatement = "SELECT * FROM booking_details where booking_id IN("+inString+")"
        let bookingDetails = await query(showBookingDetailsStatement)
        callback(null, bookingDetails)
    }catch(err){
        console.log("showbookingDetails error",err)
        callback(err, null)
    }
}


appointment.prototype.cancelBooking = async(data, callback)=>{

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

    let deleteFromUserToBookingQuery = "DELETE FROM user_to_booking WHERE user_id = '"+userId+"'"
    let deleteFromHospitalToBookingQuery = "DELETE FROM user_to_booking WHERE venue_id = '"+venueId+"'"
    let bookingStatement = "INSERT INTO booking_details VALUES('" + bookingId + "','" + bookingDateTime + "','" + doctorId + "','" + venueId + "','" +
                userId + "','" + appointmentDate + "'," + appointmentTime + ",'" + doctorName + "','" + hospitalName + "'," + amount + ",'" + userName + "','" + paymentMode + "'," + patientNumber + ",'" +
                patientName + "'," + age + ",'" + patientAddress + "','" + userPhoneNumber + "','" + userEmailId + "','" + patientPhoneNumber + "','" + patientEmailId + "',"+maxCount+",'"+bookingStatus+"','"+dateTime+"')"

    try{

        //if these two deleteFromHospitalToBookingQuery deleteFromUserToBookingQuery functions get succeded then execute bookingStatement
        await query(deleteFromHospitalToBookingQuery)
        await query(deleteFromUserToBookingQuery)
        await query(bookingStatement)
       
    }catch(err){

    }
}

function createConnection(){
    connection.getConnection((err) =>{
        if(err){
            console.log('not connected to mysql',err)
        } else{
            console.log('connected to mysql')
        }
    })

    const query = util.promisify(connection.query).bind(connection);
    return query

}


module.exports = appointment