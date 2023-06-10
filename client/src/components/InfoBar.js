const onlineIcon = 'http://localhost:3000/icons/onlineIcon.png'
const closeIcon = 'http://localhost:3000/icons/closeIcon.png'

const InfoBar = ({ room }) => (
  <div className='infoBar'>
    <div className='leftInnerContainer'>
      <img className='onlineIcon' src={onlineIcon} alt='online icon' />
      <h3 className='text-lg'>Room: {room}</h3>
    </div>
  </div>
)

export default InfoBar
