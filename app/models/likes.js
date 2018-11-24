// "use strict";
// const Sequelize = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
    const likes = Sequelize.define(
      'likes',
      {
        id: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        boardId: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
      },
      {},
    );
    // Users.associate = (models) => {
    //   // associations can be defined here
    // };
    return likes;
  };
  