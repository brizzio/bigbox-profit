var express = require('express');

var { createUser, siginUser } = require('../controllers/usersController');
var verifyAuth = require('../middlewares/verifyAuth');

const router = express.Router();

// buses Routes

router.post('/user', verifyAuth, createUser);
router.get('/user', verifyAuth, siginUser);
module.exports = router;