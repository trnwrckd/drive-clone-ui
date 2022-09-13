import NavBar from './Components/NavBar/NavBar';
import SideBar from './Components/SideBar/SideBar';
import Main from './Components/Main/Main';
import './App.css'

function App() {

  
  return (
    <div className="App">
      <header>
        <NavBar/>
      </header>
      <main className = "grid-layout">
        <SideBar></SideBar>
        <Main></Main>
      </main>
    </div>
  );
}

export default App;
