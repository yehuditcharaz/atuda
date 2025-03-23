const express = require('express');
const { create, read, update, deleteRow} = require('../modules/evaluations');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const response = await create(req.body);
    res.status(200).send(response)
  }
  catch (error) {
    res.status(500).send(error.message);
  }
});
 
router.get('/read', async (req, res) => {
  try {
    const response = await read(req.query);
    res.status(200).send(response.rows);
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