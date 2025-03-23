const jwt = require('jsonwebtoken');

const local_secretKey = process.env.JWT_SECRET_KEY;
const generateToken = (user, secretKey = local_secretKey, time = '12h') => {    
    if (!secretKey) {
        secretKey = local_secretKey;
    }
    if (!time) {
        time = '12h';
    }
    const token = jwt.sign({ user_details: user }, secretKey, { expiresIn: time });
    return token;
}
module.exports = generateToken;