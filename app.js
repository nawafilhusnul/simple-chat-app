const express = require('express');
const { init } = require('express/lib/application');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const { Server } = require("socket.io");
const httpServer = app.listen(PORT, () =>
  console.log(`server is listening to the port ${PORT} 😀`)
)

const io = new Server(httpServer)

let socketsConnected = new Set()

io.of('users').on('connection', onConnected)

function onConnected(socket) {
  socketsConnected.add(socket.id)
  socket.on('init', data => {
    if (data) {
      sendChatURLToDriver(socket.id)
    }
  })
  io.of('users').emit('clients-total', socketsConnected.size)
  socket.on('disconnect', () => {
    socketsConnected.delete(socket.id)
    console.log(` disconnected ${socket.id}`)
    io.emit('clients-total', socketsConnected.size)
  })

  socket.on('message', (data) => {
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('is-typing', (data) => {
    socket.broadcast.emit('is-typing', data)
  })
}

function sendChatURLToDriver(socketId) {
  console.log(`http://localhost:4000/to-chat/${socketId}`)
}

app.use('/', express.static(path.join(__dirname, 'user')))
app.use('/to-chat/:id', express.static(path.join(__dirname, 'driver')))