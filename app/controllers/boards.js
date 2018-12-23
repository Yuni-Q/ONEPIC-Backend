const express = require('express');
const sequelize = require('sequelize');

const router = express.Router();
const db = require('../models');
const { resultFormat } = require('../helpers/formHelper');

router.get('/', async (req, res) => {
  // const read = await db.boards.findAll({});
  const query = `
    select
      * 
    from boards
      left join (SELECT boardId, count(*) as likeCounts FROM Node2.likes group by boardId) as counts
        on boards.id = counts.boardId;
    `;
  const result = await db.sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  console.log('result', result);
  res.json(resultFormat(true, null, result));
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // const read = await db.boards.findOne({
  //     where:{
  //       id,
  //     }
  //   });
  const query = `
    select
      * 
    from boards
      left join (SELECT boardId, count(*) as likeCounts FROM Node2.likes group by boardId) as counts
        on boards.id = counts.boardId
    where boards.id = ${id};
    `;
  const result = await db.sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  console.log('result', result);
  res.json(resultFormat(true, null, result[0]));
});

router.post('/', async (req, res) => {
  const {
    date,
    content,
    userId,
    location,
    lon,
    lat,
    share,
    imgUrl,
  } = req.body;
  const read = await db.boards.create({
    date, content, userId, location, lon, lat, share, imgUrl,
  });
  res.json(resultFormat(true, null, read));
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    date,
    content,
    userId,
    location,
    lon,
    lat,
    share,
    imgUrl,
  } = req.body;
  const read = await db.boards.update({
    date,
    content,
    userId,
    location,
    lon,
    lat,
    share,
    imgUrl,
  }, {
    where: {
      id,
    },
  });
  res.json(resultFormat(true, null, read));
});

// 게시글 id에 해당하는 글 지우기 -> deleteBoards에 넣기
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.deleteBoards.create;
  const read = await db.boards.destroy({
    where: {
      id,
    },
  });
  res.json(resultFormat(true, null, read));
});

module.exports = router;
