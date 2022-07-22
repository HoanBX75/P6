const jwt = require('jsonwebtoken');
require('dotenv').config();
const  scriptAuthName = 'controllers/auth.js : ';

/*
Description : 
  This file is a  middleware that takes  the token provided in request 
  and check it against the user issuing the request.
  If it is fine, the userId is added to the req .
*/


module.exports = (req, res, next) => {
  console.log("========================================================================>")
  try {
    /* Get the token from the header */
    /* ----------------------------- */
    const token = req.headers.authorization.split(' ')[1];
    console.log (scriptAuthName + 'begin ');

    /* Get the the userId */
    /* ------------------- */
    let  secret_token =  process.env.SECRET_TOKEN;   // 'RANDOM_TOKEN_SECRET'
    const decodedToken = jwt.verify(token, secret_token);
    const userId = decodedToken.userId;
    console.log (scriptAuthName + 'token userId  = ',  userId);
    console.log (scriptAuthName + 'req  = ',  req);

    if (req.body.userId && req.body.userId !== userId) {
      console.log (scriptAuthName + 'Authorization NOK invalid user', req.body.userId)
      throw 'Invalid user ID';
    } else {
      console.log (scriptAuthName + 'Authorization OK');
      /* add the userId to the req */
      /* ------------------------- */
      req.userId = userId; /* store  userId as it will be use to control the  access 
                             when updating a sauce */
      next();
    }

  } catch (err) {

    console.log (scriptAuthName + 'Authorization NOK err= ' , err);
    console.log (scriptAuthName + 'Authorization NOK authorization= ' , req.headers.authorization);
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

console.log (scriptAuthName + 'loaded  '  );
