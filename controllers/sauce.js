const Sauce = require('../models/sauce');
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
      
      //   let url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        let url = "http://www.hoanbx.fr/Projects/P3/images/restaurants/jay-wennington-N_Y88TWmGwA-unsplash.jpg";
        console.log (funcName  + " url  ", url);

            const sauce = new Sauce ({
                ...sauceObjet,
                likes: 0,
                dislikes:0,
                imageUrl: url ,
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
 
    Sauce.deleteOne({_id: req.params.id})
     .then(() => res.status(200).json({message: 'Sauce supprimé.'}))
                    .catch(error => res.status(400).json({error}));
    }
    

// 5. LIKE  DISLIKE SAUCE     
    exports.likeDisslikeSauce = (req, res, next) => {

    }

// 6. UPDATE SAUCE 
exports.upDateSauce = (req, res, next) => {

}

console.log (scriptname + 'end '  );