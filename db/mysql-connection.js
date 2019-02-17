'use strict'

const config = require('../config/index').db
const promise = require('bluebird')
const dbConfig = config.MYSQLCONFIG
const mysql = require('mysql')
const util = require('util')

let connection

//connect to mysql db
(async function connecToMysql() {
    let host = dbConfig.HOST
    let database = dbConfig.DATABASE
     connection = mysql.createPool({
        insecureAuth : true,
        connectionLimit : 10,
        host: '127.0.0.1',
        user: 'root',
        password: 'mysqlpw',
        database: database
          })
          

      connection.getConnection((err) =>{
          if(err){
              console.log('not connected to mysql',err)
          } else{
              console.log('connected to mysql')
          }
      })

})()

// connection.query = util.promisify(connection.query).bind(connection)
const nonTransactionQuery = util.promisify(connection.query).bind(connection);

// connection.query('select * from count_status',(err,res)=>{
//     if(err){
//         console.log('error',err)
//     } else{
//         console.log('result',res)
//     }
// })

// (async () => {
//     try {
//       const rows = await query('select count(*) as count from count_status');
//       console.log(rows);
//     } catch(er) {
//         console.log('go error',er)
//     } 
//     // finally{
//     //     client.end();

//     // }
//   })()

module.exports = {
    connection,
    nonTransactionQuery
}