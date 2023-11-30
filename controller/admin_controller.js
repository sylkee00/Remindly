exports.dashboard = function(req, res) {
    // Fetch and display sessions
    res.render('admin/dashboard');
  };
  
  exports.revokeSession = function(req, res) {
    // Logic to revoke a session
    const sessionId = req.params.sessionId;
    res.redirect('/admin');
  };
  