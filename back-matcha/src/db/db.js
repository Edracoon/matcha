require("dotenv").config();

var mysql = require("mysql2");

/*
 ** Using pool system to reuse connections previously released
 */
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

/*
 ** Handle pool potential errors
 */
pool.getConnection((err, connection) => {
  console.log("pool.getConnection() called.");
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  if (connection) connection.release();
  return;
});

function initDatabase() {
  pool.query(
    "CREATE TABLE IF NOT EXISTS users \
    (id INT AUTO_INCREMENT PRIMARY KEY, \
      username VARCHAR(255), \
      email VARCHAR(255), \
      password VARCHAR(255) \
      )",
    (err, data) => {
      if (err) throw err;
    }
  );
}

module.exports = pool;
module.exports = initDatabase;
