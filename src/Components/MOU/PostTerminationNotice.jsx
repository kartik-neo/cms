import {
  Dialog,

  Transition,

} from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import {
  postTermination,
  updatePostTermination,
} from "../../Services/postTermination";
import LatestModalPopUp from "../Common/LatestModalPopUp";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  convertFromUnix,
  convertIntoUnix,
  
  getUnitId,
} from "../../utils/functions";
import { toast } from "react-toastify";
import { useState } from "react";
import UploadMediaCMS from "../Common/UploadMediaCMS";
import { useEffect } from "react";
import moment from "moment/moment";
import SuccessModal from "../Common/ModalPopups/SuccessModal";

const PostTerminationNotice = ({
  open,
  setOpen,
  globalObjectId,
  mouId,
  dateFrom,
  dateTo,
  contractId,
  contractIdDisplay,
  mouDisplayName,
  mou,
  aggregatorId = "",
  editTermination,
  mouContractOrContractDetails,
  terminationIndex,
  aggregatorInsurenceName,
  updateName,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({ defaultValues: {} });


  const [isOpen, setIsOpen] = useState();
  const [data, setData] = useState();
  const [daysDifference, setDaysDifference] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestTypeId, setRequestTypeId] = useState(null);

 

  useEffect(() => {
    if (dateFrom || dateTo) {
      setValue("startDate", moment.unix(dateFrom).toDate());
      if (editTermination) {
        setValue("endDate", moment.unix(dateTo).toDate());
        setValue(
          "remarks",
          mouContractOrContractDetails?.terminationDetails[terminationIndex].remarks
        );
      }
    }
  }, [dateFrom, dateTo, setValue]);

  useEffect(() => {
    const startDate = watch("startDate") || new Date();
    const endDate = watch("endDate");

    if (startDate && endDate) {
      const dateFromVal = moment(startDate).startOf("day");
      const dateToVal = moment(endDate).startOf("day");
      const diffinDays = dateToVal.diff(dateFromVal, "days") + 1;
      setDaysDifference(diffinDays);
    } else {
      setDaysDifference(0);
    }
  }, [watch("startDate"), watch("endDate"), getValues]);

  // useEffect(() => {
  //   // if (dateFrom && dateTo) {
  //   const dateFromVal = moment.unix(watch("startDate")).startOf("day");
  //   const dateToVal = moment.unix(watch("endDate")).startOf("day");
  //   const diffinDays = dateToVal.diff(dateFromVal, "days") / 1000;
  //   // const diffInDays = Math.floor((dateTo - dateFrom) / (1000 * 60 * 60 * 24));
  //   setDaysDifference(diffinDays +1);

  //   // }
  // }, [watch("startDate"), watch("endDate"), getValues]);

  const onSubmit = (data) => {
    setIsOpen(true);
    setData(data);
  };

  const calculateDaysDifference = (endDateUnix) => {
    const currentDateUnix = Math.floor(Date.now() / 1000);
    const differenceInSeconds = endDateUnix - currentDateUnix;
    const differenceInDays = Math.floor(differenceInSeconds / (60 * 60 * 24));
    return differenceInDays;
  };

  const handleConfirm = async () => {
 
    const startDate = data?.startDate
      ? moment(data?.startDate).unix().toString()
      : Math.floor(Date.now() / 1000).toString();

    const dataToAdd = {
      id: editTermination
        ? mouContractOrContractDetails?.terminationDetails[terminationIndex]?.id
        : 0,
      noticeDurationDay: calculateDaysDifference(
        convertIntoUnix(data?.endDate)
        // convertIntoUnix(data?.noticeDurationEnds)
      ),
      startDate: startDate,
      endsDate: convertIntoUnix(data?.endDate),
      remarks: data?.remarks,
      mouId: mouId || null,
      globalObjectId: globalObjectId,
      type: "Terminated",
      note: null,
      isDiscard: false,
      statusId: "1",
      isActive: true,
      aggregatorId: aggregatorId || null,
      tRequestId: null,
      contractId: contractId || null,
    };
    const editDataToAdd = {
      id: editTermination
        ? mouContractOrContractDetails?.terminationDetails[terminationIndex]?.id
        : 0,
      noticeDurationDay: calculateDaysDifference(
        // convertIntoUnix(data?.noticeDurationEnds)
        convertIntoUnix(data?.endDate)
      ),
      startDate: startDate,
      endsDate: convertIntoUnix(data?.endDate),
      remarks: data?.remarks,
      mouId: mouId || null,
      globalObjectId: globalObjectId,
      type: "Terminated",
      aggregatorId: aggregatorId || null,
      tRequestId:
        mouContractOrContractDetails?.terminationDetails[terminationIndex]?.tRequestId,
      contractId: contractId || null,
    };

    try {
      const postTerminationData = editTermination
        ? await updatePostTermination({ data: editDataToAdd })
        : await postTermination({ data: dataToAdd });
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
      <Dialog
        className="relative z-10"
        onClose={() => {
          if (aggregatorId) {
            setOpen();
          } else {
            setOpen(false);
          }
        }}
      >
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
                      {editTermination
                        ? "Edit Termination Notice for L2"
                        : "Contract Termination Notice"}
                    </Dialog.Title>
                    <div className="mt-2">
                      <div className="grid grid-cols-12">
                        <div className="col-span-12 mb-5">
                          {/* <label htmlFor="" className="inline-block text-gray-500 font-medium mb-2">Upload Termination Notice</label> */}
                          {editTermination ? (
                            <UploadMediaCMS
                              register={register}
                              handleSubmit={handleSubmit}
                              globalObjectId={globalObjectId}
                              disabled={true}
                              errors={errors}
                              name={"Termination Notice"}
                              mandate={true}
                              uploadFor={"Termination Notice"}
                              isVisible={true}
                              id={contractId ? contractId : mouId}
                              type={mouId ? "MOU" : "Contract"}
                              requestTypeId={mouContractOrContractDetails?.terminationDetails[terminationIndex].tRequestId?.slice(
                                1
                              )}
                              allowedSingleFile={true}
                            />
                          ) : (
                            <UploadMediaCMS
                              register={register}
                              handleSubmit={handleSubmit}
                              globalObjectId={globalObjectId}
                              disabled={false}
                              errors={errors}
                              isEdit={isEdit}
                              name="Upload Termination Notice"
                              mandate={false}
                              uploadFor={"Termination Notice"}
                              id={mouId ?? contractId ?? null}
                              type={mouId ? "MOU" : "Contract"}
                              requestTypeId={requestTypeId}
                              allowedSingleFile={true}
                            />
                          )}

                          {/* <input
                                          type="file"
                                          className="block w-full border border-gray-300 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-200 file:border-0 file:me-4 file:py-3 file:px-4 cursor-pointer"
                                          {...register("notice", {
                                              required: "File upload is required",
                                          })}
                                      /> */}
                          {/* {errors.notice && (
                            <p className="absolute text-red-500 top-full mt-1">
                              {errors.notice.message}
                            </p>
                          )} */}
                        </div>

                        <div className="col-span-12 mb-5">
                          <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-4">
                              <label
                                htmlFor=""
                                className="inline-block text-gray-500 font-medium mb-2"
                              >
                                Start Date{" "}
                                <span className="ml-1 text-red-400">*</span>
                              </label>
                              <div className="col-span-5">
                                {/* <label htmlFor="" className="inline-block text-gray-500 font-medium mb-2">Ends</label> */}
                                <Controller
                                  name={`startDate`}
                                  control={control}
                                  rules={{ required: "Start date is required" }}
                                  render={({ field }) => (
                                    <DatePicker
                                      className="form-input border-gray-300 shadow-sm rounded-md w-full"
                                      selected={field.value}
                                      onChange={(date) => field.onChange(date)}
                                      minDate={moment.unix(dateFrom).toDate()}
                                      maxDate={moment.unix(dateTo).toDate()}
                                      // minDate={convertFromUnix(dateFrom)}
                                      // maxDate={convertFromUnix(dateTo)}
                                      placeholderText="Select to date"
                                      dateFormat="dd/MM/yyyy"
                                    />
                                  )}
                                />
                                {errors.startDate && (
                                  <p className="text-red-500 mt-1">
                                    {errors.startDate.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="col-span-4">
                              <label
                                htmlFor=""
                                className="inline-block text-gray-500 font-medium mb-2"
                              >
                                End Date{" "}
                                <span className="ml-1 text-red-400">*</span>
                              </label>
                              <Controller
                                name="endDate"
                                control={control}
                                rules={{ required: "End date is required" }}
                                render={({ field }) => (
                                  <DatePicker
                                    className="form-input border-gray-300 shadow-sm rounded-md w-full"
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    minDate={
                                      watch("startDate") ||
                                      convertFromUnix(dateFrom)
                                    }
                                    maxDate={dateTo && convertFromUnix(dateTo)}
                                    placeholderText="Select to date"
                                    dateFormat="dd/MM/yyyy"
                                  />
                                )}
                              />
                              {errors.endDate && (
                                <p className="text-red-500 mt-1">
                                  {errors.endDate.message}
                                </p>
                              )}
                            </div>
                            <div className="col-span-4">
                              <label
                                htmlFor=""
                                className="inline-block text-gray-500 font-medium mb-2"
                              >
                                {" "}
                                Duration in Days
                              </label>

                              <input
                                type="text"
                                value={daysDifference || ""}
                                readOnly
                                className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                              />
                              {/* <input
                                                      type="text"
                                                      className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                                                      {...register("noticeDurationDayOrMonth", {
                                                          required: "Duration is required",
                                                      })}
                                                  /> */}
                            </div>
                            {errors.noticeDurationDayOrMonth && (
                              <p className="text-red-500 mt-1">
                                {errors.noticeDurationDayOrMonth.message}
                              </p>
                            )}
                            {errors.noticeDurationType && (
                              <p className="text-red-500 mt-1">
                                {errors.noticeDurationType.message}
                              </p>
                            )}
                          </div>
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
                            disabled={editTermination ? true : false}
                            className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full resize-none"
                            rows="5"
                            {...register("remarks", {
                              required: "This field is required",
                              maxLength: {
                                value: 2000,
                                message:
                                  "Remarks can not exceed 2000 characters",
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
                      title={
                        editTermination
                          ? `Are you sure to update the Post Termination Notice for contract with 
                          ${
                            mou
                              ? mouDisplayName
                              : contractIdDisplay
                              ? contractIdDisplay
                              : aggregatorInsurenceName
                          } 
                          ?`
                          : `Are you sure to Post Termination Notice for contract with ${
                              mou
                                ? mouDisplayName
                                : contractIdDisplay
                                ? contractIdDisplay
                                : aggregatorInsurenceName
                            } ?`
                      }
                      description={`${
                        editTermination ? "" : "It will be sent for L1 approval"
                      }`}
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
                    title={
                      editTermination
                        ? "Termination Notice has been updated successfully!"
                        : "Termination Notice has been created successfully!"
                    }
                    showSuccessModal={showPopup}
                    setShowSuccessModal={setShowPopup}
                    handleResponse={() => {
                      if (mouId) {
                        // navigate("/mou-contract-list");
                        window.location.reload();
                      } else {
                        // navigate("/contract-list");
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

export default PostTerminationNotice;
