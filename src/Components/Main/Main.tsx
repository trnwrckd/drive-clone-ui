import { useContext, useEffect, useRef, useState } from "react"
import Addons from "./Addons/Addons"
import NoFiles from "./NoFiles/NoFiles"
import { DriveContext } from "../../Contexts/driveContext"
import OutsideClickHandler from "react-outside-click-handler"
import "./Main.css"
import { Folder } from "../../Folder"

export default function Main() {
  const { currentFolder, folderContent, setCurrentFolder, getFolderDetails, selected, setSelected, triggerUpdate, triggerDelete } = useContext(DriveContext)

  // show update and delete modal state
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [fileRename, setFileRename] = useState<string>("")

  // refs for modals and overlays
  const updateModalOverlayRef = useRef<HTMLDivElement>(null)
  const updateModalRef = useRef<HTMLDivElement>(null)
  const deleteModalOverlayRef = useRef<HTMLDivElement>(null)
  const deleteModalRef = useRef<HTMLDivElement>(null)

  // to detect if a clicked outside of a seleted file/folder and target is update/delete btn
  // if, trigger operation. else set selected to null
  const handleClickOutsideSelectedFolder = (target: any, f: Folder) => {
    if (selected?._id === f._id) {
      if (target.id === "updateIcon") {
        setFileRename(f.name)
        setShowUpdateModal(true)
      } else if (target.id === "deleteIcon") {
        setShowDeleteModal(true)
      }
    }
  }

  //   close modal when clicked outside
  function handleClickOutsideModal(modal: string, target: Node): any {
    // handle add btn clicked
    if (modal === "update" && updateModalOverlayRef.current && updateModalRef.current && updateModalOverlayRef.current.contains(target) && !updateModalRef.current.contains(target)) {
      setShowUpdateModal(false)
    }
    // handle create new folder modal
    if (modal === "delete" && deleteModalOverlayRef.current && deleteModalRef.current && deleteModalOverlayRef.current.contains(target) && !deleteModalRef.current?.contains(target)) {
      setShowDeleteModal(false)
    }
  }

  // trigger modal side Effect
  useEffect(()=>{
    // show add modal
    if (showUpdateModal) {
      document.addEventListener("click", (e) => {
        handleClickOutsideModal("update", e.target as Node)
      })
    }
    // show new folder modal
    if (showDeleteModal) {
      document.addEventListener("click", (e) => {
        handleClickOutsideModal("delete", e.target as Node)
      })
    }
    // destroy eventlistener on unmount
    return () => {
      document.removeEventListener("click", (e) => {
        handleClickOutsideModal("update", e.target as Node)
      })
      document.removeEventListener("click", (e) => {
        handleClickOutsideModal("delete", e.target as Node)
      })
    }
  } , [showUpdateModal , showDeleteModal])

  return (
    <div className="main-container">
      <div className="main flex-col">
        {/* route container */}
        <div className="route flex justify-between align-center">
          {/* route */}
          <div className="flex">
            {/* initially, show mydrive */}
            {!currentFolder && (
              <span
                className="route-current flex align-center"
                onClick={() => {
                  getFolderDetails("-1")
                }}>
                <span className="route-name">My Drive</span>
                <span className="material-symbols-outlined">arrow_drop_down</span>
              </span>
            )}
            {/* if we're inside, folder, map it's ancestors as current route */}
            {currentFolder?.ancestors !== undefined &&
              currentFolder?.ancestors.map((a) => (
                <span
                  className="route-link flex align-center"
                  key={a.id}
                  onClick={() => {
                    getFolderDetails(a.id)
                  }}>
                  <span className="route-name">{a.name}</span>
                  <span className="material-symbols-outlined">arrow_right</span>
                </span>
              ))}
            {/* show current folder in route */}
            {currentFolder?.name !== undefined && (
              <span className="flex align-center route-current">
                <span className="route-name">{currentFolder?.name}</span>
                <span className="material-symbols-outlined">arrow_drop_down</span>
              </span>
            )}
          </div>

          {/* icons */}
          <div>
            {/* show update and delete options when something is selected */}
            {selected !== null && (
              <span style={{ marginRight: "30px" }}>
                {/* update */}
                <span id="updateIcon" className="material-symbols-outlined icon" style={{ marginRight: "15px" }}>
                  edit
                </span>
                {/* delete */}
                <span id="deleteIcon" className="material-symbols-outlined icon">
                  delete
                </span>
              </span>
            )}
            <span style={{ marginRight: "15px" }}>
              <span className="material-symbols-outlined icon" style={{ marginRight: "15px" }}>
                reorder
              </span>
              <span className="material-symbols-outlined icon">info</span>
            </span>
          </div>
        </div>

        {/* content */}
        {folderContent === undefined ? (
          <NoFiles />
        ) : (
          folderContent.map((f) => (
            <div
              key={f._id}
              onDoubleClick={() => {
                console.log(selected?._id)
                if (f.type === "folder") setCurrentFolder(f)
              }}
              onClick={() => {
                setSelected(f)
              }}>
              <OutsideClickHandler
                onOutsideClick={(e) => {
                  handleClickOutsideSelectedFolder(e.target, f)
                }}>
                {f.name}
              </OutsideClickHandler>
            </div>
          ))
        )}
      </div>
      <Addons></Addons>

      {/* update file/folder name modal */}
      {showUpdateModal && (
        <div className="new-folder-modal-overlay flex-center" ref={updateModalOverlayRef}>
          <div className="new-folder-modal" ref={updateModalRef}>
            <h2>Rename</h2>
            <input type="text" defaultValue={selected?.name} onBlur ={
              (e)=>{
                setFileRename(e.target.value)
              }
            }/>
            <div className="flex justify-end align-center">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowUpdateModal(false)
                }}>
                {" "}
                Cancel
              </button>
              <button
                className="btn-create"
                onClick={() => {
                  if(selected){
                    triggerUpdate(fileRename, selected)
                    setSelected(null)
                    setShowUpdateModal(false)
                  }
                }}>
                {" "}
                Create{" "}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete file/folder modal */}
      {showDeleteModal && (
        <div className="new-folder-modal-overlay flex-center" ref={deleteModalOverlayRef}>
          <div className="new-folder-modal" ref={deleteModalRef}>
            <h4>Are you sure you want to delete {selected?.name}?</h4>
            <div className="flex justify-end align-center">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowDeleteModal(false)
                }}>
                {" "}
                Cancel
              </button>
              <button
                className="btn-create"
                onClick={() => {
                  triggerDelete(selected?._id)
                  setSelected(null)
                  setShowDeleteModal(false)
                }}>
                {" "}
                Delete{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
