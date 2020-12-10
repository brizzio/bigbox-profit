var moment = require('moment');
var dbQuery = require('../db/dev/dbQuery');
var jwt = require('jsonwebtoken');
const env  = require('../../env');
const {
  errorMessage, 
  status
} = require('../helpers/status');


let sysLogger = async (req, res, next) => {
  let logger = {}
  let current_datetime = new Date();
  let created_on = current_datetime //"'" + moment(new Date())._d.toString() + "'";
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();


  let schema = req.body.db_schema? req.body.db_schema.replace(new RegExp("'", 'g'), ""): null
  let uid = req.body.uid? req.body.uid: 999999
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  let msg = `[${formatted_date}] ${method}:${url} ${status}`;
  //console.log(msg)
  
  let values = [
    created_on,
    formatted_date,
    schema,
    uid,
    method,
    url,
    status,
    msg
  ];

  const logRequestQuery = `INSERT INTO
      pricepoint.log_api_requests(
      f_timestamp,
      f_data,
      f_schema,
      f_user_id,
      f_method,
      f_url,
      f_request_status,
      f_message
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`
        
      
      /* ${created_on}, 
        ${formatted_date}, 
        ${schema}, 
        ${uid}, 
        ${method}, 
        ${url}, 
        ${status}, 
        ${msg}); */


  //console.log('log request:===> %s', logRequestQuery)
  //console.log('log values:===> %s', values)
  

  try {
    const { rows } = await dbQuery.query(logRequestQuery, values);

    const dbResponse = rows[0];
    //delete dbResponse.password;
    //const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
    logger.status = 1
    //console.log(JSON.stringify(logger))
    req.body.log = logger
    next();
    
  } catch (error) {
    logger.status = 0
    logger.log = 'Erro no log da requisição';
    next(error);
  }
  
  
};




module.exports = {
  sysLogger
}