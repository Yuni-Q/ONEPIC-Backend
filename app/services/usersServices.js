const {
  users,
  deleteUser,
} = require('../models');

module.exports = {

  usersFindOneUserName: ({
    email,
  }) => users.findOne({
    where: {
      email,
    },
  }),
  createUser: async ({
    email,
    password,
  }) => {
    await users.create({
      email,
      password,
    });
  },

  updateUser: async (
    {
      email,
    },
    {
      password,
    }) => {
    await users.update({
      password,
    }, {
      where: {
        email,
      },
    });
  },

  deleteUser: async ({
    id,
  }) => {
    const user = await users.findOne({ where: { id } });
    await deleteUser.create({
      id: user.id,
      nickName: user.nickName,
      email: user.email,
      password: user.password,
    });
    await users.destory(
      {
        where: {
          id,
        },
      },
    );
  },
};
