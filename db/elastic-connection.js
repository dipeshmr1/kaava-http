'use strict' 

const config = require('../config/index').db
const dbConfig = config.ELASTICCONFIG
const elasticsearch = require('elasticsearch')

let client

(async function connectToElasticSearch() {

    let host = dbConfig.HOST
    let port = dbConfig.PORT
    let username = dbConfig.USERNAME
    let password = dbConfig.PASSWORD
    let url = host+':'+port+"'"
    client = new elasticsearch.Client({
        host: url,
        log: 'trace'
    })


    client.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: 1000
      }, function (error) {
        if (error) {
          console.trace('elasticsearch cluster is down!');
        } else {
          console.log('All is well');
        }
      })
     
})()

module.exports = client
