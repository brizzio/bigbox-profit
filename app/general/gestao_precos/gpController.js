//var moment = require('moment');

var dbQuery = require('../../db/dev/dbQuery');

const {empty} = require('../../helpers/validations');
 
const {
    errorMessage, 
    successMessage, 
    status
  } = require('../../helpers/status');



  /**
   * recupera categorias
   * @param {object} req 
   * @param {object} res 
   * @param {object} db_schema:schema
   * @returns {object} arvore de categorias
  */
  const getAllFilters = async (req, res) => {

    //var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")

    try {
      var strQuery = `select 
        array_agg(DISTINCT  nome_fornecedor) AS fornecedor,
        array_agg(DISTINCT  nome_grupo) AS grupo,
        array_agg(DISTINCT  descricao_produto) AS produto,
        array_agg(DISTINCT  bandeira) AS bandeira,
        array_agg(DISTINCT  sensibilidade_simulador) AS sensibilidade,
        array_agg(DISTINCT  papel_categoria_simulador) AS papel_categoria,
        array_agg(DISTINCT  nome_subgrupo) AS sub_grupo,
        array_agg(DISTINCT  cluster_simulador) AS cluster,
        array_agg(DISTINCT  nome_departamento) AS departamento,
        array_agg(DISTINCT  nome_secao) AS secao
      from pricepoint.arvore_filtro (null,null,null,null,null,null,null,null,null,null,'${req.params.db_schema}',null,0,0,0);`;

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
      select * from pricepoint.filtro_dependente(
        ${req.body.departamento},
        ${req.body.secao},
        ${req.body.grupo},
        ${req.body.sub_grupo},
        ${req.body.produto},
        ${req.body.fornecedor},
        ${req.body.bandeira},
        ${req.body.cluster},
        ${req.body.sensibilidade},
        ${req.body.papel_categoria},
        '${schema}','PAI',0,0,0,0,null);`
      
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
     * Retorna a tabela filtrada
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
  
  var strQuery = `
    select * from pricepoint.filtro_multiplo (
      ${req.body.departamento},
      ${req.body.secao},
      ${req.body.grupo},
      ${req.body.sub_grupo},
      ${req.body.produto},
      ${req.body.fornecedor},
      ${req.body.bandeira},
      ${req.body.cluster},
      ${req.body.sensibilidade},
      ${req.body.papel_categoria},      
      '${schema}',
      ${str_params}
      ) offset ${offs} limit ${page_items};`

  const strQueryCount = `
    select count(*) from pricepoint.filtro_multiplo (
      ${req.body.departamento},
      ${req.body.secao},
      ${req.body.grupo},
      ${req.body.sub_grupo},
      ${req.body.produto},
      ${req.body.fornecedor},
      ${req.body.bandeira},
      ${req.body.cluster},
      ${req.body.sensibilidade},
      ${req.body.papel_categoria},      
      '${schema}',
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
   * @param {object} flag_pai_filho:null
   * @param {object} tipo:'pais' ou 'filhos' ou 'proporcionais'
   * 
   * @returns {object} totais gerais
   * select * from pricepoint.filtro_multiplo_totalizador(null,null,null,null,null,null,null,null,null,null,'pricing_bigbox',null,0,0,0,0,null);
   */
  const getGestaoTotalizadores = async (req, res) => {

    //var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
    var strQuery = `
    select * from pricepoint.filtro_multiplo_totalizador (
      ${req.body.departamento},
      ${req.body.secao},
      ${req.body.grupo},
      ${req.body.sub_grupo},
      ${req.body.produto},
      ${req.body.fornecedor},
      ${req.body.bandeira},
      ${req.body.cluster},
      ${req.body.sensibilidade},
      ${req.body.papel_categoria},      
      ${req.body.db_schema},null,0,0,0,0,null);`

    
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

    //var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    
    var strQuery = `
    select * from pricepoint.filtro_multiplo_totalizador (
    null,null,null,null,null,null,null,null,null,null,      
    ${req.body.db_schema},null,0,0,1,0,null);`
    
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
    //var exportado = req.body.exportado
    var preco_decisao = req.body.preco_decisao
    var user = req.body.uid

    var strQuery = `select pricepoint.update_values(null,null,null,null,null,null,null,null,null,null,${analisado},${user},${req.body.db_schema},${cod_pai},${preco_decisao},'0',${cluster});`
    
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

    
    //var strQuery = `select * from ${schema}.update_checkbox_multiplo ($,${req.body.fornecedor},${req.body.produto},${req.body.bandeira},${req.body.sensibilidade},${req.body.papel_categoria},,${req.body.cluster},,,${req.body.analisado},${req.body.uid});`

    var strQuery = `select pricepoint.update_checkboxes(
      ${req.body.departamento},
      ${req.body.secao},
      ${req.body.grupo},
      ${req.body.sub_grupo},
      ${req.body.fornecedor},
      ${req.body.bandeira},
      ${req.body.cluster},
      ${req.body.sensibilidade},
      ${req.body.papel_categoria},
      ${req.body.analisado},
      ${req.body.uid},
      ${req.body.db_schema});`
    
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

    var strQuery = `
    select * from pricepoint.filtro_multiplo (
    null,null,null,null,null,null,null,null,null,null,      
    ${req.body.db_schema},null,0,0,1,0,${req.body.uid}) offset ${offs} limit ${page_items};`
  

   const strQueryCount = `
   select count(*) from pricepoint.filtro_multiplo (
   null,null,null,null,null,null,null,null,null,null,      
   ${req.body.db_schema},null,0,0,1,0,${req.body.uid});`


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

    var strQuery = `select pricepoint.reset_parametros_update (${req.body.uid},${req.body.db_schema})`
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
    
  var strQuery = `select pricepoint.reset_itens_exportados (${req.body.uid}, ${req.body.db_schema})`
   
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

  var strQuery = `
    select * from pricepoint.filtro_multiplo (
    null,null,null,null,null,null,null,null,null,null,      
    ${req.body.db_schema},null,0,0,0,1,${req.body.uid}) offset ${offs} limit ${page_items};`
  

   const strQueryCount = `
   select count(*) from pricepoint.filtro_multiplo (
   null,null,null,null,null,null,null,null,null,null,      
   ${req.body.db_schema},null,0,0,0,1,${req.body.uid});`
     

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

  var strq = `select * from pricepoint.filtro_search_box(null,null,null,null,null,null,null,null,null,null,${req.body.db_schema},null,0,0,0,0,null,${texto});`
   
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
  
  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
      
  strQueryMinMax = `select 
                    max(diferenca_total) as diferenca_total_maximo, 
                    min(diferenca_total) as diferenca_total_minimo,
                    max(novamargem) as nova_margem_maximo, 
                    min(novamargem) as nova_margem_minimo,
                    max(variacaonovopreco) as variacao_novo_preco_maximo, 
                    min(variacaonovopreco) as variacao_novo_preco_minimo
                    from pricepoint.filtro_multiplo (
                      ${req.body.departamento},
                      ${req.body.secao},
                      ${req.body.grupo},
                      ${req.body.sub_grupo},
                      ${req.body.produto},
                      ${req.body.fornecedor},
                      ${req.body.bandeira},
                      ${req.body.cluster},
                      ${req.body.sensibilidade},
                      ${req.body.papel_categoria},      
                      ${req.body.db_schema},
                      null,0,0,0,0,null);`
   
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
 
      strQuery = `select * from pricepoint.filtro_multiplo (
        ${req.body.departamento},
        ${req.body.secao},
        ${req.body.grupo},
        ${req.body.sub_grupo},
        ${req.body.produto},
        ${req.body.fornecedor},
        ${req.body.bandeira},
        ${req.body.cluster},
        ${req.body.sensibilidade},
        ${req.body.papel_categoria},      
        ${req.body.db_schema},
        null,0,0,0,0,null) ${filtro} ${ordem};`

      strQueryCount = `select count(*) from pricepoint.filtro_multiplo (
        ${req.body.departamento},
        ${req.body.secao},
        ${req.body.grupo},
        ${req.body.sub_grupo},
        ${req.body.produto},
        ${req.body.fornecedor},
        ${req.body.bandeira},
        ${req.body.cluster},
        ${req.body.sensibilidade},
        ${req.body.papel_categoria},      
        ${req.body.db_schema},
        null,0,0,0,0,null) ${filtro};`
  
  
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
                    slidersMinMaxValues,
                    filterBySliderValue,
                    filterByStringOnSearchBox
                    }
