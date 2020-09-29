var express = require('express')
var cors = require('cors')
var env = require('./env');
var usersRoute = require('./app/routes/usersRoute');
var gestaoPrecosRoute = require('./app/routes/gestaoPrecosRoute');
var appController = require('./app/controllers/appController');
var path = require('path');
var jwt = require('jsonwebtoken');
//var uploadRoute = require('./app/routes/uploadRoute');
//var adminRoute = require('./app/routes/adminRoute');


var app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// set the public folder
app.use('/static', express.static(path.join(__dirname, 'public')))

// index page 
app.get('/', function(req, res) {
  var page = {title:'HOME'}
  res.render('pages/index', {page:page});
});

// about page 
app.get('/about', function(req, res) {
  var page = {title:'ABOUT'}
  res.render('pages/about',{page:page});
});

// jwt page 
app.get('/jwt', function(req, res) {
  
    // Create a new token with the username in the payload
    // and which expires 300 seconds after issue
    const jwtExpirySeconds = 300

    var obj = {
      id:'171',
      user:'BIG BOX'
    }

    const token = jwt.sign({ obj }, env.API_SECRET, {
      algorithm: "HS256",
      //expiresIn: jwtExpirySeconds,
      expiresIn: '100 years'
    })
    console.log("token:", token)
    res.send({token:token});

  
});

//ROTAS DO APLICATIVO
app.get('/gestao-precos', async function(req, res) {
  var page = await appController.page()
  console.log('a pgina é...')
  console.log(JSON.stringify(page))
  res.render('pages/gestao-precos',{page:page});
});


//ROTAS DA API

//app.use('/api/v1/files/upload', uploadRoute);
//app.use('/api/v1', adminRoute);
//app.use('/api/v1', tripRoute);
app.use('/api/v1', gestaoPrecosRoute);
//app.use('/api/v1', bookingRoute);


app.listen('5566').on('listening', () => {
  console.log(`🚀 are live on port 5566`);
});


module.exports = app;
