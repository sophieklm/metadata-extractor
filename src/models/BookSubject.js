const model = (sequelize) => {
  const BookSubject = sequelize.define("book_subject", {});
  return BookSubject;
};

module.exports = model;
