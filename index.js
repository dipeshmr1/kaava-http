const nr = require('newrelic')
const express = require('express')
const mustacheExpress = require('mustache-express');
const app = express()
const passport = require('passport')

// const mongoClient = require('./db/mongo-connection')
// const elasticClient = require('./db/elastic-connection')



initializeMiddlewares()
initializeRoutes()
app.listen(8000, () => console.log('Example app listening on port'))




function initializeMiddlewares() {
  const bodyParser = require('body-parser')
  const session = require('express-session');
  const flash = require('connect-flash');



  // pass passport for configuration
  require('./config/passport')(passport)

  // required for passport
  app.use(session({
    secret: 'iloveyousanvritti', // session secret
    resave: true,
    saveUninitialized: true
  }))

  //initialize passport
  app.use(passport.initialize())

  // persistent login sessions
  app.use(passport.session())

  // use connect-flash for flash messages stored in session
  app.use(flash())

  app.use(express.static('kava/public'));

  app.use(bodyParser.json());

  // Add headers
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next();
  })

}


function initializeRoutes() {

  const writeRecord = require('./routes/write-record')
  const bookAppointment = require('./routes/book-appointment')
  const searchRecord = require('./routes/search-record')
  const insertCount = require('./routes/insert-count-status')
  const showBookingDetails = require('./routes/show-bookings')
  const getProfileDetails = require('./routes/get-profile')



  app.get('/auth/facebook', passport.authenticate('facebook', { session: false }))

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/'
    }));

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', { session: true }),
    (req, res) => {
      //will send user object with all details
      res.send(req.user)

    });


  app.get('/', isLoggedIn, getHomePage)

  app.get('/search', (req, res) => {
    res.send('searching')
  })

  function getHomePage(req, res) {
    res.send("yo this is homepage")

  }




  //Write record into mongo
  app.post('/write-to-mongo', writeRecord)

  //book an appointment
  app.post('/book-appointment', bookAppointment)

  //search doctors,hospitals by filtering on services, specialities
  app.get('/search-record/:key', searchRecord)

  //insert 0 count to count_status
  app.get('/insert-ignore-count', insertCount)

  //show booking details 
  app.post('/show-bookings', showBookingDetails)

  //get profile
  app.get('/get-profile', getProfileDetails)
}

function isLoggedIn(req, res, next) {

  // console.log(req)
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.send("lol");
}
