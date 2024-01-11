// Express app
const express = require('express');
const app = express();
const port = 3000;
// Passport module for authentication and authorization
const passport = require("passport");
const initializePassport = require('./server/passport-config');
// Session module for keeping track of sessions
const session = require("express-session");
const cookieParser = require('cookie-parser');
// For parsing body api requests
const bodyParser = require('body-parser');
// API call files
const usersQueries = require('./server/usersQueries');
const projectsQueries = require('./server/projectsQueries');
const bugsQueries = require('./server/bugsQueries');
const pgSession = require('connect-pg-simple')(session);
// Module for working with file paths
const path = require('path');
require('dotenv').config();

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_name,
  password: process.env.db_password,
  port: process.env.db_port
});


// dotenv is for variables that should be kept seperate for security
initializePassport(passport);

// Setting app to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Using path module to allow static files
// This removes compatibility issues with ejs and css files
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(passport.initialize());
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
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000}
  })
);

//Initializes passport and sets it up to use session
app.use(passport.initialize());
app.use(passport.session());

// Renders login page upon visiting http://localhost:3000
app.get('/', (request, response) => {
  console.log("Testing for user in GET / " + request.user);
  console.log("isAuthenticated() in GET / " + request.isAuthenticated());
    response.render('login');
  });

  app.get('/register', (request, response) => {
      response.render('register');
  });

app.get('/bugForm', (request, response) => {
  // Add authenticated check here
  response.render('bugForm');
});

app.get('/projectForm', (request, response) => {
  // Add authenticated check here
  response.render('projectForm');
});

app.get('/userForm', (request, response) => {
  // Add authenticated check here
  response.render('userForm');
});

// Sets up api calls for use in app
app.get('/users', usersQueries.getUsers);
app.get('/users/:id', usersQueries.getUserById);
app.get('/users/:username', usersQueries.getUserByUsername);
app.post('/users', usersQueries.createUser);
app.post('/login', usersQueries.loginUser);
app.put('/users/:id', usersQueries.updateUser);
app.delete('/users/:id', usersQueries.deleteUser);
app.get('/userTable', usersQueries.loadUsersTable);

app.get('/projects', projectsQueries.getProjects);
app.get('/projects/:id', projectsQueries.getProjectById);
app.post('/projects', projectsQueries.createProject);
app.put('/projects/:id', projectsQueries.updateProject);
app.delete('/projects/:id', projectsQueries.deleteProject);
app.get('/projectTable', projectsQueries.loadProjectsTable);

app.get('/bugs', bugsQueries.getAllBugs);
app.get('/bugs/:bug_id', bugsQueries.getBugsById);
app.get('/bugs/status/:status', bugsQueries.getBugsByStatus);
app.post('/bugs/', bugsQueries.createBug);
app.put('/bugs/:bug_id', bugsQueries.updateBug);
app.put('/bugs/inactive/:bug_id', bugsQueries.setBugToInactive);
app.delete('/bugs/:bug_id', bugsQueries.deleteBug);
app.get('/bugTable', bugsQueries.loadBugsTable);

//Starts the application listening for api calls
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})