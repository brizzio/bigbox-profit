var express = require('express');

var { 
    getAllFilters, //ok
    getGestaoTotalizadores, //ok
    getTotalizadoresParaItensEditados,//ok
    filterTable, //ok
    filtroDependente, //ok
    getFilhosByPaiProporcional, //ok
    updateNovoPreco, //ok
    updateCheckboxMultiploOnClick, //ok
    getItensEditadosByUserId, //ok
    getItensExportadosByUserId,
    resetItensEditadosByUserId,
    resetItensExportadosByUserId,
    getPesquisasByPai, //ok
    exportaItens,
    filterByDiferencaTotal,
    filterByStringOnSearchBox
    } = require('../controllers/mainController'); 

const { verifyAPIToken }  = require('../middlewares/verifyApiAuth');

const router = express.Router();


// index page 
router.get('/', function(req, res) {
    res.status(200).send(
      {client:'PRICEPOINT',
      operator:'Versão 2',
      status:'SUCESSO'
    })
});

/**
* recupera os filtros 
*/
router.post('/filters', getAllFilters);

/**
* pega os filtros correspondentes às seleções feitas
*/
router.post('/gestao/filtro-dependentes', filtroDependente);

/**
* filtra a tabela gestão de precos e retorna registros filtrados 
*/
router.post('/gestao/filtro', filterTable);

/**
* Retorna os totais da gestão de precos 
*/
router.post('/gestao/totalizadores', getGestaoTotalizadores);

/**
* Retorna os totais da gestão de precos para os itens analisados e prestes a
* serem exportados
*/
router.post('/gestao/totalizadores-editados', getTotalizadoresParaItensEditados);

/**
* filtra a tabela gestão de precos e retorna todos os registros (pais e filhos
* associados a um pai proporcional
*/
router.post('/gestao/filtro/associados', getFilhosByPaiProporcional);

/**
* consulta a tabela de pesquisas e retorna todos os registros de pesquisa
* associados a um pai e a um cluster 
*/
router.post('/gestao/pesquisas', getPesquisasByPai);

/**
* executa o update dos preços alterados pelo usuario
*/
router.post('/gestao/update', updateNovoPreco);

/**
* executa o update dos preços em varios chekboxes ao mesmo tempo
*/
router.post('/gestao/update/checkboxes', updateCheckboxMultiploOnClick);

/** 
* recupera os itens alterados pelo usuario
*/
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

//filtra a tabela gestão de precos pelo texto no checkbox
router.get('/gestao/search/:texto', filterByStringOnSearchBox);


module.exports = router;
