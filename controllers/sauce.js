const Sauce = require('../models/sauce');
const fs = require('fs');
scriptname = 'controllers/sauce.js : ';
console.log (scriptname + 'begin '  );

// 1.  CREATE SAUCE 

exports.createSauce = (req, res, next) => {
    const funcName =  scriptname + ' - createSauce : ';
        console.log (funcName + "debut");
        console.log (funcName  + " req.body = ", req.body);

        const sauceObjet = JSON.parse(req.body.sauce);
        console.log (funcName  + " req.sauceObjet = ", sauceObjet);
     
      //   res.status(201).json({message: "Sauce ajouté !"});
    
            delete req.body._id
            console.log (funcName  + " req.sauceObjet (after delete _id) = ", sauceObjet);
      
         let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
         console.log (funcName  + " url0  ", url0);

     //    let url = "http://www.hoanbx.fr/Projects/P3/images/restaurants/jay-wennington-N_Y88TWmGwA-unsplash.jpg";
     //    console.log (funcName  + " url  ", url);

            const sauce = new Sauce ({
                ...sauceObjet,
                likes: 0,
                dislikes:0,
                imageUrl: url0 ,
                usersLiked: [],
                usersDisliked: [],
            })
            console.log (funcName  + " model Sauce  ", sauce);
      
           
            sauce.save()
            .then(() => res.status(201).json({message: "Sauce ajouté !"}))
            .catch((error) => res.status(400).json({error}))
}
        
    
// 2. GET ALL SAUCE

exports.getAllSauce = (req, res, next) => {
    console.log (scriptname + 'getAllSauce '  );
        Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
    }


// 3. GET ONE SAUCE 
exports.getOneSauce = (req, res, next) => {
    console.log (scriptname + 'getOneSauce '  );

        Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
    }

// 4. DELETE  ONE SAUCE 

exports.deleteSauce = (req, res, next) =>{
    const funcName =  scriptname + ' - deleteSauce : ';
    console.log (funcName + " sauce id (params id ) = ", req.params.id);

    // Search for a sauce with the id 
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        console.log (funcName + " Found sauce id = ", req.params.id);
        const filename = sauce.imageUrl.split('/images/')[1];
        console.log (funcName + " Image Filename to remove  = ", filename);

        fs.unlink(`images/${filename}`, () => {
            // Image sauce is deleted 
            console.log (funcName + " Deleted filename   = ", filename);
            // Delete the object Sauce in Mongodb  
            Sauce.deleteOne({_id: req.params.id})
            .then(() => {
                console.log (funcName + " Deleted sauce id  = ", req.params.id);
                res.status(200).json({message: 'Sauce supprimé.'})

            })
            .catch(error => res.status(400).json({error}));
            });

        })
    .catch(error => {
        console.log (funcName + " Error Not Deleted file   = ", error);
        res.status(400).json({error})
    } );

   //  res.status(200).json({message: 'Sauce supprimé.'});
/*    
    Sauce.deleteOne({_id: req.params.id})
     .then(() => res.status(200).json({message: 'Sauce supprimé.'}))
                    .catch(error => res.status(400).json({error}));

*/                    
}


// 6. UPDATE SAUCE 
/*
PUT /api/sauces/:id 
EITHER
Sauce as JSON
OR { sauce: String,
image: File }
The response :  { message: String }

*/

exports.upDateSauce = (req, res, next) => {
    const funcName =  scriptname + ' - upDateSauce : ';
    // Search for a sauce with the id 
    console.log("============");
   //  console.log (funcName + " req  = ", req );
    console.log (funcName + " req file  = ", req.file );
    console.log (funcName + " req image  = ", req.image );
    console.log (funcName + " req body  = ", req.body );

   if (req.file ) {
       // The image is to udpate  :  Sauce as JSON
    console.log (funcName + " Image to update   ");
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {

        console.log (funcName + " Found in MongoDB sauce id = ", req.params.id);
        let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        const filename = sauce.imageUrl.split('/images/')[1];
        console.log (funcName + " deleting this file  = ", filename);

        
        fs.unlink(`images/${filename}`, () => {
            console.log (funcName + " Ok deleted file  = ", filename);
            let osauce =  JSON.parse(req.body.sauce);
            console.log (funcName + " req osauce  = ", osauce);
            console.log (funcName + "  imageUrl  = ", url0);
            const sauceObject = {
                  ...osauce,
                imageUrl: url0,
            };

            console.log (funcName + " input sauce  = ", sauceObject);

            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() =>{ 
                console.log (funcName + " OK sauce updated -  id   = ", req.params.id);
                console.log("============");
                res.status(200).json({ message: 'Sauce modifiée avec succès !' });
            })
            .catch(error => res.status(400).json({ error }))
        })    ;
        // .catch(error => res.status(500).json({ error })); 

    })
    .catch(error => {
        console.log (funcName + " Error Sauce update - error    = ", error);
        res.status(400).json({error})
    } );    
   }
   else {
   // The image is not updated :  Sauce as JSON
   // ============================================

    console.log (funcName + " No  image to update   ");
    const sauceObject = { ...req.body } ;
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => {
         console.log (funcName + " OK sauce updated -  id   = ", req.params.id);
         console.log("============");
         res.status(200).json({ message: 'Sauce modifiée avec succès !' })
        })
        .catch(error => res.status(400).json({ error }));

   }



}



// 5. LIKE  DISLIKE SAUCE     
// /api/sauces/:id/like
// { userId: String, like: Number }
// { message: String }

    exports.likeDisslikeSauce = (req, res, next) => {

        const funcName =  scriptname + ' - likeDisslikeSauce : ';
        const userId = req.body.userId;
        const like = req.body.like;
      
        console.log("============");
        console.log (funcName + " userId   ", userId);
        console.log (funcName + " like   ", like);
        console.log (funcName + " sauce id   ", req.params.id);

         // Search for a sauce with the id 
        Sauce.findOne({_id: req.params.id})
        .then((sauce) => {

             // Get the  likes 
             let usersLiked =  sauce.usersLiked;
             let usersDisliked =  sauce.usersDisliked;
            let new_usersLiked = [];
            let new_usersDisliked =  [];


             // Get the unlikes   

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

            Sauce.updateOne({ _id: req.params.id }, {...newSauceLikeDislike, _id: req.params.id})
            .then(()=> res.status(201).json({message: 'like/dislike mis à jour.'}))
            .catch(error => res.status(400).json({error}));


        })
        .catch(error => res.status(400).json({error}));
       

  

}

console.log (scriptname + 'end '  );
