const xml2js = require("xml2js");
const fs = require("fs").promises;
const { Book, Author, Subject } = require("./db");

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
  const base = data["RDF"]["ebook"][0];
  const authors = base["creator"];
  const subjects = base["subject"];
  return createBook(data).then((book) => {
    authors.forEach(async (author) => {
      const [a] = await Author.findOrCreate({
        where: { name: author["agent"][0]["name"][0] },
      });
      book.addAuthor(a);
    });
    subjects.forEach(async (subject) => {
      const [s] = await Subject.findOrCreate({
        where: { value: subject["Description"][0]["value"][0] },
      });
      book.addSubject(s);
    });
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

const convert = (file) => {
  parseFile(file).then((data) => {
    saveData(data);
  });
};

module.exports = { parse, convert, createBook };
