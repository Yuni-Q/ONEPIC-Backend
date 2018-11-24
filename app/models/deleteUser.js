// "use strict";
// const Sequelize = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
  const deleteUser = Sequelize.define(
    'deleteUser',
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
  return deleteUser;
};
