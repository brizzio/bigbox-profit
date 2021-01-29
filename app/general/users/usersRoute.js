var express = require('express');

var { createUser, 
      siginUser,
      getUserConfigByMail
    } = require('./usersController');

var verifyAuth = require('../../middlewares/verifyAuth');

const router = express.Router();

router.get('/', function(req, res) {
    res.status(200).send(
      {route:'ROTA CONFIGURACAO DE USUARIO',
      status:'SUCESSO'
    })
});

router.get('/config/:email', getUserConfigByMail);

router.post('/user', verifyAuth, createUser);
router.get('/user', verifyAuth, siginUser);
module.exports = router;