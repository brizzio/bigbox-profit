var express = require('express');

var { getAllFilters,
      getLojasNoCluster,
      getDadosGestaoPrecos,
      getTabelaGestaoPrecos } = require('../controllers/gestaoPrecosController');
//var verifyAuth = require('../middlewares/verifyAuth');

const router = express.Router();

// buses Routes

//router.post('/user', verifyAuth, createUser);
router.get('/filters', getAllFilters);

//router.post('/user', verifyAuth, createUser);
router.get('/lojas/:cluster', getLojasNoCluster);

//Retorna os dados da gestão de precos com paginacao
router.get('/gestao/tabela', getTabelaGestaoPrecos);

//Retorna os dados da gestão de precos com paginacao
router.get('/gestao/:itensPorPagina/:pagina', getDadosGestaoPrecos);



module.exports = router;

