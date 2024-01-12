// API call files
const usersQueries = require('./usersQueries');
const projectsQueries = require('./projectsQueries');
const bugsQueries = require('./bugsQueries');
const express = require('express');
const router = express.Router();

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()){ return next(); }
	    
      else { res.redirect('/') }
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

router.get('/bugForm', authenticationMiddleware(), (request, response) => {
  response.render('bugForm');
});

router.get('/projectForm', authenticationMiddleware(), (request, response) => {
  response.render('projectForm');
});

router.get('/userForm', authenticationMiddleware(), (request, response) => {
  response.render('userForm');
});

router.get('/logout', (request, response) => {
  request.session.destroy();
  response.redirect('/');
})

// Sets up api calls for use in router
router.get('/users', authenticationMiddleware(), usersQueries.getUsers);
router.get('/users/:id', authenticationMiddleware(), usersQueries.getUserById);
router.get('/users/:username', authenticationMiddleware(), usersQueries.getUserByUsername);
router.post('/users', authenticationMiddleware(), usersQueries.createUser);
router.post('/login', usersQueries.loginUser);
router.put('/users/:id', authenticationMiddleware(), usersQueries.updateUser);
router.delete('/users/:id', authenticationMiddleware(), usersQueries.deleteUser);
router.get('/userTable', authenticationMiddleware(), usersQueries.loadUsersTable);

router.get('/projects', authenticationMiddleware(), projectsQueries.getProjects);
router.get('/projects/:id', authenticationMiddleware(), projectsQueries.getProjectById);
router.post('/projects', authenticationMiddleware(), projectsQueries.createProject);
router.put('/projects/:id', authenticationMiddleware(), projectsQueries.updateProject);
router.delete('/projects/:id', authenticationMiddleware(), projectsQueries.deleteProject);
router.get('/projectTable', authenticationMiddleware(), projectsQueries.loadProjectsTable);

router.get('/bugs', authenticationMiddleware(), bugsQueries.getAllBugs);
router.get('/bugs/:bug_id', authenticationMiddleware(), bugsQueries.getBugsById);
router.get('/bugs/status/:status', authenticationMiddleware(), bugsQueries.getBugsByStatus);
router.post('/bugs/', authenticationMiddleware(), bugsQueries.createBug);
router.put('/bugs/:bug_id', authenticationMiddleware(), bugsQueries.updateBug);
router.put('/bugs/inactive/:bug_id', authenticationMiddleware(), bugsQueries.setBugToInactive);
router.delete('/bugs/:bug_id', authenticationMiddleware(), bugsQueries.deleteBug);
router.get('/bugTable', authenticationMiddleware(), bugsQueries.loadBugsTable);

module.exports = router;