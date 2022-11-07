const { mkdir, readdir, copyFile, constants, rm, rmdir } = require('fs/promises');
const { join } = require('path');

const folderCopy = join(__dirname, 'files-copy');
const folderSource = join(__dirname, 'files');

copyFolder(folderSource, folderCopy);

async function copyFolder(dirSource, dirCopy) {
  try {
    await mkdir(dirCopy, {recursive: true});
    const files = await readdir(dirSource, {withFileTypes: true});

    let filesArr = []

    for (const file of files) {
      const fileSource = join(dirSource, file.name);
      const fileCopy = join(dirCopy, file.name);

      filesArr.push(file)
      
      if (file.isFile()) {
          await copyFile(fileSource, fileCopy);
      } else {
        await copyFolder(fileSource, fileCopy);
      }
    }

    const copyFiles = await readdir(dirCopy, {withFileTypes: true});
    for (const copy of copyFiles) {
      const isExistInSource = filesArr.some(file => {
        return (file.name === copy.name)
      })
      if (!isExistInSource) {
        const copyDir = join(dirCopy, copy.name)
        if (copy.isFile()) {
          await rm(copyDir);
        } else {
          await rmdir(copyDir, {recursive: true});
        }
      }
    }

  } catch (error) {
    console.error(error.message);
  }
}