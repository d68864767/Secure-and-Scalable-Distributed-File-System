const crypto = require('crypto');

// The passphrase used for encryption and decryption
const passphrase = 'your secure passphrase';

// Function to get the passphrase
function getPassphrase() {
  return passphrase;
}

// Function to encrypt data
function encryptData(data) {
  const cipher = crypto.createCipher('aes-256-cbc', passphrase);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt data
function decryptData(encryptedData) {
  const decipher = crypto.createDecipher('aes-256-cbc', passphrase);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  getPassphrase,
  encryptData,
  decryptData
};
