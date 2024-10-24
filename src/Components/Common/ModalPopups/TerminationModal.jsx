import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsExclamationTriangle } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";

export const TerminationModal = ({
  title,
  isOpen,
  setIsOpen,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (file) => {
    // Update the validation rule based on file upload status
    const fileIsRequired = !file; // Check if a file is uploaded
    const fileValidationRule = fileIsRequired
      ? { required: "File is required" }
      : {};

    // Register the file input with the updated validation rule
    register("file", fileValidationRule);
  };

  const onSubmit = (data) => {
    // console.log(data);
  };

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
            <div className="relative w-auto my-6 mx-auto">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-200 p-8">
                {/*header*/}
                <div className="flex items-start justify-center p-3 rounded-t">
                  {/*body*/}
                  <div className="flex items-center">
                    <BsExclamationTriangle
                      size={"25px"}
                      color="#f59e0b"
                      className="mx-auto mb-4"
                    />
                    <h3 className="text-2xl text-center">{title}</h3>
                  </div>
                  <div>
                    <p
                      onClick={() => {
                        setShowModal(false);
                        setIsOpen(false);
                      }}
                    >
                      <MdOutlineCancel
                        size={"25px"}
                        color="black"
                        cursor="pointer"
                      />
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex justify-between">
                    <label
                      htmlFor="file"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Termination Notice
                    </label>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      id="file"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      {...register("file", { required: "File is required" })}
                      className="mt-1 block w-full"
                      ref={fileInputRef}
                    />
                    <FiUpload
                      onClick={handleIconClick}
                      className="cursor-pointer text-2xl text-gray-500"
                    />
                    {errors.file && (
                      <span className="text-red-500 text-sm">
                        {errors.file.message}
                      </span>
                    )}
                  </div>

                  <div className="flex item-center gap-4">
                    <h1>Notice Duration</h1>
                    <div>
                      <label
                        htmlFor="fromDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        From Date
                      </label>
                      <input
                        type="date"
                        id="fromDate"
                        {...register("fromDate", {
                          required: "From Date is required",
                        })}
                        className="mt-1 block w-full"
                      />
                      {errors.fromDate && (
                        <span className="text-red-500 text-sm">
                          {errors.fromDate.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="toDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        To Date
                      </label>
                      <input
                        type="date"
                        id="toDate"
                        {...register("toDate", {
                          required: "To Date is required",
                        })}
                        className="mt-1 block w-full"
                      />
                      {errors.toDate && (
                        <span className="text-red-500 text-sm">
                          {errors.toDate.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="days"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Days
                      </label>
                      <input
                        type="number"
                        id="days"
                        {...register("days", { required: "Days is required" })}
                        className="mt-1 block w-20"
                      />
                      {errors.days && (
                        <span className="text-red-500 text-sm">
                          {errors.days.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label
                      htmlFor="reason"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Remark
                    </label>
                    <textarea
                      id="reason"
                      {...register("reason", {
                        required: "Reason is required",
                      })}
                      className="mt-1 block w-full"
                    />
                    {errors.reason && (
                      <span className="text-red-500 text-sm">
                        {errors.reason.message}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center p-6 pb-12 rounded-b">
                    <button
                      type="button"
                      className="py-2.5 px-8 me-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowModal(false);
                        setIsOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 text-white text-md px-8 py-2.5 border border-blue-600 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="submit"
                      // onClick={() => {
                      //   // setShowSuccessModal(true);
                      //   confirmPost();
                      //   setShowModal(false);
                      // }}
                    >
                      Save
                    </button>
                  </div>
                </form>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default TerminationModal;
