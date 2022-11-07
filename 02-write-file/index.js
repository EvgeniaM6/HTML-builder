const path = require('path');
const fs = require('fs');
const process = require('process');
const { stdin, stdout, exit } = require('process');

const strDir = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(strDir);

let resultStr = '';

stdout.write('Hello! Write something here to write to file \'text.txt\' or write \'exit\' to get out of the mode.\n');

stdin.on('data', data => {
  const checkStr = data.toString();
  resultStr += checkStr;

  if (resultStr.includes('exit')) {
    exitMode();
  }
  output.write(data);

})

process.on('SIGINT', () => {
  exitMode();
});

function exitMode() {
  stdout.write('You decide to get out of the mode. Goodbye!');
  exit();
}