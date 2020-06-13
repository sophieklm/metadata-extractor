const fs = require("graceful-fs");
const path = require("path");
require("dotenv").config();
const { transform } = require("./converter");
const { sequelize } = require("./db");

const getAllFiles = (dirPath, arrayOfFiles) => {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else if (file.endsWith(".rdf")) {
      transform(`${dirPath}/${file}`);
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

sequelize.sync({ force: true }).then(() => {
  getAllFiles(process.env.FOLDER);
});
