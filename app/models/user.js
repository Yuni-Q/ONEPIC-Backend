// "use strict";
// const Sequelize = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
  const Users = Sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nickName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isDelete: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {},
  );
  // Users.associate = (models) => {
  //   // associations can be defined here
  // };
  return Users;
};
