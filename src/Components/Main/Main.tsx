import Addons from './Addons/Addons'
import docs from '../../Assets/g-docs.png'
import slides from '../../Assets/g-slides.png'
import sheets from '../../Assets/g-sheets.png'
import drive from '../../Assets/drive-icon.png'
import excel from '../../Assets/ms-xl.png'
import word from '../../Assets/ms-word.png'
import ppt from '../../Assets/ms-ppt.png'
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
          <span className='material-symbols-outlined' style={{marginRight : "15px"}}>reorder</span>
          <span className='material-symbols-outlined'>info</span>
        </div>
      </div>

      {/* content */}
      <div className = "no-files flex-col flex-center">
          <h2> A place for all of your files</h2>
          <div className='flex-center'>
            <div style={{textAlign: "right"}}>
              <p>Google Docs, Sheets, Slides and more</p>
              <img className="img-sm" src={docs} alt=""/>
              <img className="img-sm" src={slides} alt=""/>
              <img className="img-sm" src={sheets} alt=""/>
            </div>
            <div>
              <img className='drive-logo-sideways' src={drive} alt="" />
            </div>
            <div>
              <p className='flex-center'>
                Microsoft Office files and hundreds more
                <span className='material-symbols-outlined icon' style={{marginLeft : "10px"}}>info</span>
              </p>
              <img className="img-sm" src={word} alt=""/>
              <img className="img-sm" src={excel} alt=""/>
              <img className="img-sm" src={ppt} alt=""/>
            </div>
          </div>

          <p style={{marginTop : "3rem"}}>Drag files and folders here to add them to drive</p>
      </div>
      {/* content ends*/}
      </div>

      <Addons></Addons>
    </div>
  )
}
