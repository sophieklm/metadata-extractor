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

  context("properties", () => {
    ["name"].forEach(checkPropertyExists(author));
  });

  context("indexes", () => {
    ["name"].forEach(checkNonUniqueIndex(author));
  });

  context("associations", () => {
    const Book = "book";

    before(() => {
      Author.associate({ Book });
    });

    it("defined a belongsToMany association with Book", () => {
      expect(Author.belongsToMany).to.have.been.calledWith(Book, {
        foreignKey: "authorId",
        through: "author_book",
      });
    });
  });
});
