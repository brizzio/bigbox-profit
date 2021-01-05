var express = require('express');

var dash = require('./gpDashController'); 

const { verifyAPIToken }  = require('../../middlewares/verifyApiAuth');
//const logs  = require('../../middlewares/logger');
//const { nextTick } = require('async');

const router = express.Router();


//router.use(logs.sysLogger)

// index page do dashboard de gestao de preços

router.get('/', function(req, res) {
    res.status(200).send(
      {route:'DASHBOARD GESTAO PREÇOS',
      status:'SUCESSO'
    })
});

//rotas para dados de geolocalização e referencia geografica /api/v1/geo/lojas
router.post('/geo/lojas', dash.getGeoLojas);
router.post('/geo/concorrentes', dash.getGeoConcorrentes);

//rotas para recuperar dados para os graficos
router.post('/analise-ruptura', dash.getDashData);

router.post('/analise-quantitativo', dash.getDashData);

router.post('/indice-preco-concorrente', dash.getDashData);

router.post('/indice-competitividade', dash.getDashData);

router.post('/totalizadores-dash', dash.getDashData);

router.post('/venda-sensibilidade',dash.getDashData);



module.exports = router;
