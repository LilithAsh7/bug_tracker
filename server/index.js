// API call files
const usersQueries = require('./usersQueries');
const projectsQueries = require('./projectsQueries');
const bugsQueries = require('./bugsQueries');
const express = require('express');
const router = express.Router();

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user in authentication Middleware: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()){ return next(); }
	    
      else { res.redirect('/') }
	}
}

function groupAuthorizationMiddleware (authedGroup) {
  return (req, res, next) => {
    console.log(`req.session.passport.user.user_groups in authorization Middleware: ${JSON.stringify(req.session.passport.user.user_groups)}`);
    const user_groups = req.session.passport.user.user_groups;
    const foundObject = user_groups.find(obj => obj.name === authedGroup);
    if (foundObject) {
      console.log("User is authorized with group: " + authedGroup);
      return next();
    } else { 
      console.log("User is not authorized with group:" + authedGroup); 
      res.redirect('/main_menu') 
    }
  }
}

// Renders login page upon visiting http://localhost:3000
router.get('/', (request, response) => {
  console.log("Testing for user in GET / " + request.user);
  console.log("isAuthenticated() in GET / " + request.isAuthenticated());
  if(!request.user) {
    response.render('login');
  } else {
    const user_groups = request.session.passport.user.user_groups;
    if (user_groups.find(obj => obj.name === 'admin')) {
      response.render('main_menu_admins');
    } else if (user_groups.find(obj => obj.name === 'user')) {
      response.render('main_menu');
    }
  } 
});

router.get('/main_menu', authenticationMiddleware(), (request, response) => {
  response.render('main_menu')
})

  router.get('/register', (request, response) => {
      response.render('register');
  });

router.get('/bugForm', groupAuthorizationMiddleware('user'), authenticationMiddleware(), (request, response) => {
  response.render('bugForm');
});

router.get('/projectForm', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), (request, response) => {
  response.render('projectForm');
});

router.get('/userForm', groupAuthorizationMiddleware('admin'), authenticationMiddleware(), (request, response) => {
  response.render('userForm');
});

router.get('/logout', authenticationMiddleware(), (request, response) => {
  request.session.destroy();
  response.redirect('/');
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