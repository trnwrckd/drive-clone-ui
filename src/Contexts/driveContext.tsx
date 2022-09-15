import React, {ReactNode, createContext} from 'react'
import { Folder } from '../Models';
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
    triggerUpdate : (id : string , folder : Folder) => void
    triggerDelete : (id : string) => void
    selected : Folder | null,
    setSelected : (React.Dispatch<React.SetStateAction<Folder | null>>),
    tree : Folder[],
    getTree : (id :string, expand : boolean) => void
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
    triggerUpdate : () => null, 
    triggerDelete : () => null, 
    selected : null,
    setSelected : ()=> null,
    tree : [],
    getTree : ()=>null
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