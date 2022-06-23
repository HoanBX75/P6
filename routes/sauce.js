const express= require('express');
const router = express.Router();

/* Requiring these modules */
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const sauceCrtl = require('../controllers/sauce');


/* end point sauces */
router.post('/', auth, multer, sauceCrtl.createSauce);
router.get("/", auth, sauceCrtl.getAllSauce);
router.get("/:id", auth, sauceCrtl.getOneSauce);

router.delete("/:id", auth ,sauceCrtl.deleteSauce);
router.put("/:id", auth , multer, sauceCrtl.upDateSauce);
router.post('/:id/like', auth, sauceCrtl.likeDisslikeSauce);

module.exports = router;
