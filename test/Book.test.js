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
      "authors",
    ].forEach(checkPropertyExists(book));
  });

  context("indexes", () => {
    ["title", "publication_date", "authors"].forEach(checkNonUniqueIndex(book));
  });
});
