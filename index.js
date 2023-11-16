const express = require('express')
const bodyParser = require('body-parser')
const db = require('./server/queries')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

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
    app.get('/bugs/:project_id', db.getBugsByProjectId);


  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })