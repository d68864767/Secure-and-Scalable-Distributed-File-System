const express = require('express');
const router = express.Router();
const databaseConfig = require('./databaseConfig');

// Get system status
router.get('/status', async (req, res) => {
  try {
    // Query the database for system status
    const status = await databaseConfig.executeQuery('SELECT * FROM system_status');
    res.status(200).json(status);
  } catch (err) {
    console.error('Failed to get system status', err);
    res.status(500).json({ error: 'Failed to get system status' });
  }
});

// Get system logs
router.get('/logs', async (req, res) => {
  try {
    // Query the database for system logs
    const logs = await databaseConfig.executeQuery('SELECT * FROM system_logs ORDER BY timestamp DESC');
    res.status(200).json(logs);
  } catch (err) {
    console.error('Failed to get system logs', err);
    res.status(500).json({ error: 'Failed to get system logs' });
  }
});

// Log system event
const logEvent = async (event) => {
  try {
    // Insert the event into the system logs
    await databaseConfig.executeQuery('INSERT INTO system_logs (timestamp, event) VALUES (?, ?)', [Date.now(), event]);
  } catch (err) {
    console.error('Failed to log event', err);
  }
};

module.exports = router;
module.exports.logEvent = logEvent;
