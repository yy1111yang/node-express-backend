var express = require('express');
var session = require('express-session');
var cors = require('cors');
var errorhandler = require('errorhandler');
var mongoose = require('mongoose');
var CONF = require('./config');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const jwt = require('express-jwt');

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();

// cors 허용
app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));  // response time print in console
app.use(express.json());  // body-parser 기능

app.use(require('method-override')());  // PUT, DELETE METHOD 사용
app.use(express.static(__dirname + '/public'));   // 해당 디렉토리 밑의 파일들을 브라우저에서 접근할 수 있도록 해줌.

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect("mongodb://"+CONF.COSMOSDB_HOST+":"+CONF.COSMOSDB_PORT+"/"+CONF.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb", {
    auth: {
        user: CONF.COSMOSDB_USER,
        password: CONF.COSMOSDB_PASSWORD
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false
  });
} else {
  mongoose.connect("mongodb://"+CONF.COSMOSDB_HOST+":"+CONF.COSMOSDB_PORT+"/"+CONF.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb", {
    auth: {
        user: CONF.COSMOSDB_USER,
        password: CONF.COSMOSDB_PASSWORD
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false
  });
  mongoose.set('debug', true);
}

require('./models/User');
// require('./models/Article');
// require('./models/Comment');
require('./config/passport');

app.use(require('./routes'));

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// Swagger definition
const options = {
  info: {
    version: '1.0.0',
    title: 'API Swagger',
    license: {
      name: 'MIT',
    },
  },
  security: {
    BearerAuth: { 
      type: 'http',
      scheme: 'bearer',
      beforeFormat: jwt
    }
  },
  filesPattern: ['./routes/api/*.js', './models/*.js'], // Glob pattern to find your jsdoc files (it supports arrays too ['./**/*.controller.js', './**/*.route.js'])
  swaggerUIPath: '/api-docs', // SwaggerUI will be render in this url. Default: '/api-docs'
  baseDir: __dirname,
  exposeSwaggerUI: true, // Expose OpenAPI UI. Default true
  exposeApiDocs: false, // Expose Open API JSON Docs documentation in `apiDocsPath` path. Default false.
  apiDocsPath: '/v3/api-docs', // Open API JSON Docs endpoint. Default value '/v3/api-docs'.
};
expressJSDocSwagger(app)(options);
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});


// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
