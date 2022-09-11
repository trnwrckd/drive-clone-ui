import calendar from '../../../Assets/g-calendar.png'
import keep from '../../../Assets/g-keeps.png'
import task from '../../../Assets/g-task.png'
import './Addons.css'

export default function Addons() {
  return (
    <aside className='addons'>
        <div>
            <div className='addons-container'>
                <div className="addon-img-container flex-center">
                    <img className="addon-img" src={calendar} alt="Google Calendar Logo" />
                </div>
                <div className="addon-img-container flex-center">
                    <img className="addon-img" src={keep} alt="Google Keeps Logo" />
                </div>
                <div className="addon-img-container flex-center">
                    <img className="addon-img" src={task} alt="Google Task Logo" />
                </div>
            </div>
            <div>
                <span className='material-symbols-outlined icon' style={{marginTop : "25px"}}>add</span>
            </div>
        </div>

        <div style={{marginBottom : "20px"}}>
            <span className='material-symbols-outlined icon'>keyboard_arrow_right</span>
        </div>
      </aside>
  )
}
