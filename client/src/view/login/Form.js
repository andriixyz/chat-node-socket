import React, { Component } from "react";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      registration: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  regestration(bool) {
    this.state.registration = bool;
  }
  saveUserInfo(login, password) {
    localStorage.setItem("login", login);
    localStorage.setItem("password", password);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = { login: this.state.login, password: this.state.password };
    var xhttp = new XMLHttpRequest();
    const saveUserInfo = this.saveUserInfo;

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (this.responseText == "OK") {
          saveUserInfo(data.login, data.password);
          window.location.reload();
        } else {
          console.log(this.responseText);
          document.getElementById("error").innerHTML = this.responseText;
        }
      }
    };
    if (this.state.registration) {
      xhttp.open("POST", "/registration", true);
    } else {
      xhttp.open("POST", "/", true);
    }
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
  }

  render() {
    return (
      <div id="chat">
        <div className="chat-head">
          <h1>MegaMessenger</h1>{" "}
        </div>
        <div className="chat-main">
          <div id="login-form">
            <form onSubmit={this.handleSubmit}>
              <h1>Account Login</h1>
              <p id="error" />
              <input
                type="text"
                name="login"
                maxLength="50"
                minLength="1"
                id="login-name"
                value={this.state.login}
                onChange={this.handleInputChange}
                placeholder="Login"
                required
              />
              <input
                type="password"
                name="password"
                maxLength="50"
                minLength="1"
                id="login-password"
                value={this.state.password}
                onChange={this.handleInputChange}
                placeholder="Password"
                required
              />
              <input
                type="submit"
                value="SIGN IN"
                onClick={() => {
                  this.regestration(false);
                }}
              />
              <input
                type="submit"
                value="REGESTRATION"
                onClick={() => {
                  this.regestration(true);
                }}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
