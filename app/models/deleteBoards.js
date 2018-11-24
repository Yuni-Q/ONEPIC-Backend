module.exports = (Sequelize, DataTypes) => {
    const deleteBoards = Sequelize.define(
      'deleteBoards',
      {
        id: DataTypes.INTEGER,
        title: DataTypes.STRING,
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
      },
      {},
    );

    return deleteBoards;
  };