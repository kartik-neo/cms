import React, { useState } from "react";
import { BsExclamationTriangle } from "react-icons/bs";
import {IoIosClose } from "react-icons/io";
import "../../../App.css";

export const VerifyModal = ({
  title,
  modalHeading,
  isOpen,
  setIsOpen,
  handleDescription,
  verifiedBy,
  setShowSuccessModal,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [description, setDescription] = useState("");
  const maxCharacter = 2000;
  const handleVerify = () => {
    const formData = {
      LoginUserId: 1,
      emergencyId: "1234",
      verifiedBy: verifiedBy,
      verifiedNote: description,
    };
  };

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {modalHeading ? modalHeading : "Alert"}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {
                      setShowModal(false);
                      setIsOpen(false);
                    }}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <IoIosClose color="#000" size={"24px"} />
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <h3 className="text-2xl flex items-center">
                    <BsExclamationTriangle
                      size={"30px"}
                      color="#f59e0b"
                      className="me-4"
                    />
                    <span>{title}</span>
                  </h3>
                  <hr className="my-5" />

                  <div className="form-field relative text-start">
                    <label
                      htmlFor=""
                      className="mb-2 inline-block text-gray-500"
                    >
                      Comment
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      maxLength={maxCharacter}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      rows="4"
                      required
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">
                      {description?.length == 2000
                        ? "Maximum limit reached"
                        : `${
                            maxCharacter - description?.length || 0
                          } characters remaining`}
                    </p>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    type="button"
                    className="py-2.5 px-8 me-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100"
                    onClick={() => {
                      setShowModal(false);
                      setIsOpen(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className={`bg-blue-600 text-white text-md px-8 py-2.5 border border-blue-600 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 ${
                      !description.trim() ? "disabled" : ""
                    }`}
                    type="button"
                    onClick={
                      !description.trim()
                        ? null
                        : () => {
                            setShowModal(false);

                            setIsOpen(false);
                            handleDescription(description);
                            handleVerify();
                            setShowSuccessModal(true);
                          }
                    }
                    disabled={!description.trim()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
