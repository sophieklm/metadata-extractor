const { Book, Author, Subject } = require("./db");
const { convert } = require("./helpers");

const process = (file) => {
  convert(file).then((data) => {
    saveData(data);
  });
};

const saveData = (data) => {
  const base = data["RDF"]["ebook"][0];
  const authors = base["creator"];
  const subjects = base["subject"];
  return createBook(data).then((book) => {
    if (authors) {
      createAuthors(authors, book);
    }
    if (subjects) {
      createSubjects(subjects, book);
    }
  });
};

const createBook = (result) => {
  const base = result["RDF"]["ebook"][0];
  const book_id = base["$"]["rdf:about"];
  const language = base["language"][0]["Description"][0]["value"][0]["_"];
  const license_rights = base["rights"][0];
  const publisher = base["publisher"][0];
  const publication_date = base["issued"][0]["_"];
  const title = base["title"][0];

  return Book.create({
    book_id: book_id ? book_id : undefined,
    language: language ? language : undefined,
    license_rights: license_rights ? license_rights : undefined,
    publisher: publisher ? publisher : undefined,
    publication_date: publication_date ? publication_date : undefined,
    title: title ? title : undefined,
  });
};

const createAuthors = (authors, book) => {
  authors.forEach(async (author) => {
    const name = author["agent"][0]["name"][0];
    const [a] = await Author.findOrCreate({
      where: { name },
    });
    book.addAuthor(a);
  });
};

const createSubjects = (subjects, book) => {
  subjects.forEach(async (subject) => {
    const value = subject["Description"][0]["value"][0];
    const [s] = await Subject.findOrCreate({
      where: { value: value },
    });
    book.addSubject(s);
  });
};

module.exports = {
  process,
  createBook,
  createSubjects,
  createAuthors,
  saveData,
};
