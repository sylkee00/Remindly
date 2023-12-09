const path = require("path");
const express = require("express");
const app = express();  // advanced server
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("./middleware/passport");


app.use(express.static(path.join(__dirname, "public")));  // static files -> tell our server to look in the public folder for static files, so by default,if there's no route, it will look in the public folder.
app.set("view engine", "ejs");  // view engine
app.use(ejsLayouts);

global.activeSessions = {};

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true
}));

// this bootstraps passport configuration
app.use(passport.initialize());
// hook into the persistent sessions we are using
app.use(passport.session());

// Middleware to track session creation
app.use((req, res, next) => {
  // Check if user is authenticated and session exists
  if (req.isAuthenticated()) {
    // This will set the session.userId after successful login
    global.activeSessions[req.sessionID] = { userId: req.user.id };
  }
  next();
});

// Middleware to track session destruction
app.use((req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode === 401 || res.statusCode === 403) {
      // When a session is destroyed, remove it from the activeSessions object
      delete activeSessions[req.sessionID];
    }
  });
  next();
});

const { ensureAuthenticated, checkAdminRole } = require('./middleware/checkAuth');

app.use(express.urlencoded({ extended: false }));

const authController = require("./controller/auth_controller");
const adminController = require("./controller/admin_controller");
// call the reminder_controller.js to use the functions
const reminderController = require("./controller/reminder_controller");
// Routes start here
app.get("/reminders", reminderController.list);
app.get("/reminder/new", reminderController.new);
app.get("/reminder/:id", reminderController.listOne);
app.get("/reminder/:id/edit", reminderController.edit);
app.post("/reminder/", reminderController.create);


// ⭐ Implement these two routes below!
app.post("/reminder/update/:id", reminderController.update);
app.post("/reminder/delete/:id", reminderController.delete);

// 👌 Ignore for now
app.get("/register", authController.register);
app.get("/auth/login", authController.login);
app.post("/register", authController.registerSubmit);
app.post("/auth/login", passport.authenticate("local", {
  successRedirect: "/reminders",
  failureRedirect: "/auth/login",
}));



app.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard'));
app.get('/admin', checkAdminRole, adminController.dashboard);
// This route should handle the POST request to revoke a session
app.post('/admin/revoke/:sessionId', checkAdminRole, adminController.revokeSession);
app.post('/admin/revoke/test', checkAdminRole, (req, res) => {
  return res.send("Test revoke route hit");
});

const reminderRoutes = require('./routes/reminderRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/reminders', reminderRoutes);
app.use('/auth', authRoutes);


// Random image
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/reminder', upload.single('coverImage'), reminderController.create);


// local host:3001
app.listen(8000, function () {
  console.log(
    "Server running. Visit: http://localhost:8000 in your browser 🚀"
  );
});