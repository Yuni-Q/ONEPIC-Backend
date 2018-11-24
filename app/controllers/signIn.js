
const express = require('express');
const loginServices = require('../services/loginServices');

const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();

router.post('/', isNotLoggedIn, (req, res, next) => {
  console.log('aa');
  loginServices.login(req, res, next);
});

router.delete('/', isLoggedIn, async (req, res) => {
  loginServices.logout(req, res);
});

module.exports = router;
