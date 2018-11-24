const express = require('express');
const jwt = require('jsonwebtoken');
const {
  users,
} = require('../models');
const {
  resultFormat,
} = require('../helpers/formHelper');

const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../helpers/checkLogin');

const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res) => {
  const {
    email,
    password,
  } = req.body;
  const secret = req.app.get('jwt-secret');

  const user = await users.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    res.json(resultFormat(false, '이미 존재하는 이메일 입니다'));
    return;
  }

  if (user.password === password) {
    const token = new Promise((resolve, reject) => {
      jwt.sign(
        {
          id: user.id,
          nickName: user.nickName,
          email: user.email,
        },
        secret, {
          expiresIn: '7d',
          issuer: 'ONEPIC',
          subject: 'userInfo',
        }, (err, t) => {
          if (err) reject(err);
          resolve(t);
        },
      );
    });
    await users.update({ token }, { where: { email } });
    res.json(resultFormat(true, null, token));
    return;
  }
  res.json(resultFormat(false, '이미 존재하는 이메일 입니다'));
});

router.delete('/', isLoggedIn, async (req, res) => {
  try {
    await users.update({
      token: null,
    }, {
      where: {
        id: req.id,
      },
    });
  } catch (error) {
    res.json(resultFormat(false, '에러가 발생했습니다.', error));
  }
  res.json(resultFormat(true, null));
});

module.exports = router;
