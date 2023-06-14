const onlineIcon = 'http://localhost:3000/icons/onlineIcon.png'

const InfoBar = ({ isSSR, room }) => (
  <div className='infoBar'>
    <div className='leftInnerContainer'>
      <img className='onlineIcon' src={onlineIcon} alt='online icon' />
      <h3 className='text-lg'>Room: {!isSSR && room}</h3>
    </div>
  </div>
)

export default InfoBar
