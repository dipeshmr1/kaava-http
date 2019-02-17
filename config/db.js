const envProps = require('./env-props')

var env =  process.env[envProps.APP_ENVIRONMENT_PROPERTY_NAME] || envProps.DEFAULT_ENVIRONMENT
var CONNECTION = {}
var db = {}
db.MONGOCONFIG = {}
db.ELASTICCONFIG = {}
db.MYSQLCONFIG = {}

CONNECTION[envProps.environmentPropertyNames.DEVELOPMENT] = {
    
    MONGOCONFIG: {
        DATABASE: 'kaava',
        COLLECTIONS: {
            USERS: 'users',
            DOCTORS: 'doctors',
            HOSPITALS: 'hospitals',
            CLINICS: 'clinics'
        },
        HOST: 'localhost',
        PORT: 27017
    }
}

CONNECTION[envProps.environmentPropertyNames.TEST] = {

    MONGOCONFIG: {
        DATABASE: 'kaava',
        COLLECTIONS: {
            USERS: 'users',
            DOCTORS: 'doctors',
            HOSPITALS: 'hospitals',
            CLINICS: 'clinics'
        },
        HOST: '',
        PORT: 27017
    }
}

CONNECTION[envProps.environmentPropertyNames.PRODUCTION] = {

    MONGOCONFIG: {
        DATABASE: 'kaava',
        COLLECTIONS: {
            USERS: 'users',
            DOCTORS: 'doctors',
            HOSPITALS: 'hospitals',
            CLINICS: 'clinics'
        },
        HOST: '',
        PORT: 27017
    }
}

db.MONGOCONFIG.DATABASE = CONNECTION[env].MONGOCONFIG.DATABASE
db.MONGOCONFIG.COLLECTIONS = CONNECTION[env].MONGOCONFIG.COLLECTIONS
db.MONGOCONFIG.HOST = CONNECTION[env].MONGOCONFIG.HOST
db.MONGOCONFIG.PORT = CONNECTION[env].MONGOCONFIG.PORT

//////////////////////////ELASTICSEARCH/////////////////////////

CONNECTION[envProps.environmentPropertyNames.DEVELOPMENT] = {
    
    ELASTICCONFIG: {
        USERNAME: '',
        PASSWORD: '',
        HOST: 'localhost',
        PORT: 9200
    }
}

CONNECTION[envProps.environmentPropertyNames.TEST] = {

    ELASTICCONFIG: {
        USERNAME: '',
        PASSWORD: '',
        HOST: 'localhost',
        PORT: 9200
    }
}

CONNECTION[envProps.environmentPropertyNames.PRODUCTION] = {

    ELASTICCONFIG: {
        USERNAME: '',
        PASSWORD: '',
        HOST: '',
        PORT: 9200
    }
}

db.ELASTICCONFIG.USERNAME = CONNECTION[env].ELASTICCONFIG.USERNAME
db.ELASTICCONFIG.PASSWORD = CONNECTION[env].ELASTICCONFIG.PASSWORD
db.ELASTICCONFIG.HOST = CONNECTION[env].ELASTICCONFIG.HOST
db.ELASTICCONFIG.PORT = CONNECTION[env].ELASTICCONFIG.PORT

///////////////////////MYSQL////////////////////////////
CONNECTION[envProps.environmentPropertyNames.DEVELOPMENT] = {
    
    MYSQLCONFIG: {
        USERNAME: 'root',
        PASSWORD: 'mysqlpw',
        HOST: 'localhost',
        DATABASE: 'kaava'
    }
}

CONNECTION[envProps.environmentPropertyNames.TEST] = {

    MYSQLCONFIG: {
        USERNAME: '',
        PASSWORD: '',
        HOST: '',
        DATABASE: 'kaava'
    }
}

CONNECTION[envProps.environmentPropertyNames.PRODUCTION] = {

    MYSQLCONFIG: {
        USERNAME: '',
        PASSWORD: '',
        HOST: '',
        DATABASE: 'kaava'
    }
}

db.MYSQLCONFIG.USERNAME = CONNECTION[env].MYSQLCONFIG.USERNAME
db.MYSQLCONFIG.PASSWORD = CONNECTION[env].MYSQLCONFIG.PASSWORD
db.MYSQLCONFIG.HOST = CONNECTION[env].MYSQLCONFIG.HOST
db.MYSQLCONFIG.PORT = CONNECTION[env].MYSQLCONFIG.PORT
db.MYSQLCONFIG.DATABASE = CONNECTION[env].MYSQLCONFIG.DATABASE



module.exports = db