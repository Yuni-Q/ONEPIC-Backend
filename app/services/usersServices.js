const {
  Users,
} = require('../models');
const crypto = require('../helpers/cryptoHelper');

module.exports = {

  usersFindOneUserName: ({
    userName,
  }) => Users.findOne({
    where: {
      userName,
    },
  }),
  createUser: async ({
    userName,
    password,
  }) => {
    const pwd = await crypto.makePssword(password);
    await Users.create({
      userName,
      password: pwd,
    });
  },

  updateUser: async (
    {
      userName,
    },
    {
      password,
    }) => {
    const pwd = await crypto.makePssword(password);
    await Users.update({
      password: pwd,
    }, {
      where: {
        userName,
      },
    });
  },

  deleteUser: async ({
    id,
  }) => Users.update({
    isDelete: true,
  }, {
    where: {
      id,
    },
  }),
};
