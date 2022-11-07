const { createReadStream, createWriteStream } = require('fs');
const { mkdir, readdir, copyFile, appendFile, readFile, writeFile } = require('fs/promises');
const { join, extname } = require('path');

const bundleFolder = join(__dirname, 'project-dist');
const dirHtml = join(__dirname, 'template.html');
const dirStyle = join(__dirname, 'styles');
let fielNameHtml, bundleHtml;
const folderSource = join(__dirname, 'assets');
const folderCopy = join(bundleFolder, 'assets');

createFiles();

async function createFiles() {
  try {
    await mkdir(bundleFolder, {recursive: true});

    bundleHtml = join(bundleFolder, 'index.html');
    await writeFile(bundleHtml, '')
    await copyHtml()

    bundleStyle = join(bundleFolder, 'style.css');
    await writeFile(bundleStyle, '');
    await readStyleFile()

    await copyFolder(folderSource, folderCopy);

  } catch (error) {
    console.error(error.message);
    return
  }
}

async function copyHtml() {
  let htmlTemplateStr = '';

  try {
    const data = await readFile(dirHtml);
    htmlTemplateStr = data.toString()
    await findTemplates(htmlTemplateStr)
  } catch (err) {
    console.error(err.message);
    return
  }
}

async function findTemplates(data) {
  const regexpTemplate = /\{\{(.+?)\}\}/gm;
  let regexpValue;
  let currentIndex = 0

  try {
  while (regexpValue = regexpTemplate.exec(data)) {
    fielNameHtml = regexpValue[1];
    await appendFile(bundleHtml, data.slice(currentIndex, regexpValue.index));
    const fileDir = join(__dirname, 'components', fielNameHtml + '.html')
    const fileData = await readFile(fileDir, { encoding: 'utf8' });
    await appendFile(bundleHtml, fileData)
    currentIndex = regexpTemplate.lastIndex
  }

  await appendFile(bundleHtml, data.slice(currentIndex))

  } catch (err) {
    console.error(err.message);
    return
  }
}

async function readStyleFile() {
  try {
    const files = await readdir(dirStyle);
    const streamWrite = createWriteStream(bundleStyle);

    for (const file of files) {
      if (extname(file) === '.css') {
        const dirFile = join(dirStyle, file)
        const streamRead = createReadStream(dirFile);
        
        streamRead.pipe(streamWrite)
        streamWrite.write('\n')
      }
    }
  } catch (error) {
    console.error(error.message);
    return
  }
}

async function copyFolder(dirSource, dirCopy) {
  try {
    await mkdir(dirCopy, {recursive: true});
    const files = await readdir(dirSource, {withFileTypes: true});

    for (const file of files) {
      const fileSource = join(dirSource, file.name);
      const fileCopy = join(dirCopy, file.name);
      
      if (file.isFile()) {
        await copyFile(fileSource, fileCopy);
      } else {
        await copyFolder(fileSource, fileCopy);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}