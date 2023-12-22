const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const usersQueries = require('./server/usersQueries');
const projectsQueries = require('./server/projectsQueries');
const bugsQueries = require('./server/bugsQueries');
const app = express();
const port = 3000;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt')

const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');

require('dotenv').config();

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(
  
  bodyParser.urlencoded({
    extended: true
  }),
  
  session({
    secret: process.env.secret_key,
    resave: false,
    saveUninitialized: false
  })

  );

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
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