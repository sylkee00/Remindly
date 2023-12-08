exports.dashboard = function(req, res) {
  try {
    const sessions = getAllActiveSessions();
    console.log(sessions); // This is for debugging purposes.
    if (Array.isArray(sessions)) {
        res.render('admin', { sessions: sessions });
    } else {
        // If sessions is not an array, log the error and render with an empty array
        console.error('Sessions is not an array:', sessions);
        res.render('admin', { sessions: [] });
    }
} catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).send("Error fetching sessions");
}
};
  
exports.revokeSession = function(req, res) {
    // Logic to revoke a session
    const sessionId = req.params.sessionId;

    req.sessionStore.destroy(sessionId, (err) => {
      if (err) {
        // handle error
        res.status(500).send("Error revoking session");
      } else {
      console.log(`Session with ID ${sessionId} revoked by admin.`);
      res.redirect('/admin');
      }
    });
  };
  