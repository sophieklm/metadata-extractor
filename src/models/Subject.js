const model = (sequelize, DataTypes) => {
  const Subject = sequelize.define("subject", {
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
