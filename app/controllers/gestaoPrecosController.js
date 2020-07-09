//var moment = require('moment');

var dbQuery = require('../db/dev/dbQuery');

const {empty} = require('../helpers/validations');
 
const {
    errorMessage, 
    successMessage, 
    status
  } = require('../helpers/status');


/**
   * recupera categorias
   * @param {object} req 
   * @param {object} res 
   * @returns {object} array de categorias
   */
  const getAllCategories = async (req, res) => {
    const getAllBusQuery = `SELECT DISTINCT categoria as CATEGORIAS 
                            FROM giga.cruzamento_dados_pesquisa 
                            WHERE categoria IS NOT NULL
                            ORDER BY categoria DESC`;
    try {
      const { rows } = await dbQuery.query(getAllBusQuery);
      console.log(JSON.stringify(rows))
      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem Categorias';
        return res.status(status.notfound).send(errorMessage);
      }
      successMessage.data = dbResponse;
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = 'ocorreu um erro';
      return res.status(status.error).send(errorMessage);
    }
  };


  module.exports = {getAllCategories}