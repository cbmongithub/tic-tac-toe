import { useRef, useEffect } from 'react'

import Message from './Message'

const Messages = ({ messages, name }) => {
  const ref = useRef(null)

  const scrollToLastMessage = () => {
    const lastChildElement = ref.current?.lastElementChild
    lastChildElement?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToLastMessage()
  }, [messages])

  return (
    <div className='messages'>
      {messages.map((message, i) => (
        <div ref={ref} key={i}>
          <Message message={message} name={name} />
        </div>
      ))}
    </div>
  )
}

export default Messages
