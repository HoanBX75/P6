const Sauce = require('../models/sauce');


// 1.  CREATE SAUCE 

exports.createSauce = (req, res, next) => {
    
    exports.createSauce = (req, res, next) => {
         
            delete req.body._id
            console.log(sauceObjet);
        
            const sauce = new Sauce ({
                ...req.body
            })
            console.log(sauce);
            sauce.save()
            .then(() => res.status(201).json({message: "Sauce ajouté !"}))
            .catch((error) => res.status(400).json({error}))
        }
    }   

// 2. GET ALL SAUCE
exports.getAllSauce = (req, res, next) => {
 
        Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
    }


// 3. GET ONE SAUCE 
exports.getOneSauce = (req, res, next) => {
    
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


