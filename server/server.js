import express from 'express'
import http from 'http'
import socket from 'socket.io'
import { isObject } from 'util'

const app = express()
const server = http.createServer(app)
const socketServer = socket(server)

socketServer.on("connection", socket => {
  socket.emit("your id", socket.id);
  socket.on("send message", body => {
    socketServer.emit("message", body)
  })
})

server.listen(8800, () => {
  console.log('Server is listenning 0n 8800')
})

