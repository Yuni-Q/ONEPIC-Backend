const express = require('express');
const jwt = require('jsonwebtoken');
const loginServices = require('../services/loginServices');
const {
  Users,
} = require('../models');
const {
  resultFormat,
} = require('../helpers/formHelper');

const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res) => {
  const {
    email,
    password,
  } = req.body;
  const secret = req.app.get('jwt-secret');

  const user = await Users.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    res.json(resultFormat(false, '이미 존재하는 이메일 입니다'));
    return;
  }

  if (user.password === password) {
    const p = new Promise((resolve, reject) => {
      jwt.sign({
          id: user._id,
          username: user.username,
          admin: user.admin
        },
        secret, {
          expiresIn: '7d',
          issuer: 'velopert.com',
          subject: 'userInfo'
        }, (err, token) => {
          if (err) reject(err)
          resolve(token)
        })
    })
    return p
  } else {
    throw new Error('login failed')
  }
  
  // check the user info & generate the jwt
  // check the user info & generate the jwt
  const check = (user) => {
    if (!user) {
      // user does not exist
      throw new Error('login failed');
    } else {
      // user exists, check the password
      if (user.verify(password)) {
        // create a promise that generates jwt asynchronously
        const p = new Promise((resolve, reject) => {
          jwt.sign({
              _id: user._id,
              username: user.username,
              admin: user.admin
            },
            secret, {
              expiresIn: '7d',
              issuer: 'velopert.com',
              subject: 'userInfo'
            }, (err, token) => {
              if (err) reject(err)
              resolve(token)
            })
        })
        return p
      } else {
        throw new Error('login failed')
      }
    }
  }
});

router.delete('/', isLoggedIn, async (req, res) => {
  loginServices.logout(req, res);
});

module.exports = router;
