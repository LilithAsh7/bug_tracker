// Express app
const express = require('express');
const app = express();
const port = 3000;
// Passport module for authentication and authorization
const passport = require("passport");
const helmet = require("helmet");
//const crypto = require('crypto');
//const nonce = crypto.randomBytes(16).toString('base64');

app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);


// Session module for authorization and authentication
const session = require("express-session");
const cookieParser = require('cookie-parser');
// For parsing body api requests
const bodyParser = require('body-parser');
const pgSession = require('connect-pg-simple')(session);
// Module for working with file paths
const path = require('path');
require('dotenv').config();
const indexRouter = require('./server/index');

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_name,
  password: process.env.db_password,
  port: process.env.db_port
});

// Setting app to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Using path module to allow static files
// This removes compatibility issues with ejs and css files
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
//Setting up cookies so that authentication can be kept track of
app.use(
  session({
    store: new pgSession({
      pool,
      tablename: 'session'
    }),
    secret: process.env.secret_key,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 86400000,
      httpOnly: true
      // secure: true (This line to be uncommented after going to a https connection.)
    }
  })
);

//Initializes passport and sets it up to use session
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

//Starts the application listening for api calls
app.listen(port, () => {
  console.log(`-App started and running on port ${port}.`)
})