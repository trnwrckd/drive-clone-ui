import React from 'react'
import './NavBar.css'
import logo from '../../Assets/drive-icon.png'
import profilePicture from '../../Assets/profile-picture.jpg'

interface ThemeProps{
    darkTheme : boolean
    setDarkTheme: (React.Dispatch<React.SetStateAction<boolean>>)
}

export default function NavBar({darkTheme, setDarkTheme} : ThemeProps )  {
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

        {/* all of nav is decor, except this nighmode */}
        <div className = "flex justify-end align-center">
            {/* toggle night mode button */}
            {
                darkTheme ? 
                <span className="material-icons icon" style={{marginRight: "10px"}} onClick={()=>{setDarkTheme(!darkTheme)}}>
                    light_mode   
                </span> : 
                <span className="material-icons icon" style={{marginRight: "10px"}} onClick={()=>{setDarkTheme(!darkTheme)}}>
                    dark_mode   
                </span>  
            }
            <div className = "flex" style={{marginRight: "45px"}}> 
                <span className='material-icons icon' style={{marginRight: "10px"}}>help_outline</span>
                <span className='material-symbols-outlined icon'>settings</span>
            </div>
            <div className = "flex-center"> 
                <span className='material-icons icon' style={{marginRight: "10px"}}>apps</span>
                <img className='profile-picture' src={profilePicture} alt="" />
            </div>
        </div>
    </nav>
  )
}
