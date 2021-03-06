const User = require ('../models/User');
const bcrypt =  require ('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const  scriptUsername = 'controllers/user.js : ';

/*
  This file is a set of middlewares handling User  requests.
*/


/* 
 -----------------------------------------------------------------------  
1. USER SIGN UP   : signup()
-------------------------------------------------------------------------
API : POST /api/auth/signup
-------------------------------------------------------------------------
Input : req.body.email, req.body.password
{ email: string,password: string }

Description : 
This function creates  a user by 
    hashing the input  password / this hashing will be used to compare the login password
    creating the user in  mongodb with  the hashed password and the email 
  
The response :  { message: String }

*/

exports.signup = (req, res, next) => {
 
    const funcName =  scriptUsername + ' - signup() : ';
    console.log("========================================================================>")
    console.log (funcName + 'begin '  );
   
    // Hash the password 
    // -----------------
    console.log (funcName  + " Email =  = ", req.body.email);
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
            console.log (funcName  + " hashing = ", hash);

            // Build the Model User object
            // ----------------------------- 
            const user = new User({email: req.body.email, password: hash});

            console.log (funcName  + " signup user =  ", user);

            // Create a user in mongodb
            // ------------------------- 
            user.save().then(() =>
            { 
                console.log (funcName  + " signup OK    ");
                res.status(201).json({ message: 'User signed up!' })
           })
            .catch(error => {
                console.log (funcName  + " signup ERROR    ", error );
                res.status(400).json({ error });
            });
    })
    .catch(error => {
          console.log (funcName  + " signup ERROR  : ", error );
          res.status(500).json({ error })
    });
};


/*  
-----------------------------------------------------------------------  
2. USER SIGN IN  : login()
---------------------------------------------------------------------------
API : POST /api/auth/signup
-------------------------------------------------------------------------
Input : req.body.password, req.body.email
{ email: string,password: string }

Description : 
This function is in charge of the user signs in.
  - it checks if the user already exists in DB 
  - Compare  the provided password with the hashed  password in db 
  - if it is equal, 
      then a  token is generated  using the user id .

The response :  { message: String }
*/


  exports.login = (req, res, next) => {
  
    const funcName =  scriptUsername + ' - login() : ';
    console.log("========================================================================>")
    console.log (funcName + 'begin '  );
    console.log (funcName + 'email =  ', req.body.email  );

    // Check that  user exists in DB  by using the email 
    // ---------------------------------------------------

    User.findOne({ email: req.body.email })
      .then(user => {

        if (!user) {
           console.log (funcName + 'email Not found ', req.body.email  );
            return res.status(401).json({ error: 'User not found !' });
        }
       
        console.log (funcName + 'email  found ', req.body.email  ); 

        //  Check password by comparing hashed password  stored in db
        // ---------------------------------------------------------

        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
              console.log (funcName + 'Wrong password  req.body.password', req.body.password ); 
              return res.status(401).json({ error: 'Wrong password  !' });
            }
        
            console.log (funcName + 'controllers Providing the token'   ); 

            // Generate Token and send it in the response 
            // --------------------------------------------

            let  secret_token =  process.env.SECRET_TOKEN;   // 'RANDOM_TOKEN_SECRET'
            let s_token = jwt.sign(
                { userId: user._id },
                   secret_token,
                  { expiresIn: '24h' });


            console.log (funcName + 'user id '  , user._id  );             
            console.log (funcName + 'the token'  , s_token  ); 
            console.log (funcName + 'Sign in OK '  ); 

            // Send the response with the token and user id 
            // --------------------------------------------
            res.status(200).json({
              userId: user._id,
              token: s_token
            });
        })
        .catch(error => { 
            console.log (funcName + ' Error Sign in ', error   ); 
            res.status(500).json({ error })
        });
      })
      .catch(error => {  
          console.log (funcName + ' Error Sign in ', error   ); 
          res.status(500).json({ error })
      });
};
      
console.log (scriptUsername + 'loaded  '  );

