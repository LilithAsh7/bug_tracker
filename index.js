// Express app
const express = require('express');
const app = express();
const port = 3000;
// Passport module for authentication and authorization
const passport = require("passport");
const initializePassport = require('./server/passport-config');
// Session module for keeping track of sessions
const session = require("express-session");
// For parsing body api requests
const bodyParser = require('body-parser');
// API call files
const usersQueries = require('./server/usersQueries');
const projectsQueries = require('./server/projectsQueries');
const bugsQueries = require('./server/bugsQueries');
// Module for working with file paths
const path = require('path');


// dotenv is for variables that should be kept seperate for security
require('dotenv').config();
initializePassport(passport);

// Setting app to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Using path module to allow static files
// This removes compatibility issues with ejs and css files
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

//Setting up cookies so that authentication can be kept track of
app.use(
  session({
    secret: process.env.secret_key,
    resave: false,
    saveUninitialized: false
  })
);

//Initializes passport and sets it up to use session
app.use(passport.initialize());
app.use(passport.session());

// Renders login page upon visiting http://localhost:3000
app.get('/', (request, response) => {
    response.render('login');
  });

app.get('/bugForm', (request, response) => {
  // Add authenticated check here
  response.render('bugForm');
})

app.get('/updateBug', (request, response) => {
  // Add authenticated check here
  response.render('updateBug');
})

// Sets up api calls for use in app
app.get('/users', usersQueries.getUsers);
app.get('/users/:id', usersQueries.getUserById);
app.get('/users/:username', usersQueries.getUserByUsername);
app.post('/users', usersQueries.createUser);
app.post('/login', usersQueries.loginUser);
app.put('/users/:id', usersQueries.updateUser);
app.delete('/users/:id', usersQueries.deleteUser);
app.get('/projects', projectsQueries.getProjects);
app.get('/projects/:id', projectsQueries.getProjectById);
app.post('/projects', projectsQueries.createProject);
app.put('/projects/:id', projectsQueries.updateProject);
app.delete('/projects/:id', projectsQueries.deleteProject);
app.get('/bugs', bugsQueries.getBugs);
app.get('/bugs/:bug_id', bugsQueries.getBugsById);
app.post('/bugs/', bugsQueries.createBug);
app.put('/bugs/:bug_id', bugsQueries.updateBug);
app.delete('/bugs/:bug_id', bugsQueries.deleteBug);

//Starts the application listening for api calls
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})