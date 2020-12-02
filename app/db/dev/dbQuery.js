var pool = require('./pool');
//const pool = require('./pool.js');

module.exports = {
  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
  query(quertText, params) {
    return new Promise((resolve, reject) => {
      //console.log('executando a query...')
      //console.log(quertText)
      pool.query(quertText, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err)
          reject(err);
        });
    });
  },

  sql(quertText, params) {
    return new Promise((resolve, reject) => {
      //console.log('executando a sql...')
      //console.log(quertText)
      pool.query(quertText, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          //console.log(err)
          reject(err);
        });
    });
  }
};