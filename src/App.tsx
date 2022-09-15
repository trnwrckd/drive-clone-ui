import NavBar from './Components/NavBar/NavBar';
import SideBar from './Components/SideBar/SideBar';
import Main from './Components/Main/Main';
import {DriveProvider} from './Contexts/driveContext'
import './App.css'


function App() {

  return (
    <div className="App">
      <DriveProvider>
        <header>
          <NavBar/>
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
