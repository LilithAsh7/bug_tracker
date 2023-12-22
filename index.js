const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const usersQueries = require('./server/usersQueries');
const projectsQueries = require('./server/projectsQueries');
const path = require('path');
const bugsQueries = require('./server/bugsQueries');
const app = express();
const port = 3000;
const passport = require("passport");
const initializePassport = require('./server/passport-config');

require('dotenv').config();
initializePassport(passport);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.urlencoded({extended: true}))

app.use(
  session({
    secret: process.env.secret_key,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    response.render('login');
  })

    app.get('/users', usersQueries.getUsers);
    app.get('/users/:id', usersQueries.getUserById);
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

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })