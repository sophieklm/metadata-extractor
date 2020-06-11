const { expect } = require("chai");

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkNonUniqueIndex,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const AuthorModel = require("../src/models/Author");

describe("Author", () => {
  const Author = AuthorModel(sequelize, dataTypes);
  const author = new Author();
  checkModelName(Author)("Author");
  describe("properties", () => {
    ["name"].forEach(checkPropertyExists(author));
  });

  describe("indexes", () => {
    ["name"].forEach(checkNonUniqueIndex(author));
  });

  context("associations", () => {
    const Book = "book";

    before(() => {
      Author.associate({ Book });
    });

    it("defined a belongsToMany association with Book", () => {
      expect(Author.belongsToMany).to.have.been.calledWith(Book);
    });
  });
});
