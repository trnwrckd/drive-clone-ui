import addIcon from '../../Assets/add-icon.png'
import './SideBar.css'


export default function SideBar() {
  return (
    <aside className='sidebar'>
        {/* add btn */}
        <div>
            <button className="sidebar-btn flex-center">
                <img src={addIcon} alt="" height="35px"/>
                <span style={{marginLeft : "15px"}}>New</span>
            </button>
        </div>
        {/* add btn ends*/}

        {/* side nav */}
        <div className="sidebar-nav">
            <ul className='sidebar-nav-list'>
                <li className='sidebar-nav-item'>
                    <span className='material-icons sidebar-extend-icon'>play_arrow</span>
                    <span className='material-symbols-outlined sidebar-icon'>folder</span>
                    <span className="sidebar-nav-link">My Drive</span>
                </li>
                <li className='sidebar-nav-item'>
                    <span className='material-icons sidebar-extend-icon'>play_arrow</span>
                    <span className='material-symbols-outlined sidebar-icon'>devices</span>
                    <span className="sidebar-nav-link">Computers</span>
                </li>
                <li className='sidebar-nav-item'>
                    <span className='material-symbols-outlined sidebar-icon'>group</span>
                    <span className="sidebar-nav-link">Shared with me</span>
                </li>
                <li className='sidebar-nav-item'>
                    <span className='material-symbols-outlined sidebar-icon'>schedule</span>
                    <span className="sidebar-nav-link">Recent</span>
                </li>
                <li className='sidebar-nav-item'>
                    <span className='material-symbols-outlined sidebar-icon'>star</span>
                    <span className="sidebar-nav-link">Starred</span>
                </li>
                <li className='sidebar-nav-item'>
                    <span className='material-symbols-outlined sidebar-icon'>tune</span>
                    <span className="sidebar-nav-link">Trash</span>
                </li>
            </ul>
        </div>
        {/* side nav ends*/}

        {/* storage */}
        <div className="sidebar-storage flex-col justify-center">
            <div className = "flex align-center">
                <span className='material-symbols-outlined sidebar-icon'>cloud</span>
                Storage (0% full)
            </div>
            <div className='progress'>
                <progress id="usedStorage" value="0" max="100"></progress>        
                <span className='used-storage-text'> 0 MB of 500 MB used</span>
            </div>
            <div>
                <button className='btn-buy-storage'>
                    Buy Storage
                </button>
            </div>
        </div>
        {/* storage ends*/}
    </aside>
  )
}
