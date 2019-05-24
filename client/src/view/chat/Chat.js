import React, { Component } from "react";
import Message from "./Message";
import SystemMessage from "./SystemMessage";
import User from "./User";
import Form from "./Form";
import io from "socket.io-client";
import "../../styles/css/index.css";

var messageKey = 0;
var userTypingKey = 0;

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      users: [],
      usersTyping: []
    };
    this.socket = io();
    this.socket.emit("connection", { login: localStorage.getItem("login") });
    this.socket.on("chat message", msg => {
      console.log(msg);
      this.addMessage(msg.login, msg.message, msg.time, msg.type);
    });
    this.socket.on("updateUsersInfo", users => {
      this.addUsers(users);
    });
    this.socket.on("start typing", user => {
      this.addUserTyping(user.login);
    });
    this.socket.on("stop typing", user => {
      this.deleteUserTyping(user.login);
    });
    this.timerUsersTyping = [];
  }
  componentWillMount() {
    window.onload = () => {
      document.getElementById("chat-form").onsubmit = () => {
        const MESSAGE = document.getElementById("chat-input").value;
        if (MESSAGE == "") {
          return false;
        }
        this.sendMessage(MESSAGE);
        document.getElementById("chat-input").value = "";
        return false;
      };
      this.timerTyping = null;
    };
  }
  addUsers(users) {
    this.setState({ users: users.users });
  }
  addUserTyping(login) {
    const usersTyping = this.state.usersTyping.slice();
    for (let i = 0; i < usersTyping.length; ++i) {
      if (usersTyping[i].login == login) {
        return;
      }
    }
    usersTyping[userTypingKey] = {
      login: login
    };

    ++userTypingKey;

    this.setState({ usersTyping: usersTyping });
  }
  deleteUserTyping(login) {
    const usersTyping = this.state.usersTyping.slice();
    const userToDelete = { login: login };

    for (let i = 0; i < usersTyping.length; ++i) {
      if (JSON.stringify(usersTyping[i]) === JSON.stringify(userToDelete)) {
        usersTyping.splice(i, 1);
      }
    }
    --userTypingKey;
    this.setState({ usersTyping: usersTyping });
  }
  sendMessage(message) {
    const login = localStorage.getItem("login");
    const password = localStorage.getItem("password");
    const privat = document.getElementById("private-message").checked;
    const toUser = document.getElementById("users-to-send").value;
    console.log(privat);
    if (privat) {
      this.socket.emit("privat message", {
        login: login,
        message: message,
        password: password,
        toUser: toUser
      });
    } else {
      this.socket.emit("chat message", {
        login: login,
        message: message,
        password: password
      });
    }
  }
  addMessage(login, message, time, type) {
    const messages = this.state.messages.slice();

    messages[++messageKey] = {
      login: login,
      message: message,
      time: time,
      type: type
    };

    this.setState({ messages: messages });
  }
  deleteMessage(login, message, time) {
    const messages = this.state.messages.slice();
    const messageToDelete = { login: login, message: message, time: time };

    for (let i = 0; i < messages.length; ++i) {
      if (JSON.stringify(messages[i]) === JSON.stringify(messageToDelete)) {
        messages.splice(i, 1);
      }
    }

    this.setState({ messages: messages });
  }

  showMessages() {
    var messages = [];
    for (let i = 0; i < this.state.messages.length; ++i) {
      messages.push(this.renderMessage(i));
    }
    messageKey = this.state.messages.length - 1;
    return messages;
  }
  showUsers() {
    var users = [];

    for (let i = 0; i < this.state.users.length; ++i) {
      users.push(this.renderUser(i));
    }

    return users;
  }
  showUsersTyping() {
    var usersTyping = [];

    for (let i = 0; i < this.state.usersTyping.length; ++i) {
      usersTyping.push(this.renderUserTyping(i));
    }
    this.scrollMessages();
    return usersTyping;
  }
  logout() {
    localStorage.removeItem("login");
    localStorage.removeItem("password");
    window.location.reload();
  }
  showUsersToSend() {
    var users = [];

    for (let i = 0; i < this.state.users.length; ++i) {
      users.push(this.renderUserToSend(i));
    }

    return users;
  }

  renderMessage(i) {
    if (this.state.messages[i].type == "") {
      return <Message value={this.state.messages[i]} key={i.toString()} />;
    } else {
      return (
        <SystemMessage value={this.state.messages[i]} key={i.toString()} />
      );
    }
  }
  renderUser(i) {
    return <User value={this.state.users[i]} key={i.toString()} />;
  }
  renderUserToSend(i) {
    return (
      <option value={this.state.users[i].login} key={i.toString()}>
        {this.state.users[i].login}
      </option>
    );
  }
  clickPrivate() {
    var element = document.getElementById("users-to-send");
    if (element.style.display == "block") {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  }
  renderUserTyping(i) {
    if (this.state.usersTyping.length == 1) {
      return (
        <span key={i.toString()}>
          <span>User </span>
          <span>{this.state.usersTyping[i].login}</span>

          <span> typing</span>
          <span className="chat-typing-dot"> ...</span>
        </span>
      );
    }
    switch (i) {
      case 0:
        return (
          <span key={i.toString()}>
            <span> Users </span>
            <span>{this.state.usersTyping[i].login},</span>
            <span>typing</span>
          </span>
        );
        break;
      case this.state.usersTyping.length - 1:
        return (
          <span key={i.toString()}>
            <span> {this.state.usersTyping[i].login}</span>
            <span className="chat-typing-dot"> ...</span>
          </span>
        );
        break;
      default:
        return (
          <span key={i.toString()}>{this.state.usersTyping[i].login}</span>
        );
        break;
    }
  }
  scrollMessages() {
    if (document.getElementById("chat-field") != undefined) {
      var objDiv = document.getElementById("chat-field");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }
  render() {
    return (
      <div id="chat">
        <div className="chat-head">
          <h1>MegaMessenger</h1>{" "}
          <div className="chat-logout">
            <button onClick={this.logout}>Logout</button>
          </div>
        </div>
        <div className="chat-main">
          <span>
            {" "}
            <div className="chat-field" id="chat-field">
              <div className="chat-messages">{this.showMessages()}</div>
            </div>
            <div className="chat-typing">{this.showUsersTyping()}</div>
            <div className="chat-form">
              <Form value={{ socket: this.socket }} />
              <input
                type="radio"
                name="sendmessage"
                value="all"
                defaultChecked
                onChange={this.clickPrivate}
              />{" "}
              Send message to all
              <br />
              <input
                type="radio"
                name="sendmessage"
                value="private"
                onChange={this.clickPrivate}
                id="private-message"
              />{" "}
              Send private message
              <select id="users-to-send">{this.showUsersToSend()}</select>
            </div>
          </span>

          <span className="chat-users">
            <ul>{this.showUsers()}</ul>
          </span>
        </div>
      </div>
    );
  }
}

export default Chat;
