var Controller = require("./Controller");
var Model = require("./Model");
var controller = new Controller();
var model = new Model();

const path = require("path");
const port = process.env.PORT || 5000;
const express = require("express");
const app = express();
const server = app.listen(port);
var io = require("socket.io").listen(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

var users = [];
var onlineUsers = [];

console.log(`Chat listening on ${port}`);

function changeUserStatus(user, status) {
  for (let i = 0; i < users.length; ++i) {
    if (user == users[i].login) {
      users[i].status = status;
    }
  }
}

model.getUsersLogins().then(res => {
  for (let i = 0; i < res.length; ++i) {
    users.push(res[i]);
    changeUserStatus(res[i].login, "offline");
  }

  io.on("connection", function(socket) {
    socket.on("start typing", () => {
      for (let i = 0; i < onlineUsers.length; ++i) {
        if (onlineUsers[i].id == socket.id) {
          io.emit("start typing", { login: onlineUsers[i].login });
        }
      }
    });
    socket.on("stop typing", () => {
      for (let i = 0; i < onlineUsers.length; ++i) {
        if (onlineUsers[i].id == socket.id) {
          io.emit("stop typing", { login: onlineUsers[i].login });
        }
      }
    });
    socket.on("connection", function(user) {
      console.log("User " + user.login + " connected");
      changeUserStatus(user.login, "online");
      onlineUsers.push({ login: user.login, id: socket.id });
      io.emit("updateUsersInfo", { users: users });
      io.emit("chat message", {
        login: "",
        time: "",
        message: "User " + user.login + " connected",
        type: "userConnected"
      });
    });
    socket.on("disconnect", function(a) {
      for (let i = 0; i < onlineUsers.length; ++i) {
        if (onlineUsers[i].id == socket.id) {
          console.log("User " + onlineUsers[i].login + " disconnected");
          changeUserStatus(onlineUsers[i].login, "offline");

          io.emit("updateUsersInfo", { users: users });
          io.emit("chat message", {
            login: "",
            time: "",
            message: "User " + onlineUsers[i].login + " disconnected",
            type: "userDisconnected"
          });
          onlineUsers.slice(i, 1);
        }
      }
    });
    socket.on("privat message", msg => {
      const time = new Date().toLocaleTimeString();
      const message = {
        login: msg.login,
        message: msg.message,
        time: time,
        type: "privatMessage"
      };
      controller
        .checkUser(msg.login, msg.password)
        .then((res, rej) => {
          if (message.message == "") {
            return;
          }
          for (let i = 0; i < onlineUsers.length; ++i) {
            if (onlineUsers[i].login == msg.toUser) {
              message.message = "[PRIVAT] " + message.message;
              io.to(onlineUsers[i].id).emit("chat message", message);
              console.log(message);
              message.message = "To " + onlineUsers[i].login + message.message;
              socket.emit("chat message", message);

              return;
            }
          }
        })
        .catch(function(r) {
          message.message = "Sorry,but you are must login in";
          socket.emit("chat message", message);
        });
    });
    socket.on("chat message", function(msg) {
      const time = new Date().toLocaleTimeString();
      const message = {
        login: msg.login,
        message: msg.message,
        time: time,
        type: ""
      };
      controller
        .checkUser(msg.login, msg.password)
        .then(() => {
          console.log(message);
          if (message.message == "") {
            return;
          }
          io.emit("chat message", message);
        })
        .catch(function(r) {
          message.message = "Sorry,but you are must login in";
          socket.emit("chat message", message);
        });
    });
  });
});

app.post("/registration", function(request, response) {
  if (!request.body) return response.sendStatus(400);
  controller
    .registerUser(request.body.login, request.body.password)
    .then((res, rej) => {
      console.log("User " + request.body.login + " is registered!");
      users.push({ login: request.body.login });
      return response.status(200).send(res);
    })
    .catch(function(r) {
      console.log(
        "Try to create new user " + request.body.login + " fail with " + r
      );
      return response.status(200).send(r);
    });
});

app.post("/", function(request, response) {
  if (!request.body) return response.sendStatus(400);
  controller
    .checkUser(request.body.login, request.body.password)
    .then((res, rej) => {
      return response.status(200).send(res);
    })
    .catch(function(r) {
      console.log(r);
      return response.status(200).send(r);
    });
});
