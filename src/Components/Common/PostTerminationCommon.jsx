import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import {
  BsArrowClockwise,
  BsCheck,
  BsPlusCircle,
  BsPrinter,
  BsX,
  BsXCircle,
} from "react-icons/bs";
import PostTerminationNotice from "../MOU/PostTerminationNotice";
import WithdrawlTerminatioNoticsPopUp from "./WithdrawlTerminatioNoticsPopUp";
import LatestModalPopUp from "./LatestModalPopUp";
import { useLocation, useNavigate } from "react-router-dom";
import { Termination, Withdrawal } from "../../Services/postTermination";
// import async from 'react-select/dist/declarations/src/async';
// import { toast } from 'react-toastify';
import SuccessModal from "./ModalPopups/SuccessModal";
import { toast, ToastContainer } from "react-toastify";
import {
  contractApproval,
  contractReject,
} from "../../Services/contractServices";
import AreYouSureModal from "./AreYouSureModal";
import ConfirmationModal from "./ConfirmationModal";
import { IoNewspaperOutline } from "react-icons/io5";
import { RiIndeterminateCircleLine } from "react-icons/ri";

const PostTerminationCommon = ({
  globalObjectId,
  mouId,
  dateFrom,
  dateTo,
  contractId,
  setAlert,
  type,
  mouContractOrContractDetails = null,
  contractIdDisplay,
  mou = false,
  name,
  refValue,
  contractType,
  setOpenPreview,
}) => {
  const Navigate = useNavigate();
  const [terminationNotice, setTerminationNotice] = useState(false);
  const [withdrawlTermination, setWithdrawlTermination] = useState(false);
  const [terminate, setTerminate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendForNextLevel, setSendForNextLevel] = useState(false);

  const location = useLocation();

  const [isApprove, setIsApprove] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  let AysBtntype;
  const [openTerminationModal, setOpenTerminationModal] = useState(false);
  const [openWithdrawalModal, setOpenWithdrawalModal] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [isNextRequired, setIsNextRequired] = useState(true);

  const { cameFrom, typeOf } = location.state || {};
  const activeTermination =
    mouContractOrContractDetails?.terminationDetails?.filter(
      (item) => item?.type == "Terminated" && item?.statusName == "Active"
    );
  const activeWithdraw =
    mouContractOrContractDetails?.terminationDetails?.filter(
      (item) => item?.type == "Withdraw" && item?.statusName == "Active"
    );
  const hasTerminationPending =
    mouContractOrContractDetails?.terminationDetails?.filter(
      (item) => item?.statusName == "Pending Approval"
    )?.length
      ? true
      : false;

  const filteredDetail =
    mouContractOrContractDetails?.terminationDetails?.filter(
      (item) =>
        item?.type == "Terminated" && item?.statusName == "Pending Approval"
    )[0];

  const filteredWithdrawDetail =
    mouContractOrContractDetails?.terminationDetails?.filter(
      (item) =>
        item?.type == "Withdraw" && item?.statusName == "Pending Approval"
    )[0];

  const approvelMatrixLength = mouContractOrContractDetails?.approvalMatrixModel?.length;

  const approvalCurrentLevel =
    mouContractOrContractDetails?.contractApprovalLogs?.sort(
      (a, b) => b.level - a.level
    )[0]?.level;

  const terminationCurrentLevel = filteredDetail?.terminationApprovalLogs?.sort(
    (a, b) => b.level - a.level
  )[0]?.level;

  const withdrawCurrentLevel =
    filteredWithdrawDetail?.terminationApprovalLogs?.sort(
      (a, b) => b.level - a.level
    )[0]?.level;


  const handlefunctionTermination = () => {
    setTerminationNotice(true);
  };
  var type;
  if (mouId) {
    type = "Mou";
  } else {
    type = "Contract";
  }

  const handleConfirm = async () => {
    const dataToAdd = {
      mouId: mouId || null,
      type: "Terminated",
      contractId: contractId || null,
      // aggregatorId: aggregatorId || null
      // aggregatorNumber: aggregatorNumber || null
    };

    try {
      const postTerminationData = await Termination({ data: dataToAdd });
      if (postTerminationData?.success) {
        setShowPopup(true);
        // setShowSuccessModal(true);
        // toast.success("Terminate Successfully !", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        // if(mouId){
        //   navigate("/mou-contract-list")
        // }else{
        //   navigate("/contract-list")
        // }
      }
      setTerminate(false);
    } catch (error) {
      toast.error(error?.message || "Termination failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsOpen(false);
    }
  };

  const handleWithdraw = async () => {
    // {
    //   "mouId": 0,
    //   "contractId": 0,
    //   "contractClassifiedId": false,
    //   "aggregatorId": 0,
    //   "aggregatorNumber": 0
    // }
    const dataToAdd = {
      mouId: mouId || null,
      contractId: contractId || null,
      // type: "Terminated",
      aggregatorId: null,
      aggregatorNumber: 0,
    };

    try {
      const postTerminationData = await Withdrawal({ data: dataToAdd });
      if (postTerminationData?.success) {
        setShowWithdrawPopup(true);
        // setShowSuccessModal(true);
        // toast.success("Terminate Successfully !", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        // if(mouId){
        //   navigate("/mou-contract-list")
        // }else{
        //   navigate("/contract-list")
        // }
      }
      setWithdraw(false);
    } catch (error) {
      toast.error(error?.message || "Withdrawal failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
    } finally {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsApprove(false);
  };
  
 

  const handleUserAction = (textData) => {
    let payload = null;
    if (
      typeOf == "Termination"
      // mouContractOrContractDetails?.statusName == "Active" &&
      // mouContractOrContractDetails?.terminationStatuses &&
      // mouContractOrContractDetails?.terminationStatuses[0]?.terminationActive ==
      //   false
    ) {
      const latestData =
        mouContractOrContractDetails?.terminationDetails?.filter(
          (item) =>
            item?.type == "Terminated" && item?.statusName == "Pending Approval"
        )[0];
      payload = {
        contractId: contractId,
        mouId: mouId,
        aggregatorId: null,
        aggregatorNumber: null,
        level: latestData?.terminationApprovalLogs?.sort(
          (a, b) => b.level - a.level
        )[0]?.level,
        remarks: textData ? textData : null,
        // remarks: null,
        requestTypeId: latestData?.tRequestId,
      };
      const level = latestData?.terminationApprovalLogs?.sort(
        (a, b) => b.level - a.level
      )[0];
      let isNextRequired =
        level?.level == 2 && level?.level < approvelMatrixLength
          ? sendForNextLevel
          : level?.level != 2 && level?.level < approvelMatrixLength
          ? true
          : false;
      payload = {
        ...payload,
        isNextLevelRequired: isNextRequired,
      };
      setIsNextRequired(isNextRequired);
      // if (level?.level == 1 && level?.statusName == "Pending") {
      //   payload = { ...payload, isNextLevelRequired: true };
      // }
      // if (level?.level == 2 && level?.statusName == "Pending") {
      //   payload = { ...payload, isNextLevelRequired: sendForNextLevel };
      // }
    } else if (
      typeOf == "Withdraw Notice"
      // (mouContractOrContractDetails?.statusName == "Active" ||
      //   mouContractOrContractDetails?.status == "Active") &&
      // mouContractOrContractDetails?.terminationStatuses?.length &&
      // mouContractOrContractDetails?.terminationStatuses[0]?.terminationActive ==
      //   true
    ) {
     
      payload = {
        contractId: contractId,
        mouId: mouId,
        aggregatorId: null,
        aggregatorNumber: null,
        level: withdrawCurrentLevel,
        remarks: textData ? textData : null,
        // remarks: null,
        requestTypeId: filteredWithdrawDetail?.tRequestId,
      };
      const level = filteredWithdrawDetail?.terminationApprovalLogs?.sort(
        (a, b) => b.level - a.level
      )[0];
      let isNextRequired =
        level?.level == 2 && level?.level < approvelMatrixLength
          ? sendForNextLevel
          : level?.level != 2 && level?.level < approvelMatrixLength
          ? true
          : false;
      payload = {
        ...payload,
        isNextLevelRequired: isNextRequired,
      };
      setIsNextRequired(isNextRequired);
    
    } else {
      const contractApprovalLog = mouContractOrContractDetails
        ?.contractApprovalLogs?.length
        ? mouContractOrContractDetails?.contractApprovalLogs?.sort(
            (a, b) => b.level - a.level
          )[0]
        : null;
      payload = {
        contractId: contractApprovalLog?.contractId
          ? contractApprovalLog?.contractId
          : contractApprovalLog?.id,
        mouId: contractApprovalLog?.mouId ? contractApprovalLog?.mouId : null,
        aggregatorId: contractApprovalLog?.aggregatorId
          ? contractApprovalLog?.aggregatorId
          : null,
        aggregatorNumber: contractApprovalLog?.aggregatorNumber
          ? contractApprovalLog?.aggregatorNumber
          : null,
        level: contractApprovalLog?.level ? contractApprovalLog?.level : null,
        remarks: textData ? textData : null,
        requestTypeId: contractApprovalLog?.requestTypeId
          ? contractApprovalLog?.requestTypeId
          : null,
      };

      const level = mouContractOrContractDetails?.contractApprovalLogs?.sort(
        (a, b) => b.level - a.level
      )[0];
      let isNextRequired =
        level?.level == 2 && level?.level < approvelMatrixLength
          ? sendForNextLevel
          : level?.level != 2 && level?.level < approvelMatrixLength
          ? true
          : false;
      payload = { ...payload, isNextLevelRequired: isNextRequired };
      setIsNextRequired(isNextRequired);

      

      // if (level?.level == 1 && level?.statusName == "Pending") {
      //   payload = { ...payload, isNextLevelRequired: true };
      // }
      // if (level?.level == 2 && level?.statusName == "Pending") {
      //   payload = { ...payload, isNextLevelRequired: sendForNextLevel };
      // }
    }

    const approveContract = async () => {
      try {
        const contractData = await contractApproval(payload);
        if (contractData?.success) {
          setIsApprove(false);
          setOpenTerminationModal(false);
          setOpenWithdrawalModal(false);
          setShowConfirmModal(true);
        } else {
          toast.error("Error while creating Contract", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        toast.error(error.message ?? "Error while creating Contract", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    const rejectContract = async () => {
      
      try {
        const contractData = await contractReject(payload);
        if (contractData?.success) {
          setIsApprove(false);
          setOpenTerminationModal(false);
          setOpenWithdrawalModal(false);
          setShowConfirmModal(true);
        } else {
          toast.error("Error while creating Contract", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        toast.error(error.message ?? "Error while creating Contract", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    showTextarea ? rejectContract() : approveContract(); // showTextarea is boolean which identify which button click
  };

  const handleAreYouSureModalOpen = (btnType) => {
    AysBtntype = btnType;
    setShowTextarea(AysBtntype === "reject");
    if (
      // mouContractOrContractDetails?.statusName == "Active" &&
      typeOf == "Termination"
      // &&
      // mouContractOrContractDetails?.terminationStatuses?.length &&
      // !mouContractOrContractDetails?.terminationStatuses[0]?.terminationActive
    ) {
      setOpenTerminationModal(true);
    } else if (
      typeOf == "Withdraw Notice"
      // mouContractOrContractDetails?.statusName == "Active" &&
      // mouContractOrContractDetails?.terminationStatuses?.length &&
      // mouContractOrContractDetails?.terminationStatuses[0]?.terminationActive
    ) {
      setOpenWithdrawalModal(true);
    } else {
      setIsApprove(true);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />

        <div className="flex justify-start items-center gap-4 my-8">
          {!cameFrom && (
            <>
              <button
                type="button"
                onClick={() => Navigate(-1)}
                className="py-2.5 px-8 text-md font-medium text-gray-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-gray-600 hover:border-gray-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
              >
                <BsXCircle size={"18px"} className="mr-2" />
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setOpenPreview(true)}
                className="py-2.5 px-8 text-md font-medium text-gray-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-gray-600 hover:border-gray-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
              >
                <BsPrinter size={"18px"} className="mr-2" />
                Print
              </button>
            </>
          )}
          {!cameFrom &&
            (mouContractOrContractDetails?.statusName === "Active" ||
              mouContractOrContractDetails?.statusName === "Expired") &&
            // (mouContractOrContractDetails?.statusName === "Active" ||
            //   mouContractOrContractDetails?.status === "Active") &&
            !hasTerminationPending &&
            !mouContractOrContractDetails?.isAddendumCreated && (
              <>
                {!mouContractOrContractDetails?.isRenewalCreated &&
                  (mouContractOrContractDetails?.statusName === "Active" ||
                    mouContractOrContractDetails?.statusName === "Expired") && (
                    <button
                      type="button"
                      onClick={() => setAlert(true)}
                      className="py-2.5 px-8 text-md font-medium text-green-700 focus:outline-none bg-white rounded border border-gray-300 hover:bg-green-600 hover:border-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                    >
                      <BsArrowClockwise size={"18px"} className="mr-2" />
                      Renew
                    </button>
                  )}
              </>
            )}
          {!cameFrom &&
            mouContractOrContractDetails?.statusName === "Active" &&
            // (mouContractOrContractDetails?.statusName === "Active" ||
            //   mouContractOrContractDetails?.status === "Active") &&
            !hasTerminationPending &&
            !mouContractOrContractDetails?.isAddendumCreated && (
              <>
                {
                  // filteredDetail && filteredDetail?.statusName == "Active"
                  activeTermination?.length ? (
                    <button
                      type="button"
                      onClick={() => {
                        setTerminate(true);
                      }}
                      className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                    >
                      <RiIndeterminateCircleLine
                        size={"18px"}
                        className="mr-2"
                      />
                      Terminate {type}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={
                        activeTermination?.length
                        // !mouContractOrContractDetails?.terminationDetails
                        //   ? false
                        //   : filteredDetail?.statusName === "Rejected"
                        //   ? true
                        //   : filteredDetail?.statusName === "Active" &&
                        //     filteredDetail?.isDiscard
                        //   ? false
                        //   : filteredDetail?.statusName === "Active" &&
                        //     !filteredDetail?.isDiscard
                        //   ? true
                        //   : false
                      }
                      onClick={() => handlefunctionTermination()}
                      className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                    >
                      <IoNewspaperOutline size={"18px"} className="mr-2" />
                      Post Termination Notice
                    </button>
                  )
                }
                {/* {!mouContractOrContractDetails?.isAddendumCreated && ( */}
                <button
                  type="button"
                  onClick={() => {
                    type == "Contract"
                      ? Navigate("/add-addendum", {
                          state: {
                            contractType: 2,
                            contractId: contractId,
                            path: "detailScreen",
                            refValue: refValue,
                            cameFrom: "active-contract",
                            contractType: contractType,
                          },
                        })
                      : // ? Navigate("/contract-new?contractType=2", {
                        //     state: {
                        //       contractType: 2,
                        //       contractId: contractId,
                        //       path: "detailScreen",
                        //       refValue: refValue,
                        //     },
                        //   })
                        Navigate(`/edit-mou-contract/${mouId}?edit=true`, {
                          state: { addendum: true },
                        });
                  }}
                  className="py-2.5 px-8 text-md font-medium text-blue-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                >
                  <BsPlusCircle size={"18px"} className="mr-2" />
                  Add Addendum
                </button>
                {/* )} */}

                {activeWithdraw?.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      setWithdraw(true);
                    }}
                    className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                  >
                    <RiIndeterminateCircleLine size={"18px"} className="mr-2" />
                    Withdraw Notice
                  </button>
                ) : (
                  <>
                    {activeTermination?.length ? (
                      <button
                        type="button"
                        disabled={
                          activeWithdraw?.length
                          // !mouContractOrContractDetails?.terminationDetails
                          //   ? false
                          //   : filteredWithdrawDetail?.statusName === "Rejected"
                          //   ? true
                          //   : filteredWithdrawDetail?.statusName === "Active" &&
                          //     filteredWithdrawDetail?.isDiscard
                          //   ? false
                          //   : filteredWithdrawDetail?.statusName === "Active" &&
                          //     !filteredWithdrawDetail?.isDiscard
                          //   ? true
                          //   : false
                        }
                        onClick={() => {
                          setWithdrawlTermination(true);
                        }}
                        className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                      >
                        <IoNewspaperOutline size={"18px"} className="mr-2" />
                        Post Withdraw Notice
                      </button>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </>
            )}

          {cameFrom && cameFrom == "Pending Approval" && (
            <div className="w-full flex items-center gap-2">
              <button
                type="button"
                onClick={() => Navigate(-1)}
                className="py-2.5 px-8 text-md font-medium text-gray-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-gray-600 hover:border-gray-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
              >
                <BsXCircle size={"18px"} className="mr-2" />
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAreYouSureModalOpen("approve")}
                className="py-2.5 pr-8 pl-6 text-md font-medium text-green-700 focus:outline-none bg-white rounded border border-gray-300 hover:bg-green-600 hover:border-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
              >
                <BsCheck size={"20px"} className="mr-2" />
                <span>Approve</span>
              </button>
              <button
                type="button"
                onClick={() => handleAreYouSureModalOpen("reject")}
                className="py-2.5 pr-8 pl-6 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
              >
                <BsX size={"20px"} className="mr-2" />
                <span>Reject</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {isApprove && (
        <AreYouSureModal
          show={isApprove}
          handleClose={handleClose}
          title="Are you Sure?"
          mouContractOrContractDetails={mouContractOrContractDetails}
          setSendForNextLevel={setSendForNextLevel}
          sendForNextLevel={sendForNextLevel}
          // isNextRequired = {sendForNextLevel}
          contractName={
            name == "Contract"
              ? mouContractOrContractDetails?.companyName
              : mouContractOrContractDetails?.contractName
          }
          // bodyText1= {`You are about to approve ${typeOf} for the following contract `}
          bodyText1={`${
            typeOf == "Contract" || mou == true
              ? `You are about to approve the following contract `
              : `You are about to approve ${typeOf} for the following contract `
          }`}
          bodyText2={`${
            approvalCurrentLevel && approvelMatrixLength && approvalCurrentLevel != approvelMatrixLength
              ? ` ${typeOf} will be sent for L${
                  approvalCurrentLevel + 1
                } Approval`
              : ` ${typeOf} will be activated`
          }`}
          handleUserAction={handleUserAction}
          actionButtonName={showTextarea ? "Reject" : "Approve"}
          showTextarea={showTextarea}
        />
      )}

      {openTerminationModal && (
        <AreYouSureModal
          show={openTerminationModal}
          handleClose={() => setOpenTerminationModal(false)}
          title="Are you Sure?"
          mouContractOrContractDetails={mouContractOrContractDetails}
          setSendForNextLevel={setSendForNextLevel}
          sendForNextLevel={sendForNextLevel}
          contractName={
            name == "Contract"
              ? mouContractOrContractDetails?.companyName
              : mouContractOrContractDetails?.contractName
          }
          // bodyText1="You are about to approve the following contract "
          bodyText1={`You are about to approve the ${typeOf} notice for following contract `}
          bodyText2={`${
            terminationCurrentLevel &&
            approvelMatrixLength &&
            terminationCurrentLevel != approvelMatrixLength
              ? ` ${typeOf} will be sent for L${
                  terminationCurrentLevel + 1
                } Approval`
              : ` Termination notice will be activated`
          }`}
          handleUserAction={handleUserAction}
          actionButtonName={showTextarea ? "Reject" : "Approve"}
          showTextarea={showTextarea}
        />
      )}

      {openWithdrawalModal && (
        <AreYouSureModal
          show={openWithdrawalModal}
          handleClose={() => setOpenWithdrawalModal(false)}
          title="Are you Sure?"
          mouContractOrContractDetails={mouContractOrContractDetails}
          setSendForNextLevel={setSendForNextLevel}
          sendForNextLevel={sendForNextLevel}
          contractName={
            name == "Contract"
              ? mouContractOrContractDetails?.companyName
              : mouContractOrContractDetails?.contractName
          }
          bodyText1={`You are about to approve the ${typeOf} for following contract `}
          bodyText2={`${
            withdrawCurrentLevel && approvelMatrixLength && withdrawCurrentLevel != approvelMatrixLength
              ? ` ${typeOf} will be sent for L${
                  withdrawCurrentLevel + 1
                } Approval`
              : ` ${mou ? "Mou" : "Contract"} ${typeOf} will be activated`
          }`}
          handleUserAction={handleUserAction}
          actionButtonName={showTextarea ? "Reject" : "Approve"}
          showTextarea={showTextarea}
        />
      )}

      <ConfirmationModal
        show={showConfirmModal}
        contractName={
          name == "Contract"
            ? mouContractOrContractDetails?.companyName
            : mouContractOrContractDetails?.contractName
        }
        bodyText={` ${mou ? "MOU " : ""} ${
          typeOf == "MOU" ? "" : typeOf
        } has been ${
          showTextarea
            ? "rejected"
            : typeOf === "Termination"
            ? ` L${terminationCurrentLevel} approved.`
            : typeOf === "Withdraw Notice"
            ? ` L${withdrawCurrentLevel} approved.`
            : ` L${approvalCurrentLevel} approved.`
        }
        ${
          isNextRequired == false
            ? `${
                
                  approvalCurrentLevel == approvelMatrixLength ? `${typeOf} activated` :""
              }  successfully!!`
            : ""
        }
        `}
       
        setShowConfirmModal={setShowConfirmModal}
        redirectURL={
          showTextarea
            ? mou
              ? "/mou-contract-list-pending"
              : location?.state?.contractType == "Classified"
              ? "/contract-classified-list-pending"
              : "/contract-list-pending"
            : mou
            ? "/mou-contract-list-pending"
            : location?.state?.contractType == "Classified"
            ? "/contract-classified-list"
            : "/contract-list-pending"
        }
      />
      {withdrawlTermination && (
        <WithdrawlTerminatioNoticsPopUp
          open={withdrawlTermination}
          setOpen={setWithdrawlTermination}
          mouId={mouId}
          contractId={contractId}
          globalObjectId={globalObjectId}
          contractIdDisplay={contractIdDisplay}
          mou={mou}
          mouDisplayName={mouContractOrContractDetails?.contractName}
        />
      )}
      {terminate && (
        <LatestModalPopUp
          open={terminate}
          title={`${
            typeOf == "Contract"
              ? `You are about to terminate the  ${type} with 
          (${mouContractOrContractDetails?.contractId} - ${mouContractOrContractDetails?.companyName} )  
          Are you sure?`
              : `You are about to terminate the  ${type} Contract with 
          (${mouContractOrContractDetails?.mouId} - ${mouContractOrContractDetails?.contractName} )  
          Are you sure?`
          }`}
          // title={`You are about to terminate the fdfdfd ${type} with
          // (${mouContractOrContractDetails?.contractId} - ${mouContractOrContractDetails?.companyName} )
          // Are you sure?`}
          // description={
          //   "(Users will not be allowed to terminated in case Termination notice is still active)"
          // }
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
              Confirm
            </button>,
            <button
              type="button"
              className="py-2.5 px-4 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:text-white focus:ring-0 w-[100px]"
              onClick={() => setTerminate(false)}
              data-autofocus
            >
              Cancel
            </button>,
          ]}
        />
      )}

      {withdraw && (
        <LatestModalPopUp
          open={withdraw}
          title={`${
            typeOf == "Contract"
              ? `You are about to withdraw Termination Notice  with 
          (${mouContractOrContractDetails?.contractId} - ${mouContractOrContractDetails?.companyName} )  
          Are you sure?`
              : `You are about to withdraw Termination Notice  ${type} Contract with 
          (${mouContractOrContractDetails?.mouId} - ${mouContractOrContractDetails?.contractName} )  
          Are you sure?`
          }`}
          // title={`You are about to withdraw the ${type}with (${mouContractOrContractDetails?.contractId} - ${mouContractOrContractDetails?.companyName} )`}
          // description={
          //   "(Users will not be allowed to terminated in case Termination notice is still active)"
          // }
          setOpen={setWithdraw}
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
              onClick={handleWithdraw}
            >
              Confirm
            </button>,
            <button
              type="button"
              className="py-2.5 px-4 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:text-white focus:ring-0 w-[100px]"
              onClick={() => setWithdraw(false)}
              data-autofocus
            >
              Cancel
            </button>,
          ]}
        />
      )}

      {terminationNotice && (
        <PostTerminationNotice
          globalObjectId={globalObjectId}
          mouId={mouId}
          contractId={contractId}
          dateFrom={dateFrom}
          dateTo={dateTo}
          contractIdDisplay={contractIdDisplay}
          open={terminationNotice}
          
          setOpen={setTerminationNotice}
          mou={mou}
          mouDisplayName={mouContractOrContractDetails?.contractName}
        />
      )}
      {showPopup && (
        <SuccessModal
          title="Contract terminated successfully!"
          showSuccessModal={showPopup}
          setShowSuccessModal={setShowPopup}
          handleResponse={() => {
            if (mouId) {
              // Navigate("/mou-contract-list");
              window.location.reload();
            } else {
              // Navigate("/contract-list-terminated");
              window.location.reload();
            }
          }}
        />
      )}

      {showWithdrawPopup && (
        <SuccessModal
          title=" Termination Notice withdrawn successfully!"
          showSuccessModal={showWithdrawPopup}
          setShowSuccessModal={setShowWithdrawPopup}
          handleResponse={() => {
            if (mouId) {
              // Navigate("/mou-contract-list");
              window.location.reload();
            } else {
              // Navigate("/contract-list-terminated");
              window.location.reload();
            }
          }}
        />
      )}
    </>
  );
};

export default PostTerminationCommon;
