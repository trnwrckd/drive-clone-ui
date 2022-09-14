import { useEffect, useState, useRef } from "react"
import addIcon from "../../Assets/add-icon.png"
import docs from "../../Assets/g-docs.png"
import sheets from "../../Assets/g-sheets.png"
import slides from "../../Assets/g-slides.png"
import forms from "../../Assets/g-forms.png"
import { Folder } from "../../Folder"

import "./SideBar.css"

export default function SideBar(props : any) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)



    // const folderList : Folder[] = props.folderList
    // console.log(folderList)

  //   refs for modal
  const addModalRef = useRef<HTMLDivElement>(null)
  const addModalBtnRef = useRef<HTMLButtonElement>(null)
  const newFolderOverlayRef = useRef<HTMLDivElement>(null)
  const newFolderModalRef = useRef<HTMLDivElement>(null)

  function handleClickOutsideModal(modal: string, target: Node): any {
    // handle add btn clicked
    if (modal === "add" && addModalRef.current && addModalBtnRef.current && !addModalRef.current.contains(target) && !addModalBtnRef.current.contains(target)) {
      setShowAddModal(false)
    }
    // handle create new folder modal
    if (modal === "newFolder" && newFolderOverlayRef.current && newFolderModalRef.current && !newFolderModalRef.current.contains(target) && newFolderOverlayRef.current?.contains(target)) {
      setShowNewFolderModal(false)
    }
  }

    //   handle modal show effect
  useEffect(() => {
    if (showAddModal) {
      document.addEventListener("click", (e) => {
        handleClickOutsideModal("add", e.target as Node)
      })
    }
    if (showNewFolderModal) {
      document.addEventListener("click", (e) => {
        handleClickOutsideModal("newFolder", e.target as Node)
      })
    }
    return () => {
      document.removeEventListener("click", (e) => {
        handleClickOutsideModal("add", e.target as Node)
      })
      document.removeEventListener("click", (e) => {
        handleClickOutsideModal("newFolder", e.target as Node)
      })
    }
  }, [showAddModal, showNewFolderModal])

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

        {/* add modal */}
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
              <div className="add-modal-block">
                <span className="material-symbols-outlined" style={{ padding: " 0 6px" }}>
                  upload_file
                </span>
                <span>File upload</span>
              </div>
              <div className="add-modal-block" role="button">
                <span className="material-symbols-outlined" style={{ padding: " 0 6px" }}>
                  drive_folder_upload
                </span>
                <span>Folder upload</span>
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
          <li className="sidebar-nav-item">
            <span className="material-icons sidebar-extend-icon">play_arrow</span>
            <span className="material-symbols-outlined sidebar-icon">folder</span>
            <span className="sidebar-nav-link">My Drive</span>
          </li>
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
      {/* side nav ends*/}
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
      {/* storage ends*/}
      {/* new folder modal */}
      {showNewFolderModal && (
        <div className="new-folder-modal-overlay flex-center" ref={newFolderOverlayRef}>
          <div className="new-folder-modal" ref={newFolderModalRef}>
            <h2>New folder</h2>
            <input type="text" name="folderName" id="folderName" placeholder="Untitled folder" />
            <div className="flex justify-end align-center">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowNewFolderModal(false)
                }}>
                {" "}
                Cancel
              </button>
              <button className="btn-create"> Create </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
