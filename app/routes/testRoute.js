var express = require('express');

var { getAllCategories } = require('../controllers/gestaoPrecosController');
//var verifyAuth = require('../middlewares/verifyAuth');

const router = express.Router();

// buses Routes

//router.post('/user', verifyAuth, createUser);
router.get('/categorias', getAllCategories);
module.exports = router;