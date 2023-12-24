const express = require('express');
const https = require('https');
const fs = require('fs');
const databaseConfig = require('./databaseConfig');
const encryption = require('./encryption');
const userManagement = require('./userManagement');
const fileSystem = require('./fileSystem');
const webInterface = require('./webInterface');
const monitoring = require('./monitoring');

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
databaseConfig.init();

// User management routes
app.use('/users', userManagement);

// File system routes
app.use('/files', fileSystem);

// Web interface routes
app.use('/', webInterface);

// Monitoring routes
app.use('/monitoring', monitoring);

// Start the server
const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: encryption.getPassphrase()
};

https.createServer(httpsOptions, app).listen(3000, () => {
  console.log('Server started on port 3000');
});
