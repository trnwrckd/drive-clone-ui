import { useContext} from 'react'
import Addons from './Addons/Addons'
import NoFiles from './NoFiles/NoFiles'
import { DriveContext } from '../../Contexts/driveContext'
import './Main.css'

export default function Main() {
  const {currentFolder, folderContent , setCurrentFolder , getFolderDetails} = useContext(DriveContext)

  return (
    <div className='main-container'>
      <div className="main flex-col">
      
      {/* route container */}
      <div className="route flex justify-between align-center">
        {/* route */}
        <div className="flex">
          {
            !currentFolder && 
            <span className='route-current flex align-center' onClick={()=>{getFolderDetails("-1")}}>
              <span className= "route-name">My Drive</span> 
              <span className='material-symbols-outlined'>arrow_drop_down</span>
            </span>
          }
          {
            currentFolder?.ancestors !== undefined && currentFolder?.ancestors.map(a =>
              <span className='route-link flex align-center' key={a.id} onClick={()=>{getFolderDetails(a.id)}}>
                 <span className="route-name">{a.name}</span>
                 <span className='material-symbols-outlined'>arrow_right</span>
              </span>
            )
          }
          {
            currentFolder?.name !== undefined && 
            <span className='flex align-center route-current'>
                <span className="route-name">{currentFolder?.name}</span> 
                <span className='material-symbols-outlined'>arrow_drop_down</span>
            </span>
          }
        </div>

        {/* icons */}
        <div>
          <span className='material-symbols-outlined icon' style={{marginRight : "15px"}}>reorder</span>
          <span className='material-symbols-outlined icon'>info</span>
        </div>
      </div>

      {/* content */}
      {
        folderContent===undefined  ? <NoFiles/> :
        folderContent.map(f => 
        <div key ={f._id} onDoubleClick={()=>{
          setCurrentFolder(f)
        }}>
            {f.name}
        </div>
        )
      }
      
      </div>

      <Addons></Addons>
    </div>
  )
}
