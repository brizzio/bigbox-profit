//var moment = require('moment');

var dbQuery = require('../../db/dev/dbQuery');

const {empty} = require('../../helpers/validations');
 
const {
    errorMessage, 
    successMessage, 
    status
  } = require('../../helpers/status');


  

  
  /**
   * consulta os dados para geração de graficos
   * @param {object} req 
   * @param {object} res 
   * @param {object} func 
   * @options
   *  pricepoint.analise_ruptura(db text default null::text)
      pricepoint.analise_quantitativo(db text default null::text)
      pricepoint.indice_preco_concorrente(db text default null::text)
      pricepoint.indice_competitividade(db text default null::text)
      pricepoint.totalizadores_dash(db text default null::text)
      pricepoint.venda_sensibilidade(db text default null::text)
   * @returns {object} dados para popular dados nos
  */
 const getDashData = async (req, res) => {
  
  var r = {}
  var strQuery = ''
  var result = {}
  var schema = req.body.db_schema.replace(new RegExp("'", 'g'), "")
  
  let calledRoute = req.originalUrl.match('^[^?]*')[0].split('/').slice(1)
  let tabela = calledRoute.slice(-1).toString().replace(new RegExp("'", 'g'), "").replace(new RegExp("-", 'g'), "_")
  console.log(req.originalUrl,tabela)


  switch (tabela) {
    case 'totalizadores_dash':
      strQuery = `select *,(select indice_competitividade_novo_ponderado_atacado from ${schema}.indice_competitividade) as indice_competitividade_novo_ponderado_atacado,(select indice_competitividade_novo_ponderado_atacado from ${schema}.indice_competitividade) as indice_competitividade_novo_ponderado_varejo from ${schema}.totalizadores_dash td`;
      break;
  
    default:
      strQuery = `select * from ${schema}.${tabela};`;
  }

  
  console.log(strQuery)

  try {
    
    result = await dbQuery.query(strQuery);
    
    console.log(JSON.stringify(result.rows[0]))
    console.log(result.rows[0] === undefined)
    
    if (result.rows[0] === undefined) {
      r.status='error'
      r.query = strQuery;
      r.error = JSON.stringify(result);
      r.data = []
      return res.status(status.notfound).send(r);
    }
    

    r.status='success'
    r.data = result.rows;
    console.log(JSON.stringify(r))
   
    return res.status(status.success).send(r);
  
  } catch (error) {
    errorMessage.error = JSON.stringify(error);
    return res.status(status.error).send(errorMessage);
  }
};
  
  
  
  /**
   * Recupera a localização geografica das lojas
   * @param {object} req 
   * @param {object} res 
   * @param {object} db_schema:schema
   * @returns {object} geo localização das lojas do cliente
  */
 const getGeoLojas = async (req, res) => {
  
  const strQuery = `select bigbox.cadastro_lojas;`
  
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

/**
   * Recupera a localização geografica das lojas dos concorrentes
   * @param {object} req 
   * @param {object} res 
   * @param {object} db_schema:schema
   * @returns {object} geo localização das lojas dos concorrentes pesquisados
  */
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

  module.exports = {
  getGeoConcorrentes,
  getGeoLojas,
  getDashData
  }
