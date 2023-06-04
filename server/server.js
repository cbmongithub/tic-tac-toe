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

io.on('connection', (socket) => {
  socket.on('create', (room) => {
    socket.join(room)
    console.log('Created room')
  })

  socket.on('join', (room) => {
    socket.join(room)
    io.to(room).emit('opponent_joined')
    console.log('Opponent joined room')
  })

  socket.on('turn', (data) => {
    const room = JSON.parse(data).room
    io.to(room).emit('playerTurn', data)
    console.log('Other players turn')
  })

  socket.on('restart', (data) => {
    const room = JSON.parse(data).room
    io.to(room).emit('restart')
    console.log('Restarting game')
  })
})
