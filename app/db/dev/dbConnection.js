var pool = require('./pool');
//require('make-runnable');
//const pool = require('./pool.js')

pool.on('connect', () => {
  console.log('connected to the db');
});


pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

/**
usagem da connection
 
const createUserTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
  (id SERIAL PRIMARY KEY, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  first_name VARCHAR(100), 
  last_name VARCHAR(100), 
  password VARCHAR(100) NOT NULL,
  created_on DATE NOT NULL)`;

  pool.query(userCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};
*/


/**
 * Create All Tables
 
const createAllTables = () => {
  createUserTable();
  createBusTable();
  createTripTable();
  createBookingTable();
};
*/

/**
 * Drop All Tables
 
const dropAllTables = () => {
  dropUserTable();
  dropBusTable();
  dropTripTable();
  dropBookingTable();
};

export {
  createAllTables,
  dropAllTables,
};


*/



