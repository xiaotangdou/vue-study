const childProcess = require("child_process");
const fs = require("fs");
const util = require("util");

const exists = util.promisify(fs.exists);

const dir = process.argv[2];

if (!dir) {
  console.log(`目标文件夹不存在`);
  process.exit(0);
}

exists(`./${dir}`)
  .then((res) => {
    if (res) {
      console.log(`${dir} 文件夹已经存在`);
      process.exit(0);
    }

    childProcess.spawn("cp", ["-r", "./template", dir]);
  })
  .catch((err) => {
    process.exit(1);
  });
