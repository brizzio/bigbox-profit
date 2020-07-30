var express = require('express');

var { getAllFilters,
      getLojasNoCluster,
      getDadosGestaoPrecos } = require('../controllers/gestaoPrecosController');
//var verifyAuth = require('../middlewares/verifyAuth');

const router = express.Router();

// buses Routes

//router.post('/user', verifyAuth, createUser);
router.get('/filters', getAllFilters);

//router.post('/user', verifyAuth, createUser);
router.get('/lojas/:cluster', getLojasNoCluster);

//Retorna os dados da gestão de precos
router.get('/gestao/:pagina', getDadosGestaoPrecos);



module.exports = router;

