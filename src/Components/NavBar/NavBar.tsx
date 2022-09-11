import React from 'react'
import './NavBar.css'
import logo from '../../Assets/drive-icon.png'
import profilePicture from '../../Assets/profile-picture.jpg'


export default function NavBar() {
  return (
    <div className='nav-container'> 
        <div className = "flex-center">
            <img className='logo' src={logo} alt="Google Drive Logo"/> 
            <span className='app-title'>Drive</span>
        </div>  
        
        <div className='search-bar'>
            <div className = "flex-between"> 
                <span className="material-icons icon"> search </span>
                <span className = "search-bar-text">Search in Drive</span>
                <span className="material-icons icon"> tune </span>
            </div>
        </div>

        <div className = "flex-between">
            <div className = "flex-center" style={{marginRight: "50px"}}> 
                <span className='material-icons icon'>help_outline</span>
                <span className='material-icons icon'>settings</span>
            </div>
            <div className = "flex-center"> 
                <span className='material-icons icon'>apps</span>
                <img className='profile-picture' src={profilePicture} alt="profile picture" />
            </div>
        </div>

    </div>
  )
}
