var express = require('express')
var cors = require('cors')
var env = require('./env');
var usersRoute = require('./app/general/users/usersRoute');
var gestaoPrecosRoute = require('./app/routes/gestaoPrecosRoute');
var lumiRoute = require('./app/routes/lumiRoute');
var appController = require('./app/controllers/appController');
var mainRoute = require('./app/general/main/mainRoute');
//var uploadRoute = require('./app/routes/uploadRoute');
//var adminRoute = require('./app/routes/adminRoute');


var app = express();

app.use('/static', express.static(__dirname + '/public'));

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
/* app.get('/', function(req, res) {
  res.status(200).send(
    {client:'BIG BOX',
    operator:'PRICEPOINT',
    status:'SUCESSO'
})
}); */

// about page 
/* app.get('/about', function(req, res) {
  var page = {title:'ABOUT'}
  res.render('pages/about',{page:page});
}); */

//ROTAS DO APLICATIVO
/* app.get('/gestao-precos', async function(req, res) {
  var page = await appController.page()
  console.log('a pgina é...')
  console.log(JSON.stringify(page))
  res.render('pages/gestao-precos',{page:page});
}); */


//ROTAS DA API

//app.use('/api/v1/files/upload', uploadRoute);
//app.use('/api/v1', adminRoute);
//app.use('/api/v1', tripRoute);
app.use('/api/v1', gestaoPrecosRoute);
app.use('/api/v2', mainRoute);
app.use('/api', lumiRoute);
app.use('/api/users', usersRoute);
//app.use('/api/v1', bookingRoute);


app.listen('5566').on('listening', () => {
  //console.log(`🚀 are live on port 5566`);
});


module.exports = app;
