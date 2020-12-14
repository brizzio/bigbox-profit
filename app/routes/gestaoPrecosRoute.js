var express = require('express');

var { getAllFilters,
      getLojasNoCluster,
      getDadosGestaoPrecos,
      getTabelaGestaoPrecos,
      getGeoLojas,
      getGeoConcorrentes,
      getGestaoTotalizadores,
      getTotalizadoresParaItensEditados,
      filterTable,
      filterTablePaisFilhos,
      filterTableItensProporcionais,
      filtroDependente,
      getFilhosByPaiProporcional,
      updateNovoPreco,
      updateCheckboxMultiploOnClick,
      getItensEditadosByUserId,
      getItensExportadosByUserId,
      resetItensEditadosByUserId,
      resetItensExportadosByUserId,  
      getPesquisasByPai,
      exportaItens,
      filterByDiferencaTotal,
      slidersMinMaxValues,
      filterBySliderValue,
      filterByStringOnSearchBox
} = require('../controllers/gestaoPrecosController');

//var verifyAuth = require('../middlewares/verifyAuth'); \home\ubuntu\bigbox-profit\app\general\dash_gestao_precos\gpDashRoute.js

var gestao_precos_dashboard_route = require('../general/dash_gestao_precos/gpDashRoute.js');

const router = express.Router();

// vai para o dashboard na v2 -- eliminar isso no futuro
// index page do dashboard da gestao de preços
router.use('/gestao-precos-dashboard', gestao_precos_dashboard_route);



// Gestão de Routes

//router.post('/user', verifyAuth, createUser);
router.get('/filters/:db_schema', getAllFilters);

//router.post('/user', verifyAuth, createUser);
router.get('/lojas/:cluster', getLojasNoCluster);

//Retorna os dados da gestão de precos com paginacao
router.get('/gestao/tabela', getTabelaGestaoPrecos);

//Retorna os totais da gestão de precos com paginacao
router.post('/gestao/totalizadores', getGestaoTotalizadores);

//Retorna os totais da gestão de precos para os itens analisados e prestes a serem exportados
router.post('/gestao/totalizadores-editados', getTotalizadoresParaItensEditados);

//Retorna os dados da gestão de precos com paginacao
//router.get('/gestao/:itensPorPagina/:pagina', getDadosGestaoPrecos);

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

router.post('/gestao/update/checkboxes', updateCheckboxMultiploOnClick);

//recupera os itens alterados pelo usuario
// postando o seguinte objeto no body
// 
// uid: id do usuario
router.post('/gestao/update/lista-itens-editados', getItensEditadosByUserId);

//elimina os itens alterados pelo usuario da lista de itens alterados
// postando o seguinte objeto no body
// 
// uid: id do usuario
router.post('/gestao/update/reset-editados', resetItensEditadosByUserId);

//recupera os itens exportados pelo usuario
// postando o seguinte objeto no body
// uid: id do usuario
router.post('/gestao/update/lista-itens-exportados', getItensExportadosByUserId);

//rota que atualiza a coluna exportado na tabela tratar_dados_gestao_preco
router.post('/gestao/export', exportaItens);

//elimina a lista de exportacao do usuario mantendo a lista de itens alterados
// postando o seguinte objeto no body
// uid: id do usuario
router.post('/gestao/export/reset', resetItensExportadosByUserId);

//filtra a tabela gestão de precos e retorna registros filtrados
router.post('/gestao/classificador/diferenca-total', filterByDiferencaTotal);

//retorna os valores min e max do filtro para os sliders
router.post('/gestao/classificador/valores-min-max-sliders', slidersMinMaxValues);

//filtra a tabela gestão de precos e retorna registros filtrados segundo valor no slider
router.post('/gestao/classificador/slider-filtro', filterBySliderValue);

//filtra a tabela gestão de precos pelo texto no checkbox
router.get('/gestao/search/:texto', filterByStringOnSearchBox);


module.exports = router;

