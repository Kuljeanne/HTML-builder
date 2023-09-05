const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const projectDist = path.resolve(__dirname, "project-dist");

async function mergeStyles(from, to) {
  const stream = fs.createWriteStream(path.resolve(to, "style.css"), "utf-8");
  try {
    const files = await fsp.readdir(from);

    for (const file of files) {
      if (path.extname(file) === ".css") {
        const styles = await fsp.readFile(path.resolve(from, file));

        stream.write(styles);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function copyFiles(src, destination) {
  try {
    const createDir = await fsp.mkdir(destination, { recursive: true });
    if (!createDir) await clearOldCopies(destination);
    const files = await fsp.readdir(src, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        await copyFiles(
          path.resolve(src, file.name),
          path.resolve(destination, file.name)
        );
      }
      if (file.isFile()) {
        await fsp.copyFile(
          path.resolve(src, file.name),
          path.resolve(destination, file.name)
        );
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function clearOldCopies(dest) {
  try {
    const oldCopies = await fsp.readdir(dest);
    for (const file of oldCopies) {
      await fsp.rm(path.resolve(dest, file), { recursive: true });
    }
  } catch (error) {
    console.log("delete error:", error.message);
  }
}

async function getTemplate(dest) {
  const componentsPath = path.resolve(__dirname, "components");

  let template = await fsp.readFile(
    path.resolve(__dirname, "template.html"),
    "utf-8"
  );

  const mapper = (elem) => `{{${elem}}}`;
  const components = await fsp.readdir(componentsPath);
  for await (comp of components) {
    const tempName = `{{${path.parse(comp).name}}}`;

    const compData = await fsp.readFile(
      path.resolve(componentsPath, comp),
      "utf-8"
    );
    template = template.replaceAll(tempName, compData);
  }

  await fsp.writeFile(path.resolve(projectDist, "index.html"), template);
}

(async function () {
  await copyFiles(
    path.resolve(__dirname, "assets"),
    path.resolve(projectDist, "assets")
  );
  await mergeStyles(path.resolve(__dirname, "styles"), projectDist);
  await getTemplate(projectDist);
})();
