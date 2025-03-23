require('dotenv').config();
const express = require('express');
const router = express.Router();
const { read } = require('../modules/users');
const local_secretKey = process.env.JWT_SECRET_KEY;
const generateToken = require('../auth/jwt');
const bodyParser = require('body-parser');
const {sendMail} = require('../services/utils/mail');


router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const answer = await read({ condition: `email='${email}'` });
        if (answer.rows.length < 1) {
            return res.status(301).send("User not found");
        }
        const user_details = answer.rows[0];
        if (user_details.password != password) {
            return res.status(401).send("Incorrect password");
        }
        const jwt = generateToken(user_details, local_secretKey, '24h');
        return res.status(200).setHeader('Authorization', jwt).send({ data: user_details,token:jwt });


    } catch (error) {
        console.error("Error during login process:", error);
        return res.status(500).send("Error during login process");
    }
});

router.post('/resetPassword',  (req, res) => {
    try {
      const recipient = req.body.recipient;
      const subject = req.body.subject;
      const body = req.body.body;       
      const response = sendMail({recipient:recipient,subject:subject,body:body});
      return res.status(200).send(response)
    }
    catch (error) {
      return res.status(500).send(error.message);
    }
  });

module.exports = router;