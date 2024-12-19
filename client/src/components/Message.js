import ReactEmoji from 'react-emoji'

const Message = ({ message: { text, user }, name }) => {
  const trimmedName = name.trim().toLowerCase()
  const isSentByCurrentUser = user === trimmedName

  return isSentByCurrentUser ? (
    <div className="flex justify-end px-[5%] mt-5">
      <p className="flex items-center font-sans text-gray-500 tracking-[0.3px] pr-10">
        {trimmedName}
      </p>
      <div className="bg-blue-500 rounded-lg px-5 py-2 inline-block max-w-[80%]">
        <p className="text-white text-lg break-words">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className="flex justify-start px-[5%] mt-5">
      <div className="bg-gray-100 rounded-lg px-5 py-2 inline-block max-w-[80%]">
        <p className="text-gray-800 text-lg break-words">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="flex items-center font-sans text-gray-500 tracking-[0.3px] pl-10">
        {user}
      </p>
    </div>
  )
}

export default Message