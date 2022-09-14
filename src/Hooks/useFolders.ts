import { useEffect, useState } from "react";
import { Ancestor, Folder } from "../Folder";
import axios from "axios";

export const useFolders = () =>{
    const [folderList, setFolderList] = useState<Folder[]>([])
    const [folderContent, setFolderContent] = useState<Folder[]>([])
    const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)

    const [parentFolderOfMultipleFileUpload, setParentFolderOfMultipleFileUpload] = useState<Folder | null>(null)
    const [files , setFiles] = useState<FileList | null> (null)

    const [selected , setSelected] = useState<Folder | null>(null)

    var folder : Folder 

    // get current folder details
    const getFolderDetails = (id : string) => {
        fetch(`http://localhost:5000/folderDetails/${id}`)
        .then(res => res.json())
        .then(data => {
            setCurrentFolder(data[0])
        }) 
    }

    // get current folder content
    const getFolderContent = (parent : string = "-1") => {
        fetch(`http://localhost:5000/folders/${parent}`)
        .then(res => res.json())
        .then(data => setFolderContent(data))  
    }

    // upload file/folder
    const upload =  (name : string, type : string , multiple : boolean = false) : void => {
        let level : number 
        let ancestors : Ancestor[] 
        let parent : string 

        console.log(multiple)
        // in case of multiple file upload, parent folder will be set, use that as parent
        if(parentFolderOfMultipleFileUpload !== null){
            console.log("hit")
            level = parentFolderOfMultipleFileUpload.level + 1
            ancestors = [...parentFolderOfMultipleFileUpload.ancestors , {"id" : parentFolderOfMultipleFileUpload._id , "name" : parentFolderOfMultipleFileUpload.name}]
            parent = parentFolderOfMultipleFileUpload._id
        }

        // if currentfolder is set, then newly created folder will be a child of that
         else if(currentFolder !== null && currentFolder !== undefined){
            level = currentFolder.level + 1
            ancestors = [...currentFolder.ancestors , {"id" : currentFolder._id , "name" : currentFolder.name}]
            parent = currentFolder._id
        }
        // else, new folder will be in root 
        else{
            level =  1
            ancestors = [{"id" : "-1" , "name" : "My Drive"}]
            parent = "-1"
        }

        // construct folder object
        folder = {
            "name" : name,
            "type" : type,
            "level" :  level,
            "ancestors" : ancestors,
            "parent" : parent 
        }


        // post to db
         axios.post("http://localhost:5000/folders/", folder)
        .then(res => {
            if(res.data.insertedId){
                setUploadSuccess(true)
                folder._id = res.data.insertedId
            }
        })
        if(multiple === true){
            setParentFolderOfMultipleFileUpload(folder)
        }
    }
    
    // upload folder
    const uploadSelectedFolder = (files : FileList) =>{
        // getting parent folder name
        const parent = files[0].webkitRelativePath.split("/")[0]
        upload(parent, "folder" , true)
        setTimeout(()=>{
            setFiles(files)
        },1000)
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

    // upload files inside folder
    useEffect(()=>{
        if(files !== null){
            for(let i = 0 ; i < files.length ; i++){
                upload(files[i].name , "file")
            }
        }
        setParentFolderOfMultipleFileUpload(null)
    } , [files])

    return {folderList , folderContent , setFolderContent, 
        currentFolder, setCurrentFolder , getFolderDetails , upload
        , uploadSuccess , setUploadSuccess , uploadSelectedFolder , setSelected , selected}
}