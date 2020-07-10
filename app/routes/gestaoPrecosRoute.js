var express = require('express');

var { getAllFilters,
      getLojasNoCluster } = require('../controllers/gestaoPrecosController');
//var verifyAuth = require('../middlewares/verifyAuth');

const router = express.Router();

// buses Routes

//router.post('/user', verifyAuth, createUser);
router.get('/filters', getAllFilters);
module.exports = router;

//router.post('/user', verifyAuth, createUser);
router.get('/lojas/:cluster', getLojasNoCluster);
module.exports = router;