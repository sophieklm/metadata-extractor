const xml2js = require("xml2js");
const fs = require("fs").promises;
const { sequelize, Book } = require("./db");

const processors = xml2js.processors;
const parser = new xml2js.Parser({
  tagNameProcessors: [processors.stripPrefix],
});

const parseFile = async (pathname) => {
  try {
    const data = await fs.readFile(pathname);
    return parse(data);
  } catch (err) {
    console.error(err);
  }
};

const parse = (data) => {
  return parser
    .parseStringPromise(data)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
};

const saveData = (data) => {
  sequelize.sync({ force: true }).then(() => {
    return createBook(data);
  });
};

const createBook = (result) => {
  const base = result["RDF"]["ebook"][0];
  return Book.create({
    book_id: base["$"]["rdf:about"],
    language: base["language"][0]["Description"][0]["value"][0]["_"],
    license_rights: base["rights"][0],
    publisher: base["publisher"][0],
    publication_date: base["issued"][0]["_"],
    title: base["title"][0],
  });
};

parseFile("./pg9.rdf").then((data) => {
  saveData(data);
});

module.exports = parse;
