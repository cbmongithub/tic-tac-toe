import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import queryString from 'query-string'

const Index = () => {
  const [name, setName] = useState('')
  const location = useRouter()
  const parsedRoom = queryString.parse(location.asPath)
  const roomName = parsedRoom['/?room']
  const [room, setRoom] = useState('')

  useEffect(() => {
    if (roomName) {
      setRoom(roomName)
    }
  })

  return (
    <div className='flex flex-col justify-center items-center shadow-lg rounded-lg p-8'>
      <div className='flex flex-col text-center justify-center items-center'>
        <h1 className='text-3xl font-bold p-5'>
          {room ? 'Join Game' : 'Create Game'}
        </h1>
        <div>
          <input
            placeholder='Name'
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 mt-2 leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
            type='text'
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) =>
              event.key === 'Enter'
                ? (window.location = room
                    ? `/game?name=${name}&room=${room}`
                    : `/game?name=${name}`)
                : null
            }
          />
        </div>
        {room && (
          <div>
            <input
              placeholder={room}
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 mt-2 leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
              type='text'
              disabled
            />
          </div>
        )}
        <Link
          onClick={(e) => (!name ? e.preventDefault() : null)}
          href={room ? `/game?name=${name}&room=${room}` : `/game?name=${name}`}
        >
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 py-2 px-4 rounded'
            type='submit'
          >
            Join
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Index
