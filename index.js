const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const db = require('./server/queries');
const app = express();
const port = 3000;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');

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
    secret: secret,
    resave: false,
    saveUninitialized: false
  })

  );

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

    app.get('/users', db.getUsers);
    app.get('/users/:id', db.getUserById);
    app.post('/users', db.createUser);
    app.put('/users/:id', db.updateUser);
    app.delete('/users/:id', db.deleteUser);
    app.get('/projects', db.getProjects);
    app.get('/projects/:id', db.getProjectById);
    app.post('/projects', db.createProject);
    app.put('/projects/:id', db.updateProject);
    app.delete('/projects/:id', db.deleteProject);
    app.get('/bugs', db.getBugs);
    app.get('/bugs/:bug_id', db.getBugsById);
    app.post('/bugs/', db.createBug);
    app.put('/bugs/:bug_id', db.updateBug);
    app.delete('/bugs/:bug_id', db.deleteBug);

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })