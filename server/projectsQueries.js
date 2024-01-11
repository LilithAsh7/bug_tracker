// Importing and creating new instance of Pool class
// The pg library is a postgres client for node
const Pool = require('pg').Pool
require('dotenv').config();
const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_name,
  password: process.env.db_password,
  port: process.env.db_port
});

const loadProjectsTable = (request, response) => {
  response.render('projectTable');
}

// API call for getting all data from the projects table
const getProjects= (request, response) => {
// Actual sql code  
  pool.query('SELECT * FROM projects ORDER BY id ASC', (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// API call for getting specific project by ID from projects table
const getProjectById = (request, response) => {
  //ID of specific project to get
  const id = parseInt(request.params.id)
  // Constructing sql code
  pool.query('SELECT * FROM projects WHERE id = $1', [id], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    // Returns rows gotten by sql code
    response.status(200).json(results.rows)
  })
}

// Working code for getting projects that correspond to user_id
  /*
  const getProjectByCurrentUserId = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM projects WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
*/

// API call for creating an entry in the project table
const createProject = (request, response) => {
  // Variables to be put into fields
  const { name, user_id } = request.body
  // Constructs sql code
  pool.query('INSERT INTO projects (name, user_id) VALUES ($1,$2) RETURNING *', [name, user_id], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    // Returns response that lets the user know an entry has been made
    response.status(201).send(`Project added with ID: ${results.rows[0].id}`)
  })
}

// API call to edit/update entry in projects table
const updateProject = (request, response) => {
  // ID of specific entry to be updated
  const id = parseInt(request.params.id)
  // Variables to be inserted into fields
  const { name, user_id } = request.body
  // Constructs sql code
  pool.query(
    'UPDATE projects SET name = $1, user_id = $2 WHERE id = $3',
    [name, user_id, id],
    // Error handling
    (error, results) => {
      if (error) {
        throw error
      }
      // Returns response that lets the user know that the entry with specified ID has been edited
      response.status(200).send(`Project modified with ID: ${id}`)
    }
  )
}

// API call for deleting entry in projects table
const deleteProject = (request, response) => {
  // ID of specific project to be deleted
  const id = parseInt(request.params.id)
  // Constructs sql code
  pool.query('DELETE FROM projects WHERE id = $1', [id], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    // Returns response that lets user know that the entry with specific ID has been deleted
    response.status(200).send(`Project deleted with ID: ${id}`)
  })
}

// Exporting API calls
module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  loadProjectsTable
};