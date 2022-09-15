import { useEffect, useState, useRef, useContext } from "react"
import addIcon from "../../Assets/add-icon.png"
import docs from "../../Assets/g-docs.png"
import sheets from "../../Assets/g-sheets.png"
import slides from "../../Assets/g-slides.png"
import forms from "../../Assets/g-forms.png"
import { DriveContext } from "../../Contexts/driveContext"

import "./SideBar.css"
import { Folder, MyDrive } from "../../Models"

export default function SideBar() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false)
  const [folderName, setFolderName] = useState<string>("Untitled Folder")
  const [selectedDirectory, setSelectedDirectory] = useState<Folder | null>(null)

  // use Context
  const { upload, uploadSelectedFolder, uploadSuccess, setUploadSuccess, getFolderDetails, tree, getTree } = useContext(DriveContext)

  //   refs for modal
  const addModalRef = useRef<HTMLDivElement>(null)
  const addModalBtnRef = useRef<HTMLButtonElement>(null)
  const newFolderOverlayRef = useRef<HTMLDivElement>(null)
  const newFolderModalRef = useRef<HTMLDivElement>(null)
  //   refs for file upload input elem
  const fileUploadRef = useRef<HTMLInputElement>(null)
  const folderUploadRef = useRef<HTMLInputElement>(null)

  // attribute for multiple file upload
  const otherAtt = { directory: "", webkitdirectory: "" }

  //   close modal when clicked outside
  const handleClickOutsideModal = (modal: string, target: Node): void => {
    // handle add btn clicked
    if (modal === "add" && addModalRef.current && addModalBtnRef.current && !addModalRef.current.contains(target) && !addModalBtnRef.current.contains(target)) {
      setShowAddModal(false)
    }
    // handle create new folder modal
    if (modal === "newFolder" && newFolderOverlayRef.current && newFolderModalRef.current && !newFolderModalRef.current.contains(target) && newFolderOverlayRef.current?.contains(target)) {
      setShowNewFolderModal(false)
    }
  }

  const handleExpandTree = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: string) => {
    const target = e.target as HTMLSpanElement
    // if not expanded, expand. add elements to array whose parent match this id
    if (!target.classList.contains("rotated-icon")) {

      target.classList.add("rotated-icon")
      getTree(id, true)
    }
    // if expanded, shrink. remove elements from array whose parent match this id
    else {
      target.classList.remove("rotated-icon")
      getTree(id, false)
    }
  }

  //   show / hide modal
  useEffect(() => {
    // if file gets uploaded successfully
    if (uploadSuccess) {
      setShowNewFolderModal(false)
      setUploadSuccess(false)
    }
    // show add modal
    if (showAddModal) {
      document.addEventListener("click", (e) => {
        handleClickOutsideModal("add", e.target as Node)
      })
    }
    // show new folder modal
    if (showNewFolderModal) {
      document.addEventListener("click", (e) => {
        handleClickOutsideModal("newFolder", e.target as Node)
      })
    }
    // destroy eventlistener on unmount
    return () => {
      document.removeEventListener("click", (e) => {
        handleClickOutsideModal("add", e.target as Node)
      })
      document.removeEventListener("click", (e) => {
        handleClickOutsideModal("newFolder", e.target as Node)
      })
    }
  }, [setUploadSuccess, showAddModal, showNewFolderModal, uploadSuccess])

  return (
    <aside className="sidebar">
      {/* add btn */}
      <div className="add-modal-container">
        <button
          ref={addModalBtnRef}
          className="sidebar-btn flex-center"
          onClick={() => {
            setShowAddModal(!showAddModal)
          }}>
          <img src={addIcon} alt="" height="35px" />
          <span style={{ marginLeft: "15px" }}>New</span>
        </button>

        {/* add new file/folder/upload modal */}
        {showAddModal && (
          <div className="add-modal" ref={addModalRef}>
            <div className="border-bottom">
              <div
                className="add-modal-block"
                role="button"
                onClick={() => {
                  setShowNewFolderModal(true)
                  setShowAddModal(false)
                }}>
                <span className="material-symbols-outlined" style={{ padding: " 0 6px" }}>
                  create_new_folder
                </span>
                <span>New Folder</span>
              </div>
            </div>
            <div className="border-bottom" role="button">
              <div
                className="add-modal-block"
                role="button"
                onClick={() => {
                  fileUploadRef?.current?.click()
                }}>
                <span className="material-symbols-outlined" style={{ padding: " 0 6px" }}>
                  upload_file
                </span>
                <span>File upload</span>
                {/* file upload input */}
                <input
                  type="file"
                  ref={fileUploadRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files) {
                      upload(e.target.files[0].name, "file")
                      setShowAddModal(false)
                    }
                  }}
                />
              </div>
              <div
                className="add-modal-block"
                role="button"
                onClick={() => {
                  folderUploadRef?.current?.click()
                }}>
                <span className="material-symbols-outlined" style={{ padding: " 0 6px" }}>
                  drive_folder_upload
                </span>
                <span>Folder upload</span>
                {/* folder upload input */}
                <input
                  type="file"
                  ref={folderUploadRef}
                  {...otherAtt}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files) {
                      uploadSelectedFolder(e.target.files)
                      setShowAddModal(false)
                    }
                  }}
                  multiple
                />
              </div>
            </div>

            <div>
              <div className="add-modal-block">
                <img className="img-sm" src={docs} alt="" />
                Google Docs
              </div>
              <div className="add-modal-block">
                <img className="img-sm" src={sheets} alt="" />
                Google Sheets
              </div>
              <div className="add-modal-block">
                <img className="img-sm" src={slides} alt="" />
                Google Slides
              </div>
              <div className="add-modal-block">
                <img className="img-sm" src={forms} alt="" />
                Google Forms
              </div>
              <div className="add-modal-block" style={{ paddingLeft: "50px" }}>
                More
              </div>
            </div>
          </div>
        )}
      </div>

      {/* side nav */}
      <div className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li className={selectedDirectory && selectedDirectory._id === "-1" ? "sidebar-nav-item selected-directory" : "sidebar-nav-item"} >
            {/* directory tree */}
            <span
              className="material-icons sidebar-extend-icon"
              onClick={(e) => {
                handleExpandTree(e, "-1")
              }}>
              play_arrow
            </span>
            <span className="material-symbols-outlined sidebar-icon">folder</span>
            <span
              className="sidebar-nav-link"
              onClick={() => {
                setSelectedDirectory(MyDrive)
                getFolderDetails("-1")
              }}>
              My Drive
            </span>
          </li>

          {/* tree begins here */}
          {/* directory tree */}
          {tree.length !== 0 && (
            <ul className="sidebar-nav-list">
              {tree.map((t) => (
                t.type === "folder" &&
                <li 
                className={selectedDirectory && selectedDirectory._id === t._id ? "sidebar-dir-item selected-directory not-root" : "sidebar-dir-item"} 
                key={t._id} style={{ paddingLeft: `${t.level * 12}px` }}>
                  <span
                    className= "material-icons sidebar-extend-icon"
                    onClick={(e) => {
                      handleExpandTree(e, t._id)
                    }}>
                    play_arrow
                  </span>
                  <span className="material-icons sidebar-icon">folder</span>
                  <span
                    className="sidebar-nav-link"
                    onClick={() => {
                      setSelectedDirectory(t)
                      getFolderDetails(t._id)
                    }}>
                    {t.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <li className="sidebar-nav-item">
            <span className="material-icons sidebar-extend-icon">play_arrow</span>
            <span className="material-symbols-outlined sidebar-icon">devices</span>
            <span className="sidebar-nav-link">Computers</span>
          </li>
          <li className="sidebar-nav-item">
            <span className="material-symbols-outlined sidebar-icon">group</span>
            <span className="sidebar-nav-link">Shared with me</span>
          </li>
          <li className="sidebar-nav-item">
            <span className="material-symbols-outlined sidebar-icon">schedule</span>
            <span className="sidebar-nav-link">Recent</span>
          </li>
          <li className="sidebar-nav-item">
            <span className="material-symbols-outlined sidebar-icon">star</span>
            <span className="sidebar-nav-link">Starred</span>
          </li>
          <li className="sidebar-nav-item">
            <span className="material-symbols-outlined sidebar-icon">tune</span>
            <span className="sidebar-nav-link">Trash</span>
          </li>
        </ul>
      </div>

      {/* storage */}
      <div className="sidebar-storage flex-col justify-center">
        <div className="flex align-center">
          <span className="material-symbols-outlined sidebar-icon">cloud</span>
          Storage (0% full)
        </div>
        <div className="progress">
          <progress id="usedStorage" value="0" max="100"></progress>
          <span className="used-storage-text"> 0 MB of 500 MB used</span>
        </div>
        <div>
          <button className="btn-buy-storage">Buy Storage</button>
        </div>
      </div>

      {/* new folder modal */}
      {showNewFolderModal && (
        <div className="modal-overlay flex-center" ref={newFolderOverlayRef}>
          <div className="modal" ref={newFolderModalRef}>
            <h2 className="modal-heading">New folder</h2>
            <input
              type="text"
              name="folderName"
              id="folderName"
              placeholder="Untitled folder"
              onBlur={(e) => {
                setFolderName(e.target.value)
              }}
            />
            <div className="flex justify-end align-center">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowNewFolderModal(false)
                }}>
                {" "}
                Cancel
              </button>
              <button
                className="btn-create"
                onClick={() => {
                  upload(folderName, "folder")
                }}>
                {" "}
                Create{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
