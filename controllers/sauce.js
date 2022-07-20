const Sauce = require('../models/sauce');
const fs = require('fs');
const scriptSaucename = 'controllers/sauce.js : ';

/*
  This file is a set of middlewares handling sauce requests.
*/


/*  
-----------------------------------------------------------------------  
1. CREATE SAUCE  : createSauce()
---------------------------------------------------------------------------
API : POST  /api/sauces
-----------------------------------------------------------------------
Description : 
This function creates  a sauce in mongodb.
It does the following : 
    - extract the sauce attributes from the request body
    - build the other sauce attributes
    - Create the sauce in the mongodb 

Inputs : 
Input  sauce information is stored in  the body as :
controllers/sauce.js :  - createSauce :  req.body.sauce  =  
{"name":"ggg","manufacturer":"ggg","description":"ggg","mainPepper":"gg","heat":2,"userId":"62d6d2d72534388e8e25e6fd"}
In response, it returns a message  as  { message: String }
*/


exports.createSauce = (req, res, next) => {
    const funcName =  scriptSaucename + ' - createSauce() : ';
    console.log("========================================================================>")
    console.log (funcName + 'begin '  );
    console.log (funcName  + " req.body = ", req.body);
    console.log (funcName  + " req.body.sauce  = ", req.body.sauce );

    // Get sauce fields from the request body
    // -------------------------------------
    const sauceObjet = JSON.parse(req.body.sauce);
    console.log (funcName  + " sauceObjet = ", sauceObjet);
    
    delete req.body._id
      
    let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    console.log (funcName  + " url0  ", url0);

    // Build Model Sauce object :
    // -------------------------
    const sauce = new Sauce ({
                ...sauceObjet,
                likes: 0,
                dislikes:0,
                imageUrl: url0 ,
                usersLiked: [],
                usersDisliked: [],
    })
    console.log (funcName  + " model Sauce  ", sauce);
               
    // Create Sauce object in mongodb
    // ------------------------------
    sauce.save()
    .then(() => {
        console.log (funcName + 'OK sauce created  ');  
        res.status(201).json({message: "Sauce added !"})
    })
    .catch((error) => {
        console.log (funcName + ' Error  =  ', error   ); 
        res.status(400).json({error})
    })
}
        

/*  
-----------------------------------------------------------------------  
3. GET ALL  SAUCES  : getAllSauce()
-----------------------------------------------------------------------
API : GET  /api/sauces/
id : identifier of a sauce 
-----------------------------------------------------------------------
Description : 
This function gets  all sauces  from mongodb.
In the response, it returns a Json table containing all the sauces (a 
    sauce is following the model object sauce for mongodb mongodb). 
Returns Array of sauce 
*/

exports.getAllSauce = (req, res, next) => {
   
    const funcName =  scriptSaucename + ' - getAllSauce() : ';
    console.log("========================================================================>");
    console.log (funcName + 'begin '  );

    // Get Sauces object from  mongodb
    // --------------------------------

    Sauce.find()
    .then(sauces => {
            /* Sauces are obtained */
            console.log (funcName + 'OK got  sauces  ');   
            res.status(200).json(sauces)
    })
        .catch(error => { 
            /* Error  occured  */
            console.log (funcName + ' Error  =  ', error   ); 
            res.status(400).json({error})
    });
}

/*  
-----------------------------------------------------------------------  
3. GET ONE  SAUCE  : getOneSauce()
-----------------------------------------------------------------------
API : GET /api/sauces/:id 
id : identifier of a sauce 
-----------------------------------------------------------------------
Description : 
This function gets  a sauce information from mongodb.
In the response, it returns a Json string form the returned 
model object sauce obtained from mongodb. 

Returns a Single sauce 
*/

exports.getOneSauce = (req, res, next) => {
        const funcName =  scriptSaucename + ' - getOneSauce() : ';
        console.log("========================================================================>");
        console.log (funcName + 'begin '  );

        // Get Sauce object from  mongodb
        // --------------------------------

        Sauce.findOne({_id: req.params.id})
        .then(sauce => { 
            /* Sauce is obtained */
            console.log (funcName + 'OK got  sauce =  ', sauce   );                     
             res.status(200).json(sauce)
        })
        .catch(error => {
             /* Error  occured  */
            console.log (funcName + ' Error  =  ', error   ); 
            res.status(400).json({error})
        });
}

/*  
-----------------------------------------------------------------------  
4. DELETE  SAUCE  : deleteSauce()
-----------------------------------------------------------------------
API : DELETE  /api/sauces/:id 
id : identifier of a sauce 
-----------------------------------------------------------------------
Description : 
This function deletes  a sauce.
   Get the sauce from mongodb
   It checks first if the requestor user is the owner of the sauce.
   If a image file is provided : 
        - deletes the previous file image 
        - updates the sauce in monogodb mongodb 
    If an image is not provided : 
        - updates the sauce in monogodb mongodb 

The response :  { message: String }

*/

exports.deleteSauce = (req, res, next) =>{
    const funcName =  scriptSaucename + ' - deleteSauce() : ';
    console.log("========================================================================>");
    console.log (funcName + " sauce id (params id ) = ", req.params.id);

   //  Get the sauce from mongodb  by the id 
   // --------------------------------------

    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        console.log (funcName + " Found sauce id = ", req.params.id);

        // Check that the requestor is the owner of the sauce 
        // -------------------------------------------------

        console.log (funcName +  ' sauce userid  = ' +  sauce.userId);
        console.log (funcName +    'req userid  = ' +  req.userId);

        if ( sauce.userId !== req.userId) {
            console.log (funcName +    'unauthorized request  ' );
            res.status(401).json(  { message: 'unauthorized request' } );
        }
        else {
            try {
                console.log (funcName +    'Unlinking the file   ' );
                const filename = sauce.imageUrl.split('/images/')[1];
                console.log (funcName + " Image Filename to remove  = ", filename);

                // Unlink the image  (delete the image )
                // --------------------------------------
                 fs.unlink(`images/${filename}`, (err) => {

                    if (err) {
                        console.log (funcName + "  ERROR  deleted file  = ", filename);
                        console.log (funcName + "  ERROR  deleted file err  = ", err);
                         throw err; 
                     }

                     console.log (funcName + " Deleted filename   = ", filename);

                     // Delete the object Sauce in Mongodb  
                    // -----------------------------------
                    Sauce.deleteOne({_id: req.params.id})
                    .then(() => {
                       console.log (funcName + " OK Deleted sauce id  = ", req.params.id);
                      res.status(200).json({message: 'Sauce supprimé.'})
                    })
                    .catch(error => {
                        console.log (funcName + " Error mongodb update fails   = ", error);
                         res.status(400).json({error})
                    });
                });
            }
            catch (error){
                   // Error occured in the unlink ;
                   console.log (funcName +    'Error while deleting image and  updating   error =  ', error  );
                   res.status(500).json( error );
            }
        }
    })
    .catch(error => {
        console.log (funcName + " Error Sauce delete - Sauce not found    = ", error);
        res.status(400).json({error});
    } );          
}

/*  
-----------------------------------------------------------------------  
5. UPDATE SAUCE  : upDateSauce()
-----------------------------------------------------------------------
API : PUT /api/sauces/:id 
id : identifier of a sauce 
-----------------------------------------------------------------------
Description : 
This function updates  a sauce.
   Get the sauce from mongodb
   It checks first if the requestore user is the owner of the sauce.
   If a image file is provided : 
        - deletes the previous file image 
        - updates the sauce in monogodb mongodb 
    If an image is not provided : 
        - updates the sauce in monogodb mongodb 

Inputs : 
    1/ without file (the sauce information is in the body as a Json object  string )
    Sauce as JSON . 
    req.body  =  {
    name: 'titi 2',
    manufacturer: 'titi',
    description: 'titi',
    mainPepper: 'titi',
    heat: 2,
    userId: '62d6d2d72534388e8e25e6fd'
    }

    2/ with a file :  (the sauce information is in the body as a sauce String   )
         req.body.sauce : String 
                    sauce: '{"name":"dd","manufacturer":"lalou",
                    "description":"good sauce with vegetables","mainPepper":"phuquoc",
                     "heat":2,"userId":"62cc25078cd326528ddeb819"}'
        req.file: {..} 

            fieldname: 'image',
            filename: 'firelli_hot_sauce.jpg1658239437453.jpg',
            originalname: 'firelli_hot_sauce.jpg',
            destination: 'images',

The response :  { message: String }

*/

exports.upDateSauce = (req, res, next) => {
    const funcName =  scriptSaucename + ' - upDateSauce() : ';
 
    console.log("========================================================================>");
   //  console.log (funcName + " req  = ", req );
    console.log (funcName + " req file  = ", req.file );
    console.log (funcName + " req body  = ", req.body );

   //  Get the sauce from mongodb  
   // ============================

    Sauce.findOne({_id: req.params.id})
    .then(sauce => {

        // Sauce is found  
        console.log (funcName + " Found in MongoDB sauce id = ", req.params.id);

        // Check that the requestor is the owner of the sauce 
        // ===================================================

        console.log (funcName +  ' sauce userid  = ' +  sauce.userId);
        console.log (funcName +    'req userid  = ' +  req.userId);

        if ( sauce.userId !== req.userId) {
               res.status(401).json(  { message: 'unauthorized request' } );
        }
        else 
        {
            // 
            console.log (funcName +    'OK : requestor is the owner of the sauce ' );

            if (req.file) {

                // ============================================                        
                 // The image is to udpate  :  Sauce as JSON
                // ============================================                      
                 console.log (funcName + " Image to update   ");

       
                 let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                 const filename = sauce.imageUrl.split('/images/')[1];
                 console.log (funcName + " deleting this file  = ", filename);

                 // Unlink the image  (delete the image )
                 // --------------------------------------
                 try {
                    fs.unlink(`images/${filename}`, (err) => {
        
                        if (err) {
                            console.log (funcName + "  ERROR  deleted file  = ", filename);
                            console.log (funcName + "  ERROR  deleted file err  = ", err);
                             throw err; 
                         }

                         // The delete image file is done : 
                         // =============================
                         console.log (funcName + " Ok deleted file  = ", filename);

                         let osauce =  JSON.parse(req.body.sauce);

                          const sauceObject = {
                          ...osauce,
                          imageUrl: url0,
                          };
        
                        console.log (funcName + " req osauce  = ", osauce);
                        console.log (funcName + "  imageUrl  = ", url0); 
                         console.log (funcName + " For the update :  input sauceObject   = ", sauceObject);
        
                        // Update the sauce 
                        // ================
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() =>{ 
                           console.log (funcName + " OK sauce updated -  id   = ", req.params.id);
                          
                           res.status(200).json({ message: 'Sauce updated sucessfully !' });
                        })
                        .catch(error =>  {
                                            console.log (funcName + " error  update  -  error   = ", error);
                                            res.status(400).json( error );
                        });
        
                    });
                }
                catch (err ) {
                    // Error occured in the unlink ;
                    res.status(500).json( err );
                } 
            }
            else {
                // ==================================================               
                // The Sauce  image is not updated :  Sauce as JSON
                // =================================================

                console.log (funcName + " No  image to update   ");
                const sauceObject = { ...req.body } ;

                console.log (funcName + " Input sauceObject    ", sauceObject);
                // Update the sauce 
                // ================
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => {
                        console.log (funcName + " OK sauce updated -  id   = ", req.params.id);
                      
                        res.status(200).json({ message: 'Sauce updated sucessfully  !' })
                    })
                    .catch(error => res.status(400).json({ error }));

            }
        }    

    })
    .catch(error => {
        console.log (funcName + " Error Sauce update - Sauce not found    = ", error);
        res.status(400).json({error});
    } );    
}


/*  
-----------------------------------------------------------------------  
5. LIKE  DISLIKE SAUCE :  likeDisslikeSauce()
-----------------------------------------------------------------------
API  POST  /api/sauces/:id/like
id is the sauce Id
-----------------------------------------------------------------------
Description : 
This function gives a Like status for a sauce and according to a user.
if like = 0 then it cancels the like or dislike by removing the user 
from the like and dislike list 
If like =1  then the user is added to a like list .
if the like = -1  then the user is in the  dislike list 

Inputs : 
In the body 
  { userId: String, like: Number }
Returns : 
In response, it returns a message  as  { message: String }
*/


exports.likeDisslikeSauce = (req, res, next) => {
        const funcName =  scriptSaucename + ' - likeDisslikeSauce() : ';

        console.log("========================================================================>")

        const userId = req.body.userId;
        const like = req.body.like;
      
        console.log (funcName + " userId   ", userId);
        console.log (funcName + " like   ", like);
        console.log (funcName + " sauce id   ", req.params.id);

         // Search for a sauce with the id 
         // ---------------------------------
        Sauce.findOne({_id: req.params.id})
        .then((sauce) => {

             // Get the  likes 
             let usersLiked =  sauce.usersLiked;
             let usersDisliked =  sauce.usersDisliked;
            let new_usersLiked = [];
            let new_usersDisliked =  [];


             // Build the new dislike and like user list    
            // -------------------------------------------

            console.log (funcName + " sauce found   ", sauce);
            switch (like) {
                case 0: 
                    // the user cancels his choice 
                    // so we need to remove the user from the like list or dislike list 
                    // https://developer.mozilla.org/fr/docs/Learn/JavaScript/First_steps/Arrays

                    let l_liked = usersLiked.length;
                    new_usersLiked = usersLiked.filter (function(value, index, arr){ 
                        return userId != value ; });

                   
                    new_usersDisliked = usersDisliked.filter (function(value, index, arr){ 
                            return userId != value ; });
   
                    break;
                case 1 :   
                    // the user likes 
                    // add the user in the like list 
                    usersLiked.push (userId);
                    new_usersLiked = usersLiked;
                    new_usersDisliked = usersDisliked;
                    break;
                case -1 :   
                // the user does not like 
                // add the user in the dikslike list  
                    usersDisliked.push (userId);
                    new_usersDisliked = usersDisliked;
                    new_usersLiked = usersLiked;
                    break;
        
            }

            console.log (funcName + " new usersLiked   ", new_usersLiked);
            console.log (funcName + " new usersLiked  length  ", new_usersLiked.length);
            console.log (funcName + " new usersDisliked   ", new_usersDisliked);
            console.log (funcName + " new usersLiked  length  ", new_usersDisliked.length);

            // Update the sauce 
            const newSauceLikeDislike = {
                usersLiked: new_usersLiked,
                usersDisliked: new_usersDisliked,
                likes: new_usersLiked.length,
                dislikes: new_usersDisliked.length
            }

            // Update the sauce with the new like and dislike user lists     
            // ---------------------------------------------------------
            Sauce.updateOne({ _id: req.params.id }, {...newSauceLikeDislike, _id: req.params.id})
            .then(()=> { 
                console.log (funcName + " OK sauce updated ");
                res.status(201).json({message: 'like/dislike mis à jour.'})
            })
            .catch(error => {
                console.log (funcName + " NOK sauce updated error ", error);
                res.status(400).json({error})
            });


        })
        .catch(error => { 
            console.log (funcName + " Sauce not found , error = ", error);
            res.status(400).json({error})
        });       

}

console.log (scriptSaucename + 'loaded  '  );
