var express = require('express');

var { getItensExportadosParaEnvio } = require('../controllers/lumiController');
const { verifyAPIToken }  = require('../middlewares/verifyApiAuth');

const router = express.Router();

// buses Routes

//Rota autenticada para exportação LUMI
router.get('/pricing/precoService/receber', verifyAPIToken, getItensExportadosParaEnvio);




module.exports = router;