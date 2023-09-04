const fs = require("fs");
const path = require("path");

const stream = fs.createReadStream(
  path.resolve(__dirname, "text.txt"),
  "utf-8"
);

let data = "";
stream.on("data", (chunk) => (data += chunk));
stream.on("end", () => process.stdout.write(data));
