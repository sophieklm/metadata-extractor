const { Book, Author } = require("./db");
const { convert } = require("./helpers");

const transform = (file) => {
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
    const a = author["agent"]?.[0]?.["name"]?.[0];
    return a ? a : "";
  });
};

const createSubjects = (subjects) => {
  return subjects.map((subject) => {
    const s = subject["Description"]?.[0]?.["value"]?.[0];
    return s ? s : "";
  });
};

module.exports = {
  transform,
  createBook,
  createSubjects,
  createAuthors,
};
