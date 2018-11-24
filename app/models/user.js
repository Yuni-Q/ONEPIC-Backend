// "use strict";
// const Sequelize = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
  const users = Sequelize.define(
    'users',
    {
      id: DataTypes.INTEGER,
      nickName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {},
  );
  // Users.associate = (models) => {
  //   // associations can be defined here
  // };
  return users;
};
