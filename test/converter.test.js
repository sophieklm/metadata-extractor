const { expect } = require("chai");
const sinon = require("sinon");
const {
  createBook,
  createAuthors,
  createSubjects,
} = require("../src/processor");
const { Book, Author, Subject } = require("../src/db");
const SequelizeMock = require("sequelize-mock");

describe("Converter", () => {
  const dbMock = new SequelizeMock();

  beforeEach(function () {
    sinon.stub(Book, "create").returns(BookMock);
    sinon.stub(Author, "findOrCreate").returns(AuthorMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  const fakeBook = {
    book_id: "ebooks/9",
    language: "en",
    license_rights: "Public domain in the USA.",
    publication_date: "1979-12-01",
    publisher: "Project Gutenberg",
    title: "Abraham Lincoln's First Inaugural Address",
    subjects: ["subject"],
  };

  const fakeAuthor = { name: "bob" };

  const BookMock = dbMock.define("book", fakeBook);
  const AuthorMock = dbMock.define("author", fakeAuthor);

  // const AuthorBookMock = dbMock.define("author_book");

  // BookMock.belongsToMany(AuthorMock, { through: AuthorBookMock });
  // AuthorMock.belongsToMany(BookMock, { through: AuthorBookMock });

  context("createBook", async () => {
    const jsonBook = {
      RDF: {
        ebook: [
          {
            $: { "rdf:about": "ebooks/9" },
            rights: ["Public domain in the USA."],
            title: ["Abraham Lincoln's First Inaugural Address"],
            issued: [{ _: "1979-12-01" }],
            language: [{ Description: [{ value: [{ _: "en" }] }] }],
            publisher: ["Project Gutenberg"],
            subject: [{ Description: [{ value: ["subject"] }] }],
          },
        ],
      },
    };

    it("calls Book.create", async () => {
      await createBook(jsonBook);
      expect(Book.create).to.have.been.calledWith(fakeBook);
    });

    it("returns the book", async () => {
      const book = await createBook(jsonBook);
      expect(book).to.deep.equal(BookMock);
    });
  });

  context("createAuthors", async () => {
    const jsonAuthors = [{ agent: [{ name: ["Bob"] }] }];

    it("calls Author.create", async () => {
      await createAuthors(jsonAuthors, BookMock);
      expect(Author.findOrCreate).to.have.been.calledWith({
        where: { name: "Bob" },
      });
    });
  });

  context("createSubjects", async () => {
    const jsonSubjects = [
      { Description: [{ value: ["subject_1"] }] },
      { Description: [{ value: ["subject_2"] }] },
    ];

    it("returns an array of subjects", async () => {
      const subject = await createSubjects(jsonSubjects);
      expect(subject).to.deep.equal(["subject_1", "subject_2"]);
    });
  });
});
