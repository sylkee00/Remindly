const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const adminController = require("./controller/admin_controller");
const session = require("express-session");
const passport = require("passport");
require('./middleware/passport')(passport);
const { ensureAuthenticated, checkAdminRole } = require('./middleware/checkAuth');


app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(ejsLayouts);

app.set("view engine", "ejs");

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
app.get("/login", authController.login);
app.post("/register", authController.registerSubmit);
app.post("/login", authController.loginSubmit);

app.use(session({
  secret: 'your secret key',
  resave: true,
  saveUninitialized: true
}));

// this bootstraps passport configuration
app.use(passport.initialize());
// hook into the persistent sessions we are using
app.use(passport.session());

app.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard'));
app.get('/admin', checkAdminRole, adminController.dashboard);

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

app.listen(3001, function () {
  console.log(
    "Server running. Visit: http://localhost:3001/reminders in your browser 🚀"
  );
});
