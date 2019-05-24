var Model = require("./Model");

class Controller {
  constructor() {
    this.model = new Model();
  }
  checkUser(login, password) {
    return new Promise((resolve, reject) => {
      this.model.getUser(login).then(res => {
        if (res.length != 0) {
          if (res[0].password == password) {
            resolve("OK");
          } else {
            reject("Bad password");
          }
        } else {
          reject("Not finded");
        }
      });
    });
  }
  registerUser(login, password) {
    return new Promise((resolve, reject) => {
      if (login.length > 15) {
        reject("Login too long");
        return;
      }
      if (login.length < 2) {
        reject("Login too short");
        return;
      }
      if (password.length > 15) {
        reject("Password too long");
        return;
      }
      if (password.length < 2) {
        reject("Password too short");
        return;
      }

      this.model.getUser(login).then(res => {
        if (res.length == 0) {
          this.model.insertUser(login, password);
          resolve("OK");
        } else {
          reject("User exist!");
        }
      });
    });
  }
}

module.exports = Controller;
