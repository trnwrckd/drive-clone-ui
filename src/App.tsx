import NavBar from './Components/NavBar/NavBar';
import SideBar from './Components/SideBar/SideBar';
import Main from './Components/Main/Main';
import {DriveProvider} from './Contexts/driveContext'
import './App.css'

import { useFolders } from './Hooks/useFolders'

function App() {

  // const {folderList , folderContent} = useFolders()

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
