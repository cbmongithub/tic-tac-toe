import { useRouter } from 'next/router'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { toast, Toaster } from 'react-hot-toast'
import Confetti from 'react-confetti'

const socket = io('http://localhost:4000')

const Game = () => {
  const [game, setGame] = useState(Array(9).fill(''))
  const [turnNumber, setTurnNumber] = useState(0)
  const [myTurn, setMyTurn] = useState(true)
  const [winner, setWinner] = useState(false)
  const [xo, setXO] = useState('X')
  const [hasOpponent, setHasOpponent] = useState(false)
  const [turnData, setTurnData] = useState(false)
  const location = useRouter()
  const parsedRoom = queryString.parse(location.asPath)
  const paramsName = parsedRoom['/game?name']
  const paramsRoom = parsedRoom['room']
  const [name, setName] = useState(paramsName)
  const [room, setRoom] = useState(paramsRoom)
  const [isSSR, setIsSSR] = useState(true)
  const [winnerName, setWinnerName] = useState('')
  const [playerData, setPlayerData] = useState({})
  const [opponentName, setOpponentName] = useState('')
  const [copied, setCopied] = useState(false)
  const [whosTurn, setWhosTurn] = useState('')

  const sendRestart = () => {
    socket.emit('restart', JSON.stringify({ room }))
  }

  const sendWinner = (name) => {
    socket.emit('winner', JSON.stringify({ name: name, room }))
  }

  const turn = (index) => {
    if (!game[index] && !winner && myTurn && hasOpponent) {
      socket.emit(
        'turn',
        JSON.stringify({ index: index, value: xo, room: room, name: name })
      )
    }
  }

  const announceOpponentJoined = (name) => {
    toast(`${name} joined to play!`, {
      icon: '👏',
      toastId: 'opponentJoined',
      duration: 5000,
    })
  }

  const announceCreatedRoom = (room) => {
    toast(`You created room ${room}! Invite anyone with the link to play`, {
      icon: '✅',
      toastId: 'createdRoom',
      duration: 5000,
    })
  }

  const announceWinner = () => {
    toast(`You won!`, {
      icon: '🥳',
      toastId: 'winnerChosen',
      duration: 5000,
    })
  }

  const announceLoser = () => {
    toast('You lost!', {
      icon: '😔',
      toastId: 'loserChosen',
      duration: 5000,
    })
  }

  const announceLinkCopied = () => {
    toast('Invite link copied!', {
      icon: '🔗',
      toastId: 'linkCopied',
      duration: 5000,
    })
  }

  const handleInvite = async () => {
    let inviteLink = `${window.location.origin}/?room=${room}`
    setCopied(true)
    announceLinkCopied()
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(inviteLink)
    } else {
      return document.execCommand('copy', true, inviteLink)
    }
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
      setXO('O')
      socket.emit('join', JSON.stringify({ name: name, room: paramsRoom }))
      setRoom(paramsRoom)
      setName(name)
      setMyTurn(false)
      setPlayerData({ name: name, xo: 'O' })
    } else {
      const newRoomName = random()
      socket.emit('create', JSON.stringify({ name: name, room: newRoomName }))
      announceCreatedRoom(newRoomName)
      setRoom(newRoomName)
      setName(name)
      setMyTurn(true)
      setPlayerData({ name: name, xo: 'X' })
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
      setTurnData(JSON.stringify(json))
    })

    socket.on('restart', () => {
      restart()
    })

    socket.on('opponent_joined', (data) => {
      setHasOpponent(true)
      setOpponentName(data.name)
      setWhosTurn(data.turn)
      announceOpponentJoined(data.name)
    })

    socket.on('winner', (name) => {
      setWinnerName(name)
    })
  }, [])

  useEffect(() => {
    if (turnData) {
      const rawData = JSON.parse(turnData)
      const data = JSON.parse(rawData.data)
      let g = [...game]
      if (!g[data.index] && !winner) {
        g[data.index] = data.value
        setGame(g)
        setTurnNumber(turnNumber + 1)
        setTurnData(false)
        setMyTurn(!myTurn)
        setWhosTurn(rawData.turn)
        playerData.xo === data.value && sendWinner(playerData.name)
      }
    }
  }, [turnData, game, turnNumber, winner, myTurn])

  return (
    <>
      <div className='p-10 flex flex-col justify-center text-center items-center shadow-lg rounded-xl'>
        <h1 className='text-3xl font-bold p-5'>Room: {!isSSR && room}</h1>
        {!hasOpponent && (
          <div className='flex flex-col justify-center items-center'>
            <h3 className='text-md font-normal pt-5 inline-flex'>
              Invite Link:
            </h3>
            <input
              type='text'
              className='bg-gray-200 appearance-none border-2 cursor-pointer border-gray-200 rounded w-full py-2 px-4 text-gray-700 mt-2 leading-tight active: focus:outline-none'
              placeholder={
                copied
                  ? 'Copied Invite Link!'
                  : !isSSR
                  ? `${window.location.origin}/?room=${room}`
                  : undefined
              }
              readOnly
              onClick={handleInvite}
            />
          </div>
        )}
        <br />
        <br />
        {myTurn && !winner && (
          <p className='font-bold'>{`Your turn, ${!isSSR && name}`}</p>
        )}
        {!myTurn && !winner && (
          <p className='font-bold'>{`${whosTurn}'s turn`}</p>
        )}
        <br />
        {hasOpponent ? (
          ''
        ) : (
          <p className='italic'>Waiting for someone to join...</p>
        )}
        <div className='flex flex-col justify-center items-center my-5'>
          {winner ? (
            <>
              {winnerName === playerData.name && (
                <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                />
              )}
              <h1 className='font-bold text-2xl mb-5 mt-0'>
                {winnerName} won!
              </h1>
            </>
          ) : turnNumber === 9 ? (
            <span>It's a tie!</span>
          ) : (
            <br />
          )}
          {winner || turnNumber === 9 ? (
            <button
              onClick={sendRestart}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 py-2 px-4 rounded mb-5'
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
      <Toaster />
    </>
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
