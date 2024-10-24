import React, { useEffect, useState } from "react";
import { BsExclamationTriangle } from "react-icons/bs";

const Modal = ({
  approveRejectPayload = {},
  setApproveRejectPayload = () => {},
  confirmationModal = {},
  isOpen,
  onClose,
  onConfirm,
  title,
  title1,
  description,
  currentLevel,
  approver,
  bodyText,
  sendForNextLevel,
  setSendForNextLevel,
  mouAllDetails = {},
  contractName,
  aggregator = false,
  secondDescription,
  approveRejectError="",
  setApproveRejectError=()=>{}
}) => {
  const [error, setError] = useState("");
  const [text, setText] = useState('');
  useEffect(()=>{
    if(approveRejectError){
      setError(approveRejectError)
    }
      },[approveRejectError])


  if (!isOpen) return null;
  const handleCloseModal = () => {
    setText('');
    onClose();
  };

 
  return (
    <div className="modal-overlay z-[12]">
      <div className="modal">
        <div className="relative p-6 flex-auto">
          <BsExclamationTriangle
            size={"55px"}
            color="#f59e0b"
            className="mx-auto mb-4"
          />
          <h1 className="aysModal-title">
                {title1}
              </h1>
          <h3 className="text-2xl text-center">{title}</h3>
        </div>
        {/* <h3 className="text-2xl text-center">{description || ""}</h3>  */}
        <h5 className="text-sm text-center">{secondDescription || ""}</h5>
        {
        !confirmationModal?.reject &&
        <>
         <h3 className="text-2xl text-center">{description || ""}</h3> 
        {
          // confirmationModal?.reject == false &&
          aggregator &&
          currentLevel == 2 &&
          currentLevel != approver?.length &&
          currentLevel < approver?.length ? (
                 <div className=" items-center justify-center mb-4 mt-2 w-full ">
              <input 
              className="mr-2"
                id="sendForNextLevel"
                type="checkbox"
                checked={sendForNextLevel}
                onChange={(event) => {
                  setApproveRejectPayload({...approveRejectPayload,isNextLevelRequired:event.target.checked})
                  setSendForNextLevel(event.target.checked);
                }}
              />
              <span htmlFor="sendForNextLevel" className="text-black w-full ">
                Share for level 3 approval
              </span>
            </div>
          ) 
          : 
          (
          <h4 className="text-2xl text-center my-6"><span style={{fontWeight: 'bold'}}>{contractName}</span>{bodyText}</h4>
          )
        }
          </>}
        {confirmationModal?.reject ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            
            <div className="aysform-group">
            
              <label>Rejection Reason *</label>
              <textarea
                className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full resize-none"
                rows="5"
                value={approveRejectPayload.aggregatorStatus[0].remarks}
                onChange={(e) => {
                  setApproveRejectError("")
                  setError("")
                  if (e.target.value?.length < 2001) {
                    let aggregatorStatus = {
                      ...approveRejectPayload.aggregatorStatus[0],
                      remarks: e.target.value,
                    };
                    setApproveRejectPayload({
                      ...approveRejectPayload,
                      aggregatorStatus: [aggregatorStatus],
                    });
                  } else {
                    setError(
                      "Remarks should be less than or equal to 2000 characters"
                    );
                  }
                }}
              ></textarea>
              <p className="text-red-500">{error || ""}</p>
            </div>
          </div>
        ) : (
          ""
        )}
        <button
          className="bg-blue-600 text-white text-md px-8 py-2.5 border border-blue-600 rounded shadow hover:shadow-lg outline-none 
                    focus:outline-none ease-linear transition-all duration-150"
          onClick={onConfirm}
        >
          Save
        </button>
        <button
          className="py-2.5 px-8 me-2 text-md font-medium text-gray-900 focus:outline-none bg-white 
                    rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 
                    focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 
                    dark:hover:text-white dark:hover:bg-gray-700"
          onClick={handleCloseModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
