var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs')

require('dotenv').config()

var app = express();
app.use(express.json())


/* to import .json file directly,
 you have to use require and directly send it to swaggerUI.Setup */

 
/* Fir YAML you have to declare a const swaggerDefination and passed that here,
  --> You need to load the yaml file using YAML.laod('path to yaml file')
    and pass that into SwaggerUi.setup

  const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API routes folder
};

const swaggerSpec = swaggerJSDoc(options);
*/


const swaggerDocument = require('./docs/swagger.json');

app.use('/apis', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/', indexRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
