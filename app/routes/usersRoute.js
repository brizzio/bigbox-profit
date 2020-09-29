var express = require('express');

var { createUser, siginUser } = require('../controllers/usersController');
const { verifyToken } = require('../middlewares/verifyAuth');

const router = express.Router();

// buses Routes

router.post('/user', verifyToken, createUser);
router.get('/user', verifyToken, siginUser);
module.exports = router;