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

  module.exports= {
     
    renameKeys,
    numericPropToString,
    ensureString

  };
  