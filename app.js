var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs')
const zod = require('zod')

const { Pool } = require('pg');
var app = express();
app.use(express.json())


/* to import .json file directly,
 you have to use require and directly send it to swaggerUI.Setup */

const swaggerDocument = require('./docs/swagger.json');

 
/* Fir YAML you have to declare a const swaggerDefination and passed that here,
  --> You need to load the yaml file using YAML.laod('path to yaml file')
    and pass that into SwaggerUi.setup

  const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API routes folder
};

const swaggerSpec = swaggerJSDoc(options);
*/



app.use('/apis', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const exp = require('constants');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: '2107',
  port: 5433, // default PostgreSQL port
});


// Test PostgreSQL connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL at:', result.rows[0].now);
  }
});


// app.get('/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching data from PostgreSQL:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

process.on('exit', () => pool.end());


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


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




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
