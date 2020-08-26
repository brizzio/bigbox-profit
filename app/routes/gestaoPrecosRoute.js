var express = require('express');

var { getAllFilters,
      getLojasNoCluster,
      getDadosGestaoPrecos,
      getTabelaGestaoPrecos,
      getGeoLojas,
      getGeoConcorrentes } = require('../controllers/gestaoPrecosController');
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

//rotas para dados de geolocalização e referencia geografica /api/v1/geo/lojas
router.get('/geo/lojas', getGeoLojas);
router.get('/geo/concorrentes', getGeoConcorrentes);

module.exports = router;

