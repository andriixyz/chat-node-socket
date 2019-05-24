import React, { Component } from "react";

class Message extends Component {
  render() {
    return (
      <div className="chat-message">
        <span className="chat-message-time">[{this.props.value.time}] </span>
        <span className="chat-message-login">{this.props.value.login}: </span>
        <span className="chat-message-message">
          {" "}
          {this.props.value.message}
        </span>
      </div>
    );
  }
}

export default Message;
