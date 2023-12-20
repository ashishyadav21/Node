const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
     host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    connectionLimit : 10,               // this is the max number of connections before your pool starts waiting for a release

  });


  // Test PostgreSQL connection
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('Error connecting to PostgreSQL:', err);
    } else {
      console.log('Connected to PostgreSQL at:', result.rows[0].now);
    }
  });


  process.on('exit', () => pool.end());


  module.exports = {pool}
