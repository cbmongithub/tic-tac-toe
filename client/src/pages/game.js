import { useRouter } from 'next/router'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Confetti from 'react-confetti'

const socket = io('http://localhost:4000')

const Game = () => {
  const [game, setGame] = useState(Array(9).fill(''))
  const [turnNumber, setTurnNumber] = useState(0)
  const [myTurn, setMyTurn] = useState(true)
  const [winner, setWinner] = useState(false)
  const [xo, setXO] = useState('X')
  const [player, setPlayer] = useState('')
  const [hasOpponent, setHasOpponent] = useState(false)
  const [share, setShare] = useState(false)
  const [turnData, setTurnData] = useState(false)
  const location = useRouter()
  const parsedRoom = queryString.parse(location.asPath)
  const paramsName = parsedRoom['/game?name']
  const paramsRoom = parsedRoom['room']
  const [name, setName] = useState(paramsName)
  const [room, setRoom] = useState(paramsRoom)
  const [isSSR, setIsSSR] = useState(true)

  const turn = (index) => {
    if (!game[index] && !winner && myTurn && hasOpponent) {
      socket.emit('turn', JSON.stringify({ index, value: xo, room }))
    }
  }

  const sendRestart = () => {
    socket.emit('restart', JSON.stringify({ room }))
  }

  const restart = () => {
    setGame(Array(9).fill(''))
    setWinner(false)
    setTurnNumber(0)
    setMyTurn(false)
  }

  useEffect(() => {
    setIsSSR(false)
    if (paramsRoom) {
      // Player 2
      setXO('O')
      socket.emit('join', paramsRoom)
      setRoom(paramsRoom)
      setName(name)
      setMyTurn(false)
    } else {
      // Player 1
      console.log(parsedRoom)
      const newRoomName = random()
      socket.emit('create', newRoomName)
      setRoom(newRoomName)
      setName(name)
      setMyTurn(true)
    }
  }, [paramsRoom])

  useEffect(() => {
    combinations.forEach((c) => {
      if (
        game[c[0]] === game[c[1]] &&
        game[c[0]] === game[c[2]] &&
        game[c[0]] !== ''
      ) {
        setWinner(true)
      }
    })

    if (turnNumber === 0) {
      setMyTurn(xo === 'X' ? true : false)
    }
  }, [game, turnNumber, xo])

  useEffect(() => {
    socket.on('playerTurn', (json) => {
      setTurnData(json)
    })

    socket.on('restart', () => {
      restart()
    })

    socket.on('opponent_joined', () => {
      setHasOpponent(true)
      setShare(false)
    })
  }, [])

  useEffect(() => {
    if (turnData) {
      const data = JSON.parse(turnData)
      let g = [...game]
      if (!g[data.index] && !winner) {
        g[data.index] = data.value
        setGame(g)
        setTurnNumber(turnNumber + 1)
        setTurnData(false)
        setMyTurn(!myTurn)
        setPlayer(data.value)
      }
    }
  }, [turnData, game, turnNumber, winner, myTurn])

  return (
    <div className='p-10 flex flex-col justify-center text-center items-center shadow-lg rounded-xl'>
      <h1 className='text-3xl font-bold p-5'>Room: {!isSSR && room}</h1>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={() => setShare(!share)}
      >
        Share
      </button>
      {share ? (
        <>
          <br />
          <br />
          Share link:{' '}
          <input
            type='text'
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 mt-2 leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
            value={`${window.location.origin}/?room=${room}`}
            readOnly
          />
        </>
      ) : (
        ''
      )}
      <br />
      <br />
      {myTurn ? (
        <p className='font-bold'>{`Your turn, ${!isSSR && name}`}</p>
      ) : (
        <p className='font-bold'>Opponents Turn</p>
      )}
      <br />
      {hasOpponent ? '' : <p className='italic'>Waiting for opponent...</p>}
      <div className='flex flex-col justify-center items-center my-5'>
        {winner ? (
          <>
            <Confetti width={window.innerWidth} height={window.innerHeight} />
            <span>Player {player} wins!</span>
          </>
        ) : turnNumber === 9 ? (
          <span>It's a tie!</span>
        ) : (
          <br />
        )}
        {winner || turnNumber === 9 ? (
          <button
            onClick={sendRestart}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 py-2 px-4 rounded'
          >
            Restart
          </button>
        ) : null}
      </div>
      <div className='flex'>
        <Box index={0} key={0} turn={turn} value={game[0]} />
        <Box index={1} key={1} turn={turn} value={game[1]} />
        <Box index={2} key={2} turn={turn} value={game[2]} />
      </div>
      <div className='flex'>
        <Box index={3} key={3} turn={turn} value={game[3]} />
        <Box index={4} key={4} turn={turn} value={game[4]} />
        <Box index={5} key={5} turn={turn} value={game[5]} />
      </div>
      <div className='flex'>
        <Box index={6} key={6} turn={turn} value={game[6]} />
        <Box index={7} key={7} turn={turn} value={game[7]} />
        <Box index={8} key={8} turn={turn} value={game[8]} />
      </div>
    </div>
  )
}

const Box = ({ index, turn, value }) => {
  return (
    <div
      className='w-20 h-20 border-solid border-2 border-black mt-[-1px] ml-[-1px] leading-[4.5rem] text-5xl font-bold'
      onClick={() => turn(index)}
    >
      {value}
    </div>
  )
}

const combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const random = () => {
  return Array.from(Array(8), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('')
}

export default Game
