import React, { useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const ModalPopup = ({
  title,
  modalHeading,
  isOpen,
  setIsOpen,
  popUpData,
  codeType,
  type = "WithOutMockDrill",
  entryType = "",
  edit,
  emergencyId,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const navigate = useNavigate();

  return (
    <>
      {/* <button
        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Modal
      </button> */}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{modalHeading}</h3>
                  {/* <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {
                      setShowModal(false)
                      setIsOpen(false)
                    }
                    }
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <IoIosClose color='#000' size={'24px'} />
                    </span>
                  </button> */}
                </div>
                {/*body*/}
                {entryType === "current" && !edit && (
                  <div className="relative p-6 flex-auto">
                    <h3 className="text-2xl flex items-center">
                      <IoIosCheckmarkCircleOutline
                        size={"30px"}
                        color="#16a34a"
                        className="me-4"
                      />
                      <span>{title}</span>
                    </h3>
                    <hr className="my-5" />

                    <table className="border-collapse border border-slate-400 w-full">
                      <thead>
                        <tr>
                          <th className="border border-slate-300 py-2 bg-gray-200 text-center">
                            Emp Code
                          </th>
                          <th className="border border-slate-300 py-2 bg-gray-200 text-center">
                            Emp Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {popUpData?.map((val) => (
                          <tr>
                            <td className="border border-slate-300 py-2 text-center">
                              {val?.empCode}
                            </td>
                            <td className="border border-slate-300 py-2 text-center">
                              {val?.empName}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="bg-blue-600 text-white text-md px-8 py-2.5 border border-blue-600 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setIsOpen(false);
                      !edit
                        ? navigate(
                            `${
                              type === "WithOutMockDrill"
                                ? "/emergency-list"
                                : "/emergency-list-mock"
                            }`
                          )
                        : navigate(
                            `/edit-emergency/${emergencyId}/${codeType}`,
                            {
                              state: {
                                editCancel: true,
                              },
                            }
                          );
                    }}
                  >
                    OK
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
