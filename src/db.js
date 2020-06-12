const Sequelize = require("sequelize");
const BookModel = require("./models/Book");
const AuthorModel = require("./models/Author");
const AuthorBookModel = require("./models/AuthorBook");

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
const Author = AuthorModel(sequelize, Sequelize);
const AuthorBook = AuthorBookModel(sequelize, Sequelize);

Book.belongsToMany(Author, {
  through: "author_book",
  foreignKey: "bookId",
});

Author.belongsToMany(Book, {
  through: "author_book",
  foreignKey: "authorId",
});

module.exports = { sequelize, Book, Author };
