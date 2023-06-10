import ScrollToBottom from 'react-scroll-to-bottom'

import Message from './Message'

const Messages = ({ isSSR, messages, name }) =>
  isSSR && (
    <ScrollToBottom className='messages'>
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} name={name} />
        </div>
      ))}
    </ScrollToBottom>
  )

export default Messages
