module.exports = (Sequelize, DataTypes) => {
  const boards = Sequelize.define(
    'boards', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      date: DataTypes.DATE,
      content: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      location: DataTypes.STRING,
      lon: DataTypes.FLOAT,
      lat: DataTypes.FLOAT,
      share: DataTypes.STRING,
      imgUrl: DataTypes.STRING,
    }, {},
  );

  return boards;
};
