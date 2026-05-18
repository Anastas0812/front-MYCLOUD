import uploadIcon from '../assets/upload.png'
import linkIcon from '../assets/link.svg'
import shareIcon from '../assets/share.png'
import myRobot from '../assets/my-robot.mp4'


export default function HomePage() {
  return (
    <div className="home-page">
      <video className='robot'
        src={myRobot}
        autoPlay
        loop 
        muted 
        playsInline 
      />
      <div className="text-container">
        <h1>MY CLOUD</h1>
        <span className='second-string'>регистрируйся, сохраняй, делись с друзьями!</span>

      <div className="icon-foot">
        <div className="icon-container">
          <img src={uploadIcon} alt="upload" className='icon'/>
          <span className='text-icon'>Загружай любые файлы</span>
        </div>
        <div className="icon-container">
        <img src={linkIcon} alt="link" className='icon'/>
          <span className='text-icon'>Скачивай</span>
        </div>
        <div className="icon-container">
        <img src={shareIcon} alt="share" className='icon'/>
          <span className='text-icon'>Делись с кем угодно</span>
        </div>
      </div>
      
      </div>
    </div>
  )
}