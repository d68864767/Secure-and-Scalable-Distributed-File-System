const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const databaseConfig = require('./databaseConfig');
const encryption = require('./encryption');

// File upload
router.post('/upload', async (req, res) => {
  const { username, file, filename } = req.body;

  // Encrypt the file
  const encryptedFile = encryption.encryptData(file);

  // Save the file to the database
  await databaseConfig.executeQuery('INSERT INTO files (username, filename, file) VALUES (?, ?, ?)', [username, filename, encryptedFile]);

  res.status(201).json({ message: 'File uploaded successfully' });
});

// File download
router.get('/download/:filename', async (req, res) => {
  const { username } = req.headers;
  const { filename } = req.params;

  // Get the file from the database
  const files = await databaseConfig.executeQuery('SELECT * FROM files WHERE username = ? AND filename = ?', [username, filename]);
  if (files.length === 0) {
    return res.status(404).json({ error: 'File not found' });
  }

  const file = files[0];

  // Decrypt the file
  const decryptedFile = encryption.decryptData(file.file);

  // Send the file
  res.status(200).send(decryptedFile);
});

// File deletion
router.delete('/delete/:filename', async (req, res) => {
  const { username } = req.headers;
  const { filename } = req.params;

  // Delete the file from the database
  await databaseConfig.executeQuery('DELETE FROM files WHERE username = ? AND filename = ?', [username, filename]);

  res.status(200).json({ message: 'File deleted successfully' });
});

module.exports = router;
