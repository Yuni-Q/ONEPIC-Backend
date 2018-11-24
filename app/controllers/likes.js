const express = require('express');
const db = require('../models');
const { isLoggedIn } = require('../helpers/checkLogin');
const { resultFormat } = require('../helpers/formHelper');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
  const read = await db.likes.findAll({});
  res.json(resultFormat(true, null, read));
});


router.post('/', isLoggedIn, async (req, res) => {
  const { id: userId } = req.user;
  const { boardId } = req.body;
  const read = await db.likes.create({
    userId,
    boardId,
  });
  res.json(resultFormat(true, null, read));
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    await db.likes.destroy({
      where: {
        id,
      },
    });
    res.json(resultFormat(true, null));
  } catch (error) {
    res.json(resultFormat(false, '에러발생', error));
  }
});

module.exports = router;
