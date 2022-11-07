const path = require('path');
const fs = require('fs');
const { stdout } = require('process');
const fsPromises = require('fs/promises');
const readdir = fsPromises.readdir;

const strDir = path.join(__dirname, 'secret-folder')

readFiles()

function readFiles() {
  readdir(strDir, {withFileTypes: true}).then((files) => {
    for (const file of files) {
      const fileNameExt = file.name

      if (file.isFile()) {
        const ext = path.extname(fileNameExt).slice(1)
        const fileName = fileNameExt.slice(0, (fileNameExt.length - ext.length - 1))
        
        const fileDir = path.join(__dirname, 'secret-folder', fileNameExt)
        
        fs.stat(fileDir, (err, stats) => {
          if (err) {
            console.error(err);
            return
          }
          const sizeStr = convertSize(stats.size)
          stdout.write(`${fileName} - ${ext} - ${sizeStr}\n`);
        });
      }
    }
  }, (err) => {
    console.error(err);
  })
}

function convertSize(size) {
  let result
  if (size > 1000) {
    result = `${size / 1000}kb`
  } else {
    result = `${size}b`
  }
  return result
}