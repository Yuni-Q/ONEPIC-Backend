// "use strict";
// const Sequelize = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
  const deleteUsers = Sequelize.define(
    'deleteUsers',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nickName: DataTypes.STRING,
      email: DataTypes.STRING,
      token: DataTypes.STRING,
      password: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {},
  );
  // Users.associate = (models) => {
  //   // associations can be defined here
  // };
  return deleteUsers;
};
