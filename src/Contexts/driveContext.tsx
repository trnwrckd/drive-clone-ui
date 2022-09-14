import React, {ReactNode, createContext} from 'react'
import { Folder } from '../Folder';
import { useFolders } from '../Hooks/useFolders'


interface IDriveContext {
    folderList: Folder[],
    folderContent: Folder[],
    currentFolder: Folder | null,
    uploadSuccess: boolean,
    setFolderContent: (React.Dispatch<React.SetStateAction<Folder[]>>), 
    setCurrentFolder: (React.Dispatch<React.SetStateAction<Folder | null>>), 
    setUploadSuccess: (React.Dispatch<React.SetStateAction<boolean>>),
    getFolderDetails: (id : string) => void 
    upload: (name : string , id : string) => void 
    uploadSelectedFolder: (files : FileList) => void 
    selected : Folder | null,
    setSelected : (React.Dispatch<React.SetStateAction<Folder | null>>)
}

const defaultContext = {
    folderList : [],
    folderContent : [],
    currentFolder: null,
    uploadSuccess : false,
    setFolderContent: ()=> null,
    setCurrentFolder: ()=> null,
    getFolderDetails: ()=> null,
    setUploadSuccess : ()=> false,
    upload: () => null,
    uploadSelectedFolder: () => null,
    selected : null,
    setSelected : ()=> null 
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