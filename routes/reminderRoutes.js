const express = require('express');
const router = express.Router();
const reminderController = require('../controller/reminder_controller');
const { ensureAuthenticated } = require('../middleware/checkAuth');

router.get('/', ensureAuthenticated, reminderController.list);
router.post('/create', ensureAuthenticated, reminderController.create);
router.post('/update/:id', ensureAuthenticated, reminderController.update);
router.get('/delete/:id', ensureAuthenticated, reminderController.delete);

module.exports = router;
