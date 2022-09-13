import Addons from './Addons/Addons'
import NoFiles from './NoFiles/NoFiles'
import './Main.css'


export default function Main() {
  return (
    <div className='main-container'>
      <div className="main flex-col">
      
      {/* route container */}
      <div className="route flex justify-between align-center">
        {/* route */}
        <p className='route-text flex align-center'>
          My Drive <span className='material-symbols-outlined'>arrow_drop_down</span>
        </p>
        {/* icons */}
        <div>
          <span className='material-symbols-outlined icon' style={{marginRight : "15px"}}>reorder</span>
          <span className='material-symbols-outlined icon'>info</span>
        </div>
      </div>

      {/* content */}
      <NoFiles/>
      </div>

      <Addons></Addons>
    </div>
  )
}
