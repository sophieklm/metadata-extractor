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
  checkModelName(Book)("Book");
  describe("properties", () => {
    [
      "book_id",
      "title",
      "publisher",
      "publication_date",
      "language",
      "license_rights",
    ].forEach(checkPropertyExists(book));
  });

  describe("indexes", () => {
    ["title", "publication_date"].forEach(checkNonUniqueIndex(book));
  });
});
