const { expect } = require("chai");
const sinon = require("sinon");
const {
  createBook,
  createAuthors,
  createSubjects,
} = require("../src/converter");
const { Book } = require("../src/db");
const SequelizeMock = require("sequelize-mock");

describe("Converter", () => {
  const dbMock = new SequelizeMock();

  afterEach(function () {
    sinon.restore();
  });

  context("createBook", async () => {
    const fakeBook = {
      book_id: "9",
      language: "en",
      license_rights: "Public domain in the USA.",
      publication_date: "1979-12-01",
      publisher: "Project Gutenberg",
      title: "Abraham Lincoln's First Inaugural Address",
      subjects: ["subject"],
      authors: ["Lincoln, Abraham"],
    };

    const BookMock = dbMock.define("book", fakeBook);

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
            creator: [{ agent: [{ name: ["Lincoln, Abraham"] }] }],
          },
        ],
      },
    };

    it("calls Book.create", async () => {
      sinon.stub(Book, "create").returns(BookMock);
      await createBook(jsonBook);
      expect(Book.create).to.have.been.calledWith(fakeBook);
    });

    it("returns the book", async () => {
      sinon.stub(Book, "create").returns(BookMock);
      const book = await createBook(jsonBook);
      expect(book).to.deep.equal(BookMock);
    });

    it("saves a book even if some values are empty", async () => {
      const emptyBook = {
        RDF: {
          ebook: [{ $: { "rdf:about": "ebooks/9" }, title: "title" }],
        },
      };
      const EmptyBookMock = dbMock.define("book", { title: "title" });
      sinon.stub(Book, "create").returns(EmptyBookMock);
      const book = await createBook(emptyBook);
      expect(book).to.deep.equal(EmptyBookMock);
    });
  });

  context("createAuthors", async () => {
    const jsonAuthors = [{ agent: [{ name: ["Lincoln, Abraham"] }] }];

    it("calls Author.create", async () => {
      const authors = await createAuthors(jsonAuthors);
      expect(authors).to.deep.equal(["Lincoln, Abraham"]);
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
