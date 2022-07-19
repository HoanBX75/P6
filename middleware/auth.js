const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    let  secret_token =  process.env.SECRET_TOKEN;   // 'RANDOM_TOKEN_SECRET'
    const decodedToken = jwt.verify(token, secret_token);
    const userId = decodedToken.userId;
  
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      console.log ("auth.js :  Authorization ok for userId = ", userId);
      req.userId = userId;
      next();
    }

  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
console.log ("auth.js fin ");

