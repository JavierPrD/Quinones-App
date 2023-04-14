// Import the mysql2 package
const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "capstone",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export a function to query the database
module.exports = async function query(sql, values) {
  const [rows, fields] = await pool.execute(sql, values);
  return rows;
};




function createUser(userData) {
  const { username, email, password } = userData;
  const sql = `INSERT INTO capstone.users (username, email, password) VALUES (?, ?, ?)`;
  const values = [username, email, password];
  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log(`User ${result.insertId} added successfully!`);
  });
}

/*
module.exports = connection;

//method/functions are delcared here but must be declared again in the main.js file
module.exports = {
  createUser: (userData) => {
    const { id, username, email, password } = userData;
    const sql = `INSERT INTO capstone.users (id, username, email, password) VALUES (?, ?, ?, ?)`;
    const values = [id, username, email, password];
    connection.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log(`User ${result.insertId} added successfully!`);
    });
  },
  getUserById: (id, callback) => {
    const sql = `SELECT * FROM capstone.users WHERE id = ?`;
    const values = [id];
    connection.query(sql, values, (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        callback(results[0]);
      } else {
        callback(null);
      }
    });
  },
  updateUserById: (id, userData, callback) => {
    const { username, email, password } = userData;
    const sql = `UPDATE capstone.users SET username = ?, email = ?, password = ? WHERE id = ?`;
    const values = [username, email, password, id];
    connection.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log(`User ${id} updated successfully!`);
      callback();
    });
  },
};
*/