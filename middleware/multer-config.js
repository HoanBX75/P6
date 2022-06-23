const multer = require('multer');

scriptname = 'middleware/multer-config.js : ';
console.log (scriptname + 'begin '  );

const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log ("multer.config.js  cb destination ");
        callback(null, 'images')
    },
    filename: (req, file, callback) => {

        console.log ("multer.config.js  file = ", file);
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];

        console.log ("multer.config.js  name  = ", name);
        console.log ("multer.config.js  name  = ", extension);
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('image');
console.log (scriptname + 'begin '  );