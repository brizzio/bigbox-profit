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
  const getAllFilters = async (req, res) => {
    const strQuery = `SELECT bandeiras, clusters, lojas, departamentos, secoes, categorias, sub_categorias, fornecedores, papel_categoria, sensibilidade, produtos
    FROM bigbox.mat_view_filtros;`;
    try {
      const { rows } = await dbQuery.query(strQuery);
      console.log(JSON.stringify(rows))
      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem Filtros';
        return res.status(status.notfound).send(errorMessage);
      }
      successMessage.data = dbResponse;
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = 'ocorreu um erro';
      return res.status(status.error).send(errorMessage);
    }
  };


  /**
   * recupera lojas 
   * @param {object} req 
   * @param {object} res 
   * @param {object} nome_loja
   * @param {object} nome_cluster 
   * 
   * @returns {object} array de lojas ---> default
   * @returns {object} array de lojas ---> pertencentes ao cluster caso especificado
   */

  const getLojasNoCluster = async (req, res) => {
    const strQuery = `select array(select t.descricao from bigbox.lojas t where t.cluster = (select c.cod_cluster from bigbox.clusters c where descricao ='${req.params.cluster}'));`
    try {
      const { rows } = await dbQuery.query(strQuery);
      console.log(JSON.stringify(rows))
      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem Lojas';
        return res.status(status.notfound).send(errorMessage);
      }
      successMessage.cluster = req.params.cluster;
      successMessage.data = dbResponse[0].array;
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = 'ocorreu um erro';
      return res.status(status.error).send(errorMessage);
    }
  };



  module.exports = {getAllFilters, 
                    getLojasNoCluster
                    }