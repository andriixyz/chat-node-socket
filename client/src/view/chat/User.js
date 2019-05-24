import React, { Component } from "react";

class User extends Component {
  render() {
    return (
      <li className="chat-user">
        <span className="chat-user-login">{this.props.value.login}</span>
        <span className="chat-user-status">{this.props.value.status}</span>
      </li>
    );
  }
}

export default User;
