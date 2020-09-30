var jwt = require('jsonwebtoken');
const env  = require('../../env');
const {
  errorMessage, 
  status
} = require('../helpers/status');


const generateAPIToken = async (user_id, user_name) => {
  // Create a new token with the username in the payload
  // and which expires 300 seconds after issue
  const jwtExpirySeconds = 300
  var obj = {
    id:user_id,
    user:user_name
  }
	const token = jwt.sign({ obj }, env.API_SECRET, {
		algorithm: "HS256",
    //expiresIn: jwtExpirySeconds,
    maxAge: '100 years'
	})
	console.log("token:", token)
};

const verifyAPIToken = async (req, res, next) => {
  console.log(req.headers)
  const { token } = req.headers;
  console.log(token)
  if (!token) {
    errorMessage.error = 'token não encontrado';
    return res.status(status.bad).send(errorMessage);
  }
  try {
    const decoded =  jwt.verify(token, env.API_SECRET);
    console.log(decoded);
    req.api_client = {
      id: decoded.obj.id,
      user: decoded.obj.user
    };
    next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return res.status(status.error).end();
		}
    errorMessage.error = 'Falha na autenticação';
    return res.status(status.unauthorized).send(errorMessage);
  }
};




module.exports = {verifyAPIToken, generateAPIToken}