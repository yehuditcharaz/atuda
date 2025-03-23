const jwt = require('jsonwebtoken');
const local_secretKey = process.env.JWT_SECRET_KEY;
const express = require('express');
const router = express.Router();
router.use('', async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Token missing' });
    }
    try {
        if (!local_secretKey) {
            return res.status(401).json({ message: 'System error - missing permission' });
        }
        const decoded = jwt.verify(token, local_secretKey);
        const user = JSON.stringify(decoded.user_details);
        req.user = user;        
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
});
module.exports =  router;