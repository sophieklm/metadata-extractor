# Metadata Extractor

Set up, requires psql:

```
createdb books
cp .env.example .env
npm install
```

Set the env FOLDER to where the folder is extracted.

Run the parser:

```
npm start
```

Tests:

```
npm test
open coverage/index.html
```
