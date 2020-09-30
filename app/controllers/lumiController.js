//var moment = require('moment');

var dbQuery = require('../db/dev/dbQuery');

const {empty} = require('../helpers/validations');
 
const {
    errorMessage, 
    successMessage, 
    status
  } = require('../helpers/status');


/**
   * transfere dados via api
   * @param {object} req 
   * @param {object} res 
   * @returns {object} array de categorias
   */


 const getItensExportadosParaEnvio = async (req, res) => {
    
  console.log('id: ' + req.api_client.id)
 
  const strQuery = `select * from pricing_bigbox.retorno_api_pricing()`
  
   try {
    console.log((!req.api_client.id === 171))
    if (!req.api_client.id === 171){
      errorMessage.error = 'Este usuario nao tem acesso a essa informação';
      return res.status(status.bad).send(req.api_client.id === 171);
    }
     
     const { rows } = await dbQuery.query(strQuery);
     console.log(JSON.stringify(rows))

     const dbResponse = rows;
     if (dbResponse[0] === undefined) {
       errorMessage.error = 'Não Existem Itens Para Exportação';
      return res.status(status.notfound).send(errorMessage);
     }
     
     successMessage.registros = dbResponse.length;
     successMessage.Items = dbResponse;
    
     return res.status(status.success).send(successMessage);
   } catch (error) {
     errorMessage.error = JSON.stringify(error);
     return res.status(status.error).send(errorMessage);
   }
 };



  module.exports = {
                    getItensExportadosParaEnvio
                    }