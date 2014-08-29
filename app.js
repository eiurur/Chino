
/**
 * Module dependencies
 */

var express        = require('express')
  , bodyParser     = require('body-parser')
  , methodOverride = require('method-override')
  , morgan         = require('morgan')
  , session        = require('express-session')
  , SessionStore   = require('express-mysql-session')
  // , RedisStore     = require('connect-redis')
  , cookieParser   = require('cookie-parser')
  , csrf           = require('csurf')
  , routes         = require('./routes')
  , api            = require('./routes/api')
  , http           = require('http')
  , path           = require('path')
  , settings       = process.env.NODE_ENV === "production" ? require("./data/lib/production") : require("./data/lib/development")
  ;

var app = module.exports = express();

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  // app.use(express.errorHandler());
  // app.use(errorHandler);
  app.locals.pretty = true;
}

// production only
if (env === 'production') {
  // app.set('trust proxy', 1) // trust first proxy
  // sess.cookie.secure = true // serve secure cookies
}


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 2190);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = {
  host: settings.DB_HOST,
  port: 3306,
  user: settings.DB_USER,
  password: settings.DB_PASSWORD,
  database: settings.DB_NAME
};

var sesopts = {
  key: 'chino',
  secret: 'rize',
  saveUninitialized: true,
  resave: false,

  // expressのsessionでmaxAge=nullでセッションクッキー用（ブラウザを閉じたら消える）
  cookie: {
      maxAge: 3 * 60 * 60 * 1000    // 3 hours
  },
  store: new SessionStore(options)
}
app.use(session(sesopts));

////, use csrf middleware.
// app.use(csrf());
// app.use(function(req, res, next) {
//   res.locals._csrf = req.csrfToken();
//   next();
// });

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/init', api.init);

// findStoreInfo
// app.get('/api/07E6823C4CD98DF80A28DB3576182874335EC08A3E40C2D6BA1EB85541F49340/:UUID', api.findStoreInfo);

// findStoreDetail
// app.get('/api/475D6AE6B570A302F8E1F899FC45E63386h03AE28D05B0ADF6A182C14241F6838/:UUID', api.findStoreDetail);

// notifyActiveCustomer
// app.get('/api/D6251E48DF8E14B395AB25F40A9111AEA7519C2951F9F34D9D004BFE696F2C8A/:UUID/:deviceID', api.notifyActiveCustomer);

// getActiveCustomerCount
// app.get('/api/1604551369D073E19AAC0415D84D2220559EAFDAF58B0C67565059D3995DDD76/:UUID', api.getActiveCustomerCount);

// clearActives
// app.get('/api/4E0A642BAD407952C3AE5B4AAA77F17FF48ED3D2FF0F525B0265916F5043CE1D', api.clearActives);

// あとで消す
app.get('/api/findStoreInfo/:UUID', api.findStoreInfo);
app.get('/api/findStoreDetail/:UUID', api.findStoreDetail);
app.get('/api/notifyActiveCustomer/:UUID/:deviceID', api.notifyActiveCustomer);
app.get('/api/getActiveCustomerCount/:UUID', api.getActiveCustomerCount);
app.get('/api/clearActives', api.clearActives);


// client side
app.post('/api/signIn', api.signIn);
app.post('/api/signUp', api.signUp);
app.post('/api/signOut', api.signOut);
app.post('/api/isAuthenticated', api.isAuthenticated);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
