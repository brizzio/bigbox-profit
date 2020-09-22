var express = require('express');

var { getAllFilters,
      getLojasNoCluster,
      getDadosGestaoPrecos,
      getTabelaGestaoPrecos,
      getGeoLojas,
      getGeoConcorrentes,
      getGestaoTotalizadores,
      filterTable,
      filterTablePaisFilhos,
      filtroDependente,
      getFilhosByPaiProporcional} = require('../controllers/gestaoPrecosController');
//var verifyAuth = require('../middlewares/verifyAuth');

const router = express.Router();

// buses Routes

//router.post('/user', verifyAuth, createUser);
router.get('/filters', getAllFilters);

//router.post('/user', verifyAuth, createUser);
router.get('/lojas/:cluster', getLojasNoCluster);

//Retorna os dados da gestão de precos com paginacao
router.get('/gestao/tabela', getTabelaGestaoPrecos);

//Retorna os totais da gestão de precos com paginacao
router.post('/gestao/totalizadores', getGestaoTotalizadores);

//Retorna os dados da gestão de precos com paginacao
router.get('/gestao/:itensPorPagina/:pagina', getDadosGestaoPrecos);

//rotas para dados de geolocalização e referencia geografica /api/v1/geo/lojas
router.get('/geo/lojas', getGeoLojas);
router.get('/geo/concorrentes', getGeoConcorrentes);

//filtra a tabela gestão de precos e retorna registros filtrados
router.post('/gestao/filtro', filterTable);

//filtra a tabela gestão de precos e retorna todos os registros (pais e filhos) dos itens filtrados
router.post('/gestao/filtro/paisefilhos', filterTablePaisFilhos);

//filtra a tabela gestão de precos e retorna todos os registros (pais e filhos) associados a um pai proporcional
router.get('/gestao/filtro/paisefilhos/:cluster/:codigo_pai_proporcional', getFilhosByPaiProporcional);


//filtra a tabela gestão de precos e retorna registros filtrados
router.post('/gestao/filtro-dependentes', filtroDependente);

module.exports = router;