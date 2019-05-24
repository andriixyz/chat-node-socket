## Node.js Messanger

This project was made using:

- Node.js
- React.js
- Socket.io

### Instruction to run server

First one you need to copy this repository.<br>
Next step it is install all packages using package master NPM.<br>

- "express"
- "mysql"
- "socket.io"

Use it to instal some of the packages:

`npm install name-of-package`

After that you need to intall package into client<br>

`cd client`

`npm intall socket.io`

Also you should create file `mysql.json` and create JSON object:

{
"host": "NAME OF YOUR HOST",
"user": "USER",
"password": "PASSWORD",
"database": "NAME OF DATABASE",
"port": "DATABASE PORT"
}

Now all ready to start server.<br>
To start server you should be in main folder.<br>

Type next command into terminal `npm start`<br>
You should get next message - Chat listening on PORT <br>
Now server is ready to use<br>

### Instruction to client use

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Screenshots

![login](screenshots/1.PNG)
![work](screenshots/2.PNG)
![server](screenshots/3.PNG)
