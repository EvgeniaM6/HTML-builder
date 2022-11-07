const path = require('path');
const fs = require('fs');

const strDir = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(strDir, 'utf-8');
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));
stream.on('error', error => console.log('Error', error.message));