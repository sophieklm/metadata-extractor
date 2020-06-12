const { expect } = require("chai");

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkNonUniqueIndex,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const BookModel = require("../src/models/Book");

describe("Book", () => {
  const Book = BookModel(sequelize, dataTypes);
  const book = new Book();
  checkModelName(Book)("book");
  context("properties", () => {
    [
      "book_id",
      "title",
      "publisher",
      "publication_date",
      "language",
      "license_rights",
      "subjects",
    ].forEach(checkPropertyExists(book));
  });

  context("indexes", () => {
    ["title", "publication_date"].forEach(checkNonUniqueIndex(book));
  });

  context("associations", () => {
    const Author = "Author";

    before(() => {
      Book.associate({ Author });
    });

    it("defined a belongsToMany association with Author", () => {
      expect(Book.belongsToMany).to.have.been.calledWith(Author, {
        foreignKey: "bookId",
        through: "author_book",
      });
    });
  });
});
