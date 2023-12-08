const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controller/userController")

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user // user is an object with user object and jwt token
    // done is a callback that takes 3 arguments (error, user, info)
      ? done(null, user) // if user is found, return user object, null means no error
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        }); // if user is not found (null), return false
  }
);

// serializeUser determines "which data" of the user object should be stored in the session to identify that user.
// The result of the serializeUser method is attached to the session as req.session.passport.user = {}. 1. "create a session"
passport.serializeUser(function (user, done) { // use user we got from the local strategy as a first parameter
  done(null, user.id);
});
// -> 2. create req.user = {id: '...', name: '...', email: '...', password: '...'} -> information about currently logged in user

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin);

// ------------Server hard drive ------------------------
/*

req.session.passport.user = {
  'djalkfjksajfaslk': {
    5 (user id)
  }
}

*/