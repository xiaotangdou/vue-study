const childProcess = require("child_process");
const fs = require("fs");
const util = require("util");

const exists = util.promisify(fs.exists);

const dir = process.argv[2];

if (!dir) {
  process.exit(1);
}

exists(`./${dir}`)
  .then((res) => {
    if (res) {
      console.error(`[${dir}] 文件夹已经存在`);
      process.exit(1);
    }

    childProcess.spawn("cp", ["-r", "./template", dir]);
  })
  .catch((err) => {
    process.exit(1);
  });
