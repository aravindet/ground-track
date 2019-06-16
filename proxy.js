const net = require('net');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const socket = net.connect(4533, '192.168.43.109');
socket.on('error', (e) => console.log('Socket error', e));

const app = express();
app.use(express.static('./build'));
const server = http.createServer(app).listen(8080);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('connected');
  ws.on('message', message => {
    console.log('message', message);
    socket.write(message + '\n');
  });
});

console.log('listening on 8080');
