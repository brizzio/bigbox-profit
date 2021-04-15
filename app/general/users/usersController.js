var moment = require('moment');

var dbQuery = require('../../db/dev/dbQuery');

var {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken
} = require('../../helpers/validations');

const {
  errorMessage, successMessage, status
} = require('../../helpers/status');


/**
   * Retorna a configuração do usuario com base no email
   * @param {object} req 
   * @param {object} res 
   * @param {string} email:text
   * @returns {object} user_config
  */
 const getUserConfigByMail = async (req, res) => {

  var email = req.params.email
  var msg = {}
  var config = {}
  var strQuery = `
  select * from pricepoint.user_config where uc_email = '${email}';`
  
  try {
    
    const { rows } = await dbQuery.query(strQuery);
    console.log(JSON.stringify(rows))

    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      
      msg.data = [];
      return res.status(status.success).send(msg);
    }
    
    var obj = dbResponse[0];

    var user = {
      "id" : obj.uc_id,
      "idexport" : obj.uc_id_exportacao,
      "separador":obj.uc_separador,
      "name" : obj.uc_nome,
      "surname" : obj.uc_sobrenome,
      "fullname" : obj.uc_nome + " " + (obj.uc_sobrenome?obj.uc_sobrenome:""),
      "email" : obj.uc_email,
      "image" : obj.uc_foto_url
    }

    var filters = {
    "bandeira" : (obj.uc_filtro_bandeira?obj.uc_filtro_bandeira:null),
    "cluster" : (obj.uc_filtro_cluster?obj.uc_filtro_cluster:null), 
    "departamento" : (obj.uc_filtro_departamento?obj.uc_filtro_departamento:null),
    "secao" : (obj.uc_filtro_secao?obj.uc_filtro_secao:null),
    "grupo" : (obj.uc_filtro_grupo?obj.uc_filtro_grupo:null),
    "sub_grupo" : (obj.uc_filtro_sub_grupo? obj.uc_filtro_sub_grupo:null),
    "produto" : (obj.uc_filtro_produto? obj.uc_filtro_produto:null),
    "sensibilidade" : (obj.uc_filtro_sensibilidade? obj.uc_filtro_sensibilidade:null),
    "papel_categoria" : (obj.uc_filtro_papel_categoria? obj.uc_filtro_papel_categoria:null),
    "escala" : (obj.uc_filtro_escala? obj.uc_filtro_escala:null),
    "fornecedor" : (obj.uc_filtro_fornecedor? obj.uc_filtro_fornecedor:null)
    }

    var system = {
     "start" : obj.uc_landpage,
     "schema" : obj.uc_db_schema,
     "url": obj.uc_api_url
    }

    var empresa = {
      "id" : obj.uc_id_empresa,
      "nome" : obj.uc_nome_empresa,
      "logo": obj.uc_logo
    }

    
    config.user = user
    config.filters = filters
    config.system = system
    config.empresa = empresa

    
    msg.status = 'success'
    msg.data = config;
   
    return res.status(status.success).send(msg);
  } catch (error) {
    errorMessage.error = JSON.stringify(error);
    return res.status(status.error).send(errorMessage);
  }
};






/**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const createUser = async (req, res) => {
  const {
    email, first_name, last_name, password,
  } = req.body;

  const created_on = moment(new Date());
  if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
    errorMessage.error = 'Email, password, first name and last name field cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email)) {
    errorMessage.error = 'Please enter a valid Email';
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(password)) {
    errorMessage.error = 'Password must be more than five(5) characters';
    return res.status(status.bad).send(errorMessage);
  }
  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO
      users(email, first_name, last_name, password, created_on)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
  const values = [
    email,
    first_name,
    last_name,
    hashedPassword,
    created_on,
  ];

  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    delete dbResponse.password;
    const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'User with that EMAIL already exist';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

/**
   * Signin
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
const siginUser = async (req, res) => {
  const { email, password } = req.body;
  if (isEmpty(email) || isEmpty(password)) {
    errorMessage.error = 'Email or Password detail is missing';
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email) || !validatePassword(password)) {
    errorMessage.error = 'Please enter a valid Email or Password';
    return res.status(status.bad).send(errorMessage);
  }
  const signinUserQuery = 'SELECT * FROM users WHERE email = $1';
  try {
    const { rows } = await dbQuery.query(signinUserQuery, [email]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = 'User with this email does not exist';
      return res.status(status.notfound).send(errorMessage);
    }
    if (!comparePassword(dbResponse.password, password)) {
      errorMessage.error = 'The password you provided is incorrect';
      return res.status(status.bad).send(errorMessage);
    }
    const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
    delete dbResponse.password;
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

module.exports =  {
  createUser,
  siginUser,
  getUserConfigByMail
};