const { expect } = require("chai");
const mock = require("mock-fs");
const sinon = require("sinon");
const { parse, convert } = require("../src/helpers");

describe("Helpers", () => {
  beforeEach(function () {
    sinon.spy(console, "error");
  });

  afterEach(function () {
    console.error.restore();
  });

  context("parse", async () => {
    const data = "<test><data>Data</data><data>Data</data></test>";
    const json = { test: { data: ["Data", "Data"] } };

    it("parses xml to json", async () => {
      const result = await parse(data);
      expect(result).to.eql(json);
    });

    it("console logs an error when there is bad data", async () => {
      await parse("Bad Data");
      expect(console.error).to.be.called;
    });
  });

  context("convert", async () => {
    mock({
      "path/to/fake/dir": {
        "test-file.rdf": "<one><two>Data</two><three>Data</three></one>",
        "empty-file.rdf": {},
      },
    });

    it("converts the file", async () => {
      const result = await convert("path/to/fake/dir/test-file.rdf");
      expect(result).to.eql({ one: { two: ["Data"], three: ["Data"] } });
      mock.restore();
    });

    it("console logs an error if no file", async () => {
      await convert("path/to/fake/dir/empty-file.rdf");
      expect(console.error).to.be.called;
      mock.restore();
    });
  });
});
