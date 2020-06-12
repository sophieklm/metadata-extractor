const Sequelize = require("sequelize");
const BookModel = require("./models/Book");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "postgres",
    define: { timestamps: false },
  }
);

const Book = BookModel(sequelize, Sequelize);

module.exports = { sequelize, Book };
