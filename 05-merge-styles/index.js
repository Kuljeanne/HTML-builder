const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

(async function mergeStyles() {
  const stream = fs.createWriteStream(
    path.resolve(__dirname, "project-dist", "bundle.css"),
    "utf-8"
  );
  try {
    const files = await fsp.readdir(path.resolve(__dirname, "styles"));

    for (const file of files) {
      if (path.extname(file) === ".css") {
        const styles = await fsp.readFile(
          path.resolve(__dirname, "styles", file)
        );

        stream.write(styles);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
})();
