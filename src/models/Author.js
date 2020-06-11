const model = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    "author",
    {
      name: { type: DataTypes.STRING },
    },
    {
      indexes: [{ unique: false, fields: ["name"] }],
    }
  );

  Author.associate = ({ Book }) => {
    Author.belongsToMany(Book, {
      through: "author_book",
      foreignKey: "authorId",
    });
  };

  return Author;
};

module.exports = model;
