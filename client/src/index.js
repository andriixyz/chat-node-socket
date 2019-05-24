import React from "react";
import ReactDOM from "react-dom";
import Chat from "./view/chat/Chat";
import LoginForm from "./view/login/Form";

checkLoggedIn();

function checkLoggedIn() {
  const login = localStorage.getItem("login");
  const password = localStorage.getItem("password");
  if (login != null && password != null) {
    ReactDOM.render(<Chat />, document.getElementById("root"));
  } else {
    ReactDOM.render(<LoginForm />, document.getElementById("root"));
  }
}
