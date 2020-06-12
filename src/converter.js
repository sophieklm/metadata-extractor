const { Book, Author } = require("./db");
const { convert } = require("./helpers");

const process = (file) => {
  convert(file).then((data) => {
    return createBook(data);
  });
};

const createBook = (result) => {
  const base = result["RDF"]?.["ebook"]?.[0];
  const id = base["$"]?.["rdf:about"];
  const book_id = id.substr(id.lastIndexOf("/") + 1);
  const language =
    base["language"]?.[0]?.["Description"]?.[0]?.["value"]?.[0]?.["_"];
  const license_rights = base["rights"]?.[0];
  const publisher = base["publisher"]?.[0];
  const publication_date = base["issued"]?.[0]?.["_"];
  const title = base["title"]?.[0];
  const subjects = base["subject"];
  const authors = base["creator"];

  return Book.create({
    book_id,
    language,
    license_rights,
    publisher,
    publication_date,
    title,
    subjects: subjects ? createSubjects(subjects) : undefined,
    authors: authors ? createAuthors(authors) : undefined,
  });
};

const createAuthors = (authors) => {
  return authors.map((author) => {
    return author["agent"][0]["name"][0];
  });
};

const createSubjects = (subjects) => {
  return subjects.map((subject) => {
    return subject["Description"][0]["value"][0];
  });
};

module.exports = {
  process,
  createBook,
  createSubjects,
  createAuthors,
};
