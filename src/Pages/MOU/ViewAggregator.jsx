import React, { useContext, useEffect, useState } from "react";
import StepperBar from "../../Components/Common/StepperBar";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Aggregator from "./Aggregator";
import AuditLogs from "../../Components/Common/AuditLogs";


import {
  getAggregatorById,
  submitApprovRejectStatus,
} from "../../Services/mouServices";
import { ToastContainer, toast } from "react-toastify";
import {
  
  convertFromUnix,
  convertIntoUnix,
  userDetails,
} from "../../utils/functions";
import PostTerminationNotice from "../../Components/MOU/PostTerminationNotice";
import {
  bifurcateAggregatorApprovalStatus,
  bifurcateWithdrawalStatuse,
  convertFromUnix1,
  formatDateString,
  makeItProperObject,
  } from "../../utils/other";
import PageTitle from "../../Components/Common/PageTitle";
import {
  BsCheck,
  BsChevronRight,
  BsX,
  BsXCircle,
} from "react-icons/bs";
import UploadMediaCMS from "../../Components/Common/UploadMediaCMS";
import SuccessModal from "../../Components/Common/ModalPopups/SuccessModal";
import Modal from "../../Components/Modal";
import { TETooltip } from "tw-elements-react";
import { FiEdit } from "react-icons/fi";
import UserContext from "../../context/UserContext";

const ViewAggregator = () => {
  const navigate = useNavigate();
  const { mouId, aggregatorId } = useParams();
  const location = useLocation();
  const { type } = location.state || {};

  const [mouName, setMouName] = useState();
  const [breadCrumb, setBreadCrumb] = useState();

  const [mouStatuses, setMouStatuses] = useState([]);

  const [creditCompany, setCreditCompany] = useState();

  const [mouAllDetails, setMouAllDetails] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [approvalSuccessModal, setApprovalSuccessModal] = useState(false);
  const [approveRejectPayload, setApproveRejectPayload] = useState();
  const [approvalApproveRejectPayload, setApprovalApproveRejectPayload] =
    useState();
  const { isAdmin } = useContext(UserContext);
  const [sendForNextLevel, setSendForNextLevel] = useState(false);
  const [currentLevel, setCurrentLevel] = useState();
  const [currentApprover, setCurrentApprover] = useState();
  const [approver, setApprover] = useState();
  const [requestTypeId, setRequestTypeId] = useState();
  const [postTerminationPopUp, setPostTerminationPopUp] = useState(false);
  const [isNextLevel, setIsNextLevel] = useState(false);
  const [MOUDetail, setMOUDetail] = useState();
  const [terminationNotice, setTerminationNotice] = useState(false);
  const [showEditTermination, setShowEditTermination] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    status: false,
    reject: false,
  });
  const [approverMetrixLength, setApproverMetrixLength] = useState();
  const [approvalConfirmationModal, setApprovalConfirmationModal] = useState({
    status: false,
    reject: false,
  });
  const [approveRejectError, setApproveRejectError] = useState("");
  const userDetail = userDetails();

  const getAggregatorDetails = async (mouId, aggregatorId) => {
    try {
      const aggregatorDetail = await getAggregatorById({
        id: mouId,
        AggregatorId: aggregatorId,
      });
      if (aggregatorDetail?.success && aggregatorDetail?.data?.length) {
        const defaultValue = makeItProperObject(aggregatorDetail?.data[0], 3);
        const aggregator = defaultValue?.aggregators?.length
          ? defaultValue?.aggregators[0]
          : {};
        setMouName(aggregatorDetail?.data[0]?.mouId);
        setMOUDetail(aggregator);
        setCreditCompany({
          label: aggregatorDetail?.data[0]?.contractName,
          value: aggregatorDetail?.data[0]?.creditCompanyId,
        });
        const terminationData = aggregator?.terminationDetails?.filter(
          (item) =>
            (item?.type == "Terminated" || item?.type == "Withdraw") &&
            item?.statusName == "Pending Approval"
        );
        // const terminationCurrentLevel = terminationData?.terminationAggregatorApprovalLogs?.sort(
        //   (a, b) => b.level - a.level
        // )[0]?.level;

        const dataToSend = terminationData?.length
          ? terminationData[0]
          : aggregatorDetail?.data[0]?.mouAggregatorDetail[0];

        const detail = terminationData?.length
          ? terminationData[0]
          : aggregatorDetail?.data[0];
        let typeOf =
          terminationData?.length && terminationData[0]?.type == "Withdraw"
            ? "Withdraw"
            : terminationData?.length &&
              terminationData[0]?.type == "Terminated"
            ? "Termination"
            : "";
        const statuses =
          aggregator?.statusName == "Pending Approval"
            ? bifurcateAggregatorApprovalStatus(
                aggregator?.contractAggregatorApprovalLogs,
                aggregator?.createdBy,
                aggregator?.createdOn,
                aggregator?.statusName,
                aggregator?.unixvalidityTo,
                true,
                aggregator?.contractStatusTypeName
              )
            : bifurcateWithdrawalStatuse(
                dataToSend,
                detail?.createdBy,
                detail?.createdOn,
                detail?.statusName,
                typeOf,
                terminationData[0]?.endsDate,
                aggregator?.contractStatusTypeName
              );

        setMouStatuses(statuses);

        // setMouStatuses(statuses);

        if (aggregator?.statusName == "Pending Approval") {
          const currentLevel = aggregator?.contractAggregatorApprovalLogs?.sort(
            (a, b) => b?.level - a.level
          )[0]?.level;
          const approverMetrixLength = aggregator?.approvalMatrixModel?.length;
          const approver = aggregator?.approvalMatrixModel?.filter(
            (item) => item?.isActive == true
          );

          let isNextRequired =
            currentLevel == 2 && currentLevel < approver?.length
              ? sendForNextLevel
              : currentLevel == 2 && currentLevel == approver?.length
              ? false
              : currentLevel && currentLevel < approver?.length
              ? true
              : false;
          const currentApprover = approver?.find(
            (item) => item?.level == currentLevel
          );

          setIsNextLevel(isNextRequired);
          setCurrentLevel(currentLevel);
          setCurrentApprover(currentApprover);
          setApproverMetrixLength(approverMetrixLength);
          setApprover(approver);
          setRequestTypeId(null);
        } else {
          const currentLevel =
            dataToSend?.terminationAggregatorApprovalLogs?.sort(
              (a, b) => b?.level - a.level
            )[0]?.level;
          const pendingAggregators =
            aggregatorDetail?.data[0]?.mouAggregatorDetail[0];
          const approverMetrixLength = aggregator?.approvalMatrixModel?.length;
          const approver = pendingAggregators?.approvalMatrixModel?.filter(
            (item) => item?.isActive == true
          );

          let isNextRequired =
            currentLevel == 2 && currentLevel < approver?.length
              ? sendForNextLevel
              : currentLevel == 2 && currentLevel == approver?.length
              ? false
              : currentLevel && currentLevel < approver?.length
              ? true
              : false;

          const currentApprover = approver?.find(
            (item) => item?.level == currentLevel
          );
          setIsNextLevel(isNextRequired);
          setCurrentLevel(currentLevel);
          setCurrentApprover(currentApprover);
          setApproverMetrixLength(approverMetrixLength);
          setApprover(approver);
          setRequestTypeId(detail?.tRequestId);
        }
      }
    } catch (error) {
      toast.error(
        error.message ?? "Error while fetching mou contract details",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };

  useEffect(() => {
    if (aggregatorId) {
      getAggregatorDetails(mouId, aggregatorId);
    }
  }, [aggregatorId, mouId]);

  const handleApprovalApproveRejectStatus = (reject) => {
    const payload = {
      mouId: mouId,
      aggregatorStatus: [
        {
          aggregatorId: aggregatorId,
          remarks: "",
          requestTypeId: requestTypeId || null,
          status: reject ? 3 : 2,
          //   note: string"
        },
      ],
      level: currentLevel,
      isNextLevelRequired:
        currentLevel == 2 && currentLevel < approver?.length
          ? sendForNextLevel
          : currentLevel == 2 && currentLevel == approver?.length
          ? false
          : currentLevel && currentLevel < approver?.length
          ? true
          : false,
      // isNextLevelRequired:
      //   currentLevel == 2 && currentLevel < approverMetrixLength
      //     ? sendForNextLevel
      //     : currentLevel != 2 && currentLevel < approverMetrixLength
      //     ? true
      //     : false,
    };

    setApprovalApproveRejectPayload(payload);
    setApprovalConfirmationModal({ status: true, reject: reject });
  };

  const SendApprovalApproveRejectStatus = async () => {
    const isError =
      approvalApproveRejectPayload?.aggregatorStatus[0]?.status == 3 &&
      !approvalApproveRejectPayload?.aggregatorStatus[0]?.remarks;
    if (isError) {
      setApproveRejectError("Remarks required");
    } else {
      try {
        const response = await submitApprovRejectStatus(
          approvalApproveRejectPayload
        );
        if (response?.success) {
          setApprovalSuccessModal({
            status: true,
            reject: approvalConfirmationModal?.reject,
          });
          setApprovalConfirmationModal({ status: false, reject: false });
        }
      } catch (error) {
        toast.error(
          error.message || "Error while submitting approval/rejection status",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
    }
  };
  const handleApproveRejectStatus = (reject) => {
    const payload = {
      mouId: mouId,
      aggregatorStatus: [
        {
          aggregatorId: aggregatorId,
          remarks: "",
          requestTypeId: requestTypeId,
          status: reject ? 3 : 2,
          //   note: string"
        },
      ],
      level: currentLevel,
      isNextLevelRequired:
        currentLevel == 2 && currentLevel < approver?.length
          ? sendForNextLevel
          : currentLevel == 2 && currentLevel == approver?.length
          ? false
          : currentLevel && currentLevel < approver?.length
          ? true
          : false,
    };

    setApproveRejectPayload(payload);
    setConfirmationModal({ status: true, reject: reject });
  };
  const SendApproveRejectStatus = async () => {
    try {
      const response = await submitApprovRejectStatus(approveRejectPayload);
      if (response?.success) {
        setConfirmationModal({
          status: false,
          reject:
            approveRejectPayload?.aggregatorStatus[0]?.status == 3
              ? true
              : false,
        });
        setSuccessModal(true);
      }
    } catch (error) {
      toast.error(
        error.message || "Error while submitting approval/rejection status",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };
  useEffect(() => {
    let value;
    if (type == "Pending Approval") {
      value = "pending";
    } else if (type == "Terminate") {
      value = "terminated";
    } else if (type == "Reject") {
      value = "rejected";
    } else if (type == "Active") {
      value = "active";
    } else {
      value = "";
    }
    setBreadCrumb([
      {
        route:
          value == "" ? "/mou-contract-list" : `/mou-contract-list-${value}`,
        name: `Mou List ${type}`,
      },
      {
        route: "",
        name: `Mou Contract ${mouName}`,
      },
    ]);
  }, [mouName]);
  useEffect(() => {
    if (MOUDetail) {
      let result = MOUDetail?.terminationDetails;
      if (Array.isArray(result)) {
        const firstObject = result[0];
        const firstApprovalLog =
          firstObject?.terminationAggregatorApprovalLogs &&
          firstObject?.terminationAggregatorApprovalLogs[0];
        const currentLevelStatus =
          firstApprovalLog &&
          firstApprovalLog?.level == 2 &&
          firstApprovalLog?.statusName == "Pending";
        if (currentLevelStatus) {
          setShowEditTermination(true);
        }
      }
    }
  }, [MOUDetail]);
  return (
    <div>
      <ToastContainer />

      <PageTitle
        title={`Mou Contract ${mouName}`}
        buttonTitle="sdcnkn"
        breadCrumbData={breadCrumb}
        bg={true}
      />
      <div className="mb-4">
        <StepperBar data={mouStatuses} step={1} />
      </div>

      <div className="grid grid-cols-12 py-4 px-4 bg-white shadow ">
        <div className="col-span-12">
          <p className="text-xl font-semibold">Aggregator - {aggregatorId}</p>
        </div>
      </div>

      <div className="bg-white shadow relative p-4 rounded-b mb-5">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor="creditCompany"
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Credit Company
            </label>
            <p className="text-lg font-medium">{creditCompany?.label}</p>
          </div>
        </div>
      </div>

      <div className="bg-white px-5 py-4 shadow relative rounded-b flex flex-col gap-y-4">
        {/*---------AGGREGATOR DETAILS SECTION------------ */}

        <>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Insurance Company
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.insuranceCompany?.label || "--"}
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5 ">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Contract Segment</p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                OP
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.op ? "Yes" : MOUDetail?.op == false ? "No" : "-"}
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                IP
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.ip ? "Yes" : MOUDetail?.ip == false ? "No" : "-"}
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Hc
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.hc ? "Yes" : MOUDetail?.hc == false ? "No" : "-"}
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Netralaya
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.netralaya
                  ? "Yes"
                  : MOUDetail?.netralaya == false
                  ? "No"
                  : "-"}
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5 ">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Co-Payment</p>
            </div>
            <div className="col-span-12">
              <label for="" class="inline-block text-gray-500 text-lg mb-2">
                Co-Payment in %
              </label>
              <p className="text-lg font-medium flex justify-between gap-2">
                {MOUDetail?.coPaymentInPercent
                  ? MOUDetail?.coPaymentInPercent?.charAt(0).toUpperCase() +
                    MOUDetail?.coPaymentInPercent.slice(1)
                  : ""}
              </p>
            </div>
            <div className="col-span-8">
              <p className="text-lg font-medium flex justify-between gap-2 w-full">
                {MOUDetail?.coPaymentInPercent && (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th></th>
                        <th className="font-medium">Employee</th>
                        <th className="font-medium">Dependant</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2">OP </td>
                        <td className="px-3 py-2 text-center">
                          {MOUDetail?.opCoPaymentEmployee || "--"}{" "}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {MOUDetail?.opCoPaymentDependant || "--"}{" "}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">IP </td>
                        <td className="px-3 py-2 text-center">
                          {MOUDetail?.ipCoPaymentEmployee || "--"}{" "}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {MOUDetail?.ipCoPaymentDependant || "--"}{" "}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">HC </td>
                        <td className="px-3 py-2 text-center">
                          {MOUDetail?.hcCoPaymentEmployee || "--"}{" "}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {MOUDetail?.hcCoPaymentDependant || "--"}{" "}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Netralaya </td>
                        <td className="px-3 py-2 text-center">
                          {MOUDetail?.netralayaCoPaymentEmployee || "--"}{" "}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {MOUDetail?.netralayaCoPaymentDependant || "--"}{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5 ">
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <p className="text-xl font-semibold">Validity</p>
              <div className="grid grid-cols-12 gap-x-8 mt-4">
                <div className="col-span-6">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    From
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetail?.validityDateFrom
                      ? formatDateString(MOUDetail?.validityDateFrom)
                      : "--"}
                  </p>
                </div>
                <div className="col-span-6">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    To
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetail?.validityDateTo
                      ? formatDateString(MOUDetail?.validityDateTo)
                      : "--"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <p className="text-xl font-semibold">Renewal Date</p>
              <div className="grid grid-cols-12 gap-x-8 mt-4">
                <div className="col-span-6">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    From
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetail?.renewalFrom
                      ? formatDateString(MOUDetail?.renewalFrom)
                      : "--"}
                  </p>
                </div>
                <div className="col-span-6">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    To
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetail?.renewalTo
                      ? formatDateString(MOUDetail?.renewalTo)
                      : "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Discount on Tariff</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Tariff
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.discountTariff?.label}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Transaction Year
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.discountTransactionYear}
              </p>
            </div>
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-6 md:col-span-2">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    OP
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetail?.opDiscount || ""} {MOUDetail?.opDiscount && "%"}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    IP
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetail?.ipDiscount || ""} {MOUDetail?.ipDiscount && "%"}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    HC
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetail?.hcDiscount || ""} {MOUDetail?.hcDiscount && "%"}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    Netralaya
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetail?.netralayaDiscount || ""}{" "}
                    {MOUDetail?.netralayaDiscount && "%"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Approval Documents</p>
            </div>
            <div className="col-span-12">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Documents
              </label>
              <ul className="grid grid-cols-12">
                {MOUDetail?.approvalDocuments?.map((item) => (
                  <li className="col-span-12 md:col-span-2 text-lg inline-flex items-center font-medium gap-2">
                    <BsChevronRight /> <span>{item?.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="my-3" />
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Attachments</p>
            </div>
            <div className="col-span-6">
              <UploadMediaCMS
                // register={register}
                // handleSubmit={handleSubmit}
                globalObjectId={MOUDetail?.globalObjectId}
                disabled={true}
                // errors={errors}
                name={""}
                mandate={false}
                uploadFor={
                  MOUDetail?.contractStatusTypeName == "Addendum"
                    ? "Aggregator Addendum Document"
                    : MOUDetail?.contractStatusTypeName == "Renewal"
                    ? "Aggregator Renewal Document"
                    : "Aggregator Document"
                }
                id={MOUDetail?.aggregatorId}
                aggregatorReference={MOUDetail?.aggregatorReference}
                aggregatorId={MOUDetail?.aggregatorId}
                type="Aggregator"
                uuidVal={`aggregator_${aggregatorId}`}
              />
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Patient Deposit
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.patientDeposit == "yes"
                  ? "Yes"
                  : MOUDetail?.patientDeposit == "no"
                  ? "No"
                  : ""}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Patient Deposit In Rupees
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.patientDepositInRupees || "-"}{" "}
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-y-5 gap-x-8">
            <div className="col-span-12">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Non Admissable Material / Service
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.nonAdmissableService == "yes"
                  ? "Yes"
                  : MOUDetail?.nonAdmissableService == "no"
                  ? "No"
                  : ""}
              </p>
              {MOUDetail?.nonAdmissableService == "yes" ? (
                <ul className="grid grid-cols-12 mt-3">
                  {MOUDetail?.naMaterialService?.map((item) => (
                    <li className="col-span-12 md:col-span-3 text-lg inline-flex items-center font-medium gap-2">
                      <BsChevronRight /> <span>{item?.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Payment Terms
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.paymentTerms} Days
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Physical Document Details</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Employee Name
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.custodianName?.label}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                File Location
              </label>
              <p className="text-lg font-medium">
                {MOUDetail?.fileLocation?.label}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Add Details
              </label>
              <p className="text-lg font-medium">{MOUDetail?.addDetails}</p>
            </div>
          </div>
        </>
        {/*---------AGGREGATOR DETAILS SECTION ENDS HERE------------ */}
        {/* ----------------AGGREGATOR STATUS SECTION ---------------- */}
        {MOUDetail?.terminationDetails && (
          <div>
            {MOUDetail?.terminationDetails?.map((item, index) => (
              <React.Fragment key={index}>
                <div className="bg-white border-2 border-gray-400 relative p-4 rounded mt-5">
                  <div className="grid grid-cols-12 gap-x-8 gap-y-5">
                    <div className="col-span-12">
                      <div className="flex items-center justify-between relative">
                        <label className="inline-block text-xl font-semibold">
                          {item?.type} Notice
                        </label>
                        <label className="inline-block text-gray-500 font-medium mb-1 justify-end mr-10">
                          Approval Status -{" "}
                          <span className="font-semibold text-gray-800">
                            {item?.statusName == "Active"
                              ? "Approved"
                              : item?.statusName}
                          </span>
                        </label>
                        {item?.terminationAggregatorApprovalLogs?.length && 
                        item?.terminationAggregatorApprovalLogs?.filter((itm)=>itm?.level == 2 && itm?.statusName == "Pending")?.length
                         ? (
                          <TETooltip title={"Edit termination"} className="absolute top-0 right-0">
                            <FiEdit
                              className="text-xl"
                              onClick={() => {
                                setTerminationNotice({
                                  status:true,
                                  dateFrom:convertFromUnix(item?.startDate),
                                  dateTo:convertFromUnix(item?.endsDate),
                                  index:index
                                })
                              }}
                            />
                          </TETooltip>
                        ):""}
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <UploadMediaCMS
                        // register={()=>{}}
                        // handleSubmit={()=>{}}
                        globalObjectId={item?.globalObjectId}
                        disabled={true}
                        // errors={errors}
                        name={`${
                          item?.type == "Terminated"
                            ? "Termination"
                            : item?.type == "Withdraw"
                            ? "Withdrawal"
                            : ""
                        }`}
                        mandate={true}
                        uploadFor={
                          item?.type == "Terminated"
                            ? "Termination Notice"
                            : item?.type == "Withdraw"
                            ? "Withdrawal Notice"
                            : ""
                        }
                        id={item?.id}
                        type={item?.type}
                        // requestTypeId={item?.tRequestId?.slice(1)}
                        requestTypeId={item?.id}
                        isVisible={false}
                      />
                    </div>
                    {item?.type != "Withdraw" ? (
                      <>
                        <div className="col-span-12 md:col-span-4">
                          <label
                            htmlFor=""
                            className="inline-block text-gray-500 text-lg mb-1"
                          >
                            Start Date
                          </label>
                          <p className="text-lg font-medium">
                            {item?.startDate
                              ? convertFromUnix1(item?.startDate)
                              : ""}
                          </p>
                        </div>
                        <div className="col-span-12 md:col-span-4">
                          <label
                            htmlFor=""
                            className="inline-block text-gray-500 text-lg mb-1"
                          >
                            End Date
                          </label>
                          <p className="text-lg font-medium">
                            {item?.endsDate
                              ? convertFromUnix1(item?.endsDate)
                              : ""}
                          </p>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div
                      className={`${
                        item?.type == "Withdraw" ? "col-span-8" : "col-span-12"
                      }`}
                    >
                      <label
                        htmlFor=""
                        className="inline-block text-gray-500 font-medium mb-1"
                      >
                        Remark
                      </label>
                      <p className="text-lg font-medium">
                        {item?.remarks || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
        {/* ----------------AGGREGATOR STATUS SECTION ENDS HERE---------------- */}

        {/* -------------------AGGREGATOR AUDIT LOG SECTION --------------------------- */}

        {/*---------AGGREGATOR ACTION BUTTONS SECTION ------------ */}
        <>
          <div className="flex justify-start items-center gap-4 py-6">
            <>
              <>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="py-2.5 px-8 text-md font-medium text-gray-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-gray-600 hover:border-gray-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                >
                  <BsXCircle size={"18px"} className="mr-2" />
                  Cancel
                </button>

                {/* <button
                  type="button"
                  className="py-2.5 px-8 text-md font-medium text-gray-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-gray-600 hover:border-gray-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                >
                  <BsPrinter size={"18px"} className="mr-2" />
                  Print
                </button> */}
              </>

              {(currentApprover?.empCode == userDetail?.UserId || isAdmin) &&
                MOUDetail?.statusName == "Pending Approval" && (
                  <>
                    <div className="w-full flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprovalApproveRejectStatus(false)}
                        className="py-2.5 pr-8 pl-6 text-md font-medium text-green-700 focus:outline-none bg-white rounded border border-gray-300 hover:bg-green-600 hover:border-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                      >
                        <BsCheck size={"20px"} className="mr-2" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprovalApproveRejectStatus(true)}
                        className="py-2.5 pr-8 pl-6 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                      >
                        <BsX size={"20px"} className="mr-2" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </>
                )}

              {(currentApprover?.empCode == userDetail?.UserId || isAdmin) &&
                MOUDetail?.statusName != "Pending Approval" &&
                MOUDetail?.terminationDetails?.filter(
                  (item) => item?.statusName == "Pending Approval"
                )?.length && (
                  <>
                    <div className="w-full flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApproveRejectStatus(false)}
                        className="py-2.5 pr-8 pl-6 text-md font-medium text-green-700 focus:outline-none bg-white rounded border border-gray-300 hover:bg-green-600 hover:border-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                      >
                        <BsCheck size={"20px"} className="mr-2" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveRejectStatus(true)}
                        className="py-2.5 pr-8 pl-6 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                      >
                        <BsX size={"20px"} className="mr-2" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </>
                )}
            </>
          </div>
        </>
        {/*---------AGGREGATOR ACTION BUTTONS SECTION ENDS HERE------------ */}

        {/* -------------------AGGREGATOR AUDIT LOG SECTION --------------------------- */}
        {aggregatorId && (
          <AuditLogs
            id={
              MOUDetail?.parentContractId
                ? MOUDetail?.parentContractId
                : MOUDetail?.aggregatorId
            }
            type="Aggregator"
            print={false}
          />
        )}
      </div>
      {/* </AccordionItem> */}
      {/* ))
        : ""} */}

      {/* ----------------ALL THE POPUPS -------------- */}
      <>
        {postTerminationPopUp?.status &&
          postTerminationPopUp?.payload?.aggregatorId && (
            <PostTerminationNotice
              globalObjectId={postTerminationPopUp?.payload?.globalObjectId}
              mouId={postTerminationPopUp?.payload?.mouId}
              contractId={null}
              dateFrom={postTerminationPopUp?.payload?.dateFrom}
              dateTo={postTerminationPopUp?.payload?.dateTo}
              aggregatorId={postTerminationPopUp?.payload?.aggregatorId}
              contractIdDisplay={""}
              open={postTerminationPopUp}
              setOpen={() =>
                setPostTerminationPopUp({ status: false, payload: {} })
              }
            />
          )}

        <Modal
          isOpen={approvalConfirmationModal?.status}
          title1="Are you Sure?"
          description={`You are about to approve Aggregator ${
            MOUDetail?.contractStatusTypeName !== "New"
              ? MOUDetail?.contractStatusTypeName
              : ""
          } for contract with ${creditCompany?.label}. `}
          // description={

          //   currentLevel == 2 &&
          //   currentLevel != approver?.length &&
          //   currentLevel < approver?.length ? `Approve aggregator termination notice`
          //   : ""}
          bodyText={`${
            currentLevel && currentLevel != approverMetrixLength
              ? `It will be sent for L${currentLevel + 1} Approval`
              : `Aggregator ${
                  MOUDetail?.contractStatusTypeName !== "New"
                    ? MOUDetail?.contractStatusTypeName
                    : ""
                } will be activated`
          }`}
          // ${creditCompany?.label}
          onClose={() =>
            setApprovalConfirmationModal({ status: false, reject: false })
          }
          onConfirm={SendApprovalApproveRejectStatus}
          sendForNextLevel={sendForNextLevel}
          setSendForNextLevel={setSendForNextLevel}
          mouAllDetails={mouAllDetails}
          aggregator={true}
          currentLevel={currentLevel}
          approver={approver}
          confirmationModal={approvalConfirmationModal}
          approveRejectPayload={approvalApproveRejectPayload}
          setApproveRejectPayload={setApprovalApproveRejectPayload}
          approveRejectError={approveRejectError}
          setApproveRejectError={setApproveRejectError}
        />
        {approvalSuccessModal?.status && (
          <SuccessModal
            title={`Aggregator ${
              MOUDetail?.contractStatusTypeName !== "New"
                ? MOUDetail?.contractStatusTypeName
                : ""
            } has been  ${
              approvalSuccessModal?.reject
                ? "rejected"
                : `approved by L${currentLevel}`
            }   successfully `}
            title2={
              !approvalSuccessModal?.reject &&
              `${
                !approvalApproveRejectPayload?.isNextLevelRequired
                  ? `Aggregator ${
                      MOUDetail?.contractStatusTypeName !== "New"
                        ? MOUDetail?.contractStatusTypeName
                        : ""
                    }
            is activated successfully!`
                  : ""
              }`
            }
            showSuccessModal={approvalSuccessModal?.status}
            setShowSuccessModal={() =>
              setApprovalSuccessModal({ status: true, reject: false })
            }
            handleResponse={() => {
              // if (approver?.length == currentLevel) {
              navigate("/mou-contract-list-pending");
              // } else {
              //   window.location.reload();
              // }
            }}
          />
        )}

        <Modal
          isOpen={confirmationModal?.status}
          title1="Are you Sure?"
          description={`You are about to approve ${
            MOUDetail?.terminationDetails[
              MOUDetail?.terminationDetails?.length - 1
            ]?.type == "Terminated"
              ? "Termination notice"
              : "Withdrawal notice"
          }  in ${creditCompany?.label} for Aggregator ${
            MOUDetail?.insuranceCompany?.label
          }`}
          // description={
          //   currentLevel == 2 &&
          //   currentLevel != approver?.length &&
          //   currentLevel < approver?.length
          //     ? `Approve aggregator termination notice`
          //     : ""
          // }
          bodyText={`${
            currentLevel && currentLevel != approverMetrixLength
              ? ` It will be sent for L${currentLevel + 1} Approval `
              : ` ${MOUDetail?.insuranceCompany?.label} Aggregator ${
                  MOUDetail?.terminationDetails[
                    MOUDetail?.terminationDetails?.length - 1
                  ]?.type == "Terminated"
                    ? "Termination notice"
                    : "Withdrawal notice"
                } will be activated`
          }`}
          // secondDescription={isNextLevel ? "It will be sent to next level for approval" : "" }
          onClose={() => setConfirmationModal({ status: false, reject: false })}
          onConfirm={SendApproveRejectStatus}
          sendForNextLevel={sendForNextLevel}
          setSendForNextLevel={setSendForNextLevel}
          mouAllDetails={mouAllDetails}
          aggregator={true}
          currentLevel={currentLevel}
          approver={approver}
          confirmationModal={confirmationModal}
          approveRejectPayload={approveRejectPayload}
          setApproveRejectPayload={setApproveRejectPayload}
        />
        {successModal && (
          <SuccessModal
            title={`${
              confirmationModal?.reject
                ? `${
                    // currentLevel == approverMetrixLength
                    // ?
                    // `${
                    //     MOUDetail?.terminationDetails[
                    //       MOUDetail?.terminationDetails?.length - 1
                    //     ]?.type == "Terminated"
                    //       ? "Termination Notice Activated"
                    //       : "Withdrawal Notice Activated"
                    //   }`
                    // :
                    `${
                      MOUDetail?.terminationDetails[
                        MOUDetail?.terminationDetails?.length - 1
                      ]?.type == "Terminated"
                        ? "Aggregator termination notice"
                        : "Aggregator withdrawal notice"
                    } has been rejected successfully`
                  }`
                : `${
                    MOUDetail?.terminationDetails[
                      MOUDetail?.terminationDetails?.length - 1
                    ]?.type == "Terminated"
                      ? "Aggregator termination notice"
                      : "Aggregator withdrawal notice"
                  } has been approved by L${currentLevel} successfully`
            }`}
            title2={`${ !confirmationModal?.reject &&
              !approveRejectPayload?.isNextLevelRequired
                ? `${
                    MOUDetail?.terminationDetails[
                      MOUDetail?.terminationDetails?.length - 1
                    ]?.type == "Terminated"
                      ? "Aggregator Termination notice activated successfully!"
                      : "Aggregator Withdrawal notice activated successfully!"
                  }`
                : ""
            }`}
            showSuccessModal={successModal}
            setShowSuccessModal={setSuccessModal}
            handleResponse={() => {
              // if (approver?.length == currentLevel) {
              navigate("/mou-contract-list-pending");
              // } else {
              //   window.location.reload();
              // }
            }}
          />
        )}
      </>

      {terminationNotice?.status && (
        <PostTerminationNotice
          globalObjectId={MOUDetail.globalObjectId}
          mouId={mouId}
          dateFrom={(terminationNotice?.dateFrom && convertIntoUnix(terminationNotice?.dateFrom)) || (MOUDetail.validityDateFrom && convertIntoUnix(MOUDetail.validityDateFrom))}
          dateTo={(terminationNotice?.dateTo && convertIntoUnix(terminationNotice?.dateTo)) || (MOUDetail.validityDateTo && convertIntoUnix(MOUDetail.validityDateTo))}
          mouContractOrContractDetails={MOUDetail}
          mouDisplayName={MOUDetail?.insuranceCompany?.label}
          open={terminationNotice?.status}
          terminationIndex={terminationNotice?.index}
          setOpen={()=>setTerminationNotice({status:false,dateFrom:null,dateTo:null,index:null})}
          editTermination={true}
          aggregatorId={aggregatorId}
          aggregatorInsurenceName={MOUDetail?.insuranceCompany?.label}
          updateName="Aggregator"
          mou={true}
        />
      )}
      {/* ----------------ALL THE POPUPS ENDS HERE-------------- */}
    </div>
  );
};

export default ViewAggregator;
