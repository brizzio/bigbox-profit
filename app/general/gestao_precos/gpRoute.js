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
    getItensExportadosByUserId, //ok
    resetItensEditadosByUserId, //ok
    resetItensExportadosByUserId,
    getPesquisasByPai, //ok
    exportaItens, //ok
    filterByDiferencaTotal,
    slidersMinMaxValues,
    filterBySliderValue,
    filterByStringOnSearchBox //ok
    } = require('./gpController'); 

const { verifyAPIToken }  = require('../../middlewares/verifyApiAuth');

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
router.get('/filters/:db_schema', getAllFilters); //-----------ok

/**
* pega os filtros correspondentes às seleções feitas
*/
router.post('/gestao/filtro-dependentes', filtroDependente); //------ok

/**
* filtra a tabela gestão de precos e retorna registros filtrados 
*/
router.post('/gestao/filtro', filterTable); //------ok

/**
* Retorna os totais da gestão de precos 
*/
router.post('/gestao/totalizadores', getGestaoTotalizadores); //----ok

/**
* Retorna os totais da gestão de precos para os itens analisados e prestes a
* serem exportados
*/
router.post('/gestao/totalizadores-editados', getTotalizadoresParaItensEditados); //---ok

/**
* filtra a tabela gestão de precos e retorna todos os registros (pais e filhos
* associados a um pai proporcional
*/
router.post('/gestao/filtro/associados', getFilhosByPaiProporcional); //----ok

/**
* consulta a tabela de pesquisas e retorna todos os registros de pesquisa
* associados a um pai e a um cluster 
*/
router.post('/gestao/pesquisas', getPesquisasByPai); //-------ok

/**
* executa o update dos preços alterados pelo usuario
*/
router.post('/gestao/update', updateNovoPreco); //-------ok

/**
* executa o update dos preços em varios chekboxes ao mesmo tempo
*/
router.post('/gestao/update/checkboxes', updateCheckboxMultiploOnClick); //----ok

/** 
* recupera os itens alterados pelo usuario
*/
router.post('/gestao/update/lista-itens-editados', getItensEditadosByUserId); //----ok

/** 
* elimina os itens alterados pelo usuario da lista de itens alterados
*/
router.post('/gestao/update/reset-editados', resetItensEditadosByUserId); //----ok

/** 
* recupera os itens exportados pelo usuario
*/
router.post('/gestao/update/lista-itens-exportados', getItensExportadosByUserId); //---ok

/** 
* rota que atualiza a coluna exportado na tabela tratar_dados_gestao_preco
* exporta itens para uma determinada data 
*/
router.post('/gestao/export', exportaItens);

/** 
* elimina a lista de exportacao do usuario mantendo a lista de itens alterados
*/
router.post('/gestao/export/reset', resetItensExportadosByUserId); //-----ok

//filtra a tabela gestão de precos e retorna registros filtrados
router.post('/gestao/classificador/diferenca-total', filterByDiferencaTotal);

//retorna os valores min e max do filtro para os sliders
router.post('/gestao/classificador/valores-min-max-sliders', slidersMinMaxValues);

//filtra a tabela gestão de precos e retorna registros filtrados segundo valor no slider
router.post('/gestao/classificador/slider-filtro', filterBySliderValue);

/** 
* filtra a tabela gestão de precos pelo texto no checkbox
*/
router.post('/gestao/search', filterByStringOnSearchBox); //---- ok


module.exports = router;
