const { writeFile, createReadStream, createWriteStream } = require('fs');
const { readdir } = require('fs/promises');
const { join, extname } = require('path');

const bundleFile = join(__dirname, 'project-dist', 'bundle.css');
writeFile(bundleFile, '', (err) => {
  if (err) {
    console.error(err.message);
  }
})

const dirStyle = join(__dirname, 'styles');
const streamWrite = createWriteStream(bundleFile);

readStyleFile()

async function readStyleFile() {
  try {
    const files = await readdir(dirStyle);

    for (const file of files) {

      if (extname(file) === '.css') {
        const dirFile = join(dirStyle, file)
        const streamRead = createReadStream(dirFile);
        streamRead.pipe(streamWrite)
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}