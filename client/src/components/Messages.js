import { useEffect, useRef } from 'react'
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
    <div className="h-[1000px] py-6 overflow-auto flex-grow max-h-[400px] bg-white">
      {messages.map((message, i) => (
        <div ref={ref} key={i}>
          <Message message={message} name={name} />
        </div>
      ))}
    </div>
  )
}

export default Messages