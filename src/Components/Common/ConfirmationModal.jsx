import React from 'react';
import { FaRegCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function ConfirmationModal({ show, setShowConfirmModal, contractName, bodyText,redirectURL }) {
  const Navigate = useNavigate()
  const handleCloseModal = () => {
    setShowConfirmModal(false);
    
  };

  return (
    <div className={show ? "aysModal aysModal-open" : "aysModal"}>
      <div className="aysModal-dialog">
        <div className="aysModal-content">
          <div className="confirm-Modal-header">
            <FaRegCheckCircle size="55px" color="#f59e0b" className="mx-auto mb-4" />

            {/* <button type="button" className="close" onClick={handleCloseModal}>
              <span>&times;</span>
            </button> */}
          </div>
          <div className="text-xl text-center pb-8">
            <p><span style={{ fontWeight: 'bold' }}>{contractName}</span>{bodyText}</p>
          </div>
          <div className="confirm-Modal-footer">
            <button type="button" className="btn btn-primary" onClick={()=>{
              handleCloseModal()
              Navigate(redirectURL)
              }} >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
