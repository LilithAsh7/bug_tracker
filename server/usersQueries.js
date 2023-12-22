const Pool = require('pg').Pool
const bcrypt = require('bcrypt')
const saltRounds = 10;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bug_tracker',
  password: 'postgres',
  port: 5432,
});

// User table queries

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
    const { id, username, password } = request.body;

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            throw err;
        }

        pool.query('INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *', [id, username, hashedPassword], (error, results) => {
            if (error) {
                throw error;
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        });
    });
};

const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const { username, password } = request.body;
  
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        throw err;
      }
  
      pool.query(
        'UPDATE users SET username = $1, password = $2 WHERE id = $3',
        [username, hashedPassword, id],
        (error, results) => {
          if (error) {
            response.status(500).send('Error updating user.');
          } else {
            response.status(200).send(`User modified with ID: ${id}`);
          }
        }
      );
    });
};

  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }

  module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  };