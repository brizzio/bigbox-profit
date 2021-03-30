//var moment = require('moment');

var dbQuery = require('../../db/dev/dbQuery');

const {empty} = require('../../helpers/validations');

const fn = require('../../helpers/functions');
 
const {
    errorMessage, 
    successMessage, 
    status
  } = require('../../helpers/status');
const { select } = require('async');



  /**
   * recupera categorias
   * @param {object} req 
   * @param {object} res 
   * @param {object} db_schema:schema
   * @returns {object} arvore de categorias
  */
  const getAllFilters = async (req, res) => {

    //var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
    // fornecedor, grupo, produto, bandeira, sensibilidade, papel_categoria, sub_grupo, "cluster", departamento, secao
    try {
      var strQuery = `select 
      bandeira, "cluster", departamento, secao, grupo, sub_grupo, fornecedor, papel_categoria, sensibilidade      
      from ${req.params.db_schema}.mv_filters;`;

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

  var msg = {}
  msg.data = [];
  var strQuery =''


//*** {and_where_filters} & {db}**** 
//estes itens são introduzidos no req.body pela função filterStringBuilder(MIDDLEWARE)
//----chamada pelo router --- 

strQuery = `select 
            array_agg(DISTINCT  bandeira) AS bandeira,
            array_agg(DISTINCT  cluster_simulador) AS cluster,
            array_agg(DISTINCT  nome_departamento) AS departamento,
            array_agg(DISTINCT  nome_secao) AS secao,
            array_agg(DISTINCT  nome_grupo) AS grupo,
            array_agg(DISTINCT  nome_subgrupo) AS sub_grupo,
            array_agg(DISTINCT  nome_fornecedor) AS fornecedor,
            array_agg(DISTINCT  papel_categoria_simulador) AS papel_categoria,
            array_agg(DISTINCT  sensibilidade_simulador) AS sensibilidade
            from ${req.body.db}.filtro_dependente where 1=1
              ${req.body.and_where_filters};`
      
    try {
      
      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
       
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
  
  let calledRoute = req.originalUrl.match('^[^?]*')[0].split('/').slice(1)
  let endpoint = calledRoute.slice(-1).toString().replace(new RegExp("'", 'g'), "").replace(new RegExp("-", 'g'), "_")
  
  var msg = {}
  var page_items= parseInt(req.body.registros.replace("'","")) 
  var pagina = parseInt(req.body.pagina.replace("'",""))
  var offs = (pagina -1) * page_items
  var opt = ["filtro","paisefilhos","proporcionais"]
  var str_params = ''

  //console.log(typeof opt[0] )

  //console.log( endpoint + ' >>> ' + opt[0] + ' === ' +  (endpoint == opt[0]))
  //console.log( endpoint + ' >>> ' + opt[1] + ' === ' +  (endpoint == opt[1]))
  //console.log( endpoint + ' >>> ' + opt[2] + ' === ' +  (endpoint == opt[2]))

    if (endpoint == opt[0]){
      str_params = " AND flag_pai_ou_filho='PAI'::text";
    } else if (endpoint == opt[1]) {
      str_params = " AND flag_pai_ou_filho='FILHO'::text";
    } else {
      str_params = " and ftp_fator::numeric <> 1::numeric AND flag_pai_ou_filho = 'FILHO'::text";
    }
    
  //console.log('complemento=====>' +  str_params)
  //*** {and_where_filters} & {db}**** 
  //estes itens são introduzidos no req.body pela função filterStringBuilder(MIDDLEWARE)
  //----chamada pelo router --- 

  var strQuery = `select * from ${req.body.db}.vw_dados_totais where 1=1 ${req.body.and_where_filters} ${str_params} offset ${offs} limit ${page_items};`

  const strQueryCount = `select count(*) from ${req.body.db}.vw_dados_totais where 1=1 ${req.body.and_where_filters} ${str_params} offset ${offs} limit ${page_items};`
  
  try {
    
    if (pagina == 1){
    const countSelect = await dbQuery.query(strQueryCount);
    console.log(JSON.stringify('contagem ===> ' + countSelect.rows[0].count))
    var reg = countSelect.rows[0].count
    msg.registros = reg;
    msg.paginas = Math.ceil(reg / page_items)
    } 

    const { rows } = await dbQuery.query(strQuery);
    

    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      
      msg.data = [];
      return res.status(status.success).send(msg);
    }
    
    msg.pagina = pagina
    msg.start_at = offs + 1;
    msg.end_at = msg.registros < page_items ? msg.registros : offs + page_items+1;
    msg.data = dbResponse;
   
    return res.status(status.success).send(msg);
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

    //console.log('complemento=====>' +  str_params)
  //*** {and_where_filters} & {db}**** 
  //estes itens são introduzidos no req.body pela função filterStringBuilder(MIDDLEWARE)
  //----chamada pelo router --- 

    
    var strQuery = `
    select 
    count(*) AS itens_exportados,
    sum(lucro_rs) / sum(venda_rs) as margem_atual_ponderada,  
    case when sum(vendas::numeric) is null then 0 else sum(vendas::numeric) end as total_vendas,
    sum(lucro_rs_novo) / sum(venda_rs_novo) as margem_nova_ponderada,
    case when to_char(sum(preco_atual_varejo::numeric * vendas::numeric), 'FM999999999999999999'::text)::numeric <> 0 then to_char(sum(preco_atual_varejo::numeric * vendas::numeric), 'FM999999999999999999'::text)::numeric else 0.0 end AS venda_total_atual,
    case when to_char(sum(coalesce (preco_decisao::numeric,preco_min_max::numeric) * qtde_vendas_estimada), 'FM999999999999999999'::text)::numeric <> 0 then to_char(sum(coalesce (preco_decisao::numeric,preco_min_max::numeric) * qtde_vendas_estimada), 'FM999999999999999999'::text)::numeric else 0.0 end AS venda_total_novo_preco,
       case when sum(vendas::numeric) <>0  then sum(margem_objetiva_ponderada::numeric) /sum(vendas::numeric)else 0.0 end as margem_objetiva_ponderada,
    case when sum(diferenca_preco_total) is null then 0.00 else sum(diferenca_preco_total) end as diferenca_total,
    case when avg(indice_preco_atual)>0 then avg(indice_preco_atual) else 0 end AS indice_competitividade_atual_medio,
    case when  greatest (sum(preco_ponderado_cliente),sum(preco_ponderado_concorrente)) >0 then  (((sum(preco_ponderado_cliente) - sum(preco_ponderado_concorrente)) / greatest (sum(preco_ponderado_cliente),sum(preco_ponderado_concorrente))) +1)*100 else 0.0 end as indice_competitividade_atual_ponderado,
    case when avg(indice_novo_atual) >0 then avg(indice_novo_atual) else 0 end AS indice_final_medio,
    case when avg(indice_competitividade_novo_medio_) >0 then avg(indice_competitividade_novo_medio_) else 0 end AS indice_competitividade_novo_medio,
    case when greatest (sum(preco_ponderado_cliente_novo),sum(preco_ponderado_concorrente)) >0 then  (((sum(preco_ponderado_cliente_novo) - sum(preco_ponderado_concorrente)) / greatest (sum(preco_ponderado_cliente_novo),sum(preco_ponderado_concorrente))) +1)*100 else 0.0 end as indice_competitividade_novo_ponderado,
    case when sum(case when analizado = 1 then 1 else 0 end)::numeric is null then 0 else sum(case when analizado = 1 then 1 else 0 end)::numeric end as itens_editados,
    case when sum (case when coalesce (preco_decisao::numeric,preco_min_max::numeric) <> preco_atual_varejo::numeric then 1 else 0 end)::numeric is null then 0 else sum (case when coalesce (preco_decisao::numeric,preco_min_max::numeric) <> preco_atual_varejo::numeric then 1 else 0 end)::numeric end as itens_preco_alterado,
    case when sum(vendas::numeric) >0 then sum(margem_sugestao_ponderada) / sum(vendas::numeric)else 0.0 end as margem_regular_sugestao,
    case when avg(indice_novo_sugestao) >0 then avg(indice_novo_sugestao) else 0 end AS indice_medio_sugestao,
    case when greatest (sum(preco_ponderado_cliente_sugestao),sum(preco_ponderado_concorrente)) >0 then  (((sum(preco_ponderado_cliente_sugestao) - sum(preco_ponderado_concorrente)) / greatest (sum(preco_ponderado_cliente_sugestao),sum(preco_ponderado_concorrente))) +1)*100 else 0.0 end as indice_ponderado_sugestao,
    sum(lucro_realizado) / sum(receita_realizada) as margem_real
    from ${req.body.db}.vw_dados_totais_totalizador2
    where 1=1 ${req.body.and_where_filters}`

    
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
    
    var strQuery = `select 
    count(*) AS itens_exportados,
    sum(lucro_rs) / sum(venda_rs) as margem_atual_ponderada,  
    case when sum(vendas::numeric) is null then 0 else sum(vendas::numeric) end as total_vendas,
    sum(lucro_rs_novo) / sum(venda_rs_novo) as margem_nova_ponderada,
    case when to_char(sum(preco_atual_varejo::numeric * vendas::numeric), 'FM999999999999999999'::text)::numeric <> 0 then to_char(sum(preco_atual_varejo::numeric * vendas::numeric), 'FM999999999999999999'::text)::numeric else 0.0 end AS venda_total_atual,
    case when to_char(sum(coalesce (preco_decisao::numeric,preco_min_max::numeric) * qtde_vendas_estimada), 'FM999999999999999999'::text)::numeric <> 0 then to_char(sum(coalesce (preco_decisao::numeric,preco_min_max::numeric) * qtde_vendas_estimada), 'FM999999999999999999'::text)::numeric else 0.0 end AS venda_total_novo_preco,
       case when sum(vendas::numeric) <>0  then sum(margem_objetiva_ponderada::numeric) /sum(vendas::numeric)else 0.0 end as margem_objetiva_ponderada,
    case when sum(diferenca_preco_total) is null then 0.00 else sum(diferenca_preco_total) end as diferenca_total,
    case when avg(indice_preco_atual)>0 then avg(indice_preco_atual) else 0 end AS indice_competitividade_atual_medio,
    case when  greatest (sum(preco_ponderado_cliente),sum(preco_ponderado_concorrente)) >0 then  (((sum(preco_ponderado_cliente) - sum(preco_ponderado_concorrente)) / greatest (sum(preco_ponderado_cliente),sum(preco_ponderado_concorrente))) +1)*100 else 0.0 end as indice_competitividade_atual_ponderado,
    case when avg(indice_novo_atual) >0 then avg(indice_novo_atual) else 0 end AS indice_final_medio,
    case when avg(indice_competitividade_novo_medio_) >0 then avg(indice_competitividade_novo_medio_) else 0 end AS indice_competitividade_novo_medio,
    case when greatest (sum(preco_ponderado_cliente_novo),sum(preco_ponderado_concorrente)) >0 then  (((sum(preco_ponderado_cliente_novo) - sum(preco_ponderado_concorrente)) / greatest (sum(preco_ponderado_cliente_novo),sum(preco_ponderado_concorrente))) +1)*100 else 0.0 end as indice_competitividade_novo_ponderado,
    case when sum(case when analizado = 1 then 1 else 0 end)::numeric is null then 0 else sum(case when analizado = 1 then 1 else 0 end)::numeric end as itens_editados,
    case when sum (case when coalesce (preco_decisao::numeric,preco_min_max::numeric) <> preco_atual_varejo::numeric then 1 else 0 end)::numeric is null then 0 else sum (case when coalesce (preco_decisao::numeric,preco_min_max::numeric) <> preco_atual_varejo::numeric then 1 else 0 end)::numeric end as itens_preco_alterado,
    case when sum(vendas::numeric) >0 then sum(margem_sugestao_ponderada) / sum(vendas::numeric)else 0.0 end as margem_regular_sugestao,
    case when avg(indice_novo_sugestao) >0 then avg(indice_novo_sugestao) else 0 end AS indice_medio_sugestao,
    case when greatest (sum(preco_ponderado_cliente_sugestao),sum(preco_ponderado_concorrente)) >0 then  (((sum(preco_ponderado_cliente_sugestao) - sum(preco_ponderado_concorrente)) / greatest (sum(preco_ponderado_cliente_sugestao),sum(preco_ponderado_concorrente))) +1)*100 else 0.0 end as indice_ponderado_sugestao,
    sum(lucro_realizado) / sum(receita_realizada) as margem_real
    from ${req.body.db}.vw_dados_totais_totalizador where analizado=1;`
    
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
    
  var cluster = req.body.cluster.replace(new RegExp("'", 'g'), "")
  var cod_pai = req.body.codigo_pai.replace(new RegExp("'", 'g'), "")
  var tipo_concorrente = req.body.tipo_concorrente.replace(new RegExp("'", 'g'), "")
  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
  //pagina=req.params.pagina 
  //var offs = (pagina -1)*page_items
  const strQuery = `select * from pricepoint.pesquisas_codigo_pai('${cod_pai}', '${cluster}','${tipo_concorrente}','${schema}');`

  try {
     const { rows } = await dbQuery.query(strQuery);
    //console.log(JSON.stringify(rows))

    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
        var sm = {}
        var resp = []
        sm.registros = 0;
        sm.data = resp;
        return res.status(status.success).send(sm);
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
  var analizado = req.body.analizado
  //var exportado = req.body.exportado
  var preco_decisao = req.body.preco_decisao
  var user = req.body.uid

  const newKeys = { update_values_test: "update_values" };

  var strQuery = `select pricepoint.update_values_test(null,null,null,null,null,null,null,null,null,null,${analizado},${user},${req.body.db_schema},${cod_pai},${preco_decisao},'0',${cluster});`
  
  try {
     const { rows } = await dbQuery.query(strQuery);
    console.log(JSON.stringify(rows))

    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = 'Erro na gravação de dados de novo preço';
      return res.status(status.notfound).send(errorMessage);
    }
    
    
    fn.ensureString(dbResponse,"update_values_test")
    
    successMessage.registros = dbResponse.length;
    successMessage.data = dbResponse.map((e)=>fn.renameKeys(e, newKeys))
    
    //.map((item)=>fn.numericPropToString(item["update_values"]))
     
   
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
     * ESTA FUNCAO NAO USA O MIDDLEWARE filterStringBuilder.js
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
    var msg = {}
    var page_items= parseInt(req.body.registros.replace("'","")) 
    var pagina = parseInt(req.body.pagina.replace("'",""))
    var offs = (pagina -1) * page_items
    var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")

    var strQuery = `select * from ${schema}.vw_dados_totais where analizado=1;`
  

   const strQueryCount = `select count(*) from ${schema}.vw_dados_totais where analizado=1;`


    try {
      
      if (pagina == 1){
        const countSelect = await dbQuery.query(strQueryCount);
        //console.log(JSON.stringify('contagem ===> ' + rows))
        var reg = countSelect.rows[0].count
        msg.registros = reg;
        msg.paginas = Math.ceil(reg / page_items)
      }

      const { rows } = await dbQuery.query(strQuery);
      //console.log(JSON.stringify(rows))

      const dbResponse = rows;
      if (dbResponse[0] === undefined) {
        
        
        msg.data = [];
        //console.log('passou aqui...' + msg.data)
        return res.status(status.success).send(msg);
      }
      
      msg.pagina = pagina
      msg.start_at = offs + 1;
      msg.end_at =  msg.registros < page_items? msg.registros : offs + page_items+1;;
      msg.data = dbResponse;
     
      return res.status(status.success).send(msg);
      
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
  * select dia.exporta_itens('1234', '2020-01-05')
  */
const exportaItens = async (req, res) => {
  
  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
  
  const strQuery = `select * from ${schema}.exporta_itens (${req.body.uid},${req.body.data});`
  
  try {
     const { rows } = await dbQuery.query(strQuery);
    //console.log(JSON.stringify(rows))

    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      let msg = {}
      msg.data = []
      msg.message = 'Não existem itens exportados...';
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
  * exporta itens para uma determinada data 
  * @param {object} req 
  * @param {object} res 
  * @param {object} uid:not null
  * @param {object} db_schema:'pricing_bigbox'
  * @returns {string} OK
  * select dia.exporta_itens('1234', '2020-01-05')
  */
 const downloadItensExportados = async (req, res) => {
  
  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")

  var strQuery = ''

  if(schema == 'pricing_bigbox'){
    strQuery = `select * from pricing_bigbox.api_retorno;`
  }else{
    strQuery =`select * from ${schema}.arquivo_exportacao;`
  }
  
  try {
     const { rows } = await dbQuery.query(strQuery);
    //console.log(JSON.stringify(rows))

    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      msg = {}
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

  var msg = {}
  var page_items= parseInt(req.body.registros.replace("'","")) 
  var pagina = parseInt(req.body.pagina.replace("'",""))
  var offs = (pagina -1) * page_items

  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")

  var strQuery = `select * from ${schema}.vw_dados_totais where exportado=1`
  

  var strQueryCount = `select count(*) from ${schema}.vw_dados_totais where exportado=1;`
     

   try {

    if (pagina == 1){
      const countSelect = await dbQuery.query(strQueryCount);
      var reg = countSelect.rows[0].count
      console.log('contagem ===> ' + reg)
      msg.registros = reg;
      msg.paginas = Math.ceil(reg / page_items)
    }
     
     const { rows } = await dbQuery.query(strQuery);
     //console.log(JSON.stringify(rows))

     const dbResponse = rows;
     if (dbResponse[0] === undefined) {
       
       
       msg.data = [];
       return res.status(status.success).send(msg);
     }
     
     msg.pagina = pagina
     msg.start_at = offs + 1;
     msg.end_at = msg.registros < page_items ? msg.registros : offs + page_items+1;
     msg.data = dbResponse;
    
     return res.status(status.success).send(msg);
   } catch (error) {
     errorMessage.error = JSON.stringify(error);
     return res.status(status.error).send(errorMessage);
   }
 };
 
/**
     * Recupera os itens bloqueados pelo usuario 
     * @param {object} req 
     * @param {object} res 
     * @param {object} registros:'250'
     * @param {object} pagina:'1'
     * @param {object} uid:not null, id do usuario
     * @param {object} db_schema:'pricing_bigbox'
     * @returns {object} data
  */
 const getItensBloqueadosByUserId = async (req, res) => {

  var msg = {}
  var page_items= parseInt(req.body.registros.replace("'","")) 
  var pagina = parseInt(req.body.pagina.replace("'",""))
  var offs = (pagina -1) * page_items

  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")

  var strQuery = `select * from ${schema}.vw_dados_totais where analizado=2;`
  
  var strQueryCount = `select count(*) ${schema}.vw_dados_totais where analizado=2;`
     

   try {

    if (pagina == 1){
      const countSelect = await dbQuery.query(strQueryCount);
      var reg = countSelect.rows[0].count
      console.log('contagem ===> ' + reg)
      msg.registros = reg;
      msg.paginas = Math.ceil(reg / page_items)
    }
     
     const { rows } = await dbQuery.query(strQuery);
     //console.log(JSON.stringify(rows))

     const dbResponse = rows;
     if (dbResponse[0] === undefined) {
       
       
       msg.data = [];
       return res.status(status.success).send(msg);
     }
     
     msg.pagina = pagina
     msg.start_at = offs + 1;
     msg.end_at = msg.registros < page_items ? msg.registros : offs + page_items+1;
     msg.data = dbResponse;
    
     return res.status(status.success).send(msg);

   } catch (error) {
     errorMessage.error = JSON.stringify(error);
     return res.status(status.error).send(errorMessage);
   }
 };

/**
  * elimina os itens bloqueados pelo usuario 
  * @param {object} req 
  * @param {object} res 
  * @param {object} uid:not null
  * @param {object} db_schema:'pricing_bigbox'
  * @returns {string} OK
  */
 const resetItensBloqueadosByUserId = async (req, res) => {

  var strQuery = `select pricepoint.reset_itens_bloqueados(${req.body.uid},${req.body.db_schema})`
   try {
     
     const { rows } = await dbQuery.query(strQuery);
     //console.log(JSON.stringify(rows))

     const dbResponse = rows;
     if (dbResponse[0] === undefined) {
       errorMessage.error = 'Não encontramos itens bloqueados pelo usuario ' + req.body.uid + '...';
       return res.status(status.success).send(errorMessage);
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
     * @param {object} db_schema:'pricing_bigbox'
     * @param {object} texto:not null, string para pocurar
     * @param {object} cluster:cluster selecionado se houver
     * @returns {object} data
  */
 const filterByStringOnSearchBox = async (req, res) => {
 
  var texto = req.params.texto.toUpperCase()
  var cluster = (req.params.cluster == null)?"null":"'" + decodeURI(req.params.cluster) + "'"

  var strq = `select * from pricepoint.filtro_search_box(
    '${req.params.schema}','${texto}',${cluster});`
   
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

 /**
  * ESTA FUNCAO USA O MIDDLEWARE filterStringBuilder.js
  * calcula os limites minimos e maximos dos sliders
  * @param {*} req 
  * @param {*} res 
  */
const slidersMinMaxValues = async (req, res) => {
    
  var sm = {}
  
  //o db vem do middleware   
  strQueryMinMax = `select 
                    round(max(diferenca_total)+1) as diferenca_total_maximo, 
                    round(min(diferenca_total)-1) as diferenca_total_minimo,
                    round(max(margem_nova)+1) as nova_margem_maximo, 
                    round(min(margem_nova)-1) as nova_margem_minimo,
                    round(max(var_novo_preco)+1) as variacao_novo_preco_maximo, 
                    round(min(var_novo_preco)-1) as variacao_novo_preco_minimo
                    from ${req.body.db}.vw_dados_totais where 1=1 ${req.body.and_where_filters} and analizado::numeric <> 2;`
   
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

/**
 * ESTA FUNCAO **NAO** USA O MIDDLEWARE filterStringBuilder.js
 * @param {*} req 
 * @param {*} res 
 */

const filterBySliderValue = async (req, res) => {
    
  var strQuery = ''
  var strQueryCount = ''
  var filtro = ''
  var ordem = ''
  var campo_slider = ''
  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
  var sm = {}
  var page_items= parseInt(req.body.registros.replace("'","")) 
  var pagina = parseInt(req.body.pagina.replace("'",""))
  var offs = (pagina -1) * page_items

  var value = parseInt(req.body.maioriguala.replace("'",""));

  var abaixo_de = req.body.abaixo_de === undefined || req.body.abaixo_de==="null"?null:parseInt(req.body.abaixo_de.replace("'",""));
  var acima_de = req.body.acima_de === undefined || req.body.acima_de==="null"?null:parseInt(req.body.acima_de.replace("'",""));

  //console.log('abaixo_de...>' + abaixo_de)
  //console.log('acima_de...>' + acima_de)


  var num_slider = parseInt(req.body.slider.replace("'",""))

  switch (num_slider) {
    case 1:
      campo_slider = "diferenca_total";
      break;
    case 2:
      campo_slider = "margem_nova";
      break;
    case 3:
      campo_slider = "var_novo_preco";
  }

  var a =  req.body.departamento=="null"?"":`and nome_departamento=${req.body.departamento}`
  var b = (req.body.secao=="null")?"":` and nome_secao=${req.body.secao}` 
  var c =  (req.body.grupo=="null")?"":` and nome_grupo=${req.body.grupo}`
  var d = (req.body.sub_grupo=="null")?"":` and nome_subgrupo=${req.body.sub_grupo}`
  var e =  (req.body.produto=="null")?"":` and descricao_produto=${req.body.produto}`
  var f =  (req.body.fornecedor=="null")?"":` and nome_fornecedor=${req.body.fornecedor}`
  var g =  (req.body.bandeira=="null")?"":` and bandeira=${req.body.bandeira}`
  var h =  (req.body.cluster=="null")?"":` and cluster_simulador=${req.body.cluster}`
  var i = (req.body.sensibilidade=="null")?"":` and sensibilidade_simulador=${req.body.sensibilidade}`
  var j =  (req.body.papel_categoria=="null")?"":` and papel_categoria_simulador=${req.body.papel_categoria}`

  var tree = a+b+c+d+e+f+g+h+i+j


  

  if(value >= 0){
    filtro = `where ${campo_slider} >= ${value}` 
    ordem = `order by ${campo_slider} desc`
  }else{
    filtro = `where ${campo_slider} <= ${value}`
    ordem = `order by ${campo_slider} asc`  
  }

  strQuery = `select * from ${schema}.vw_dados_totais vdt ${filtro} ${tree} ${ordem}`

  strQueryCount = `select count(*) from ${schema}.vw_dados_totais vdt ${filtro} ${tree}`

  //verifica se tem valores acima ou abaixo de.... essa seleção sobrepoe o bloco if anterior
  var outliers = ''

  if(acima_de || abaixo_de){

      if(acima_de && abaixo_de){
        
        //
        //console.log('ambosValoeres...> %s --- %s',abaixo_de,acima_de)
        outliers= `where ( ${campo_slider}::numeric < ${abaixo_de}::numeric or ${campo_slider}::numeric > ${acima_de}::numeric )`
        if (acima_de == abaixo_de){
          strQuery = `select * from ${schema}.vw_dados_totais vdt where 1=1 ${tree} ${ordem}`
        }

      }else{

          outliers = abaixo_de!==null?`where ${campo_slider}::numeric < ${abaixo_de}`:`where ${campo_slider}::numeric > ${acima_de}`
          
      }

      ordem = `order by ${campo_slider} desc`

      strQuery = `select * from ${schema}.vw_dados_totais vdt ${outliers} ${tree} and analizado::numeric <> 2 ${ordem}`

      strQueryCount = `select count(*) from ${schema}.vw_dados_totais vdt ${outliers} ${tree} and analizado::numeric <> 2`
  }

  //console.log('outliers...> ' + outliers + ' ordem...> ' + ordem)

 
    try {
      
      if (pagina == 1){
        //console.log(JSON.stringify('query ===> ' + strQueryCount))

        const countSelect = await dbQuery.query(strQueryCount);
        var reg = countSelect.rows[0].count
        //console.log('reg...>' + reg)
        sm.registros = reg;
        sm.paginas = Math.ceil(reg / page_items)
        }
    
    
    
    const { rows } = await dbQuery.query(strQuery);
    
    const dbResponse = rows;
    if (dbResponse[0] === undefined) 
    {
      errorMessage.error = JSON.stringify(req.body);
     return res.status(status.notfound).send(errorMessage);
    }else{

          var id_editavel_array = []
          
          dbResponse.forEach((item)=>{
            console.log('eh um item pai editavel? %s --- id: %s',item.cod_pai_proporcao == item.codigo_filhos,item.id_editavel)
              if (item.cod_pai_proporcao !== item.codigo_filhos){
                id_editavel_array.push(item.id_editavel)
                console.log('adiciona? %s ---- SIM',item.id_editavel)
              }else{
                id_editavel_array = id_editavel_array.filter(e => e !== item.id_editavel)
                console.log('removido %s ---- SIM',item.id_editavel)
              }
              
          })
          
          if(id_editavel_array.length > 0){
              var pais_editaveis_ausentes = "(" + [...new Set(id_editavel_array)].map(array_item => `'${array_item}'`).join(',') + ")"
              console.log('array de ids editaveis ===>' + pais_editaveis_ausentes)
              const result = await dbQuery.query(`select * from ${schema}.vw_dados_totais where id_editavel IN ${pais_editaveis_ausentes} and flag_pai_ou_filho = 'PAI'`); 
              var pais_editaveis = result.rows;
              // atualiza o numero de registros e paginas
              sm.registros = parseInt(sm.registros) + parseInt(Object.keys(pais_editaveis).length)

              console.log('pais_editaveis quantidade ===>' + Object.keys(pais_editaveis).length)

              sm.paginas = Math.ceil(sm.registros / page_items)

              console.log('pais_editaveis ===>' + JSON.stringify(pais_editaveis))

              sm.pais_editaveis_ausentes = pais_editaveis_ausentes

              pais_editaveis.forEach(obj=>dbResponse.push(obj))
              
              sm.pagina = 1
              sm.start_at = 1;
              sm.end_at = sm.registros;
              sm.data = dbResponse.sort(function(a, b) {
                        //classifica pelo valor do slider tudo decrescente 
                        //if (a[campo_slider] > b[campo_slider]) return -1
                        //if (a[campo_slider] < b[campo_slider]) return 1
                        //If the first item comes first in the alphabet, move it up
                        if (a.id_editavel > b.id_editavel) return 1
                        if (a.id_editavel < b.id_editavel) return -1
                        //poe o pai primeiro
                        if (a.flag_pai_ou_filho > b.flag_pai_ou_filho) return -1
                        if (a.flag_pai_ou_filho < b.flag_pai_ou_filho) return 1
                      })//.map(e=>  ['id_editavel', 'novamargem'].reduce(function(o, k) { o[k] = e[k]; return o; }, {}));
  
                          
            return res.status(status.success).send(sm);              
          
          }else{

            sm.pagina = 1
            sm.start_at = 1;
            sm.end_at = sm.registros;
            sm.data = dbResponse;
  
          
              return res.status(status.success).send(sm);

          }
          
             
    }

  } catch (error) {
    errorMessage.error = JSON.stringify(error);
    return res.status(status.error).send(errorMessage);
  }
};




  module.exports = {getAllFilters, 
                    getGestaoTotalizadores,
                    getTotalizadoresParaItensEditados,
                    filterTable,
                    filtroDependente,
                    updateNovoPreco,
                    updateCheckboxMultiploOnClick,
                    getItensEditadosByUserId,
                    getItensBloqueadosByUserId,
                    resetItensBloqueadosByUserId,
                    getItensExportadosByUserId,
                    resetItensEditadosByUserId,
                    resetItensExportadosByUserId,
                    getPesquisasByPai,
                    exportaItens,
                    downloadItensExportados,
                    slidersMinMaxValues,
                    filterBySliderValue,
                    filterByStringOnSearchBox
                    }
