const express = require('express');
const { create, read, update, deleteRow} = require('../modules/attachment');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/create', upload.single("file"), async (req, res) => {
  try {
    const response = await create(req);
    res.status(200).send(response);
  } 
  catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/read', async (req, res) => {
  try {
    const response = await read(req.query);    
    res.status(200).send(response);
  }
  catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/update', async (req, res) => {
  try {
    const response = await update(req.body);
    res.status(200).send(response);
  }
  catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/delete', async (req, res) => {
  try {
    const response = await deleteRow(req.body);
    res.status(200).send(response);
  }
  catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;