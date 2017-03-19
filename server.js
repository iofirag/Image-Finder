/************* Moduls **************/
var express = require('express')

var app = express();
app.use( express.static(__dirname + '/public'));// Serve files from ./www directory


/******************** API ********************/
// Serve web application
app.get('/', function(req, res, next) {
    res.sendFile('index.html', { root: __dirname+'/public'});
});


//-------------------------------------
//// Configure server host+port
app.set('host', process.env.HOST || 'localhost');
app.set('port', process.env.PORT || 3333);

app.listen(app.get('port'), function(){
  console.log('Express server listening on ' + app.get('host') + ':' + app.get('port'));
});