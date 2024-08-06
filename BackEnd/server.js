// server.js
const app = require('express')();
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('~/certs/practice/server.key'), // replace it with your key path
    cert: fs.readFileSync('~/certs/practice/server.crt'), // replace it with your certificate path
}

https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Hello, HTTPS World!');
}).listen(443, () => {
    console.log('Server is running on port 443');
}); node