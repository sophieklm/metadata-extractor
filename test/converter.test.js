const { expect } = require("chai");
const sinon = require("sinon");
const { parse, saveData } = require("../src/converter");
const { Book } = require("../src/db");
const SequelizeMock = require("sequelize-mock");

describe("Converter", () => {
  const dbMock = new SequelizeMock();

  beforeEach(function () {
    sinon.stub(Book, "create").returns(BookMock);
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

  const BookMock = dbMock.define("Book", fakeBook);

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

  context("parse", async () => {
    const data = "<test><data>Data</data><data>Data</data></test>";
    const json = { test: { data: ["Data", "Data"] } };

    const result = await parse(data);

    it("parses xml to json", () => {
      expect(result).to.eql(json);
    });
  });

  context("saveData", async () => {
    it("calls Book.create", async () => {
      const book = await saveData(jsonBook);
      expect(Book.create).to.have.been.calledWith(fakeBook);
    });

    it("returns the book", async () => {
      const book = await saveData(jsonBook);
      expect(book).to.deep.equal(BookMock);
    });
  });
});
