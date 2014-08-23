
/**
 * Module dependencies
 */

var express        = require('express')
  , bodyParser     = require('body-parser')
  , methodOverride = require('method-override')
  , morgan         = require('morgan')
  , routes         = require('./routes')
  , api            = require('./routes/api')
  , http           = require('http')
  , path           = require('path')
  ;

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 2190);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));

app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  // app.use(express.errorHandler());
  // app.use(errorHandler);
  app.locals.pretty = true;
}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/init', api.init);
app.get('/api/findStoreInfo/:UUID', api.findStoreInfo);
app.get('/api/findStoreDetail/:UUID', api.findStoreDetail);
app.get('/api/notifyActiveCustomer/:UUID/:deveceIDHashed', api.notifyActiveCustomer);
app.get('/api/getActiveCustomerCount/:UUID', api.getActiveCustomerCount);
// app.get('/api/notifyActiveCustomer/', api.notifyActiveCustomer);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
