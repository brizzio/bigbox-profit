const { Pool } = require('pg')
var env = require('../../../env');

//const databaseConfig = { connectionString: env.DATABASE_URL };
const pool = new Pool(env.DB_CREDENTIALS);

module.exports = pool;