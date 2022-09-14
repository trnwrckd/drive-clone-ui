import React from 'react'
import './NavBar.css'
import logo from '../../Assets/drive-icon.png'
import profilePicture from '../../Assets/profile-picture.jpg'


export default function NavBar() {
  return (
    <nav className='nav-container'> 
        <a href="/" className='nav-link-home flex align-center'>
            <img className='logo' src={logo} alt="Google Drive Logo"/> 
            <span className='app-title'>Drive</span>
        </a>
        
        <div className='search-bar'>
            <div className = "flex justify-between align-center"> 
                <span className="material-icons icon"> search </span>
                <span className = "search-bar-text">Search in Drive</span>
                <span className="material-icons icon"> tune </span>
            </div>
        </div>

        <div className = "flex justify-end align-center">
            <div className = "flex" style={{marginRight: "45px"}}> 
                <span className='material-icons icon' style={{marginRight: "10px"}}>help_outline</span>
                <span className='material-symbols-outlined icon'>settings</span>
            </div>
            <div className = "flex-center"> 
                <span className='material-icons icon' style={{marginRight: "10px"}}>apps</span>
                <img className='profile-picture' src={profilePicture} alt="profile picture" />
            </div>
        </div>
    </nav>
  )
}
