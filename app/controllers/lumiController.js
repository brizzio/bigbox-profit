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
    console.log((req.api_client.id === 171))
    if (req.api_client.id != 171){
      errorMessage.error = 'Este usuario nao tem acesso a essa informação';
      return res.status(status.bad).send(req.api_client.id === 171);
    }
     
     const { rows } = await dbQuery.query(strQuery);
     console.log(JSON.stringify(rows))

     const dbResponse = rows;
     if (dbResponse[0] === undefined) {
        var msg = {}
        msg.Items = [];
        return res.status(status.success).send(msg);
     }
     
     const resp = {};
     resp.status = 'success'
     resp.registros = dbResponse.length;
     resp.Items = dbResponse;
    
     return res.status(status.success).send(resp);
   } catch (error) {
     errorMessage.error = JSON.stringify(error);
     return res.status(status.error).send(errorMessage);
   }
 };

 const confirmaItens = async (req, res) => {
    
  console.log('id: ' + req.api_client.id)

  const strQuery = `select pricing_bigbox.confirmar(${req.body.id})`
  
   try {
    console.log((req.api_client.id == 171))
    if (req.api_client.id != 171){
      errorMessage.error = 'Este usuario nao tem acesso a essa informação';
      return res.status(status.bad).send(req.api_client.id === 171);
    }
     
    const { rows } = await dbQuery.query(strQuery);
    console.log(JSON.stringify(rows))

    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
       var msg = 'Este Id nao foi exportado ===>' + req.body.id
       return res.status(status.success).send(msg);
    }
    
    const resp = {};
    resp.status = 'confirmado'
   
    return res.status(status.success).send(resp);

   } catch (error) {
     errorMessage.error = JSON.stringify(error);
     return res.status(status.error).send(errorMessage);
   }
 };



 const testeRotaAPI = async (req, res) => {
    
  console.log('id: ' + req.api_client.id)
 
  const strQuery = `select * from pricing_bigbox.api_retorno`
  
   try {
    console.log((req.api_client.id == 171))
    if (req.api_client.id != 171){
      errorMessage.error = 'Este usuario nao tem acesso a essa informação';
      return res.status(status.bad).send(req.api_client.id === 171);
    }
     
     const { rows } = await dbQuery.query(strQuery);
     //console.log(JSON.stringify(rows))

     const dbResponse = rows;
     if (dbResponse[0] === undefined) {
        var msg = {}
        msg.Items = [];
        return res.status(status.success).send(msg);
     }
     
     const resp = {};
     resp.status = 'success'
     resp.registros = dbResponse.length;
     resp.Items = dbResponse;
    
     return res.status(status.success).send(resp);
   } catch (error) {
     errorMessage.error = JSON.stringify(error);
     return res.status(status.error).send(errorMessage);
   }
 };

  module.exports = {
                    getItensExportadosParaEnvio, 
                    confirmaItens,
                    testeRotaAPI
                    }