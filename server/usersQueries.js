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
// Imports bcrypt for authentication purposes
// saltRounds dictates how much power to put towards hashing
const bcrypt = require('bcrypt')
const saltRounds = 10;
const passport = require("passport");
const validator = require('validator');

// API call to get all data from users table
const getUsers = (request, response) => {
  
  console.log("isAuthenticated() in getUsers: " + request.isAuthenticated());
  // Constructs sql code
  pool.query('SELECT id, username FROM users ORDER BY id ASC', (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    //Returns response that consists of all data gotten by sql code
    response.status(200).json(results.rows)
  })
}

const loadUsersTable = (request, response) => {
  response.render('userTable');
}

// API call to get user by a specific ID
const getUserById = (request, response) => {
  
  if (validator.isNumeric(request.params.id)) {
    // Specified ID to grab
    const id = parseInt(request.params.id)
    console.log(validator.isNumeric(request.params.id))
    // Constructs sql code
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      // Error handling
      if (error) {
        throw error
      }
      // Returns all data gotten by sql code
      response.status(200).json(results.rows)
    })
  } else { return; }
}

// API call to get user by a specific username
const getUserByUsername = (request, response) => {
  // Specified username to grab
  const username = parseInt(request.params.username)
  // Constructs sql code
  pool.query('SELECT * FROM users WHERE id = $1', [username], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    // Returns all data gotten by sql code
    response.status(200).json(results.rows)
  })
}

const setDefaultRole = (user_id) => {
    pool.query('INSERT INTO user_groups (user_id, group_id) VALUES ($1, 2);', [user_id], (error, results) => {
      if (error) {
        throw error;
      } else {
        console.log("User role set");
        return;
      }
    });
  }

// API call to create entry into user database
const createUser = (request, response) => {
  // Variables to be inserted into database
  const { username, password } = request.body;
  const passwordIsDangerous = checkForSqlCharacters(password);
  const usernameIsDangerous = checkForSqlCharacters(username);
  if (!usernameIsDangerous && !passwordIsDangerous) {
    // Encrypts password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      // Error handling for bcrypt.hash function  
      if (err) {
            throw err;
      }
      // Constructs sql code
      // Note this adds the hashed password to the database, not the input password
      pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword], (error, results) => {
        // Error handling
        if (error) {
            throw error;
        }
        // Returns response that user was created with specific ID.
        setDefaultRole(results.rows[0].id)
        response.status(201).redirect('/');
      });
    });
  } else {
    console.log("DANGEROUS INPUT DETECTED ON USERNAME OR PASSWORD!");
    response.redirect('/register');
  }
};


// API call to update entry in user table
const updateUser = (request, response) => {
  // Specific ID of entry to update
  const id = parseInt(request.params.id);
  // Variables to be put into database
  const { username, password } = request.body;
  const passwordIsDangerous = checkForSqlCharacters(password);
  const usernameIsDangerous = checkForSqlCharacters(username);
  if (!usernameIsDangerous && !passwordIsDangerous) {
    // Encrypts password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      // Error handling for encryption
      if (err) {
        throw err;
      }
      // Constructs sql code
      pool.query(
        'UPDATE users SET username = $1, password = $2 WHERE id = $3',
        [username, hashedPassword, id],
        (error, results) => {
          // Error handling
          if (error) {
            response.status(500).send('Error updating user.');
          } else {
            // Returns response saying entry was modified
            response.status(200).send(`User modified with ID: ${id}`);
          }
        }
      );
    });
  } else {
    console.log("DANGEROUS INPUT DETECTED ON USERNAME OR PASSWORD!");
    return;
  }
};

// API call to delete entry from user table
const deleteUser = (request, response) => {
  // Specific id of entry to delete
  const id = parseInt(request.params.id)
  // Constructs sql code
  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    // Returns response saying that specified entry in users table was deleted
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

const getUserGroupsById = (user_id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT groups.name FROM users JOIN user_groups ON users.id = user_groups.user_id JOIN groups ON user_groups.group_id = groups.id WHERE users.id = $1', [user_id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        console.log("Results in getUserGroupsById:");
        console.log(results.rows);
        resolve(results.rows);
      }
    });
  });
};

const getUserProjectsById = (user_id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT projects.id FROM users JOIN users_projects ON users.id = users_projects.user_id JOIN projects ON users_projects.project_id = projects.id WHERE users.id = $1', [user_id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        console.log("Results in getUserProjectsById:");
        console.log(results.rows);
        resolve(results.rows);
      }
    });
  });
};

const checkForSqlCharacters = (string) => {
  if (validator.contains(string, ';') || validator.contains(string, "--") || validator.contains(string, "'")) {
    return true;
  } else { return false; }
}

// API call to authenticate user
const loginUser = async (request, response) => {
  // Variables to be checked
  const { username, password } = request.body;
  const passwordIsDangerous = checkForSqlCharacters(password);
  const usernameIsDangerous = checkForSqlCharacters(username)
  if (!usernameIsDangerous && !passwordIsDangerous) {
    // SQL query to find user with specified username
    pool.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) => {
      // Error handling
      if (error) {
        response.status(500).send("Idk what the heck happen");
      }
      // If the result is empty then it knows that no user was found
      if (results.rows.length === 0) {
        response.status(401).send('Authentication failed. User not found.');
      } else {
        
        const user_id = results.rows[0].id;
        
        // When a user is found the supplied password gets hashed
        const hashedPassword = results.rows[0].password;
        // The hased password gets compared to the one in the database
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
          // If the passwords match it loads the dashboard html page
          if (passwordMatch) {
            
            const user_groups = await getUserGroupsById(user_id);
            const user_projects = await getUserProjectsById(user_id);
            console.log('Users groups in loginUser():');
            console.log(user_groups);
            const user_object = {
              user_id: user_id,
              user_groups: user_groups,
              user_projects: user_projects
            }

            request.login(user_object, function(err) {
              response.redirect('/');
            });
          // If passwords don't match it just loads a page that said incorrect password
          } else {
            response.status(401).send('Authentication failed. Incorrect password.');
          }
      };
    });
  } else {
    console.log("DANGEROUS INPUT DETECTED ON USERNAME OR PASSWORD!");
    response.redirect('/register');
  }
}

// Serializes user object so it can be stored in the session (This stores only the users ID)
passport.serializeUser((user_id, done) => done(null, user_id));
// Deserialize user object, meaning it reverts it back to it's original state
passport.deserializeUser(async (user_id, done) => done(null, user_id));

// Exporting API calls
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUserByUsername,
  loadUsersTable,
  getUserGroupsById
};