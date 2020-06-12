const fs = require("graceful-fs");
const path = require("path");
const { process } = require("./converter");
const { sequelize } = require("./db");

const getAllFiles = (dirPath, arrayOfFiles) => {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      process(`${dirPath}/${file}`);
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

sequelize.sync({ force: true }).then(() => {
  getAllFiles("./epub");
});
