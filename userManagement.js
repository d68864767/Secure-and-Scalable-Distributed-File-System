const express = require('express');
const router = express.Router();
const databaseConfig = require('./databaseConfig');
const encryption = require('./encryption');
const crypto = require('crypto');

// User registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const userExists = await databaseConfig.executeQuery('SELECT * FROM users WHERE username = ?', [username]);
  if (userExists.length > 0) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Hash the password
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  // Save the user to the database
  await databaseConfig.executeQuery('INSERT INTO users (username, hash, salt) VALUES (?, ?, ?)', [username, hash, salt]);

  res.status(201).json({ message: 'User registered successfully' });
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const users = await databaseConfig.executeQuery('SELECT * FROM users WHERE username = ?', [username]);
  if (users.length === 0) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const user = users[0];

  // Check the password
  const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
  if (user.hash !== hash) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  // User is authenticated
  res.status(200).json({ message: 'User authenticated successfully' });
});

// User authorization
router.use((req, res, next) => {
  const { username } = req.headers;

  // Check if user exists
  const users = await databaseConfig.executeQuery('SELECT * FROM users WHERE username = ?', [username]);
  if (users.length === 0) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // User is authorized
  next();
});

module.exports = router;
