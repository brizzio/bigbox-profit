var express = require('express');

var { 
      getItensExportadosParaEnvio,
      testeRotaAPI, 
      confirmaItens
    } = require('../controllers/lumiController');

const { verifyAPIToken }  = require('../middlewares/verifyApiAuth');

const router = express.Router();


// index page 
router.get('/', function(req, res) {
    res.status(200).send(
      {client:'BIG BOX',
      operator:'PRICEPOINT',
      status:'SUCESSO'
    })
});


//Rota autenticada para exportação LUMI
router.get('/pricing/precoService/receber', verifyAPIToken, getItensExportadosParaEnvio);

//Rota de confirmação da exportação LUMI
//recebe um  objeto
//{"id": "1"}
//'content-type': 'application/x-www-form-urlencoded'

router.post('/pricing/precoService/confirmar', verifyAPIToken, confirmaItens);

//Rota sandbox
router.get('/pricing/precoService/receber/teste', verifyAPIToken, testeRotaAPI);



module.exports = router;