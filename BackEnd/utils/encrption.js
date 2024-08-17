const crypto = require('crypto');

// Encryption function
function encrypt(text) {
    const algorithm = 'aes-256-cbc'; 
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); 
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; 
}

// Decryption function
function decrypt(text) {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt,
};