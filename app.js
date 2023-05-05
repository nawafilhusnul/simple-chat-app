const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const { Server } = require("socket.io");
const httpServer = app.listen(PORT, () =>
  console.log(`server is listening to the port ${PORT} 😀`)
)

const io = new Server(httpServer)

app.use(express.static(path.join(__dirname, 'public')))
let socketsConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
  socketsConnected.add(socket.id)
  console.log(`connected ${socket.id}`)

  io.emit('clients-total', socketsConnected.size)

  socket.on('disconnect', () => {
    socketsConnected.delete(socket.id)
    console.log(` disconnected ${socket.id}`)
    io.emit('clients-total', socketsConnected.size)
  })

  socket.on('message', (data) => {
    console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('is-typing', (data) => {
    console.log(data)
    socket.broadcast.emit('is-typing', data)
  })
}

app.get('/chat/:id', (req, res) => {
  console.log(req.params.id)
  res.send('hello world')
  return
})