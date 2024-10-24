import React, { useState } from "react";
import { BsExclamationTriangle } from "react-icons/bs";

export const AlertModal = ({
  title,
  isOpen,
  setIsOpen,
  confirmPost,
  updateName,
  extraTitle,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  return (
    <>
      {/* <button
        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Alert Modal
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
                  <BsExclamationTriangle
                    size={"55px"}
                    color="#f59e0b"
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-2xl text-center">{title}</h3>
                </div>
                <div className="mt-2">
                  <h4 className="text-xl text-center">
                    {extraTitle ? extraTitle : ""}
                  </h4>
                </div>
               
                {/*footer*/}

                <div className="flex items-center justify-center p-6 pb-12 rounded-b">
                  <button
                    type="button"
                    className="py-2.5 px-8 me-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      setShowModal(false);
                      setIsOpen(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="bg-blue-600 text-white text-md px-8 py-2.5 border border-blue-600 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={(e) => {
                      // setShowSuccessModal(true);
                      confirmPost(e);
                      setShowModal(false);
                    }}
                  >
                    {updateName ? updateName : "Confirm"}
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

export default AlertModal;
