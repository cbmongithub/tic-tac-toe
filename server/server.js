const express = require('express')

const PORT = 4000
const INDEX = '/index.html'

const app = express()
app.use((_req, res) => res.sendFile(INDEX, { root: __dirname }))

const server = app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT}...`)
)

const socket = require('socket.io')
const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

let playerOne
let playerTwo

io.on('connection', (socket) => {
  socket.on('create', (data) => {
    const { name, room } = JSON.parse(data)
    socket.join(room)
    playerOne = name
    socket.emit('message', {
      user: 'tictacbot',
      text: `${name}, welcome to room ${room}.`,
    })
    console.log(`${name} created room ${room}`)
  })

  socket.on('join', (data) => {
    const { name, room } = JSON.parse(data)
    socket.join(room)
    playerTwo = name
    socket.emit('message', {
      user: 'tictacbot',
      text: `${name}, welcome to room ${room}.`,
    })
    io.to(room).emit('opponent_joined', { name: name, turn: playerOne })
    console.log(`${name} joined room ${room}`)
  })

  socket.on('turn', (data) => {
    const { index, value, room, name } = JSON.parse(data)
    io.to(room).emit('playerTurn', {
      data: data,
      turn: name === playerOne ? playerTwo : playerOne,
    })
    console.log(`Index: ${index}, Value: ${value}, Room:${room}, Name:${name}`)
  })

  socket.on('restart', (data) => {
    const { name, room } = JSON.parse(data)
    io.to(room).emit('restart', name)
    console.log(`${name} restarted the game`)
  })

  socket.on('winner', (data) => {
    const { name, room } = JSON.parse(data)
    io.to(room).emit('winner', name)
    console.log(`Tracking winner: ${name}`)
  })

  socket.on('sendMessage', (data, callback) => {
    const { name, room, message } = JSON.parse(data)
    io.to(room).emit('message', { user: name, text: message })
    callback()
  })
})
