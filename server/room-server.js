import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

let users = []
const messages = {
  general: [],
  random: [],
  jokes: [],
  javascript: []
}
io.on('connection', socket => {
  socket.on('join server', (username) => {
    const user = {
      username,
      id: socket.id
    }

    users.push(user)
    io.emit('new user', users)
  })

  socket.on('join room', (roomName, cb) => {
    socket.join(roomName)
    // get back the messages of the room
    cb(messages[roomName])
  })
})
server.listen(8900, ()=> console.log('Server is listening on port 8900'))
