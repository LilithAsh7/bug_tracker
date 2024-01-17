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

const loadBugsTable = (request, response) => {
  response.render('bugTable');
}

const bugAuthorizationMiddleware = (request, response, next) => {
  const bug_id = parseInt(request.params.bug_id);

  pool.query("SELECT * FROM bugs WHERE bug_id = $1", [bug_id], (error, result) => {
    if (error) {
      throw error;
    }

    const bugProjectId = result.rows[0].project_id;
    console.log("bugProjectId: " + bugProjectId);
    const bug = result.rows[0];

    if (!bug) {
      // Bug not found
      return response.status(404).json({ error: 'Bug not found' });
    }

    const userProjects = request.session.passport.user.user_projects;
    console.log(userProjects)
    const authorizedProject = userProjects.find(project => project.id === bugProjectId);

    if (!authorizedProject) {
      // User is not authorized to access this bug
      console.log("Unauthorized for this bug, loser.");
      return response.redirect('/');
    }
    next();
  });
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
  const user_id = request.session.passport.user.user_id;
  if (bug_status === 'all'){
      pool.query("SELECT bugs.* FROM bugs JOIN users_projects ON bugs.project_id = users_projects.project_id WHERE users_projects.user_id = $1 AND bugs.status <> 'inactive' ORDER BY project_id ASC, CASE WHEN status = 'pending' THEN 0 ELSE 1 END, status ASC, bug_type ASC, CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END", [user_id], (error, results) => {  
      // Error handling  
      if (error) {
          throw error
        }
        // Returns all rows gotten by get request
        response.status(200).json(results.rows)
    })
  } else {
    // Actual sql code  
    pool.query("SELECT bugs.* FROM bugs JOIN users_projects ON bugs.project_id = users_projects.project_id WHERE users_projects.user_id = $1 AND bugs.status = $2 ORDER BY project_id ASC, bug_type ASC, CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END", [user_id, bug_status], (error, results) => {
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
  bugAuthorizationMiddleware(request, response, () => {
    // ID of specific bug you want the data from
    const bug_id = parseInt(request.params.bug_id)
    const user_id = request.session.passport.user.user_id;
    // Works similarly to getBugs()
    pool.query("SELECT bugs.* FROM bugs JOIN users_projects ON bugs.project_id = users_projects.project_id WHERE users_projects.user_id = $1 AND bugs.status <> 'inactive' AND bug_id = $2", [user_id, bug_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}

// API call for creating an entry into the bugs table
const createBug = (request, response) => {
  // Variables to fill each field
  const { bug_type, bug_description, file, line, priority, status, project_id, fixer_notes, reason } = request.body
  const user_id = request.session.passport.user.user_id;
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
  const user_id = request.session.passport.user.user_id;
  // Variables to fill each field
  const { bug_type, bug_description, file, line, priority, status, project_id, fixer_notes, reason } = request.body
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