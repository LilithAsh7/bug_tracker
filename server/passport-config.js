// Importing bcrypt for hash checking and LocalStategy for username/password authentication
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
// Imports userQueries API calls
const usersQueries = require('./usersQueries');

// Initializes passport.js with authentication login
function initialize(passport) {
  console.log("Passport initialized")
  // Async function to authenticate user
  const authenticateUser = async (username, password, done) => {
    console.log("Authenticating user")
    try {
      // Gets user based on username
      const user = await usersQueries.getUserByUsername(username);
      // If no user matches then just responds with "No user found"
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      // Compares password with password in database
      const passwordMatch = await bcrypt.compare(password, user.password);
      // If passwords match then returns user object else returns response that says "incorrect password"
      if (passwordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
      // Error handling
    } catch (error) {
      return done(error);
    }
  }
  // Configures passport to use LocalStrategy with authenticaseUser function
  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
  // Serializes user object so it can be stored in the session (This stores only the users ID)
  passport.serializeUser((user, done) => done(null, user.id));
  // Deserialize user object, meaning it reverts it back to it's original state
  passport.deserializeUser(async (id, done) => {
    try {
      // Gets user object
      const user = await usersQueries.getUserById(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}

// Export initialize function
module.exports = initialize;