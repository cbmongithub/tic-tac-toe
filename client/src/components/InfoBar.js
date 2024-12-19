const onlineIcon =
  'https://main--tictactoenextjs.netlify.app/icons/onlineIcon.png'

const InfoBar = ({ isSSR, room }) => (
  <div className="flex items-center justify-between bg-blue-500 rounded-t-lg h-[70px] w-full">
    <div className="flex-1 flex items-center ml-[5%] text-white">
      <img className="mr-[5%]" src={onlineIcon} alt="online icon" />
      <h3 className="text-lg">Room: {!isSSR && room}</h3>
    </div>
  </div>
)

export default InfoBar