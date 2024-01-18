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
const sqlInjectionSecurity = require('./sqlInjectionSecurity')

// API call to get all data from users table
const getUsers = (req, res) => {
  
  console.log("getUsers() in usersQueries.js");
  // Constructs sql code
  pool.query('SELECT id, username FROM users ORDER BY id ASC', (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    //Returns res that consists of all data gotten by sql code
    res.status(200).json(results.rows)
  })
}

const loadUsersTable = (req, res) => {
  console.log("loadUsersTable() in usersQueries.js");
  res.render('userTable');
}

// API call to get user by a specific ID
const getUserById = (req, res) => {
  console.log("getUserById() in usersQueries.js");
  
  if (validator.isNumeric(req.params.id)) {
    // Specified ID to grab
    const id = parseInt(req.params.id)
    // Constructs sql code
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      // Error handling
      if (error) {
        throw error
      }
      // Returns all data gotten by sql code
      res.status(200).json(results.rows)
    })
  } else { return; }
}

// API call to get user by a specific username
const getUserByUsername = (req, res) => {
  console.log("getUserByUsername() in usersQueries.js");
  // Specified username to grab
  const username = parseInt(req.params.username)
  // Constructs sql code
  pool.query('SELECT * FROM users WHERE id = $1', [username], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    // Returns all data gotten by sql code
    res.status(200).json(results.rows)
  })
}

const setDefaultRole = (user_id) => {
  console.log("setDefaultRole() in usersQueries.js");
    pool.query('INSERT INTO users_groups (user_id, group_id) VALUES ($1, 2);', [user_id], (error, results) => {
      if (error) {
        throw error;
      } else {
        console.log("-User role set");
        //return;
      }
    });
  }

// API call to create entry into user database
const createUser = (req, res) => {
  console.log("createUser() in usersQueries.js");
  // Variables to be inserted into database
  const { username, password } = req.body;
  const passwordIsDangerous = sqlInjectionSecurity.checkForSqlCharacters(password);
  const usernameIsDangerous = sqlInjectionSecurity.checkForSqlCharacters(username);
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
        // Returns res that user was created with specific ID.
        setDefaultRole(results.rows[0].id)
        if(!req.isAuthenticated()) { res.status(201).redirect('/'); }
        else if (req.isAuthenticated()) { res.sendStatus(201); }
      });
    });
  } else {
    console.log("DANGEROUS INPUT DETECTED ON USERNAME OR PASSWORD!");
    res.redirect('/register');
  }
};


// API call to update entry in user table
const updateUser = (req, res) => {
  console.log("updateUser() in usersQueries.js");
  // Specific ID of entry to update
  const id = parseInt(req.params.id);
  // Variables to be put into database
  const { username, password } = req.body;
  const passwordIsDangerous = sqlInjectionSecurity.checkForSqlCharacters(password);
  const usernameIsDangerous = sqlInjectionSecurity.checkForSqlCharacters(username);
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
            res.status(500).send('Error updating user.');
          } else {
            // Returns res saying entry was modified
            res.status(200).send(`User modified with ID: ${id}`);
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
const deleteUser = (req, res) => {
  console.log("deleteUser() in usersQueries.js");
  // Specific id of entry to delete
  const id = parseInt(req.params.id)
  // Constructs sql code
  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    // Error handling
    if (error) {
      throw error
    }
    // Returns res saying that specified entry in users table was deleted
    res.status(200).send(`User deleted with ID: ${id}`)
  })
}

const getUserGroupsById = (user_id) => {
  console.log("getUserGroupsbyId() in usersQueries.js");
  return new Promise((resolve, reject) => {
    pool.query('SELECT groups.name FROM users JOIN users_groups ON users.id = users_groups.user_id JOIN groups ON users_groups.group_id = groups.id WHERE users.id = $1', [user_id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
};

const getUserProjectsById = (user_id) => {
  console.log("getUserProjectsById() in usersQueries.js");
  return new Promise((resolve, reject) => {
    pool.query('SELECT projects.id FROM users JOIN users_projects ON users.id = users_projects.user_id JOIN projects ON users_projects.project_id = projects.id WHERE users.id = $1', [user_id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
};

// API call to authenticate user
const loginUser = async (req, res) => {
  console.log("loginUser() in usersQueries.js");
  // Variables to be checked
  const { username, password } = req.body;
  const passwordIsDangerous = sqlInjectionSecurity.checkForSqlCharacters(password);
  const usernameIsDangerous = sqlInjectionSecurity.checkForSqlCharacters(username)
  if (!usernameIsDangerous && !passwordIsDangerous) {
    // SQL query to find user with specified username
    pool.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) => {
      // Error handling
      if (error) {
        res.status(500).send("Idk what the heck happen");
      }
      // If the result is empty then it knows that no user was found
      if (results.rows.length === 0) {
        res.status(401).send('Authentication failed. User not found.');
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
            const user_object = {
              user_id: user_id,
              user_groups: user_groups,
              user_projects: user_projects
            }

            req.login(user_object, function(err) {
              res.redirect('/');
            });
          // If passwords don't match it just loads a page that said incorrect password
          } else {
            res.status(401).send('Authentication failed. Incorrect password.');
          }
      };
    });
  } else {
    console.log("DANGEROUS INPUT DETECTED ON USERNAME OR PASSWORD!");
    res.redirect('/register');
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