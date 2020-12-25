var express = require('express');
var session = require('express-session');
var cors = require('cors');
var errorhandler = require('errorhandler');
var mongoose = require('mongoose');
var CONF = require('./config');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
require('./models/Article');
require('./models/Comment');
// require('./config/passport');

app.use(require('./routes'));

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: { // API informations (required)
    title: 'Auth Service', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Auth API' // Description (optional)
  },
  host: 'localhost:3000', // Host (optional)
  basePath: '/' // Base path (optional)
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: ['./routes/api/*.js'] // api 파일 위치들 
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
