const sequelize = require("../db");

const model = (sequelize) => {
  const AuthorBook = sequelize.define("author_book", {});
  return AuthorBook;
};

module.exports = model;
