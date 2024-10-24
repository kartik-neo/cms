import React, { useState } from 'react';
import { BsExclamationTriangle } from "react-icons/bs";
import { useLocation } from 'react-router-dom';

function AreYouSureModal({ mouContractOrContractDetails,sendForNextLevel,setSendForNextLevel,show, handleClose, title, contractName, bodyText1, bodyText2, handleUserAction, actionButtonName, showTextarea = false }) {
  const [text, setText] = useState('');
  const location = useLocation();

  const {typeOf } = location.state;

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleCloseModal = () => {
    setText('');
    handleClose();
  };

  const handleDynamicActionBtn = () => {
    showTextarea ? handleUserAction(text) : handleUserAction();
  };

 const approvalMatrixLength =  mouContractOrContractDetails?.approvalMatrixModel?.length
 
 const terminationleveSorting = mouContractOrContractDetails?.terminationDetails?.sort((a,b)=>b.id - a.id)
 const level =   typeOf == "Termination" ?  
 terminationleveSorting?.filter((item)=>item?.type == "Terminated")[0]?.terminationApprovalLogs?.sort((a,b)=>b.level - a.level)[0]
  : typeOf == "Withdraw Notice" ? terminationleveSorting?.filter((item)=>item?.type == "Withdraw")[0]?.terminationApprovalLogs?.sort((a,b)=>b.level - a.level)[0] 
  :  mouContractOrContractDetails?.contractApprovalLogs?.sort(
    (a, b) => b.level - a.level
  )[0]



  return (
    <div className={show ? "aysModal aysModal-open" : "aysModal"}>
      <div className="aysModal-dialog">
        <div className="aysModal-content">
          <div className="aysModal-header">
            <span className="aysModal-header-text-icon">
              <BsExclamationTriangle size="25px" color="#f59e0b" className="aystriangleicon" />
              <h1 className="aysModal-title">
                {title}
              </h1>
            </span>
            {/* <button type="button" className="close" onClick={handleCloseModal}>
              <span>&times;</span>
            </button> */}
          </div>
          <div className="aysModal-body">
            {!showTextarea &&
              <>
                <p>{bodyText1}<span style={{fontWeight: 'bold'}}>{contractName}</span></p>
                <br/>
                
                { level?.level == 2 && level?.level < approvalMatrixLength && level?.statusName == "Pending" ? (
                 <div className="flex items-center mb-4 mt-2 w-full ">
                 <input
                   id="sendForNextLevel"
                   type="checkbox"
                   checked={sendForNextLevel}
                   onChange={(event) => {
                    setSendForNextLevel(event.target.checked);
                  }}
                   className="mr-2"
                 />
                 <span htmlFor="sendForNextLevel" className="text-black w-full ">
                   Share for level 3 approval
                 </span>
               </div>
                ):(<p><span style={{fontWeight: 'bold'}}>{contractName}</span>{bodyText2}</p>) }
              </>}
            {showTextarea &&
              <>
                <br />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="aysform-group">
                    <label >Rejection Reason *</label>
                    <textarea
                      className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full resize-none"
                      rows="5"
                      value={text}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </>
              }
          </div>
          <div className="aysModal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="button" className={` btn ${showTextarea && text === "" ? " btn-disable" :" btn-primary"}`} onClick={handleDynamicActionBtn} disabled={showTextarea && text === ""}>
              {actionButtonName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AreYouSureModal;
