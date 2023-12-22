const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const usersQueries = require('./usersQueries');

function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
      try {
        const user = await usersQueries.getUserByUsername(username);
  
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (error) {
        return done(error);
      }
    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));
  
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await usersQueries.getUserById(id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    });
  }
  
module.exports = initialize;