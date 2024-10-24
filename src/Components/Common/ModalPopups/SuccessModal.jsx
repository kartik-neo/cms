import React, { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";

export const SuccessModal = ({
  title,
  title2,
  showSuccessModal,
  setShowSuccessModal = () => {},
  handleStepChange = () => {},
  step = 1,
  handleResponse=()=>{},
}) => {
  const [showModal, setShowModal] = useState(showSuccessModal);

  useEffect(() => {
    if (showModal === false) {
      setShowSuccessModal(false);
    }
  }, [showModal]);

  const handleClick = () => {
    handleResponse();
    handleStepChange(step + 1);
    setShowModal(false);
  };

  return (
    <>
      {/* <button
        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Success Modal
      </button> */}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-md">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-center p-3 rounded-t"></div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <BsCheckCircle
                    size={"55px"}
                    color="#16a34a"
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-2xl text-center">{title}</h3>
                  <h3 className="text-2xl text-center pt-2">{title2}</h3>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 pb-12 rounded-b">
                  <button
                    className="bg-blue-600 text-white text-md px-8 py-2.5 border border-blue-600 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => handleClick()}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default SuccessModal;
