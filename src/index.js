const { convert } = require("./converter");
const { sequelize } = require("./db");

sequelize.sync({ force: true }).then(() => {
  convert("./pg9.rdf");
});
