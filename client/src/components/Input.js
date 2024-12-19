const Input = ({ setMessage, sendMessage, message }) => (
  <form className="flex border-t-2 border-gray-900 h-[75px]">
    <input
      className="border-none rounded-b-lg px-4 py-0 w-3/4 text-lg bg-white focus:outline-none"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyDown={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
    />
    <button
      className="group cursor-pointer inline-flex w-1/4 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium outline-offset-2 transition active:transition-none bg-blue-500 text-neutral-300 hover:text-neutral-100 active:bg-blue-400 active:text-neutral-100/70 hover:bg-blue-600"
      type="button"
      onClick={(e) => sendMessage(e)}
    >
      Send
    </button>
  </form>
)

export default Input