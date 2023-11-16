const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bug_tracker',
  password: 'postgres',
  port: 5432,
})

// Queries for users table

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const createUser = (request, response) => {
    const { id, username, password } = request.body
  
    pool.query('INSERT INTO users (id, username, password) VALUES ($1,$2, $3) RETURNING *', [id, username, password], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
  }

  const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { username, password } = request.body
  
    pool.query(
      'UPDATE users SET username = $1, password = $2 WHERE id = $3',
      [username, password, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }

  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }

  // Queries for projects table

  const getProjects= (request, response) => {
    pool.query('SELECT * FROM projects ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getProjectById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM projects WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const createProject = (request, response) => {
    const { id, name, user_id } = request.body
  
    pool.query('INSERT INTO projects (id, name, user_id) VALUES ($1,$2, $3) RETURNING *', [id, name, user_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Project added with ID: ${results.rows[0].id}`)
    })
  }

  const updateProject = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, user_id } = request.body
  
    pool.query(
      'UPDATE projects SET name = $1, user_id = $2 WHERE id = $3',
      [name, user_id, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Project modified with ID: ${id}`)
      }
    )
  }

  const deleteProject = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM projects WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Project deleted with ID: ${id}`)
    })
  }

  // Queries for bugs table

  const getBugs = (request, response) => {
    pool.query('SELECT * FROM bugs ORDER BY bug_id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  };

  const getBugsByProjectId = (request, response) => {
    const project_id = parseInt(request.params.project_id)
    
    pool.query('SELECT * FROM bugs WHERE project_id = $1', [project_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

  module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getBugs,
    getBugsByProjectId
  };