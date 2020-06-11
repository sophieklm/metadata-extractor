const sequelize = require("../db");

const model = (sequelize, DataTypes) => {
  const Subject = sequelize.define("Subject", {
    value: { type: DataTypes.STRING },
  });

  Subject.associate = ({ Book }) => {
    Subject.belongsToMany(Book, {
      through: "book_subject",
      foreignKey: "subjectId",
    });
  };

  return Subject;
};

module.exports = model;
