const express = require('express');
const router = express.Router();
const path = require('path');
const databaseConfig = require('./databaseConfig');
const userManagement = require('./userManagement');
const fileSystem = require('./fileSystem');

// Serve static files from the React app
router.use(express.static(path.join(__dirname, 'client/build')));

// User management routes
router.use('/users', userManagement);

// File system routes
router.use('/files', fileSystem);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

module.exports = router;
