
const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_SECRET_KEY; // Make sure this environment variable is set

// Encrypt data
function encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

// Decrypt data
function decrypt(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
}

module.exports = { encrypt, decrypt };