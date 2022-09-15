import { useEffect, useState } from "react"
import { Ancestor, Folder, MyDrive } from "../Models"
import axios from "axios"

export const useFolders = () => {
  const apiURL = "https://nameless-savannah-03121.herokuapp.com"

  let contentFromLocalStorage = localStorage.getItem("folderContent")
  let currentFolderFromLocalStorage = localStorage.getItem("currentFolder")
  let treeFromLocalStorage = localStorage.getItem("tree")

  const [folderList, setFolderList] = useState<Folder[]>([])
  const [folderContent, setFolderContent] = useState<Folder[]>(contentFromLocalStorage ? JSON.parse(contentFromLocalStorage) : [])
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(currentFolderFromLocalStorage ? JSON.parse(currentFolderFromLocalStorage) : null)

  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)

  const [parentFolderOfMultipleFileUpload, setParentFolderOfMultipleFileUpload] = useState<Folder | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  // directory tree
  const [tree, setTree] = useState<Folder[]>(treeFromLocalStorage ? JSON.parse(treeFromLocalStorage) : [])

  const [selected, setSelected] = useState<Folder | null>(null)

  var folder: Folder

  // get current folder details
  const getFolderDetails = (id: string) => {
    fetch(`${apiURL}/folderDetails/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelected(null)
        if (id === "-1") {
          setCurrentFolder(data)
          localStorage.setItem("currentFolder", JSON.stringify(data))
        } else {
          setCurrentFolder(data[0])
          localStorage.setItem("currentFolder", JSON.stringify(data[0]))
        }
      })
  }

  // get current folder content
  const getFolderContent = (parent: string = "-1") => {
    fetch(`${apiURL}/folders/${parent}`)
      .then((res) => res.json())
      .then((data) => {
        setSelected(null)
        setFolderContent(data)
        localStorage.setItem("folderContent", JSON.stringify(data))
      })
  }

  // upload file/folder
  const upload = (name: string, type: string, multiple: boolean = false): void => {
    let level: number
    let ancestors: Ancestor[]
    let parent: string

    // in case of multiple file upload, parent folder will be set, use that as parent
    if (parentFolderOfMultipleFileUpload !== null && parentFolderOfMultipleFileUpload !== undefined ) {
      level = parentFolderOfMultipleFileUpload.level + 1
      ancestors = [...parentFolderOfMultipleFileUpload.ancestors, { id: parentFolderOfMultipleFileUpload._id, name: parentFolderOfMultipleFileUpload.name }]
      parent = parentFolderOfMultipleFileUpload._id
    }

    // if currentfolder is set, then newly created folder will be a child of that
    else if (currentFolder !== null && currentFolder !== undefined) {
      level = currentFolder.level + 1
      ancestors = [...currentFolder.ancestors, { id: currentFolder._id, name: currentFolder.name }]
      parent = currentFolder._id
    }
    // else, new folder will be in root
    else {
      level = 1
      ancestors = [{ id: "-1", name: "My Drive" }]
      parent = "-1"
    }

    // construct folder object
    folder = {
      name: name,
      type: type,
      level: level,
      ancestors: ancestors,
      parent: parent,
    }

    // post to db
    axios.post(`${apiURL}/folders/`, folder).then((res) => {
      if (res.data.insertedId) {
        setUploadSuccess(true)
        folder._id = res.data.insertedId
      }
    })
    if (multiple === true) {
      setParentFolderOfMultipleFileUpload(folder)
    }

    // update dom
    if(currentFolder?._id === folder.parent){
        const content = [...folderContent]
        content.push(folder)
        setFolderContent(content)
        localStorage.setItem("folderContent", JSON.stringify(content))
        // if current folders' parent exists in tree, add to tree
        const newTree = [...tree]
        if(newTree.find((el) => el._id === folder.parent) !== undefined){
            const index = newTree.findIndex((t) => t._id === folder.parent) 
            newTree.splice(index+1,0,folder)  
            setTree(newTree)
            localStorage.setItem("tree", JSON.stringify(newTree))
        }
    }
  }

  // upload folder with possibly multiple files inside
  const uploadSelectedFolder = (files: FileList) => {
    // getting parent folder name
    const parent = files[0].webkitRelativePath.split("/")[0]
    upload(parent, "folder", true)
    // timeout because setState() isn't always updated immediately
    setTimeout(() => {
      setFiles(files)
    }, 1000)
  }

  // update file/folder.name
  const triggerUpdate = (newName: string, folder: Folder | null) => {
    if (folder) {
      folder.name = newName

      fetch(`${apiURL}/folders/${folder._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(folder),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.modifiedCount > 0) {
            console.log("updated", data.modifiedCount)
            const newContent = folderContent.filter((f) => f._id !== folder._id)
            newContent.push(folder)
            setFolderContent(newContent)
            localStorage.setItem("folderContent", JSON.stringify(newContent))
            // if updated folder exist in tree, update tree too
            if (tree.length && tree.find((el) => el._id === folder._id) !== undefined) {
            const index = tree.findIndex((t) => t._id === folder._id)
              const newTree = [...tree]
              // insert at exact index
              newTree.splice(index, 1, folder)
              setTree(newTree)
              localStorage.setItem("tree", JSON.stringify(newTree))
            }
          }
        })
    }
  }

  // delete file/folder
  const triggerDelete = (id: string) => {
    console.log(id)
    fetch(`${apiURL}/folders/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          console.log("deleted", data.deletedCount)
          const newContent = folderContent.filter((folder) => folder._id !== id && folder.ancestors.every(a=>a.id !== id))
          setFolderContent(newContent)
          localStorage.setItem("folderContent", JSON.stringify(newContent))
          //   if deleted folder exists in tree, update
          const newTree = tree.filter((folder) => {
            return folder._id !== id && folder.ancestors.every(a=>a.id !== id)
          })
          setTree(newTree)
          localStorage.setItem("tree", JSON.stringify(newTree))
        }
      })
  }

  // get updated tree on directory click
  const getTree = (parent: string, expand: boolean) => {
    // expand tree
    if (expand) {
      fetch(`${apiURL}/folders/${parent}`)
        .then((res) => res.json())
        .then((data) => {
          // insert children after parent if there are already elements in tree
          if (tree.length > 0) {
            // find parent index
            const index = tree.findIndex((t) => {
              return t._id === parent
            })
            const newTree = [...tree]

            // insert fetched data after parent
            data.forEach((element: Folder) => {
              // if doesn't already exist, insert
              if (newTree.find((el) => el._id === element._id) === undefined) {
                newTree.splice(index + 1, 0, element)
              }
            })

            setTree(newTree)
            localStorage.setItem("tree", JSON.stringify(newTree))
          } else {
            setTree(data)
            localStorage.setItem("tree", JSON.stringify(data))
          }
        })
    }
    // shrink tree
    else {
      const newTree = tree.filter((elem) => {
        return elem.ancestors.every((e) => e.id !== parent)
      })
      setTree(newTree)
      localStorage.setItem("tree", JSON.stringify(newTree))
    }
  }

  // set all folders
  useEffect(() => {
    fetch(`${apiURL}/folders`)
      .then((res) => res.json())
      .then((data) => setFolderList(data))
  }, [])

  // find content by parent ID
  useEffect(() => {
    if (currentFolder?._id !== undefined) {
      getFolderContent(currentFolder._id)
    } else{
        setCurrentFolder(MyDrive)
        getFolderContent()
    }
  }, [currentFolder])

  // upload files inside folder
  useEffect(() => {
    if (files !== null) {
      for (let i = 0; i < files.length; i++) {
        upload(files[i].name, "file")
      }
    }
    setParentFolderOfMultipleFileUpload(null)
  }, [files])

  return { folderList, folderContent, setFolderContent, currentFolder, setCurrentFolder, getFolderDetails, upload, uploadSuccess, setUploadSuccess, uploadSelectedFolder, setSelected, selected, triggerUpdate, triggerDelete, tree, getTree }
}
