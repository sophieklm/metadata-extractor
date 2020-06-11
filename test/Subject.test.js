const { expect } = require("chai");

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const SubjectModel = require("../src/models/Subject");

describe("Subject", () => {
  const Subject = SubjectModel(sequelize, dataTypes);
  const subject = new Subject();
  checkModelName(Subject)("subject");

  context("properties", () => {
    ["value"].forEach(checkPropertyExists(subject));
  });

  context("associations", () => {
    const Book = "book";

    before(() => {
      Subject.associate({ Book });
    });

    it("defined a belongsToMany association with Book", () => {
      expect(Subject.belongsToMany).to.have.been.calledWith(Book, {
        foreignKey: "subjectId",
        through: "book_subject",
      });
    });
  });
});
