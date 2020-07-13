//var moment = require('moment');

var dbQuery = require('../db/dev/dbQuery');

const {empty} = require('../helpers/validations');
 
const {
    errorMessage, 
    successMessage, 
    status
  } = require('../helpers/status');



/**
   * recupera lojas 
   * @returns {object} array de lojas ---> default
   * @returns {object} array de lojas ---> pertencentes ao cluster caso especificado
   */

  const lojas = async function(){
    let dbResponse, res
    console.log('chamou lojas');
    const strQuery = `select array(select t.descricao from bigbox.lojas t);`
    try{
   
    dbResponse = await dbQuery.sql(strQuery)
                                
    }
    catch(err){
      console.log(err)
    }

    console.log(JSON.stringify(dbResponse));
    if (dbResponse[0] === undefined) {
      res = [];
    }else{
      res = dbResponse.rows[0].array;
    }
    return res

  };

  const page = async function(){
    let dbResponseLojas, res
    console.log('chamou lojas');
    const strQueryLojas = `select array(select t.descricao from bigbox.lojas t);`
    try{
   
    dbResponseLojas = await dbQuery.sql(strQueryLojas)
                                
    }
    catch(err){
      console.log(err)
    }

  
    return {
      title: 'Gestão Preços',
      lojas: dbResponseLojas.rows[0].array
    }

  };

  module.exports = {
        lojas,
        page
  }         