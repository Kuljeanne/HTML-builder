const path = require("path");
const fsp = require("fs/promises");

const source = path.resolve(__dirname, "files");
const dest = path.resolve(__dirname, "files-copy");

async function copyFiles(src, destination) {
  try {
    const createDir = await fsp.mkdir(destination, { recursive: true });
    if (!createDir) await clearOldCopies(dest);
    
    const files = await fsp.readdir(src);
    for (const file of files) {
     await fsp.copyFile(path.resolve(src, file), path.resolve(dest, file));
    }
    
  } catch (error) {
    console.error(error.message);
  }
}

async function clearOldCopies(dest) {
  const oldCopies = await fsp.readdir(dest);
  for (const file of oldCopies) {
    fsp.rm(path.resolve(dest, file));
  }
}

copyFiles(source, dest);
