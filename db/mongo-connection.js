'use strict'

const config = require('../config/index').db
const dbConfig = config.MONGOCONFIG
// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')

let client
let db

// Connect to the db
(async function connectToMongo() {
    let host = dbConfig.HOST
    let port = dbConfig.PORT
    let databse = dbConfig.DATABASE
    let url = 'mongodb://'+host+':'+port+'/'+databse
    
    try {
        client = await mongoose.connect(url, { useNewUrlParser: true })
        console.log('successfully connected to mongo')
        db = db
    } catch(e) {
        console.error(e)
    }
})()


module.exports = client