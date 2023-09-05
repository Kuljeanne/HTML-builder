const fs = require("fs/promises");
const path = require("path");

async function getSizeInKb(filePath) {
  const data = await fs.stat(filePath);
  return (data.size / 1024).toFixed(2);
}

async function getFilesData(dir) {
  const targetFolder = path.resolve(__dirname, dir);
  try {
    const files = await fs.readdir(targetFolder, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const size = await getSizeInKb(path.resolve(targetFolder, file.name));
        const name = file.name;
        const ext = path.extname(file.name);
        console.log(`${name} - ${size}kb - ${ext}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

getFilesData("secret-folder");
