const { expect } = require("chai");
const sinon = require("sinon");
const {
  createBook,
  createAuthors,
  createSubjects,
} = require("../src/converter");
const { Book, Author, Subject } = require("../src/db");
const SequelizeMock = require("sequelize-mock");

describe("Converter", () => {
  const dbMock = new SequelizeMock();

  beforeEach(function () {
    sinon.stub(Book, "create").returns(BookMock, {
      instanceMethods: {
        addAuthor: () => {
          return "author";
        },
        addSubject: () => {
          return "subject";
        },
      },
    });
    sinon.stub(Author, "create").returns(AuthorMock);
    sinon.stub(Subject, "create").returns(SubjectMock);
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
  };

  const fakeAuthor = { name: "bob" };
  const fakeSubject = { value: "subject_1" };

  const BookMock = dbMock.define("Book", fakeBook);
  const AuthorMock = dbMock.define("Author", fakeAuthor);
  const SubjectMock = dbMock.define("Subject", fakeSubject);

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

  // context("createAuthors", async () => {
  //   const jsonAuthors = [{ agent: [{ name: ["Bob"] }] }];

  //   it("calls Author.create", async () => {
  //     await createAuthors(jsonAuthors, BookMock);
  //     expect(Author.create).to.have.been.calledWith(fakeAuthor);
  //   });

  //   it("returns the author", async () => {
  //     const author = await createAuthors(jsonAuthors, BookMock);
  //     expect(author).to.deep.equal(AuthorMock);
  //   });
  // });

  // context("createSubjects", async () => {
  //   const jsonSubjects = [
  //     { Description: [{ value: ["subject_1"] }] },
  //     { Description: [{ value: ["subject_2"] }] },
  //   ];

  //   it("calls Subject.create", async () => {
  //     await createSubjects(jsonSubjects, BookMock);
  //     expect(Subject.create).to.have.been.calledWith(fakeSubject);
  //   });

  //   it("returns the subject", async () => {
  //     const subject = await createSubjects(jsonSubjects, BookMock);
  //     expect(subject).to.deep.equal(SubjectMock);
  //   });
  // });
});
