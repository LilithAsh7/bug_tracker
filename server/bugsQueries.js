const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bug_tracker',
  password: 'postgres',
  port: 5432,
});

const getBugs = (request, response) => {
    pool.query('SELECT * FROM bugs ORDER BY project_id ASC, status ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  };

  const getBugsById = (request, response) => {
    const bug_id = parseInt(request.params.bug_id)
    
    pool.query('SELECT * FROM bugs WHERE bug_id = $1', [bug_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

  const createBug = (request, response) => {
    const { bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason } = request.body
  
    pool.query('INSERT INTO bugs ( bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', 
    [bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Bug added with ID: ${results.rows[0].bug_id}`)
    })
  }

  const updateBug = (request, response) => {
    const bug_id = parseInt(request.params.bug_id)
    const { bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason } = request.body
  
    pool.query(
      'UPDATE bugs SET bug_type = $2, bug_description = $3, file = $4, line = $5, priority = $6, status = $7, user_id = $8, project_id = $9, fixer_notes = $10, reason = $11 WHERE bug_id = $1',
      [bug_id, bug_type, bug_description, file, line, priority, status, user_id, project_id, fixer_notes, reason],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Bug modified with ID: ${bug_id}`)
      }
    )
  }

  const deleteBug = (request, response) => {
    const bug_id = parseInt(request.params.bug_id)
  
    pool.query('DELETE FROM bugs WHERE bug_id = $1', [bug_id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Bug deleted with ID: ${bug_id}`)
    })
  }

module.exports = {
    getBugs,
    getBugsById,
    createBug,
    updateBug, 
    deleteBug
  };