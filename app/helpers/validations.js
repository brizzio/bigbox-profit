const env  = require('../../env');

/**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

/**
   * validatePassword helper method
   * @param {string} password
   * @returns {Boolean} True or False
   */
const validatePassword = (password) => {
  if (password.length <= 5 || password === '') {
    return false;
  } return true;
};
/**
   * isEmpty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const isEmpty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
  if (input.replace(/\s/g, '').length) {
    return false;
  } return true;
};

/**
   * empty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const empty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
};

/**
   * generate Token
   * @param {string} id
   * @returns {string} token
   */
  const generateUserToken = (email, id, is_admin, first_name, last_name) => {
   return token = jwt.sign(
       {
           email,
           user_id:id,
           is_admin,
           first_name,
           last_name
       },
       env.secret,
       {expiresIn:'3d'}
    );
    
  };


  /**
   * generate Token
   * @param {string} id
   * @returns {string} token
   */
  const generateApiToken = (id, user) => {
    return token = jwt.sign(
        {
            user_id:id,
            user
        },
        env.secret,
        {expiresIn:'100y'}
     );
     
   };

  const toCamel = (o) => {
    var newO, origKey, newKey, value
    if (o instanceof Array) {
      return o.map(function(value) {
          if (typeof value === "object") {
            value = toCamel(value)
          }
          return value
      })
    } else {
      newO = {}
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
          value = o[origKey]
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = toCamel(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO
  }

module.exports= {
  isValidEmail,
  validatePassword,
  isEmpty,
  empty,
  generateUserToken,
  generateApiToken
};