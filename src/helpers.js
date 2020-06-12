const xml2js = require("xml2js");
const fs = require("fs").promises;

const processors = xml2js.processors;

const parser = new xml2js.Parser({
  tagNameProcessors: [processors.stripPrefix],
});

const convert = async (pathname) => {
  try {
    const data = await fs.readFile(pathname);
    return parse(data);
  } catch (err) {
    console.error(err);
  }
};

const parse = (data) => {
  const cleaned = data.toString().replace("\ufeff", "");
  return parser
    .parseStringPromise(cleaned)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { convert, parse };
