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
    const strQuery = `select * from pricing_bigbox.mv_filters;`;
    try {
      const { rows } = await dbQuery.query(strQuery);
     // console.log(JSON.stringify(rows))
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
      //console.log(JSON.stringify(rows))
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
      //console.log(JSON.stringify(pages.rows[0].count))
      var registros = pages.rows[0].count
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

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
    
    const strQuery = `select * from pricing_bigbox.vw_gestao_preco_calculada where cluster_simulador = 'BIG BOX';`
    
    try {
      const pages = await dbQuery.query(`select count(*) from pricing_bigbox.vw_gestao_preco_calculada where cluster_simulador = 'BIG BOX';`);
      //console.log(JSON.stringify(pages.rows[0].count))
      var registros = pages.rows[0]
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

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
      errorMessage.getTAbelaGestaoPrecos_error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };


  const getGestaoTotalizadores = async (req, res) => {
    
    const strQuery = `select * from pricing_bigbox.filtro_multiplo_totalizador(${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao})`
    
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem Totais';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  const getTotalizadoresParaItensEditados = async (req, res) => {
    
    const strQuery = `select * from pricing_bigbox.filtro_multiplo_totalizador_editados()`
    
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem Itens editados para totalizar';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };




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

  const filterTable = async (req, res) => {
    
    const filters = req.body
    console.log(req.body)
   
    var page_items= parseInt(req.body.registros.replace("'","")) 
    var pagina = parseInt(req.body.pagina.replace("'",""))
    var offs = (pagina -1) * page_items

   const strQuery = `
      select * from pricing_bigbox.filtro_multiplo_pais_proporcionais (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao}) offset ${offs} limit ${page_items};`
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = JSON.stringify(req.body);
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.start_at = offs + 1;
      successMessage.end_at = offs + page_items+1;
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  const filterTablePaisFilhos = async (req, res) => {
    
    const filters = req.body
    console.log(req.body)

    var page_items= parseInt(req.body.registros.replace("'","")) 
    var pagina = parseInt(req.body.pagina.replace("'",""))
    var offs = (pagina -1) * page_items
   
   const strQuery = `
      select * from pricing_bigbox.filtro_multiplo_gestao_preco_paifilho (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao}) offset ${offs} limit ${page_items};`
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      console.log(rows)

      const dbResponse = rows;
      //console.log('COUNT : ' + dbResponse.lenght)
      if (dbResponse[0] === undefined) {
        errorMessage.error = JSON.stringify(req.body);
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.start_at = offs + 1;
      successMessage.end_at = offs + page_items+1;
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  const filterTableItensProporcionais = async (req, res) => {
    
    const filters = req.body
    console.log(req.body)
   
   const strQuery = `
      select * from pricing_bigbox.filtro_multiplo_itens_proporcionais (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao})`
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      console.log(rows)

      const dbResponse = rows;
      //console.log('COUNT : ' + dbResponse.lenght)
      if (dbResponse[0] === undefined) {
        dbResponse = 0
        //errorMessage.error = JSON.stringify(req.body);
        //return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.registros = dbResponse.length;
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };


  const filtroDependente = async (req, res) => {
    
    const filters = req.body
    console.log(req.body)

   //parametros de entrada
   //departamento,secao,grupo,subgrupo,produto,fornecedor
   
   const strQuery = `
      select * from pricing_bigbox.filtro_dependente(${req.body.departamento},${req.body.secao},${req.body.grupo},${req.body.sub_grupo},${req.body.produto},${req.body.fornecedor},${req.body.bandeira},${req.body.cluster})`
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem filtros';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  const getFilhosByPaiProporcional = async (req, res) => {
    var pagina, page_items
    
    var cluster = req.params.cluster
    var cod_pai_proporcional = req.params.codigo_pai_proporcional
    //pagina=req.params.pagina 
    //var offs = (pagina -1)*page_items
    const strQuery = `select * from pricing_bigbox.tratar_dados_pais_filhos_proporcionais
    where cluster_simulador = '${cluster}' and cod_pai_proporcao ='${cod_pai_proporcional}';`
    
    try {
       const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem Filhos ou Proporcionais';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.registros = dbResponse.length;
      successMessage.data = dbResponse;
      
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  // atualiza os preços editados pelo usuario
  const updateNovoPreco = async (req, res) => {
    
    var cluster = req.body.cluster
    var cod_pai = req.body.codigo_pai
    var analisado = req.body.analisado
    var exportado = req.body.exportado
    var preco_decisao = req.body.preco_decisao
    var user = req.body.uid

    const strQuery = `select pricing_bigbox.update_preco_decisao(${cod_pai}, ${analisado}, ${exportado}, ${preco_decisao},${cluster},${user});`
    
    try {
       const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Erro na gravação de dados de novo preço';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.registros = dbResponse.length;
      successMessage.data = dbResponse;
      
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  // atualiza o checkbox multiplo para todos os itens de um filtro de pais proporcionais
  const updateCheckboxMultiploOnClick = async (req, res) => {
  
    const strQuery = `select * from pricing_bigbox.update_checkbox_multiplo (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao},${req.body.analisado},${req.body.uid});`
    
    try {
       const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Erro na gravação de dados do checkbox multiplo';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.registros = dbResponse.length;
      successMessage.data = dbResponse;
      
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };


  const getItensEditadosByUserId = async (req, res) => {
    
   const strQuery = `SELECT * FROM pricing_bigbox.tratar_dados_gestao_preco where analizado = 1 and id_user = ${req.body.uid}`
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        
        var msg = {}
        msg.data = [];
        console.log('passou aqui...' + msg.data)
        return res.status(status.success).send(msg);
      }
      
      successMessage.registros = dbResponse.length;
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  const resetItensEditadosByUserId = async (req, res) => {
    
    const strQuery = `select pricing_bigbox.reset_parametros_update (${req.body.uid})`
     try {
       
       const { rows } = await dbQuery.query(strQuery);
       //console.log(JSON.stringify(rows))
 
       const dbResponse = rows;
       if (dbResponse[0] === undefined) {
         errorMessage.error = 'Não encontramos itens analizados para o usuario ' + req.body.uid + '...';
         return res.status(status.notfound).send(errorMessage);
       }
       
       successMessage.registros = dbResponse.length;
       successMessage.data = dbResponse;
      
       return res.status(status.success).send(successMessage);
     } catch (error) {
       errorMessage.error = JSON.stringify(error);
       return res.status(status.error).send(errorMessage);
     }
   };

  const getPesquisasByPai = async (req, res) => {
    var pagina, page_items
    
    var cluster = req.body.cluster
    var cod_pai = req.body.codigo_pai
    var tipo_concorrente = req.body.tipo_concorrente
    //pagina=req.params.pagina 
    //var offs = (pagina -1)*page_items
    const strQuery = `select * from pricing_bigbox.pesquisas_codigo_pai('${cod_pai}', '${cluster}','${tipo_concorrente}');`
    
    try {
       const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Não Existem pesquisas para este item';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.registros = dbResponse.length;
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };


  //-----------------------------------------------------------------------
  //exporta itens

  // atualiza o checkbox multiplo para todos os itens de um filtro de pais proporcionais
const exportaItens = async (req, res) => {
  
  const strQuery = `select * from pricing_bigbox.exporta_itens (${req.body.uid},${req.body.data});`
  
  try {
     const { rows } = await dbQuery.query(strQuery);
    //console.log(JSON.stringify(rows))

    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = 'Erro na gravação de dados de exportação';
      return res.status(status.notfound).send(errorMessage);
    }
    
    successMessage.registros = dbResponse.length;
    successMessage.data = dbResponse;
    
   
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = JSON.stringify(error);
    return res.status(status.error).send(errorMessage);
  }
};

const resetItensExportadosByUserId = async (req, res) => {
    
  const strQuery = `select pricing_bigbox.reset_parametros_exportacao (${req.body.uid})`
   try {
     
     const { rows } = await dbQuery.query(strQuery);
     //console.log(JSON.stringify(rows))

     const dbResponse = rows;
     if (dbResponse[0] === undefined) {
       errorMessage.error = 'Não encontramos itens exportados para o usuario ' + req.body.uid + '...';
       return res.status(status.notfound).send(errorMessage);
     }
     
     successMessage.registros = dbResponse.length;
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
                    getTabelaGestaoPrecos,
                    getGeoLojas,
                    getGeoConcorrentes,
                    getGestaoTotalizadores,
                    getTotalizadoresParaItensEditados,
                    filterTable,
                    filterTablePaisFilhos,
                    filterTableItensProporcionais,
                    filtroDependente,
                    getFilhosByPaiProporcional,
                    updateNovoPreco,
                    updateCheckboxMultiploOnClick,
                    getItensEditadosByUserId,
                    resetItensEditadosByUserId,
                    resetItensExportadosByUserId,
                    getPesquisasByPai,
                    exportaItens
  }