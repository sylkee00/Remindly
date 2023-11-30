let database = require("../database");
const Reminder = require("../models/userModel");


let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database.cindy.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database.cindy.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: database.cindy.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
      coverImage: req.file ? req.file.path : req.body.unsplashImageUrl
    }; 
    
    database.cindy.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implementation here 👈
    let reminderToFind = req.params.id;
    let index = database.cindy.reminders.findIndex(function (reminder) {
      return reminder.id == reminderToFind;
    });
  
    if (index !== -1) {
      database.cindy.reminders[index].title = req.body.title;
      database.cindy.reminders[index].description = req.body.description;
      database.cindy.reminders[index].completed = req.body.completed == "true" ? true : false;
    }
  
    res.redirect("/reminders");
  },

  delete: (req, res) => {
    // implementation here 👈
    let reminderToFind = req.params.id;
    database.cindy.reminders = database.cindy.reminders.filter(function (reminder) {
      return reminder.id != reminderToFind;
    });
  
    res.redirect("/reminders");
  },


  // getRandomCover: async (req, res) => {
  //   const response = await fetch("https://unsplash.com/");
  //   const data = await response.json();
  // }

};

exports.getReminders = function(req, res) {
  Reminder.find({ userId: req.user._id }, function(err, reminders) {
      if (err) {
          // Handle error
          console.error(err);
            res.status(500).send('Error occurred while fetching reminders');
            return;
      }
      res.render('reminder/list', { reminders }); // Adjust view path as necessary
  });
};


module.exports = remindersController;
