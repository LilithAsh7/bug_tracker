// API call files
const usersQueries = require('./usersQueries');
const projectsQueries = require('./projectsQueries');
const bugsQueries = require('./bugsQueries');
const express = require('express');
const router = express.Router();

function authenticationMiddleware () {  
	return (req, res, next) => {

	    if (req.isAuthenticated()){ 
        console.log('-User is authenticated')
        return next(); }
	    
      else { res.redirect('/') }
	}
}

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

// Renders login page upon visiting http://localhost:3000
router.get('/', (req, res) => {
  console.log("-Testing for user object in GET / " + req.user);
  console.log("-Testing isAuthenticated() in GET / " + req.isAuthenticated());
  if(!req.user) {
    res.render('login');
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

router.get('/bugForm', groupAuthorizationMiddleware('user'), authenticationMiddleware(), (req, res) => {
  res.render('bugForm');
});

router.get('/projectForm', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), (req, res) => {
  res.render('projectForm');
});

router.get('/userForm', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), (req, res) => {
  res.render('userForm');
});

router.get('/logout', authenticationMiddleware(), (req, res) => {
  req.session.destroy();
  console.log("-User logged out.");
  res.redirect('/');
})

// Sets up api calls for use in router
router.get('/users', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUsers);
router.get('/users/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUserById);
router.get('/users/:username', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUserByUsername);
router.post('/users', usersQueries.createUser);
router.post('/login', usersQueries.loginUser);
router.put('/users/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.updateUser);
router.delete('/users/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.deleteUser);
router.get('/userTable', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.loadUsersTable);
router.get('/userGroups/login/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUserGroupsById);

router.get('/projects', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.getProjects);
router.get('/projects/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.getProjectById);
router.post('/projects', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.createProject);
router.put('/projects/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.updateProject);
router.delete('/projects/:id', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.deleteProject);
router.get('/projectTable', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.loadProjectsTable);

router.get('/bugs', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getAllBugs);
router.get('/bugs/:bug_id', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getBugsById);
router.get('/bugs/status/:status', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getBugsByStatus);
router.post('/bugs/', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.createBug);
router.put('/bugs/:bug_id', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.updateBug);
router.put('/bugs/inactive/:bug_id', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.setBugToInactive);
router.delete('/bugs/:bug_id', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.deleteBug);
router.get('/bugTable', groupAuthorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.loadBugsTable);

module.exports = router;