import { useContext, useEffect, useRef, useState } from "react"
import OutsideClickHandler from "react-outside-click-handler"
import { DriveContext } from "../../Contexts/driveContext"
import { Folder } from "../../Models"
import Addons from "./Addons/Addons"
import NoFiles from "./NoFiles/NoFiles"
import "./Main.css"
import Spinner from "../Shared/Spinner/Spinner"

export default function Main() {
  const { currentFolder, folderContent, setCurrentFolder, getFolderDetails, selected, setSelected, triggerUpdate, triggerDelete, loading } = useContext(DriveContext)

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
      } else if (target.id !== "btn-rename" && target.id !== "btn-delete" && !updateModalOverlayRef.current?.contains(target) && !deleteModalOverlayRef.current?.contains(target)) {
        setSelected(null)
      }
    }
  }

  //   close modal when clicked outside
  const handleClickOutsideModal = (modal: string, target: Node): void => {
    // handle update btn clicked
    if (modal === "update" && updateModalOverlayRef.current && updateModalRef.current && updateModalOverlayRef.current.contains(target) && !updateModalRef.current.contains(target)) {
      setShowUpdateModal(false)
    }
    // handle delete btn clicked
    if (modal === "delete" && deleteModalOverlayRef.current && deleteModalRef.current && deleteModalOverlayRef.current.contains(target) && !deleteModalRef.current?.contains(target)) {
      setShowDeleteModal(false)
    }
  }

  // trigger modal side Effect
  useEffect(() => {
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
  }, [showUpdateModal, showDeleteModal])

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

            {/* if we're inside a folder, map it's ancestors as current route */}
            {/* if ancestors.length <=4, show them all */}
            {currentFolder?.ancestors !== undefined &&
              currentFolder.ancestors.length <= 4 &&
              currentFolder?.ancestors.map((a) => (
                <span
                  className="route-link flex align-center"
                  key={a.id}
                  onClick={() => {
                    getFolderDetails(a.id)
                  }}>
                  <span className="route-name">{a.name}</span>
                  <span className="material-symbols-outlined">keyboard_arrow_right</span>
                </span>
              ))}

            {/* if ancestors.length >= 5, show the first one and the last one */}
            {currentFolder?.ancestors !== undefined && currentFolder.ancestors.length >= 5 && (
              <>
                {/* first one */}
                <span
                  className="route-link flex align-center"
                  key={currentFolder.ancestors[0].id}
                  onClick={() => {
                    getFolderDetails(currentFolder.ancestors[0].id)
                  }}>
                  <span className="route-name">{currentFolder.ancestors[0].name}</span>
                  <span className="material-symbols-outlined">keyboard_arrow_right</span>
                </span>
                {/* dots */}
                <span className="flex align-center ">
                  <span className="material-icons">more_horiz</span>
                  <span className="material-symbols-outlined">keyboard_arrow_right</span>
                </span>

                {/* parent of current folder */}
                <span
                  className="route-link flex align-center"
                  key={currentFolder.ancestors[currentFolder.ancestors.length - 1].id}
                  onClick={() => {
                    getFolderDetails(currentFolder.ancestors[currentFolder.ancestors.length - 1].id)
                  }}>
                  <span className="route-name">{currentFolder.ancestors[currentFolder.ancestors.length - 1].name}</span>
                  <span className="material-symbols-outlined">keyboard_arrow_right</span>
                </span>
              </>
            )}
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

        {/* main section begins */}
        {/* if loading, show spinner */}
        {loading && <Spinner />}
        {/* else, show contents of current folder */}
        {!loading && 
        (currentFolder === null || (currentFolder._id === "-1" && !folderContent.length)) ? (
        // for root directory
        <NoFiles />
        ) 
          : folderContent.length ? (
          <div>
            {folderContent.filter((f) => f.type === "folder").length !== 0 && (
              // display folders first
              <>
                <div className="grid-section-heading">Folders</div>
                <div className="folder-grid">
                  {folderContent.map(
                    (f) =>
                      f.type === "folder" && (
                        <div
                          key={f._id}
                          // if selected
                          className={selected && selected._id === f._id ? "grid-item grid-item-selected" : "grid-item"}
                          onDoubleClick={() => {
                            if (f.type === "folder") {
                              setCurrentFolder(f)
                              localStorage.setItem("currentFolder", JSON.stringify(f))
                            }
                          }}
                          onClick={() => {
                            setSelected(f)
                          }}>
                          <OutsideClickHandler
                            onOutsideClick={(e) => {
                              handleClickOutsideSelectedFolder(e.target, f)
                            }}>
                            <span className={"flex align-center"}>
                              <span className="material-icons">folder</span>
                              <span style={{ marginLeft: "15px" }} className="grid-item-name">
                                {f.name.length > 21 ? <>{f.name.slice(0, 20)}...</> : f.name}
                              </span>
                            </span>
                          </OutsideClickHandler>
                        </div>
                      )
                  )}
                </div>
              </>
            )}

            {/* display files */}
            {folderContent.filter((f) => f.type === "file").length !== 0 && (
              <>
                <div className="grid-section-heading">Files</div>

                <div className="folder-grid">
                  {folderContent.map(
                    (f) =>
                      f.type === "file" && (
                        <div
                          key={f._id}
                          // if selected
                          className={selected && selected._id === f._id ? "grid-item grid-item-selected" : "grid-item"}
                          onDoubleClick={() => {
                            console.log(selected?._id)
                            if (f.type === "folder") {
                              setCurrentFolder(f)
                              localStorage.setItem("currentFolder", JSON.stringify(f))
                            }
                          }}
                          onClick={() => {
                            setSelected(f)
                          }}>
                          <OutsideClickHandler
                            onOutsideClick={(e) => {
                              handleClickOutsideSelectedFolder(e.target, f)
                            }}>
                            <span className={"flex align-center"}>
                              <span className="material-icons">description</span>
                              <span style={{ marginLeft: "15px" }} className="grid-item-name">
                                {f.name.length > 21 ? <>{f.name.slice(0, 20)}...</> : f.name}
                              </span>
                            </span>
                          </OutsideClickHandler>
                        </div>
                      )
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <Addons></Addons>

      {/* update file/folder name modal */}
      {showUpdateModal && (
        <div className="modal-overlay flex-center" ref={updateModalOverlayRef}>
          <div className="modal" ref={updateModalRef}>
            <h2 className="modal-heading">Rename</h2>
            <input
              type="text"
              defaultValue={selected?.name}
              onBlur={(e) => {
                setFileRename(e.target.value)
              }}
            />
            <div className="flex justify-end align-center">
              <button
                className="btn-cancel-rename"
                onClick={() => {
                  setShowUpdateModal(false)
                }}>
                {" "}
                Cancel
              </button>
              <button
                id="btn-rename"
                className="btn-rename"
                onClick={() => {
                  if (selected) {
                    triggerUpdate(fileRename, selected)
                    setSelected(null)
                    setShowUpdateModal(false)
                  }
                }}>
                {" "}
                Ok{" "}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete file/folder modal */}
      {showDeleteModal && (
        <div className="modal-overlay flex-center" ref={deleteModalOverlayRef}>
          <div className="modal" ref={deleteModalRef}>
            <h3 className="modal-heading">Are you sure you want to delete "{selected?.name}"?</h3>
            <div className="flex justify-end align-center">
              <button
                className="btn-cancel-rename"
                onClick={() => {
                  setShowDeleteModal(false)
                }}>
                {" "}
                Cancel
              </button>
              <button
                id="btn-rename"
                className="btn-delete"
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
