const express = require('express');

const router = express.Router();
const db = ('../models');


router.get('/likes', async (req, res) => {
    const read = await db.likes.findAll({});
    res.json(read);
});

router.get('/likes/:boardId', async (req, res) => {
  const { boardId } = req.params;
  const read = await db.likes.findAll({
    where:{
      boardId,
    }
  });
  res.json(read);
});


router.post('/likes', async (req, res) => {
    const { user } = req.user;
    const { boardId, createdAt } = req.body;
    const read = await db.likes.create({
        user,
        boardId,
        createdAt
    });
    res.json(read);
});

router.delete('/likes/:id', async (req, res) => {
    const { id } = req.params;
    const read = await db.likes.destroy({
      where: {
        id,
      },
    });
    res.json(read); 
});

module.exports = router;


