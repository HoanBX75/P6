const express= require('express');
const router = express.Router();
const sauceCrtl = require('../controllers/sauce');
const auth = require('../middleware/auth');

router.post('/', auth,  sauceCrtl.createSauce);
router.get("/", auth, sauceCrtl.getAllSauce);
router.get("/:id", auth, sauceCrtl.getOneSauce);

router.delete("/:id", auth ,sauceCrtl.deleteSauce);
router.put("/:id", auth , sauceCrtl.upDateSauce);
router.post('/:id/like', auth, sauceCrtl.likeDisslikeSauce);

module.exports = router;
