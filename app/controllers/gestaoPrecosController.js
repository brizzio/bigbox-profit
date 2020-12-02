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

  const filterTable = async (req, res) => {
        
       
    var page_items= parseInt(req.body.registros.replace("'","")) 
    var pagina = parseInt(req.body.pagina.replace("'",""))
    var offs = (pagina -1) * page_items

    const strQuery = `
      select * from pricing_bigbox.filtro_multiplo_pais_proporcionais (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao}) offset ${offs} limit ${page_items};`

    const strQueryCount = `
      select count(*) from pricing_bigbox.filtro_multiplo_pais_proporcionais (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao});`      
    
    try {
      
      if (pagina == 1){
      const countSelect = await dbQuery.query(strQueryCount);
      //console.log(JSON.stringify('contagem ===> ' + rows))
      var reg = countSelect.rows[0].count
      successMessage.registros = reg;
      successMessage.paginas = Math.ceil(reg / page_items)
      }

      const { rows } = await dbQuery.query(strQuery);
      

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        var msg = {}
        msg.data = [];
        return res.status(status.success).send(msg);
      }
      
      successMessage.pagina = pagina
      successMessage.start_at = offs + 1;
      successMessage.end_at = successMessage.registros < page_items ? successMessage.registros : offs + page_items+1;
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  const filterTablePaisFilhos = async (req, res) => {
    
    
    var page_items= parseInt(req.body.registros.replace("'","")) 
    var pagina = parseInt(req.body.pagina.replace("'",""))
    var offs = (pagina -1) * page_items
   
   const strQuery = `
      select * from pricing_bigbox.filtro_multiplo_gestao_preco_paifilho (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao}) offset ${offs} limit ${page_items};`
    
   const strQueryCount = `
      select count(*) from pricing_bigbox.filtro_multiplo_gestao_preco_paifilho (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao});`
            
  try {
      
    if (pagina == 1){
      const countSelect = await dbQuery.query(strQueryCount);
      //console.log(JSON.stringify('contagem ===> ' + rows))
      var reg = countSelect.rows[0].count
      successMessage.registros = reg;
      successMessage.paginas = Math.ceil(reg / page_items)
    }

      
      const { rows } = await dbQuery.query(strQuery);
      //console.log(rows)

      const dbResponse = rows;
      //console.log('COUNT : ' + dbResponse.lenght)
      if (dbResponse[0] === undefined) {
        var msg = {}
        msg.data = [];
        return res.status(status.success).send(msg);
      }
      
      successMessage.pagina = pagina
      successMessage.start_at = offs + 1;
      successMessage.end_at = successMessage.registros < page_items ? successMessage.registros : offs + page_items+1;
      successMessage.data = dbResponse;
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  const filterTableItensProporcionais = async (req, res) => {
    
    var page_items= parseInt(req.body.registros.replace("'","")) 
    var pagina = parseInt(req.body.pagina.replace("'",""))
    var offs = (pagina -1) * page_items
   
   const strQuery = `
      select * from pricing_bigbox.filtro_multiplo_itens_proporcionais (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao})offset ${offs} limit ${page_items};`

   const strQueryCount = `
      select count(*) from pricing_bigbox.filtro_multiplo_itens_proporcionais (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao})`   

    try {
      
      if (pagina == 1){
        const countSelect = await dbQuery.query(strQueryCount);
        //console.log(JSON.stringify('contagem ===> ' + rows))
        var reg = countSelect.rows[0].count
        successMessage.registros = reg;
        successMessage.paginas = Math.ceil(reg / page_items)
      }
  
      const { rows } = await dbQuery.query(strQuery);
      //console.log(rows)

      const dbResponse = rows;
      //console.log('COUNT : ' + dbResponse.lenght)
      if (dbResponse[0] === undefined) {
        var msg = {}
        msg.data = [];
        return res.status(status.success).send(msg);
      }
      
      successMessage.pagina = pagina
      successMessage.start_at = offs + 1;
      successMessage.end_at = successMessage.registros < page_items ? successMessage.registros : offs + page_items+1;
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
      select * from pricing_bigbox.filtro_dependente(${req.body.departamento},${req.body.secao},${req.body.grupo},${req.body.sub_grupo},${req.body.produto},${req.body.fornecedor},${req.body.bandeira},${req.body.cluster},${req.body.sensibilidade},${req.body.papel_categoria})`
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
        var msg = {}
        msg.data = [];
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

  // atualiza os preços editados pelo usuario
  const updateNovoPreco = async (req, res) => {
    
    var cluster = req.body.cluster
    var cod_pai = req.body.codigo_pai
    var analisado = req.body.analisado
    var exportado = req.body.exportado
    var preco_decisao = req.body.preco_decisao
    var user = req.body.uid

    const strQuery = `select pricing_bigbox.update_preco_decisao(${cod_pai},${analisado},${exportado},${preco_decisao},${cluster},${user});`
    
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
    
    var page_items= parseInt(req.body.registros.replace("'","")) 
    var pagina = parseInt(req.body.pagina.replace("'",""))
    var offs = (pagina -1) * page_items


   const strQuery = `select * from pricing_bigbox.lista_itens_editados(${req.body.uid}) offset ${offs} limit ${page_items}`

   const strQueryCount = `select count(*) from pricing_bigbox.lista_itens_editados(${req.body.uid})`


    try {
      
      if (pagina == 1){
        const countSelect = await dbQuery.query(strQueryCount);
        //console.log(JSON.stringify('contagem ===> ' + rows))
        var reg = countSelect.rows[0].count
        successMessage.registros = reg;
        successMessage.paginas = Math.ceil(reg / page_items)
      }

      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        
        var msg = {}
        msg.data = [];
        //console.log('passou aqui...' + msg.data)
        return res.status(status.success).send(msg);
      }
      
      successMessage.pagina = pagina
      successMessage.start_at = offs + 1;
      successMessage.end_at =  successMessage.registros < page_items? successMessage.registros : offs + page_items+1;;
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

 const getItensExportadosByUserId = async (req, res) => {

  var page_items= parseInt(req.body.registros.replace("'","")) 
  var pagina = parseInt(req.body.pagina.replace("'",""))
  var offs = (pagina -1) * page_items

    
  const strQuery = `select * from pricing_bigbox.lista_itens_exportados(${req.body.uid}) offset ${offs} limit ${page_items}`

  const strQueryCount = `select count(*) from pricing_bigbox.lista_itens_exportados(${req.body.uid})`  

   try {

    if (pagina == 1){
      const countSelect = await dbQuery.query(strQueryCount);
      var reg = countSelect.rows[0].count
      console.log('contagem ===> ' + reg)
      successMessage.registros = reg;
      successMessage.paginas = Math.ceil(reg / page_items)
    }
     
     const { rows } = await dbQuery.query(strQuery);
     //console.log(JSON.stringify(rows))

     const dbResponse = rows;
     if (dbResponse[0] === undefined) {
       
       var msg = {}
       msg.data = [];
       return res.status(status.success).send(msg);
     }
     
     successMessage.pagina = pagina
     successMessage.start_at = offs + 1;
     successMessage.end_at = successMessage.registros < page_items ? successMessage.registros : offs + page_items+1;
     successMessage.data = dbResponse;
    
     return res.status(status.success).send(successMessage);
   } catch (error) {
     errorMessage.error = JSON.stringify(error);
     return res.status(status.error).send(errorMessage);
   }
 };
 
 //method:GET
 const filterByStringOnSearchBox = async (req, res) => {
 
  //console.log(req.params.texto)
 
 
  var strq = `
     select * from pricing_bigbox.filtro_search_box('${req.params.texto}');
     `
   try {
     
     var { rows } = await dbQuery.query(strq);
     //console.log(strq)
 
     const dbResponse = rows;
     
     if (dbResponse[0] === undefined) {
       var msg = {}
       msg.data = [];
       return res.status(status.success).send(msg);
     }
     
     successMessage.pagina = 1
     successMessage.registros = dbResponse.length;
     successMessage.data = dbResponse;
    
     return res.status(status.success).send(successMessage);
   } catch (error) {
     errorMessage.error = JSON.stringify(error);
     return res.status(status.error).send(errorMessage);
   }
 };

 const filterByDiferencaTotal = async (req, res) => {
    
  var strQuery = ''
  var strQueryCount = ''
  var filtro = ''
  var ordem = ''
  var sm = {}
  var page_items= parseInt(req.body.registros.replace("'","")) 
  var pagina = parseInt(req.body.pagina.replace("'",""))
  var offs = (pagina -1) * page_items
  
  var value = parseInt(req.body.maioriguala.replace("'",""));

  if(value >= 0){
    filtro = 'where diferenca_total >= ' + value 
    ordem = 'order by diferenca_total desc offset ' + offs +  ' limit ' + page_items
  }else{
    filtro = 'where diferenca_total <= ' + value
    ordem = 'order by diferenca_total asc offset ' + offs +  ' limit ' + page_items
  }
 

      strQuery = `select * from pricing_bigbox.filtro_extra(${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao}) ${filtro} ${ordem};`

      strQueryCount = `select count(*) from pricing_bigbox.filtro_extra (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao}) ${filtro};`
      
   
  
    try {
      console.log(JSON.stringify('query ===> ' + strQueryCount))
    if (pagina == 1){
    const countSelect = await dbQuery.query(strQueryCount);
    var reg = countSelect.rows[0].count
    sm.registros = reg;
    sm.paginas = Math.ceil(reg / page_items)
    }

    const { rows } = await dbQuery.query(strQuery);
    

    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = JSON.stringify(req.body);
     return res.status(status.notfound).send(errorMessage);
    }
    
    sm.pagina = pagina
    sm.start_at = offs + 1;
    sm.end_at = sm.registros < page_items ? sm.registros : offs + page_items+1;
    sm.data = dbResponse;
   
    return res.status(status.success).send(sm);
  } catch (error) {
    errorMessage.error = JSON.stringify(error);
    return res.status(status.error).send(errorMessage);
  }
};

const slidersMinMaxValues = async (req, res) => {
    
  var sm = {}
  
      
  strQueryMinMax = `select 
                    max(diferenca_total) as diferenca_total_maximo, 
                    min(diferenca_total) as diferenca_total_minimo,
                    max(novamargem) as nova_margem_maximo, 
                    min(novamargem) as nova_margem_minimo,
                    max(variacaonovopreco) as variacao_novo_preco_maximo, 
                    min(variacaonovopreco) as variacao_novo_preco_minimo
                    from pricing_bigbox.filtro_extra (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao});`
   
    try {
  
    let minMax = await dbQuery.query(strQueryMinMax);
    
    let values = minMax.rows[0];
    if (values === undefined) {
      errorMessage.error = 'Sem valores min e max para esta requisição: ===> ' + JSON.stringify(req.body);
     return res.status(status.notfound).send(errorMessage);
    }

    console.log(values)

    sm.data = values;
   
    return res.status(status.success).send(sm);
  } catch (error) {
    errorMessage.error = JSON.stringify(error);
    return res.status(status.error).send(errorMessage);
  }
};

const filterBySliderValue = async (req, res) => {
    
  var strQuery = ''
  var strQueryCount = ''
  var filtro = ''
  var ordem = ''
  var campo_slider = ''
  var sm = {}

  var num_slider = parseInt(req.body.slider.replace("'",""))

  switch (num_slider) {
    case 1:
      campo_slider = "diferenca_total";
      break;
    case 2:
      campo_slider = "novamargem";
      break;
    case 3:
      campo_slider = "variacaonovopreco";
  }

  var value = parseInt(req.body.maioriguala.replace("'",""));

  if(value >= 0){
    filtro = `where ${campo_slider} >= ${value}` 
    ordem = `order by ${campo_slider} desc`//'order by diferenca_total desc offset ' + offs +  ' limit ' + page_items
  }else{
    filtro = `where ${campo_slider} <= ${value}`
    ordem = `order by ${campo_slider} asc`  //offset ' + offs +  ' limit ' + page_items
  }
 
      strQuery = `select * from pricing_bigbox.filtro_extra(${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao}) ${filtro} ${ordem};`

      strQueryCount = `select count(*) from pricing_bigbox.filtro_extra (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao}) ${filtro};`
  
  
    try {
      console.log(JSON.stringify('query ===> ' + strQueryCount))
    
    const countSelect = await dbQuery.query(strQueryCount);
    var reg = countSelect.rows[0].count
    sm.registros = reg;
    
    const { rows } = await dbQuery.query(strQuery);
    
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = JSON.stringify(req.body);
     return res.status(status.notfound).send(errorMessage);
    }
    
    sm.pagina = 1
    sm.start_at = 1;
    sm.end_at = sm.registros //< page_items ? sm.registros : offs + page_items+1;
    sm.data = dbResponse;
   
    return res.status(status.success).send(sm);
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
                    getItensExportadosByUserId,
                    resetItensEditadosByUserId,
                    resetItensExportadosByUserId,
                    getPesquisasByPai,
                    exportaItens,
                    filterByDiferencaTotal,
                    slidersMinMaxValues,
                    filterBySliderValue,
                    filterByStringOnSearchBox
                    }