const renameKeys = function (obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }


  const numericPropToString = function (obj) {
    const keyValues = Object.keys(obj).map(key => {
    	if(typeof obj[key] == 'number')
      return { [key]: obj[key].toString() };
      else
      return { [key]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }
 
 const ensureString = function (target, objKey){
    for (const reg in target) {
     		var obj = target[reg]
        target[reg][objKey] = numericPropToString(obj[objKey]);
     }
   //console.log(target)
   return target
}

const makeWhereStringFromObjectFilter = function (filtro){
  console.log('vai construir a wherestring')
  console.log(filtro)

  var a =  (filtro.bandeira=="null")?"":` and bandeira in (${filtro.bandeira})`
  var b =  (filtro.cluster=="null")?"":` and cluster_simulador in (${filtro.cluster})`
  var c = (filtro.departamento=="null")?"":`and nome_departamento in (${filtro.departamento})`
  var d = (filtro.secao=="null")?"":` and nome_secao in (${filtro.secao})` 
  var e = (filtro.grupo=="null")?"":` and nome_grupo in (${filtro.grupo})`
  var f = (filtro.sub_grupo=="null")?"":` and nome_subgrupo in (${filtro.sub_grupo})`
  var g =  (filtro.papel_categoria=="null")?"":` and papel_categoria_simulador in (${filtro.papel_categoria})`
  var h = (filtro.sensibilidade=="null")?"":` and sensibilidade_simulador in (${filtro.sensibilidade})`
  var i =  (filtro.fornecedor=="null")?"":` and nome_fornecedor in (${filtro.fornecedor})`

  return a+b+c+d+e+f+g+h+i;

  
};

  module.exports= {
     
    renameKeys,
    numericPropToString,
    ensureString,
    makeWhereStringFromObjectFilter

  };
  