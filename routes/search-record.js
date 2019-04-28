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
        body: {
            "query": {
                "bool": {
                    "must": { "match": { "district": "banke" } },

                    "must": [
                        { "wildcard": { "name": `*${searchPrefix}*` } }
                    ]
                }
            }
        },
        json: true
    };

    await request(options, function (error, response, body) {
        if (error) throw new Error(error)
        else {
            console.log(body.hits.hits)
            sendResponse(body.hits.hits)
        }
    })
    function sendResponse(result) {
        res.status(200).send(JSON.stringify(result))
    }
}

async function searchRecordByService(req, res) {

    let service = req.params.key
    console.log(service)
    var options = {
        method: 'GET',
        url: 'http://localhost:9200/hospitals/hospital/_search',
        headers:
        {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        },
        body: {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match":
                                { "services": service}
                        },
                        {
                            "match":
                                { "district": "banke" }
                        }
                    ]
                }
            }
        },
        json: true
    };

    await request(options, function (error, response, body) {
        if (error) throw new Error(error)
        else {
            console.log(body.hits.hits)
            sendResponse(body.hits.hits)
        }
    })
    function sendResponse(result) {
        res.status(200).send(JSON.stringify(result))
    }

}

async function searchRecordBySpeciality(req, res) {

    let speciality = req.params.key
    console.log(speciality)
    var options = {
        method: 'GET',
        url: 'http://localhost:9200/doctors/doctor/_search',
        headers:
        {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        },
        body: {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match":
                                { "specialities": speciality }
                        },
                        {
                            "match":
                                { "district": "banke" }
                        }
                    ]
                }
            }
        },
        json: true
    };

    await request(options, function (error, response, body) {
        if (error) throw new Error(error)
        else {
            console.log(body.hits.hits)
            sendResponse(body.hits.hits)
        }
    })

    function sendResponse(result) {
        res.status(200).send(JSON.stringify(result))
    }

}



module.exports = {
    searchRecord,
    searchRecordByService,
    searchRecordBySpeciality
}