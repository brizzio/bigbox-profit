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

  const getDadosGestaoPrecos = async (req, res) => {
    var pagina, page_items
    
    page_items= req.params.itensPorPagina
    pagina=req.params.pagina 
    var offs = (pagina -1)*page_items
    const strQuery = `select * from bigbox.gestao_precos_view offset ${offs} limit ${page_items};`
    
    try {
      const pages = await dbQuery.query(`select count(*) from bigbox.gestao_precos_view;`);
      console.log(JSON.stringify(pages.rows[0].count))
      var registros = pages.rows[0].count
      const { rows } = await dbQuery.query(strQuery);
      console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem Dados';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.registros = registros
      successMessage.paginas = registros / page_items
      successMessage.pagina = pagina
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  const getTabelaGestaoPrecos = async (req, res) => {
    
    const strQuery = `select * from bigbox.gestao_precos_view;`
    
    try {
      const pages = await dbQuery.query(`select count(*) from bigbox.gestao_precos_view;`);
      console.log(JSON.stringify(pages.rows[0].count))
      var registros = pages.rows[0].count
      const { rows } = await dbQuery.query(strQuery);
      console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem Dados';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.registros = registros
      successMessage.paginas = 1
      successMessage.pagina = 1
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };



  module.exports = {getAllFilters, 
                    getLojasNoCluster,
                    getDadosGestaoPrecos,
                    getTabelaGestaoPrecos
                    }