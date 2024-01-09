// Importing and creating new instance of Pool class
// The pg library is a postgres client for node
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bug_tracker',
  password: 'postgres',
  port: 5432,
});

const loadBugsTable = (request, response) => {
  response.render('dashboard');
}

// API call for getting all data from the bugs table
const getAllBugs = (request, response) => {
  // Actual sql code  
  pool.query("SELECT * FROM bugs WHERE status <> 'inactive' ORDER BY project_id ASC, CASE WHEN status = 'pending' THEN 0 ELSE 1 END, status ASC, bug_type ASC, CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END", (error, results) => {
    // Error handling  
    if (error) {
        throw error
      }
      // Returns all rows gotten by get request
      response.status(200).json(results.rows)
  })
};

// API call for getting all data from the bugs table
const getBugsByStatus = (request, response) => {
  
  const bug_status = (request.params.status);
  if (bug_status === 'all'){
    pool.query("SELECT * FROM bugs WHERE status <> 'inactive' ORDER BY project_id ASC, CASE WHEN status = 'pending' THEN 0 ELSE 1 END, status ASC, bug_type ASC, CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END", (error, results) => {
      // Error handling  
      if (error) {
          throw error
        }
        // Returns all rows gotten by get request
        response.status(200).json(results.rows)
    })
  } else {
    // Actual sql code  
    pool.query("SELECT * FROM bugs WHERE status = $1 ORDER BY project_id ASC, bug_type ASC, CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END", [bug_status], (error, results) => {
      // Error handling  
      if (error) {
          throw error
        }
        // Returns all rows gotten by get request
        response.status(200).json(results.rows)
    })
  }
};

  // API call for getting specific bug by ID from bugs table
const getBugsById = (request, response) => {
  // ID of specific bug you want the data from
  const bug_id = parseInt(request.params.bug_id)
  // Works similarly to getBugs()
  pool.query('SELECT * FROM bugs WHERE bug_id = $1', [bug_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// API call for creating an entry into the bugs table
const createBug = (request, response) => {
  // Variables to fill each field
  const { bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason } = request.body
  // Constructs sql code
  pool.query('INSERT INTO bugs ( bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', 
  [bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    response.status(201).send(`Bug added with ID: ${results.rows[0].bug_id}`)
  })
}

// API call for updating an entry into the bug table
const updateBug = (request, response) => {
  // ID of specific but to be updated
  const bug_id = parseInt(request.params.bug_id)
  // Variables to fill each field
  const { bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason } = request.body
  // Constructs sql code
  pool.query(
    'UPDATE bugs SET bug_type = $2, bug_description = $3, file = $4, line = $5, priority = $6, status = $7, user_id = $8, project_id = $9, fixer_notes = $10, reason = $11 WHERE bug_id = $1',
    [bug_id, bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason],
    // Error handling
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Bug modified with ID: ${bug_id}`)
    }
  )
}

// API call for deleting entry in bug table
const deleteBug = (request, response) => {
  //ID of specific bug to be deleted
  const bug_id = parseInt(request.params.bug_id)
  // Constructs sql code
  pool.query('DELETE FROM bugs WHERE bug_id = $1', [bug_id], (error, results) => {
    //Error handling
    if (error) {
      throw error
    }
    response.status(200).send(`Bug deleted with ID: ${bug_id}`)
  })
}

// API call for deleting entry in bug table
const setBugToInactive = (request, response) => {
  //ID of specific bug to be deleted
  const bug_id = parseInt(request.params.bug_id)
  // Constructs sql code
  pool.query("UPDATE bugs SET status = 'inactive' WHERE bug_id = $1",
    [bug_id], (error, results) => {
    //Error handling
    if (error) {
      throw error
    }
    response.status(200).send(`Bug with ID ${bug_id} set to inactive.`)
  })
}

// Exporting API calls
module.exports = {
    getAllBugs,
    getBugsByStatus,
    getBugsById,
    createBug,
    updateBug, 
    deleteBug,
    setBugToInactive,
    loadBugsTable
  };