module.exports = async (req, res, next) => {
    //console.log('Acessou a filterStrinBuilder ( MIDDLEWARE ) com o seguinte body:')
    //console.log(JSON.stringify(req.body))

    var db = req.body.db_schema.replace(new RegExp("'", 'g'), "") // remove as aspas para usar no select
    
    var a = (req.body.departamento=="null")?"":`and nome_departamento in (${req.body.departamento})`
    var b = (req.body.secao=="null")?"":` and nome_secao in (${req.body.secao})` 
    var c = (req.body.grupo=="null")?"":` and nome_grupo in (${req.body.grupo})`
    var d = (req.body.sub_grupo=="null")?"":` and nome_subgrupo in (${req.body.sub_grupo})`
    var e =  (req.body.produto=="null")?"":` and descricao_produto in (${req.body.produto})`
    var f =  (req.body.fornecedor=="null")?"":` and nome_fornecedor in (${req.body.fornecedor})`
    var g =  (req.body.bandeira=="null")?"":` and bandeira in (${req.body.bandeira})`
    var h =  (req.body.cluster=="null")?"":` and cluster_simulador in (${req.body.cluster})`
    var i = (req.body.sensibilidade=="null")?"":` and sensibilidade_simulador in (${req.body.sensibilidade})`
    var j =  (req.body.papel_categoria=="null")?"":` and papel_categoria_simulador in (${req.body.papel_categoria})`
  
    var tree = a+b+c+d+e+f+g+h+i+j
  
    req.body.db = db
    req.body.and_where_filters = tree
    //console.log(JSON.stringify(req.body))
    next()
};