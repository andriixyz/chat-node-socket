var mysql = require("mysql");

const MYSQL = require("./mysql.json");

class Model {
  constructor() {
    this.connection = mysql.createConnection(MYSQL);
    this.connection.connect();
  }
  getUser(login) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        {
          sql: "select login,password from user where login=?",
          values: [login]
        },
        function(error, results, fields) {
          if (error) throw error;

          resolve(results);
        }
      );
    });
  }
  getUsersLogins() {
    return new Promise((resolve, reject) => {
      this.connection.query("SELECT login from user", function(
        error,
        results,
        fields
      ) {
        if (error) throw error;
        resolve(results);
      });
    });
  }
  insertUser(login, password) {
    this.connection.query(
      {
        sql: "INSERT INTO user (`login`, `password`) VALUES(?, ?)",
        values: [login, password]
      },
      function(error, results, fields) {
        if (error) throw error;
      }
    );
  }
}

module.exports = Model;
