# Metadata Extractor

A metadata extractor for all the project Gutenberg titles which are available in [zip](http://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.zip) and [tar](http://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2) format.

Set up, requires psql:

```
createdb books
cp .env.example .env
npm install
```

Set the database variables in `.env` to match your database name, user and password if necessary.

Set the folder variable in `.env` to where the files have been extracted to, in this case I have the folder /epub in the current directory.

Run the transformer:

```
npm start
```

Tests:

```
npm test
open coverage/index.html
```
