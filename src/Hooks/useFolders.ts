import { useEffect, useState } from "react";
import { Ancestor, Folder } from "../Folder";
import axios from "axios";

export const useFolders = () =>{

    const apiURL = 'https://nameless-savannah-03121.herokuapp.com'

    let contentFromLocalStorage = localStorage.getItem('folderContent')
    let currentFolderFromLocalStorage = localStorage.getItem('currentFolder')


    const [folderList, setFolderList] = useState<Folder[]>([])
    const [folderContent, setFolderContent] = useState<Folder[]>( contentFromLocalStorage ? JSON.parse(contentFromLocalStorage) : [] )
    const [currentFolder, setCurrentFolder] = useState<Folder | null>( currentFolderFromLocalStorage  ? JSON.parse(currentFolderFromLocalStorage) : null)

    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)

    const [parentFolderOfMultipleFileUpload, setParentFolderOfMultipleFileUpload] = useState<Folder | null>(null)
    const [files , setFiles] = useState<FileList | null> (null)

    const [selected , setSelected] = useState<Folder | null>(null)

    var folder : Folder 

    // get current folder details
    const getFolderDetails = (id : string) => {
        fetch(`${apiURL}/folderDetails/${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(id === "-1"){
                setCurrentFolder(data)
                localStorage.setItem('currentFolder', JSON.stringify(data))
            }else{
                setCurrentFolder(data[0])
                localStorage.setItem('currentFolder', JSON.stringify(data[0]))
            }
        }) 
    }

    // get current folder content
    const getFolderContent = (parent : string = "-1") => {
        fetch(`${apiURL}/folders/${parent}`)
        .then(res => res.json())
        .then(data => {
            setFolderContent(data)
            localStorage.setItem('folderContent', JSON.stringify(data))
        })  
    }

    // upload file/folder
    const upload =  (name : string, type : string , multiple : boolean = false) : void => {
        let level : number 
        let ancestors : Ancestor[] 
        let parent : string 

        // in case of multiple file upload, parent folder will be set, use that as parent
        if(parentFolderOfMultipleFileUpload !== null){
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
         axios.post(`${apiURL}/folders/`, folder)
        .then(res => {
            if(res.data.insertedId){
                setUploadSuccess(true)
                folder._id = res.data.insertedId
            }
        })
        if(multiple === true){
            setParentFolderOfMultipleFileUpload(folder)
        }

        // update dom
        const content = [...folderContent] 
        content.push(folder)
        setFolderContent(content)
        localStorage.setItem("folderContent" , JSON.stringify(content))
    }
    
    // upload folder with possibly multiple files inside
    const uploadSelectedFolder = (files : FileList) =>{
        // getting parent folder name
        const parent = files[0].webkitRelativePath.split("/")[0]
        upload(parent, "folder" , true)
        // timeout because setState() isn't always updated immediately
        setTimeout(()=>{
            setFiles(files)
        },1000)
    }

    // update file/folder.name
    const triggerUpdate = (newName : string ,folder : Folder | null) =>{
        if(folder){
            folder.name = newName

            fetch(`${apiURL}/update/${folder._id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(folder)
            })
            .then(res => res.json())
            .then(data => {
                if (data.modifiedCount > 0) {
                    console.log("updated" , data.modifiedCount)
                    const newContent = folderContent.filter(f => f._id !== folder._id);
                    newContent.push(folder)
                    setFolderContent(newContent);
                }
            })
        }
        
    }

    // delete file/folder
    const triggerDelete = (id : string ) =>{
        console.log(id)
        fetch(`${apiURL}/delete/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            if (data.deletedCount > 0) {
                console.log("deleted" , data.deletedCount)
                const newContent = folderContent.filter(folder => folder._id !== id);
                setFolderContent(newContent);
                localStorage.setItem("folderContent" , JSON.stringify(newContent))
            }
        });
        
    }

    // set all folders
    useEffect(()=>{
        fetch('${apiURL}/folders')
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
        , uploadSuccess , setUploadSuccess , uploadSelectedFolder , setSelected , selected , triggerUpdate , triggerDelete}
}