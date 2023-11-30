const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

const reminderSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: mongoose.Schema.Types.ObjectId // Link to the user who created the reminder
  });

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Reminder', reminderSchema);
