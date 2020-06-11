const Sequelize = require("sequelize");
const BookModel = require("./models/Book");
const AuthorModel = require("./models/Author");
const SubjectModel = require("./models/Subject");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "postgres",
  }
);

const Book = BookModel(sequelize, Sequelize);
const Author = AuthorModel(sequelize, Sequelize);
const Subject = SubjectModel(sequelize, Sequelize);

module.exports = {
  sequelize,
  Book,
  Author,
  Subject,
};
