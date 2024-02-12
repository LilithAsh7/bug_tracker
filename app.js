/*
  File: app.js
  Description: This file initializes and configures the Express application for Bug Bridge.
               It sets up an HTTPS server with secure connections using SSL/TLS certificates.
               The application utilizes Passport.js for authentication with authorization managed through PostgreSQL, 
               which includes group-based access control specified in a dedicated table defining the relationship between 
               user IDs and groups. Static files are served using Express static middleware.
               CORS is enabled to allow cross-origin requests. Additionally, it configures Content Security Policy (CSP)
               to mitigate various types of attacks such as Cross-Site Scripting (XSS).
  Author: Lilith Ashbury
  Date: 2/12/2024

  Dependencies:
    - Express.js
    - Passport.js
    - Helmet
    - Cors
    - Express-session
    - Cookie-parser
    - Body-parser
    - Connect-pg-simple
    - PostgreSQL
    - Path
    - dotenv
    - pg

  Environment Variables:
    - app_port: Port on which the Express.js server listens.
    - db_user: PostgreSQL database username.
    - db_host: PostgreSQL database host.
    - db_name: PostgreSQL database name.
    - db_password: PostgreSQL database password.
    - db_port: PostgreSQL database port.
    - secret_key: Secret key used for session encryption.
    - ssl_private_key: Private key for your ssl certification.
    - ssl_cert: ssl certificate.

*/

const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const passport = require("passport");
const helmet = require("helmet");
const cors = require('cors');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
require('dotenv').config();
const indexRouter = require('./server/index');
const Pool = require('pg').Pool

app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'"],
    },
  })
);

app.use(cors());
const port = process.env.app_port;

const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_name,
  password: process.env.db_password,
  port: process.env.db_port
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

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
      httpOnly: true,
      secure: true
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

/*
const certificate = fs.readFileSync('/etc/letsencrypt/live/bugbridge.duckdns.org/cert.pem', 'utf8');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/bugbridge.duckdns.org/privkey.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
*/

const sslCertPath = process.env.ssl_cert;
const sslPrivateKeyPath = process.env.ssl_private_key;

const certificate = fs.readFileSync(sslCertPath, 'utf8');
const privateKey = fs.readFileSync(sslPrivateKeyPath, 'utf8');
const credentials = { key: privateKey, cert: certificate };


const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`-App started and running on port ${port}.`)
})
