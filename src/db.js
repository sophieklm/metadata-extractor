const Sequelize = require("sequelize");
const BookModel = require("./models/Book");
const BookSubjectModel = require("./models/BookSubject");
const AuthorModel = require("./models/Author");
const AuthorBookModel = require("./models/AuthorBook");
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
const BookSubject = BookSubjectModel(sequelize, Sequelize);
const Author = AuthorModel(sequelize, Sequelize);
const AuthorBook = AuthorBookModel(sequelize, Sequelize);
const Subject = SubjectModel(sequelize, Sequelize);

Book.belongsToMany(Author, {
  through: "author_book",
  foreignKey: "bookId",
});

Book.belongsToMany(Subject, {
  through: "book_subject",
  foreignKey: "bookId",
});

Author.belongsToMany(Book, {
  through: "author_book",
  foreignKey: "authorId",
});

Subject.belongsToMany(Book, {
  through: "book_subject",
  foreignKey: "subjectId",
});

module.exports = { sequelize, Book, Author, Subject };
