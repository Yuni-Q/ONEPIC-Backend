const express = require('express');
const sequelize = require('sequelize');
const dayjs = require('dayjs');

const router = express.Router();
const AWS = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const { isLoggedIn } = require('../helpers/checkLogin');

const db = require('../models');
const {
  resultFormat,
} = require('../helpers/formHelper');

router.get('/users/location', isLoggedIn, async (req, res) => {
  const { id: userId } = req.user;
  const read = await db.boards.findAll({
    where: {
      userId,
      location: {
        [sequelize.Op.ne]: null,
      },
    },
    group: 'location',
  });
  // console.log(read);
  const result = read.length;
  res.json(resultFormat(true, null, result));
});

router.get('/users/likes', isLoggedIn, async (req, res) => {
  // const read = await db.boards.findAll({});
  const query = `
    select
      * 
    from likes 
      join (
        select
          * 
        from boards
          join (
            SELECT
              boardId,
              count(*) as likeCounts
                FROM likes
                  join boards
                    on likes.boardId = boards.id 
                group by boardId) as counts
            on boards.id = counts.boardId) as myBoards
      where likes.userId = ${req.user.id};
    `;
  const result = await db.sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });
  res.json(resultFormat(true, null, result));
});

router.get('/users', isLoggedIn, async (req, res) => {
  // const read = await db.boards.findAll({});
  const query = `
    select
      * 
    from boards
      left join (SELECT boardId, count(*) as likeCounts FROM Node2.likes group by boardId) as counts
        on boards.id = counts.boardId
      where userId = ${req.user.id};
    `;
  const result = await db.sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });
  res.json(resultFormat(true, null, result));
});

router.get('/users/ninePick', isLoggedIn, async (req, res) => {
  console.log('aaaaaa');
  const query = `
    select
      * 
    from boards 
      where userId = ${req.user.id} and ninePick > 0;
    `;
  const result = await db.sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });
  res.json(resultFormat(true, null, result));
});

router.put('/users/ninePick', isLoggedIn, async (req, res) => {
  const { id: userId } = req.user;
  const { boardId, number } = req.body;
  const before = await db.boards.findOne({
    where: {
      userId,
      ninePick: number,
    },
  });
  if (before) {
    db.boards.update(
      {
        ninePick: 0,
      },
      {
        where: {
          userId,
          ninePick: number,
        },
      },
    );
  }
  await db.boards.update(
    {
      ninePick: number,
    },
    {
      where: {
        id: boardId,
      },
    },
  );
  res.json(resultFormat(true, null));
});

router.get('/', isLoggedIn, async (req, res) => {
  const {
    offset,
    limit,
    year,
    month,
    location,
    others,
  } = req.query;
  const date = dayjs(req.query.date).format('YYYY-MM-DD HH:mm:ss');
  console.log(date);
  const query = `
  select
    * 
  from boards
    left join (SELECT boardId, count(*) as likeCounts FROM Node2.likes group by boardId) as counts
      on boards.id = counts.boardId
    where createdAt <= '${date}'
  `;
  const query1 = others ? `${query} and userId != ${req.user.id}` : `${query} and userId = ${req.user.id}`;
  const query2 = year ? `${query1} and year(Date) = ${year} and month(Date) = ${month}` : query1;
  const query3 = location ? `${query2} and location = '${location}';` : query2;
  const totalBoards = await db.sequelize.query(query3, {
    type: sequelize.QueryTypes.SELECT,
  });
  const boards = totalBoards.slice(offset, limit);
  const totalCount = boards.length;
  const result = {
    totalCount,
    boards,
  };
  res.json(resultFormat(true, null, result));
});

router.post('/', isLoggedIn, async (req, res) => {
  if (!req.body.image) {
    const read = await db.boards.create({
      date: req.body.date,
      content: req.body.content,
      userId: req.user.id,
      location: req.body.location,
      lon: req.body.lon,
      lat: req.body.lat,
      share: req.body.share,
    });
    res.json(resultFormat(true, null, read));
    return;
  }
  AWS.config.update({
    accessKeyId: global.config.AWSAccessKeyId,
    secretAccessKey: global.config.AWSSecretKey,
  });
  const s3 = new AWS.S3();
  const form = new formidable.IncomingForm();

  // make upload dirName
  // const dirName = '';
  let possible = '0123456789abcdef';
  // for (var i = 0; i < 4; i++) dirName += possible.charAt(Math.floor(Math.random() * possible.length));
  // dirName = dirName + '-' + new Date().toISOString().substr(0, 10);

  // make upload fileName
  let fileName = '';
  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 8; i += 1) fileName += possible.charAt(Math.floor(Math.random() * possible.length));
  // 서버에 업로드 완료 후
  form.parse(req, async (err, fields, files) => {
    const { image } = files;
    const defaultPath = fileName;
    const imageUrl = defaultPath + path.parse(image.name).ext;

    // image upload
    // console.log('image path : ' + defaultPath + path.parse(image.name).ext);
    s3.upload({
      Bucket: 'yunhee',
      Key: imageUrl,
      ACL: 'public-read',
      Body: fs.createReadStream(image.path),
    }, (error, result) => {
      if (error) console.log(error);
      else console.log(result);
    });
    const baseUrl = 'https://yunhee.s3.amazonaws.com/';
    const imgUrl = baseUrl + imageUrl;
    const read = await db.boards.create({
      date: fields.date,
      content: fields.content,
      userId: req.user.id,
      location: fields.location,
      lon: fields.lon,
      lat: fields.lat,
      share: fields.share,
      imgUrl,
    });
    res.json(resultFormat(true, null, read));
    // unlink tmp files
    fs.unlinkSync(image.path);
  });
});

router.put('/:id', isLoggedIn, async (req, res) => {
  if (!req.body.image) {
    const read = await db.boards.update(
      {
        date: req.body.date,
        content: req.body.content,
        userId: req.user.id,
        location: req.body.location,
        lon: req.body.lon,
        lat: req.body.lat,
        share: req.body.share,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
    res.json(resultFormat(true, null, read));
    return;
  }
  AWS.config.update({
    accessKeyId: global.config.AWSAccessKeyId,
    secretAccessKey: global.config.AWSSecretKey,
  });
  const s3 = new AWS.S3();
  const form = new formidable.IncomingForm();

  // make upload dirName
  // const dirName = '';
  let possible = '0123456789abcdef';
  // for (var i = 0; i < 4; i++) dirName += possible.charAt(Math.floor(Math.random() * possible.length));
  // dirName = dirName + '-' + new Date().toISOString().substr(0, 10);

  // make upload fileName
  let fileName = '';
  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 8; i += 1) fileName += possible.charAt(Math.floor(Math.random() * possible.length));

  // 서버에 업로드 완료 후
  form.parse(req, isLoggedIn, async (err, fields, files) => {
    const { image } = files;
    const defaultPath = fileName;
    const imageUrl = defaultPath + path.parse(image.name).ext;

    // image upload
    // console.log('image path : ' + defaultPath + path.parse(image.name).ext);
    s3.upload({
      Bucket: 'yunhee',
      Key: imageUrl,
      ACL: 'public-read',
      Body: fs.createReadStream(image.path),
    }, (error, result) => {
      if (error) console.log(error);
      else console.log(result);
    });
    const baseUrl = 'https://yunhee.s3.amazonaws.com/';
    const imgUrl = baseUrl + imageUrl;
    const read = await db.boards.update(
      {
        date: fields.date,
        content: fields.content,
        userId: fields.userId,
        location: fields.location,
        lon: fields.lon,
        lat: fields.lat,
        share: fields.share,
        imgUrl,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
    res.json(resultFormat(true, null, read));
    // unlink tmp files
    fs.unlinkSync(image.path);
  });
});

router.get('/users/:id', isLoggedIn, async (req, res) => {
  // const read = await db.boards.findAll({});
  const { id } = req.params;
  const query = `
    select
      * 
    from boards
      left join (SELECT boardId, count(*) as likeCounts FROM Node2.likes group by boardId) as counts
        on boards.id = counts.boardId
      where userId = ${id};
    `;
  const result = await db.sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });
  res.json(resultFormat(true, null, result));
});

router.get('/:id', isLoggedIn, async (req, res) => {
  const {
    id,
  } = req.params;
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
  const result = await db.sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });
  console.log('result', result);
  res.json(resultFormat(true, null, result[0]));
});

// 게시글 id에 해당하는 글 지우기 -> deleteBoards에 넣기
router.delete('/:id', isLoggedIn, async (req, res) => {
  const {
    id,
  } = req.params;
  // await db.deleteBoards.create({
  // });
  const read = await db.boards.destroy({
    where: {
      id,
    },
  });
  res.json(resultFormat(true, null, read));
});

module.exports = router;
