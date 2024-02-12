/*
  File: routes.js
  Description: This file defines the routes and middleware for the BugBridge project.
               It handles user authentication, authorization, and API calls for users, projects, and bugs tables.
               The file also sets up CSRF protection for form submissions and renders HTML views for various routes.
  Author: Lilith Ashbury
  Date: 2/12/2024

  Dependencies:
    - Express.js
    - csurf
    - cookie-parser

  Middleware Functions:
    - authenticationMiddleware: Middleware function for user authentication.
    - groupAuthorizationMiddleware: Middleware function for group-based authorization.
    - csrfProtect: Middleware function for CSRF protection.

  Routes:
    - GET '/': Renders login page or main menu based on user authentication and group.
    - GET '/register': Renders user registration page.
    - GET '/bugForm': Renders bug submission form.
    - GET '/projectForm': Renders project creation form.
    - GET '/userForm': Renders user creation form.
    - GET '/logout': Logs out the user and redirects to the login page.
    - GET '/users': API endpoint to get all users.
    - GET '/users/:id': API endpoint to get user by ID.
    - GET '/users/:username': API endpoint to get user by username.
    - POST '/users': API endpoint to create a new user.
    - POST '/login': API endpoint to log in a user.
    - PUT '/users/:id': API endpoint to update user information.
    - GET '/userTable': API endpoint to load users table.
    - GET '/userGroups/login/:id': API endpoint to get user groups by user ID.
    - GET '/projects': API endpoint to get all projects.
    - GET '/projects/:id': API endpoint to get project by ID.
    - POST '/projects': API endpoint to create a new project.
    - PUT '/projects/:id': API endpoint to update project information.
    - GET '/projectTable': API endpoint to load projects table.
    - GET '/bugs': API endpoint to get all bugs.
    - GET '/bugs/:bug_id': API endpoint to get bug by ID.
    - GET '/bugs/status/:status': API endpoint to get bugs by status.
    - GET '/bugs/:project_id': API endpoint to get bugs by project ID.
    - POST '/bugs/': API endpoint to create a new bug.
    - PUT '/bugs/:bug_id': API endpoint to update bug information.
    - GET '/bugTable': API endpoint to load bugs table.
*/

// usersQueries.js, projectsQueries.js, bugsQueries.js house the functions where all the API calls are handled.
const usersQueries = require('./usersQueries');
const projectsQueries = require('./projectsQueries');
const bugsQueries = require('./bugsQueries');

const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const router = express.Router();

/*
  The csrfProtect works by generating a toke and passing it through to a specific form. Look at the bugForm (line 121)
  The route is set up to use the csrfProtect middleware.
  Line 122, res.render('bugForm', { csrfToken: req.csrfToken() });, renders bugForm.ejs and sends the csrf token. 
  The route that the form actually calls when it is submitted also needs to be set up to take the csrfProtect middleware. 
  All in all the csrf token is generated, sent to the form, then sent back when the form is submitted to ensure it is authentic.
*/

router.use(cookieParser());
const csrfProtect = csrf({ cookie: true });

// The authenticationMiddleware function uses the passport.js function isAuthenticated to check if the user has logged in
// If they have logged in then it continues through the route, but if not it redirects them to the login page.
function authenticationMiddleware () {  
	return (req, res, next) => {

	    if (req.isAuthenticated()){ 
        console.log('-User is authenticated')
        return next(); }
	    
      else { res.redirect('/') }
	}
}

// The groupAuthorizationMiddleware taked in a specific group that is allowed to access the desired API call.
// It checks if the currently logged in users specific groups matches that group, and if so it allows them through. 
// Else if will return them to the main menu.
function groupAuthorizationMiddleware (authedGroup) {
  return (req, res, next) => {
    const user_groups = req.session.passport.user.user_groups;
    const foundObject = user_groups.find(obj => obj.name === authedGroup);
    if (foundObject) {
      console.log("-User is authorized with group: " + authedGroup);
      return next();
    } else { 
      console.log("-User is not authorized with group:" + authedGroup); 
      res.redirect('/') 
    }
  }
}

router.get('/', csrfProtect, (req, res) => {
  console.log("-Testing for user object in GET / " + req.user);
  console.log("-Testing isAuthenticated() in GET / " + req.isAuthenticated());
  if(!req.user) {
    res.render('login', { csrfToken: req.csrfToken() });
  } else {
    console.log(`-req.session.passport.user in '/' route: ${JSON.stringify(req.session.passport.user)}`);
    const user_groups = req.session.passport.user.user_groups;
    if (user_groups.find(obj => obj.name === 'admin')) {
      console.log(`-User with id ${req.session.passport.user.user_id} logged into admin main menu.`);
      res.render('main_menu_admins');
    } else if (user_groups.find(obj => obj.name === 'user')) {
      console.log(`-User with id ${req.session.passport.user.user_id} logged into user main menu.`);
      res.render('main_menu');
    }
  } 
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/bugForm', csrfProtect, groupAuthorizationMiddleware('user'), authenticationMiddleware(), (req, res) => {
  res.render('bugForm', { csrfToken: req.csrfToken() });
});

router.get('/projectForm', csrfProtect, groupAuthorizationMiddleware('admin'), authenticationMiddleware(), (req, res) => {
  res.render('projectForm', { csrfToken: req.csrfToken() });
});

router.get('/userForm', csrfProtect, groupAuthorizationMiddleware('admin'), authenticationMiddleware(), (req, res) => {
  res.render('userForm', { csrfToken: req.csrfToken() });
});

router.get('/logout', authenticationMiddleware(), (req, res) => {
  req.session.destroy();
  console.log("-User logged out.");
  res.redirect('/');
})

router.get('/users', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUsers);
router.get('/users/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUserById);
router.get('/users/:username', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUserByUsername);
router.post('/users', csrfProtect, usersQueries.createUser);
router.post('/login', csrfProtect, usersQueries.loginUser);
router.put('/users/:id', groupAuthorizationMiddleware('admin'), csrfProtect, authenticationMiddleware(), usersQueries.updateUser);
// Unused delete user API call
// router.delete('/users/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.deleteUser);
router.get('/userTable', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.loadUsersTable);
router.get('/userGroups/login/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUserGroupsById);

router.get('/projects', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.getProjects);
router.get('/projects/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.getProjectById);
router.post('/projects', groupAuthorizationMiddleware('admin'), csrfProtect, authenticationMiddleware(), projectsQueries.createProject);
router.put('/projects/:id', groupAuthorizationMiddleware('admin'), csrfProtect, authenticationMiddleware(), projectsQueries.updateProject);
// Unused delete project API call
// router.delete('/projects/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.deleteProject);
router.get('/projectTable', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.loadProjectsTable);

router.get('/bugs', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getAllBugs);
router.get('/bugs/:bug_id', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getBugsById);
router.get('/bugs/status/:status', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getBugsByStatus);
router.get('/bugs/:project_id', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getBugsByProjectId);
router.post('/bugs/', groupAuthorizationMiddleware('user'), csrfProtect, authenticationMiddleware(), bugsQueries.createBug);
router.put('/bugs/:bug_id', groupAuthorizationMiddleware('user'), csrfProtect, authenticationMiddleware(), bugsQueries.updateBug);
router.get('/bugTable', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.loadBugsTable);

module.exports = router;
