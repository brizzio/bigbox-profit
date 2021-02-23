var express = require('express');

var gestao_precos_route = require('../gestao_precos/gpRoute');

var gestao_precos_dashboard_route = require('../dash_gestao_precos/gpDashRoute');

const logs  = require('../../middlewares/logger');

const router = express.Router();

//carrega o middleware para registro das requisições 
//router.use(logs.sysLogger)

// index page 
router.use('/', gestao_precos_route);

// index page do dashboard da gestao de preços
router.use('/gestao-precos-dashboard', gestao_precos_dashboard_route);


module.exports = router;
