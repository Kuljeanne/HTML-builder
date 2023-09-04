const fs = require("fs");
const path = require("path");
const readline = require("readline");

const { stdin, stdout } = process;

const exit = () => {
  stdout.write("Bye!");
};
stdout.write("Hello! write smth \n");

const rl = readline.createInterface({ input: stdin, output: stdout });

const writeableStream = fs.createWriteStream(
  path.resolve(__dirname, "text.txt"),
  "utf-8"
);

rl.on("line", (input) => {
  if (input.includes("exit")) return process.exit();
  writeableStream.write(`${input} \n`);
});

process.on("SIGINT", exit);
process.on("exit", exit);
