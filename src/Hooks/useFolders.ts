import { useEffect, useState } from "react";
import { Folder } from "../Folder";

export const useFolders = () =>{
    const [folderList, setFolderList] = useState<Folder[]>([])
    const [folderContent, setFolderContent] = useState<Folder[]>([])
    const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)

    // get current folder details
    const getFolderDetails = (id : string) => {
        fetch(`http://localhost:5000/folderDetails/${id}`)
        .then(res => res.json())
        .then(data => setCurrentFolder(data[0])) 
    }

    // get current folder content
    const getFolderContent = (parent : string = "-1") => {
        fetch(`http://localhost:5000/folders/${parent}`)
        .then(res => res.json())
        .then(data => setFolderContent(data))  
    }

    // set all folders
    useEffect(()=>{
        fetch('http://localhost:5000/folders')
        .then(res => res.json())
        .then(data => setFolderList(data))        
    }, [])
    
    // find content by parent ID
    useEffect(()=>{
        if(currentFolder?._id !== undefined){
            getFolderContent(currentFolder._id)
        }
        else getFolderContent()
    } , [currentFolder])

    // set current folder
    useEffect(()=>{
        if(currentFolder?._id !== undefined){
            getFolderDetails(currentFolder._id)
            getFolderContent(currentFolder._id)
        }
    } , [])

    return {folderList , folderContent , setFolderContent, currentFolder, setCurrentFolder , getFolderDetails}
}