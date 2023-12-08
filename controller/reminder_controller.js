// let database = require("../database");
const database = require("../models/userModel");


let remindersController = {  //objects -> in index.js, we can call it like this: remindersController.list
  list: (req, res) => {
    res.render("reminder/index", { reminders: req.user.reminders });
  }, // if you want send just the string, you can use res.send("Hello World")

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.status(404).send("Reminder not found");
    }
  },

  create: (req, res) => {
    let reminder = {
      id: req.user.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
      coverImage: req.file ? req.file.path : req.body.unsplashImageUrl
    }; 
    
    req.user.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implementation here 👈
    let reminderToFind = req.params.id;
    let index = req.user.reminders.findIndex(function (reminder) {
      return reminder.id == reminderToFind;
    });
  
    if (index !== -1) {
      req.user.reminders[index].title = req.body.title;
      req.user.reminders[index].description = req.body.description;
      req.user.reminders[index].completed = req.body.completed == "true" ? true : false;
    }
  
    res.redirect("/reminders");
  },

  delete: (req, res) => {
    // implementation here 👈
    let reminderToFind = req.params.id;
    req.user.reminders = req.user.reminders.filter(function (reminder) {
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
