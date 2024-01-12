// Express app
const express = require('express');
const app = express();
const port = 3000;
// Passport module for authentication and authorization
const passport = require("passport");
// Session module for authorization and authentication
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

// Setting app to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Using path module to allow static files
// This removes compatibility issues with ejs and css files
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
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

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()){ return next(); }
	    
      else { res.redirect('/') }
	}
}

// Renders login page upon visiting http://localhost:3000
app.get('/', (request, response) => {
  console.log("Testing for user in GET / " + request.user);
  console.log("isAuthenticated() in GET / " + request.isAuthenticated());
    response.render('login');
  });

app.get('/main_menu', authenticationMiddleware(), (request, response) => {
  response.render('main_menu')
})

  app.get('/register', (request, response) => {
      response.render('register');
  });

app.get('/bugForm', authenticationMiddleware(), (request, response) => {
  response.render('bugForm');
});

app.get('/projectForm', authenticationMiddleware(), (request, response) => {
  response.render('projectForm');
});

app.get('/userForm', authenticationMiddleware(), (request, response) => {
  response.render('userForm');
});

app.get('/logout', (request, response) => {
  request.session.destroy();
  response.redirect('/');
})

// Sets up api calls for use in app
app.get('/users', authenticationMiddleware(), usersQueries.getUsers);
app.get('/users/:id', authenticationMiddleware(), usersQueries.getUserById);
app.get('/users/:username', authenticationMiddleware(), usersQueries.getUserByUsername);
app.post('/users', authenticationMiddleware(), usersQueries.createUser);
app.post('/login', usersQueries.loginUser);
app.put('/users/:id', authenticationMiddleware(), usersQueries.updateUser);
app.delete('/users/:id', authenticationMiddleware(), usersQueries.deleteUser);
app.get('/userTable', authenticationMiddleware(), usersQueries.loadUsersTable);

app.get('/projects', authenticationMiddleware(), projectsQueries.getProjects);
app.get('/projects/:id', authenticationMiddleware(), projectsQueries.getProjectById);
app.post('/projects', authenticationMiddleware(), projectsQueries.createProject);
app.put('/projects/:id', authenticationMiddleware(), projectsQueries.updateProject);
app.delete('/projects/:id', authenticationMiddleware(), projectsQueries.deleteProject);
app.get('/projectTable', authenticationMiddleware(), projectsQueries.loadProjectsTable);

app.get('/bugs', authenticationMiddleware(), bugsQueries.getAllBugs);
app.get('/bugs/:bug_id', authenticationMiddleware(), bugsQueries.getBugsById);
app.get('/bugs/status/:status', authenticationMiddleware(), bugsQueries.getBugsByStatus);
app.post('/bugs/', authenticationMiddleware(), bugsQueries.createBug);
app.put('/bugs/:bug_id', authenticationMiddleware(), bugsQueries.updateBug);
app.put('/bugs/inactive/:bug_id', authenticationMiddleware(), bugsQueries.setBugToInactive);
app.delete('/bugs/:bug_id', authenticationMiddleware(), bugsQueries.deleteBug);
app.get('/bugTable', authenticationMiddleware(), bugsQueries.loadBugsTable);

//Starts the application listening for api calls
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})