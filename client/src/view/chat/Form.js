import React, { Component } from "react";

class Form extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.isTyping = false;
    this.timer = null;
  }
  handleInputChange(event) {
    if (!this.isTyping) {
      this.isTyping = true;
      this.props.value.socket.emit("start typing");
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.props.value.socket.emit("stop typing");
      this.isTyping = false;
    }, 800);
  }
  render() {
    return (
      <form action="" id="chat-form">
        <input
          id="chat-input"
          autoComplete="off"
          onChange={this.handleInputChange}
        />
        <button>
          <i className="material-icons">send</i>
        </button>
      </form>
    );
  }
}

export default Form;
