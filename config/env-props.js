'use strict'
 var environmentStrings = {}

 environmentStrings.APP_ENVIRONMENT_PROPERTY_NAME = 'TIER'

 environmentStrings.environmentPropertyNames = {
     PRODUCTION: 'production',
     DEVELOPMENT: 'development',
     TEST: 'test'
 }


environmentStrings.DEFAULT_ENVIRONMENT = environmentStrings.environmentPropertyNames.TEST

module.exports = environmentStrings