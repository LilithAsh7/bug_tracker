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

function authorizationMiddleware (authedGroup) {
  return (req, res, next) => {
    console.log(`req.session.passport.user.user_groups in authorization Middleware: ${JSON.stringify(req.session.passport.user.user_groups)}`);
    const user_groups = req.session.passport.user.user_groups;
    const foundObject = user_groups.find(obj => obj.name === authedGroup);
    if (foundObject) {
      console.log("User is authorized with group: " + authedGroup);
      return next();
    } else{ 
      console.log("User is not authorized with group:" + authedGroup); 
      res.redirect('/main_menu') 
    }
  }
}

// Renders login page upon visiting http://localhost:3000
router.get('/', (request, response) => {
  console.log("Testing for user in GET / " + request.user);
  console.log("isAuthenticated() in GET / " + request.isAuthenticated());
    response.render('login');
  });

router.get('/main_menu', authenticationMiddleware(), (request, response) => {
  response.render('main_menu')
})

  router.get('/register', (request, response) => {
      response.render('register');
  });

router.get('/bugForm', authorizationMiddleware('user'), authenticationMiddleware(), (request, response) => {
  response.render('bugForm');
});

router.get('/projectForm', authorizationMiddleware('admin'), authenticationMiddleware(), (request, response) => {
  response.render('projectForm');
});

router.get('/userForm', authorizationMiddleware('admin'), authenticationMiddleware(), (request, response) => {
  response.render('userForm');
});

router.get('/logout', authenticationMiddleware(), (request, response) => {
  request.session.destroy();
  response.redirect('/');
})

// Sets up api calls for use in router
router.get('/users', authorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUsers);
router.get('/users/:id', authorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUserById);
router.get('/users/:username', authorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUserByUsername);
router.post('/users', usersQueries.createUser);
router.post('/login', usersQueries.loginUser);
router.put('/users/:id', authorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.updateUser);
router.delete('/users/:id', authorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.deleteUser);
router.get('/userTable', authorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.loadUsersTable);
router.get('/userGroups/login/:id', authorizationMiddleware('admin'), authenticationMiddleware(), usersQueries.getUserGroupsById);

router.get('/projects', authorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.getProjects);
router.get('/projects/:id', authorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.getProjectById);
router.post('/projects', authorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.createProject);
router.put('/projects/:id', authorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.updateProject);
router.delete('/projects/:id', authorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.deleteProject);
router.get('/projectTable', authorizationMiddleware('admin'), authenticationMiddleware(), projectsQueries.loadProjectsTable);

router.get('/bugs', authorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getAllBugs);
router.get('/bugs/:bug_id', authorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getBugsById);
router.get('/bugs/status/:status', authorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.getBugsByStatus);
router.post('/bugs/', authorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.createBug);
router.put('/bugs/:bug_id', authorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.updateBug);
router.put('/bugs/inactive/:bug_id', authorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.setBugToInactive);
router.delete('/bugs/:bug_id', authorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.deleteBug);
router.get('/bugTable', authorizationMiddleware('user'), authenticationMiddleware(), bugsQueries.loadBugsTable);

module.exports = router;