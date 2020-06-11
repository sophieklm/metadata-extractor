const { process } = require("./converter");
const { sequelize } = require("./db");

sequelize.sync({ force: true }).then(() => {
  process("./pg9.rdf");
});
