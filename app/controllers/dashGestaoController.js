//var moment = require('moment');

var dbQuery = require('../db/dev/dbQuery');

const {empty} = require('../helpers/validations');
 
const {
    errorMessage, 
    successMessage, 
    status
  } = require('../helpers/status');





const getGeoLojas = async (req, res) => {
    
    const strQuery = `select * from bigbox.cadastro_lojas;`
    
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem Lojas';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  const getGeoConcorrentes = async (req, res) => {
    
    const strQuery = `select * from pricing_bigbox.cadastro_concorrentes;`
    
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        var msg = {}
        msg.data = [];
        return res.status(status.success).send(msg);
      }
      
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };


  module.exports = {
    getGeoLojas,
    getGeoConcorrentes
    }