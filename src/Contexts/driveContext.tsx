import {ReactNode, createContext} from 'react'
import { Folder } from '../Folder';
import { useFolders } from '../Hooks/useFolders'


interface IDriveContext {
    folderList: Folder[],
    folderContent: Folder[],
    currentFolder: Folder | null,
    setFolderContent: (React.Dispatch<React.SetStateAction<Folder[]>>), 
    setCurrentFolder: (React.Dispatch<React.SetStateAction<Folder | null>>), 
    getFolderDetails: (id : string) => void 
    
}

const defaultContext = {
    folderList : [],
    folderContent : [],
    currentFolder: null,
    setFolderContent: ()=> null,
    setCurrentFolder: ()=> null,
    getFolderDetails: ()=> null
}

export const DriveContext = createContext<IDriveContext>(defaultContext)

export function DriveProvider({children} :{children :  ReactNode}){

    const context = useFolders()

    return (
        <DriveContext.Provider value={context}>
            {children}
        </DriveContext.Provider>
    )
}

export default DriveProvider