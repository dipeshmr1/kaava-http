const axios = require('axios')
const request = require('request')
const elasticClient = require('../db/elastic-connection')
const User = require('../models/user')


async function searchRecord(req, res) {

    let searchPrefix = req.params.key
    console.log(searchPrefix)
    var options = {
        method: 'GET',
        url: 'http://localhost:9200/_search',
        headers:
        {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        },
        body: { query: { prefix: { name: searchPrefix } } },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error)
        else{
            console.log(body.hits.hits)
            sendResponse(body.hits.hits)
        }
    })

    function sendResponse(result) {
        res.status(200).send(JSON.stringify(result))
    }
}

module.exports = searchRecord