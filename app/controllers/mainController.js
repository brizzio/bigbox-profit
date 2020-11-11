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
   * @param {object} db_schema:schema
   * @returns {object} arvore de categorias
  */
  const getAllFilters = async (req, res) => {

    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
    try {
      var strQuery = `select * from ${schema}.mv_filters;`;
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
   * pega os filtros correspondentes às seleções feitas
   * @param {object} req 
   * @param {object} res 
   * @param {object} grupo:null
   * @param {object} fornecedor:null
   * @param {object} produto:null
   * @param {object} bandeira:'BIG BOX'
   * @param {object} sensibilidade:null
   * @param {object} papel_categoria:null
   * @param {object} sub_grupo:null
   * @param {object} cluster:'BIG BOX'
   * @param {object} departamento:null
   * @param {object} secao:'SECA DOCE'
   * @param {object} db_schema:'pricing_bigbox'
   * @returns {object} data
   */
  const filtroDependente = async (req, res) => {

  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
       
   const strQuery = `
      select * from ${schema}.filtro_dependente(${req.body.departamento},${req.body.secao},${req.body.grupo},${req.body.sub_grupo},${req.body.produto},${req.body.fornecedor},${req.body.bandeira},${req.body.cluster},${req.body.sensibilidade},${req.body.papel_categoria})`
      
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


  /**
   * Retorna os totais da gestão de precos 
   * @param {object} req 
   * @param {object} res 
   * @param {object} grupo:null
   * @param {object} fornecedor:null
   * @param {object} produto:null
   * @param {object} bandeira:'BIG BOX'
   * @param {object} sensibilidade:null
   * @param {object} papel_categoria:null
   * @param {object} sub_grupo:null
   * @param {object} cluster:'BIG BOX'
   * @param {object} departamento:null
   * @param {object} secao:'SECA DOCE'
   * @param {object} db_schema:'pricing_bigbox'
   * @returns {object} totais gerais
   */
  const getGestaoTotalizadores = async (req, res) => {

    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
    var strQuery = `select * from ${schema}.filtro_multiplo_totalizador(${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao})`
    
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

  /**
   * Retorna os totais da gestão de precos para os itens analisados e prestes a 
   * serem exportados
   * @param {object} req 
   * @param {object} res 
   * @param {object} db_schema:schema
   * @returns {object} arvore de categorias
  */
  const getTotalizadoresParaItensEditados = async (req, res) => {

    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
    const strQuery = `select * from ${schema}.filtro_multiplo_totalizador_editados()`
    
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

  /**
     * Retorna os totais da gestão de precos 
     * @param {object} req 
     * @param {object} res 
     * @param {object} grupo:null
     * @param {object} fornecedor:null
     * @param {object} produto:null
     * @param {object} bandeira:'BIG BOX'
     * @param {object} sensibilidade:null
     * @param {object} papel_categoria:null
     * @param {object} sub_grupo:null
     * @param {object} cluster:'BIG BOX'
     * @param {object} departamento:null
     * @param {object} secao:'SECA DOCE'
     * @param {object} registros:'250'
     * @param {object} pagina:'1'
     * @param {object} tipo:'pais' ou 'filhos' ou 'proporcionais'
     * @param {object} db_schema:'pricing_bigbox'
     * @returns {object} data
  */
  const filterTable = async (req, res) => {
        
       
    var page_items= parseInt(req.body.registros.replace("'","")) 
    var pagina = parseInt(req.body.pagina.replace("'",""))
    var offs = (pagina -1) * page_items
    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    var tipo = req.body.tipo.replace(new RegExp("'", 'g'), "")
    var opt = ["pais","filhos","proporcionais"]
    var str_params = ''

    console.log(typeof opt[0] )

    console.log( tipo + ' >>> ' + opt[0] + ' === ' +  (tipo == opt[0]))
    console.log( tipo + ' >>> ' + opt[1] + ' === ' +    (tipo == opt[1]))
    console.log( tipo + ' >>> ' + opt[2] + ' === ' +    (tipo == opt[2]))

      if (tipo == opt[0]){
        str_params = "'PAI',0,0,0,0,null";
      } else if (tipo == opt[1]) {
        str_params = "null,1,0,0,0,null";
      } else {
        str_params = "null,0,1,0,0,null";
      }
      

    console.log('complemento=====>' +  str_params)
    
    const strQuery = `
      select * from public.filtro_multiplo (
        ${req.body.grupo},
        ${req.body.fornecedor},
        ${req.body.produto},
        ${req.body.bandeira},
        ${req.body.sensibilidade},
        ${req.body.papel_categoria},
        ${req.body.sub_grupo},
        ${req.body.cluster},
        ${req.body.departamento},
        ${req.body.secao},
        ${schema},
        ${str_params}
        ) offset ${offs} limit ${page_items};`

    const strQueryCount = `
      select count(*) from public.filtro_multiplo (
        ${req.body.grupo},
        ${req.body.fornecedor},
        ${req.body.produto},
        ${req.body.bandeira},
        ${req.body.sensibilidade},
        ${req.body.papel_categoria},
        ${req.body.sub_grupo},
        ${req.body.cluster},
        ${req.body.departamento},
        ${req.body.secao},
        ${schema},
        ${str_params}
        );`      
    
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

  
  /**
  * filtra a tabela gestão de precos e retorna todos os registros (pais e filhos
  * associados a um pai proporcional 
  * @param {object} req 
  * @param {object} res 
  * @param {object} cluster:not null
  * @param {object} codigo_pai_proporcional:not null
  * @param {object} db_schema:'pricing_bigbox'
  * @returns {object} data
  */
  const getFilhosByPaiProporcional = async (req, res) => {
    var pagina, page_items
    
    var cluster = req.body.cluster
    var cod_pai_proporcional = req.body.codigo_pai_proporcional
    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
    //pagina=req.params.pagina 
    //var offs = (pagina -1)*page_items
    const strQuery = `select * from ${schema}.tratar_dados_pais_filhos_proporcionais
    where cluster_simulador = ${cluster} and cod_pai_proporcao =${cod_pai_proporcional};`
    
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


  /**
  *  atualiza os preços editados pelo usuario
  * @param {object} req 
  * @param {object} res 
  * @param {object} cluster:not null
  * @param {object} cod_pai:not null
  * @param {object} analizado:not null, 0 ou 1
  * @param {object} exportado:not null, 0 ou 1
  * @param {object} preco_decisao:not null
  * @param {object} uid:not null, id do usuario
  * @param {object} db_schema:'pricing_bigbox'
  * @returns {object array} data:[{"update_preco_decisao": novo preço atacado com 
  * arredondamento}]
  */
  const updateNovoPreco = async (req, res) => {
    
    var cluster = req.body.cluster
    var cod_pai = req.body.codigo_pai
    var analisado = req.body.analisado
    var exportado = req.body.exportado
    var preco_decisao = req.body.preco_decisao
    var user = req.body.uid

    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")

    const strQuery = `select ${schema}.update_preco_decisao(${cod_pai},${analisado},${exportado},${preco_decisao},${cluster},${user});`
    
    try {
       const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        errorMessage.error = 'Erro na gravação de dados de novo preço';
        return res.status(status.notfound).send(errorMessage);
      }
      
      successMessage.registros = dbResponse.length;
      successMessage.data = dbResponse[0];
      
     
      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = JSON.stringify(error);
      return res.status(status.error).send(errorMessage);
    }
  };

  /**
     * atualiza o checkbox multiplo para todos os itens 
     * de um filtro de paisproporcionais
     * @param {object} req 
     * @param {object} res 
     * @param {object} grupo:null
     * @param {object} fornecedor:null
     * @param {object} produto:null
     * @param {object} bandeira:'BIG BOX'
     * @param {object} sensibilidade:null
     * @param {object} papel_categoria:null
     * @param {object} sub_grupo:null
     * @param {object} cluster:'BIG BOX'
     * @param {object} departamento:null
     * @param {object} secao:'SECA DOCE'
     * @param {object} analizado: definir para valor 1
     * @param {object} uid:not null, id do usuario
     * @param {object} db_schema:'pricing_bigbox'
     * @returns {object} data
  */
  const updateCheckboxMultiploOnClick = async (req, res) => {

    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
  
    var strQuery = `select * from ${schema}.update_checkbox_multiplo (${req.body.grupo},${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},${req.body.sub_grupo},${req.body.cluster},${req.body.departamento},${req.body.secao},${req.body.analisado},${req.body.uid});`
    
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

  /**
     * Recupera os itens alterados pelo usuario 
     * @param {object} req 
     * @param {object} res 
     * @param {object} registros:'250'
     * @param {object} pagina:'1'
     * @param {object} uid:not null, id do usuario
     * @param {object} db_schema:'pricing_bigbox'
     * @returns {object} data
  */
  const getItensEditadosByUserId = async (req, res) => {
    
    var page_items= parseInt(req.body.registros.replace("'","")) 
    var pagina = parseInt(req.body.pagina.replace("'",""))
    var offs = (pagina -1) * page_items

    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
    var strQuery = `select * from ${schema}.lista_itens_editados(${req.body.uid}) offset ${offs} limit ${page_items}`

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

  /**
  * elimina os itens alterados ( editados ) pelo usuario da lista de itens alterados
  * @param {object} req 
  * @param {object} res 
  * @param {object} uid:not null
  * @param {object} db_schema:'pricing_bigbox'
  * @returns {string} OK
  */
  const resetItensEditadosByUserId = async (req, res) => {

    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
    var strQuery = `select ${schema}.reset_parametros_update (${req.body.uid})`
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

  /**
  * consulta a tabela de pesquisas e retorna todos os registros de pesquisa
  * associados a um pai e a um cluster
  * @param {object} req 
  * @param {object} res 
  * @param {object} cluster:not null
  * @param {object} codigo_pai:not null
  * @param {object} tipo_concorrente:not null
  * @param {object} db_schema:'pricing_bigbox'
  * @returns {object} data
  */
  const getPesquisasByPai = async (req, res) => {
    
    var cluster = req.body.cluster
    var cod_pai = req.body.codigo_pai
    var tipo_concorrente = req.body.tipo_concorrente
    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    //pagina=req.params.pagina 
    //var offs = (pagina -1)*page_items
    const strQuery = `select * from ${schema}.pesquisas_codigo_pai(${cod_pai}, ${cluster},${tipo_concorrente});`
    
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

  /**
  * exporta itens para uma determinada data 
  * @param {object} req 
  * @param {object} res 
  * @param {object} uid:not null
  * @param {object} db_schema:'pricing_bigbox'
  * @returns {string} OK
  */
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

/**
  * remove itens exportados pelo usuario da lista 
  *              ==========
  * @param {object} req 
  * @param {object} res 
  * @param {object} uid:not null
  * @param {object} db_schema:'pricing_bigbox'
  * @returns {string} OK
  */
const resetItensExportadosByUserId = async (req, res) => {

  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
  var strQuery = `select ${schema}.reset_parametros_exportacao (${req.body.uid})`
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

 /**
     * Recupera os itens exportados pelo usuario 
     * @param {object} req 
     * @param {object} res 
     * @param {object} registros:'250'
     * @param {object} pagina:'1'
     * @param {object} uid:not null, id do usuario
     * @param {object} db_schema:'pricing_bigbox'
     * @returns {object} data
  */
 const getItensExportadosByUserId = async (req, res) => {

  var page_items= parseInt(req.body.registros.replace("'","")) 
  var pagina = parseInt(req.body.pagina.replace("'",""))
  var offs = (pagina -1) * page_items

  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
  const strQuery = `select * from ${schema}.lista_itens_exportados(${req.body.uid}) offset ${offs} limit ${page_items}`

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
 
 /**
     * Recupera os itens exportados pelo usuario 
     * @param {object} req 
     * @param {object} res 
     * @param {object} registros:'250'
     * @param {object} pagina:'1'
     * @param {object} uid:not null, id do usuario
     * @param {object} db_schema:'pricing_bigbox'
     * @returns {object} data
  */
 const filterByStringOnSearchBox = async (req, res) => {
 
  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
  var texto = req.body.texto.toUpperCase()

  
  var strq = `select * from ${schema}.filtro_search_box(${texto});`
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




  module.exports = {getAllFilters, 
                    getGestaoTotalizadores,
                    getTotalizadoresParaItensEditados,
                    filterTable,
                    //filterTablePaisFilhos,
                    //filterTableItensProporcionais,
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
                    filterByStringOnSearchBox
                    }