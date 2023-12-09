exports.dashboard = function(req, res) {
  console.log('Active sessions:', global.activeSessions);
  
  const sessionData = Object.entries(global.activeSessions).map(([id, data]) => ({
    id: id,
    userId: data.userId
  }));

  console.log('Session data being passed to view:', sessionData);
  
  res.render('admin', { sessions: sessionData });
};
  
exports.revokeSession = function(req, res) {
    // Logic to revoke a session
    const sessionId = req.params.sessionId;

    console.log(`Attempting to revoke session with ID: ${req.params.sessionId}`);

    if (global.activeSessions[sessionId]) {
      delete global.activeSessions[sessionId]; // Remove the session from the tracking object
      req.sessionStore.destroy(sessionId, (err) => { // Destroy the session in the session store
        if (err) {
          // handle error
          res.status(500).send("Error revoking session");
        } else {
          console.log(`Session with ID ${sessionId} revoked by admin.`);
          res.redirect('/admin'); // Redirect back to the admin dashboard
        }
      });
    } else {
      res.status(404).send("Session not found"); // Send a 404 error if the session doesn't exist
    }
  };
  