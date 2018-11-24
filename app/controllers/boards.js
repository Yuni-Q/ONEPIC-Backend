const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/boards', async (req, res) => {
    const read = await db.boards.findAll({});
    res.json(read);
});

router.post('/boards', async (req, res) => {
    const { id, title, createdAt, updatedAt, date, content, userId, location, lon, lat, share, imgUrl } = req.body;
    const read = await db.boards.create({
        id, title, createdAt, updatedAt, date, content, userId, location, lon, lat, share, imgUrl,
    });
    res.json(read);
});

router.put('/boards/:id', async (req, res) => {
    const { id } = req.params;
    const { id, title, createdAt, updatedAt, date, content, userId, location, lon, lat, share, imgUrl } = req.body;
    const read = await db.boards.update({
        id: id, 
        title: title,
        createdAt: createdAt,
        updatedAt: updatedAt, 
        date: date, 
        content: content,
        userId: userId, 
        location: location,
        lon: lon, 
        lat: lat,
        share: share, 
        imgUrl: imageUrl
    }, {
        where: {
        id,
    },
  });
  res.json(read);
  
});

//게시글 id에 해당하는 글 지우기 -> deleteBoards에 넣기 
router.delete('/boards:id', async (req, res) => {
    const { id } = req.params;
    await db.deleteBoards.create
    const read = await db.boards.destroy({
      where: {
        id,
      },
    });
    
    res.json(read);

});

module.exports = router;
