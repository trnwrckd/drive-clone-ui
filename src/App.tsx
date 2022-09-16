import NavBar from './Components/NavBar/NavBar';
import SideBar from './Components/SideBar/SideBar';
import Main from './Components/Main/Main';
import {DriveProvider} from './Contexts/driveContext'
import './App.css'
import { useEffect, useState } from 'react';
import { themeSetter } from './Helper/ThemeSetter';


function App() {
  // theme state
  const themeFromLocalStorage = localStorage.getItem('theme')
  const [darkTheme, setDarkTheme] = useState<boolean>(themeFromLocalStorage ==='dark' ? true : false)

  // changeTheme
  useEffect(()=>{
    themeSetter(darkTheme)
    darkTheme === true ? localStorage.setItem('theme','dark') : localStorage.setItem('theme','light')
  }, [darkTheme])

  return (
    <div className="App">
      <DriveProvider>
        <header>
          <NavBar darkTheme = {darkTheme} setDarkTheme = {setDarkTheme} />
        </header>
        <main className = "grid-layout">
          <SideBar  ></SideBar>
          <Main  ></Main>
        </main>
      </DriveProvider>
    </div>
  );
}

export default App;
