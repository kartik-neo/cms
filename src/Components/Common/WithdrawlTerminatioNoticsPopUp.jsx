import {
  Dialog,
  Transition,
} from "@headlessui/react";
import { useForm } from "react-hook-form";
import { postTermination } from "../../Services/postTermination";
import LatestModalPopUp from "./LatestModalPopUp";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { useState } from "react";
import UploadMediaCMS from "./UploadMediaCMS";
import SuccessModal from "./ModalPopups/SuccessModal";

const WithdrawlTerminatioNoticsPopUp = ({
  open,
  setOpen,
  aggregatorId,
  globalObjectId,
  mouId,
  contractId,
  contractIdDisplay,
  mouDisplayName,
  aggregatorInsurenceName,
  mou,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: {} });
  const [isOpen, setIsOpen] = useState();
  const [data, setData] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestTypeId, setRequestTypeId] = useState(null);

  // useEffect(() => {
  //   if (dateFrom) {
  //     setValue("startDate", new Date(dateFrom));
  //   }
  //   if (dateTo) {
  //     setValue("endDate", new Date(dateTo));
  //   }
  // }, [dateFrom, dateTo, setValue]);

  // useEffect(() => {
  //   const dateFromVal = moment.unix(watch("startDate")).startOf("day");
  //   const dateToVal = moment.unix(watch("endDate")).startOf("day");
  //   const diffinDays = dateToVal.diff(dateFromVal, "days") / 1000;
  //   setDaysDifference(diffinDays);
  // }, [watch("startDate"), watch("endDate"), getValues]);

  const onSubmit = (data) => {
    setIsOpen(true);
    setData(data);
    
  };

  const handleConfirm = async () => {
    const dataToAdd = {
      // id: 0,
      remarks: data?.remarks,
      mouId: mouId,
      globalObjectId: globalObjectId,
      type: "Withdraw",
      // note: null,
      // isDiscard: false,
      statusId: "1",
      // isActive: false,
      contractId: contractId || null,
      aggregatorId: aggregatorId,
    };
    try {
      const postTerminationData = await postTermination({ data: dataToAdd });
      if (postTerminationData?.success) {
        setIsEdit(true);
        const requestTypeIdVal = postTerminationData?.data
          ? postTerminationData?.data?.slice(1)
          : null;
        setRequestTypeId(requestTypeIdVal);
        setShowPopup(true);
      }
    } catch (error) {
      setValue("isCaptain", false);
      toast.error(error?.response?.data?.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl px-8 pt-8 pb-4">
                {" "}
                {/* Increased max-width */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white">
                    <Dialog.Title
                      as="h2"
                      className="text-2xl mb-8 font-semibold leading-6 text-gray-900"
                    >
                      {/* <ExclamationTriangleIcon
                                    className="h-20 w-20 text-red-600"
                                    aria-hidden="true"
                                /> */}
                      Termination Withdrawal Notice
                    </Dialog.Title>
                    <div className="mt-2">
                      <div className="grid grid-cols-12">
                        <div className="col-span-12 mb-5">
                          {/* <label htmlFor="" className="inline-block text-gray-500 font-medium mb-2">Upload Termination Notice</label> */}
                          <UploadMediaCMS
                            register={register}
                            handleSubmit={handleSubmit}
                            globalObjectId={globalObjectId}
                            // disabled={view}
                            errors={errors}
                            isEdit={isEdit}
                            name="File Upload"
                            mandate={false}
                            uploadFor={"Withdrawal Notice"}
                            id={mouId ?? contractId ?? null}
                            type={mouId ? "MOU" : "Contract"}
                            requestTypeId={requestTypeId}
                            allowedSingleFile={true}
                          />

                          {/* {errors.notice && (
                                          <p className="absolute text-red-500 top-full mt-1">
                                              {errors.notice.message}
                                          </p>
                                      )} */}
                        </div>

                        <div className="col-span-12">
                          <label
                            htmlFor=""
                            className="inline-block text-gray-500 font-medium mb-2"
                          >
                            Remarks
                            <span className="ml-1 text-red-400">*</span>
                          </label>
                          <textarea
                            className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full resize-none"
                            rows="5"
                            {...register("remarks", {
                              required: "This field is required",
                              maxLength: {
                                value: 2000,
                                message:
                                  "Remarks cannot exceed 2000 characters",
                              },
                            })}
                          ></textarea>
                          {errors.remarks && (
                            <p className="text-red-500 mt-1">
                              {errors.remarks.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse justify-center mt-3">
                    <button
                      type="submit"
                      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-8 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-300"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="py-2.5 px-8 me-2 ml-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100"
                      onClick={() => setOpen(false)}
                      data-autofocus
                    >
                      Cancel
                    </button>
                  </div>
                  {isOpen && (
                    <LatestModalPopUp
                      open={isOpen}
                      title={`Are you sure to Post Withdrawal Notice for contract with ${
                        mou ? mouDisplayName : (contractIdDisplay ? contractIdDisplay : aggregatorInsurenceName)
                      } ?`}
                      description={`It will be sent for L1 approval`}
                      // title={"Are you sure do you want to Withdraw details?"}
                      setOpen={setIsOpen}
                      icon={
                        <ExclamationTriangleIcon
                          className="h-20 w-20 text-red-600"
                          aria-hidden="true"
                        />
                      }
                      buttons={[
                        <button
                          type="button"
                          className="py-2.5 px-4 text-md font-medium text-white focus:outline-none bg-blue-600 rounded border border-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:ring-0 w-[100px]"
                          onClick={handleConfirm}
                        >
                          Ok
                        </button>,
                        <button
                          type="button"
                          className="py-2.5 px-4 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:ring-0 w-[100px]"
                          onClick={() => setIsOpen(false)}
                          data-autofocus
                        >
                          Cancel
                        </button>,
                      ]}
                    />
                  )}
                </form>
                {showPopup && (
                  <SuccessModal
                    title="Termination Withdrawal Notice has been created successfully!"
                    showSuccessModal={showPopup}
                    setShowSuccessModal={setShowPopup}
                    handleResponse={() => {
                      if (mouId) {
                        // navigate("/mou-contract-list")
                        window.location.reload();
                      } else {
                        // navigate("/contract-list-terminated")
                        window.location.reload();
                      }
                    }}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WithdrawlTerminatioNoticsPopUp;
