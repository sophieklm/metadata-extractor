const model = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "book",
    {
      book_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      publisher: {
        type: DataTypes.STRING,
      },
      publication_date: {
        type: DataTypes.DATEONLY,
      },
      language: {
        type: DataTypes.STRING,
      },
      license_rights: {
        type: DataTypes.STRING,
      },
      subjects: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      authors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
    },
    {
      indexes: [
        { unique: false, fields: ["title"] },
        { unique: false, fields: ["publication_date"] },
        { unique: false, fields: ["authors"] },
      ],
    }
  );
  return Book;
};

module.exports = model;
