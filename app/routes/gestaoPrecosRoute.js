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
      filterTableItensProporcionais,
      filtroDependente,
      getFilhosByPaiProporcional,
      updateNovoPreco,
      getItensEditadosByUserId,
      getPesquisasByPai} = require('../controllers/gestaoPrecosController');
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

//filtra com o mesmo objeto a tabela gestão de precos e 
//retorna todos os registros (pais e filhos) que sejam relativos a um pai proporcional
//que seja editável
router.post('/gestao/filtro/proporcionais', filterTableItensProporcionais);

//filtra a tabela gestão de precos e retorna todos os registros (pais e filhos) associados a um pai proporcional
// com as seguintes variaveis na url
// /gestao/filtro/paisefilhos/:cluster/:codigo_pai_proporcional.

router.get('/gestao/filtro/paisefilhos/:cluster/:codigo_pai_proporcional', getFilhosByPaiProporcional);


//consulta a tabela de pesquisas e retorna todos os registros de pesquisa associados a um pai e a um cluster 
// com as seguintes variaveis na url
// /gestao/pesquisas/:codigo_pai/:cluster/:tipo_concorrente.

router.post('/gestao/pesquisas', getPesquisasByPai);


//filtra a tabela gestão de precos e retorna registros filtrados
router.post('/gestao/filtro-dependentes', filtroDependente);

//executa o update dos preços alterados pelo usuario
// postando o seguinte objeto no body
// cluster: string not null
// cod_pai: string not null
// analisado: 0 ou 1 not null
// exportado: 0 ou 1 not null
// preco_decisao: numeric not null
// uid: id do usuario
router.post('/gestao/update', updateNovoPreco);

//recupera os itens alterados pelo usuario
// postando o seguinte objeto no body
// 
// uid: id do usuario
router.post('/gestao/update/lista-itens-editados', getItensEditadosByUserId);

module.exports = router;

