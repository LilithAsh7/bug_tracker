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

const validator = require('validator');

const loadProjectsTable = (req, res) => {
  res.render('projectTable');
}

// API call for getting all data from the projects table
const getProjects= (req, res) => {
// Actual sql code  
  pool.query('SELECT * FROM projects ORDER BY id ASC', (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

// API call for getting specific project by ID from projects table
const getProjectById = (req, res) => {
  //ID of specific project to get
  if (validator.isNumeric(req.params.id)) {
    const id = parseInt(req.params.id)
    // Constructing sql code
    pool.query('SELECT * FROM projects WHERE id = $1', [id], (error, results) => {
      // Error handling
      if (error) {
        throw error
      }
      // Returns rows gotten by sql code
      res.status(200).json(results.rows)
      })
  } else { return; }
}

// API call for creating an entry in the project table
const createProject = (req, res) => {
  // Variables to be put into fields
  const { name } = req.body;
  // Constructs sql code
  pool.query('INSERT INTO projects (name) VALUES ($1) RETURNING *', [name], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    // Returns res that lets the user know an entry has been made
    res.status(201).send(`Project added with ID: ${results.rows[0].id}`)
  })
}

// API call to edit/update entry in projects table
const updateProject = (req, res) => {
  // ID of specific entry to be updated
  const id = parseInt(req.params.id)
  // Variables to be inserted into fields
  const { name } = req.body
  // Constructs sql code
  pool.query(
    'UPDATE projects SET name = $1 WHERE id = $2',
    [name, id],
    // Error handling
    (error, results) => {
      if (error) {
        throw error
      }
      // Returns res that lets the user know that the entry with specified ID has been edited
      res.status(200).send(`Project modified with ID: ${id}`)
    }
  )
}

// API call for deleting entry in projects table
const deleteProject = (req, res) => {
  // ID of specific project to be deleted
  const id = parseInt(req.params.id)
  // Constructs sql code
  pool.query('DELETE FROM projects WHERE id = $1', [id], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    // Returns res that lets user know that the entry with specific ID has been deleted
    res.status(200).send(`Project deleted with ID: ${id}`)
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