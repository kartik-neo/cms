import React, { useContext, useEffect, useState } from "react";
import StepperBar from "../../Components/Common/StepperBar";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AuditLogs from "../../Components/Common/AuditLogs";
import {
  getMouById,
  submitApprovRejectStatus,
} from "../../Services/mouServices";
import { ToastContainer, toast } from "react-toastify";
import {
  
  getUnitId,
  userDetails,
} from "../../utils/functions";
import PostTerminationNotice from "../../Components/MOU/PostTerminationNotice";
import MOUContext from "../../context/MOUContext";
import {
  bifurcateAggregatorApprovalStatus,
  convertFromUnix1,
  formatDateString,
  makeItProperObject,
  validateAggregators,
} from "../../utils/other";
import PageTitle from "../../Components/Common/PageTitle";
import {
  BsArrowClockwise,
  BsCheck,
  BsChevronRight,
  BsPlusCircle,
  BsPrinter,
  BsX,
  BsXCircle,
} from "react-icons/bs";
import UploadMediaCMS from "../../Components/Common/UploadMediaCMS";
import AccordionItem from "../../Components/Common/AccordianItem";
import { RiIndeterminateCircleLine } from "react-icons/ri";
import { IoNewspaperOutline } from "react-icons/io5";
import SuccessModal from "../../Components/Common/ModalPopups/SuccessModal";
import Modal from "../../Components/Modal";
import AddendumRenewalAggregator from "./AddendumRenewalAggregator";
import WithdrawlTerminatioNoticsPopUp from "../../Components/Common/WithdrawlTerminatioNoticsPopUp";
import { Termination, Withdrawal } from "../../Services/postTermination";
import UserContext from "../../context/UserContext";

const ViewMouAggregator = () => {
  const navigate = useNavigate();
  const { mouId } = useParams();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [contractType, setContractType] = useState();
  const [contractName, setContractName] = useState();
  const { MOUDetails, setMOUDetails } = useContext(MOUContext);
  const { isAdmin } = useContext(UserContext);
  const [globalObjectId, setGlobalObjectId] = useState();
  const [mouName, setMouName] = useState();
  const [breadCrumb, setBreadCrumb] = useState();
  const [mouStatuses, setMouStatuses] = useState([]);
  const [aggregatorStatuses, setAggregatorStatuses] = useState([]);
  const [currentAggregatorId, setCurrentAggregatorId] = useState(null);
  const [isNextRequired, setIsNextRequired] = useState(true);

  const [creditCompany, setCreditCompany] = useState();

  const { cameFrom, type } = location.state || {
    cameFrom: searchParams.get("cameFrom"),
    typeOf: searchParams.get("typeOf"),
    type: searchParams.get("type"),
  };
  const [sendAggregatorForRenewal, setSendAggregatorForRenewal] = useState([]);
  const [mouAllDetails, setMouAllDetails] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [approveRejectPayload, setApproveRejectPayload] = useState();
  const [sendForNextLevel, setSendForNextLevel] = useState(false);
  const [pendingAggregators, setPendingAggregators] = useState();
  const [currentLevel, setCurrentLevel] = useState();
  const [currentApprover, setCurrentApprover] = useState();
  const [approver, setApprover] = useState();
  const [approverMetrixLength, setApproverMetrixLength] = useState();
  const [postTerminationPopUp, setPostTerminationPopUp] = useState();
  const [openAddendumRenew, setOpenAddendumRenew] = useState(false);
  const [openPreviewName, setOpenPreviewName] = useState("");
  const [withdrawlTermination, setWithdrawlTermination] = useState();
  const [withdraw, setWithdraw] = useState();
  const [termination, setTermination] = useState();
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [terminationSuccess, setTerminationSuccess] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [openPreviewId, setOpenPreviewId] = useState(null);
  const [openPreviewIdData, setOpenPreviewIdData] = useState(null);
  const [insuranceCompanyName, setInsuranceCompanyName] = useState("");
  const [currentUnitId, setCurrentUnitId] = useState();
  const userDetail = userDetails();

  const getMouDetails = async (id) => {
    try {
      const mouDetail = await getMouById({ id: id });

      if (mouDetail?.success) {
        const response = mouDetail?.data?.length ? mouDetail?.data[0] : {};
        setContractName(response?.contractName);
        setMouName(response?.mouId);
        setInsuranceCompanyName(
          response?.mouAggregatorDetail[0]?.insuranceCompany
        );
        // const approver = response?.mouAggregatorDetail?.length ? response?.mouAggregatorDetail[0]?.approvalMatrixModel?.filter((item)=>item?.isActive) :[]
        setMouAllDetails(response);
        const pendingAggregators = response?.mouAggregatorDetail?.filter(
          (item) => item?.statusName == "Pending Approval"
        );

        const currentLevel =
          pendingAggregators[0]?.contractAggregatorApprovalLogs?.sort(
            (a, b) => b?.level - a.level
          )[0]?.level;
        const approverMetrixLength =
          pendingAggregators[0]?.approvalMatrixModel?.length;
        const approver = pendingAggregators[0]?.approvalMatrixModel?.filter(
          (item) => item?.isActive == true
        );
        const currentApprover = approver?.find(
          (item) => item?.level == currentLevel
        );
        setPendingAggregators(pendingAggregators);
        setCurrentLevel(currentLevel);
        setCurrentApprover(currentApprover);
        setApproverMetrixLength(approverMetrixLength);
        setApprover(approver);
        const statuses = bifurcateAggregatorApprovalStatus(
          response?.contractApprovalLogs,
          response?.createdBy,
          response?.createdOn,
          response?.statusName,
          response?.validityDateTo
        );
        setMouStatuses(statuses);
        const defaultValue = makeItProperObject(response, 3);
        const globalObjectIds = defaultValue?.aggregators?.map(
          (item) => item?.globalObjectId
        );
        setCreditCompany({
          value: response?.creditCompanyId,
          label: response?.contractName,
        });
        setGlobalObjectId(globalObjectIds);
        setMOUDetails(defaultValue);

        setContractType(3);
        // }
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
    if (mouId) {
      getMouDetails(mouId);
    }
  }, [mouId]);

  useEffect(() => {
    let value;
    if (type == "Pending Approval") {
      value = "pending";
    } else if (type == "Terminated") {
      value = "terminated";
    } else if (type == "Rejected") {
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

  const handleApproveRejectStatus = () => {
    // const pendingAggregators = mouAllDetails?.mouAggregatorDetail?.filter(
    //   (item) => item?.statusName === "Pending Approval"
    // );

    const currentLevel =
      pendingAggregators[0]?.contractAggregatorApprovalLogs?.sort(
        (a, b) => b?.level - a.level
      )[0]?.level;

    // const approver = pendingAggregators[0]?.approvalMatrixModel?.filter(
    //   (item) => item?.isActive == true
    // );

    const remaining = validateAggregators(
      pendingAggregators,
      sendAggregatorForRenewal
    );

    if (remaining?.length) {
      toast.error(
        `Approve/Reject status has not submitted for ${
          remaining?.length > 1 ? "aggregators" : "aggregator"
        } ${remaining.join(",")}`,
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
      return;
    }

    const isValid = sendAggregatorForRenewal.every((item) => {
      if (item.status === 3 && !item.remarks) {
        toast.error(`Remarks required for aggregator ID ${item.aggregatorId}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        return false;
      }
      return true;
    });

    if (!isValid) return;

    const rejectStatus = sendAggregatorForRenewal?.length
      ? sendAggregatorForRenewal[0]?.status
      : "";

    // let isNextRequired = currentLevel?.currentLevel == 2 && currentLevel?.currentLevel < approverMetrixLength ? sendForNextLevel : currentLevel?.currentLevel != 2 && currentLevel?.currentLevel < approverMetrixLength ? true: false;

    const payload = {
      mouId: MOUDetails?.mouContractId,
      aggregatorStatus: [...sendAggregatorForRenewal],
      level: currentLevel,
      isNextLevelRequired:
        rejectStatus == 3
          ? false
          : currentLevel == 2 && currentLevel < approver?.length
          ? sendForNextLevel
          : currentLevel == 2 && currentLevel == approver?.length
          ? false
          : currentLevel != 2 && currentLevel < approver?.length
          ? true
          : false,
    };
    setIsNextRequired(isNextRequired);

    setApproveRejectPayload(payload);
    setConfirmationModal(true);
  };
  const SendApproveRejectStatus = async () => {
    const rejectStatus = sendAggregatorForRenewal?.length
      ? sendAggregatorForRenewal[0]?.status
      : "";
    const payloadToSend = {
      ...approveRejectPayload,
      isNextLevelRequired:
        rejectStatus == 3
          ? false
          : currentLevel == 2 && currentLevel < approver?.length
          ? sendForNextLevel
          : currentLevel == 2 && currentLevel == approver?.length
          ? false
          : currentLevel != 2 && currentLevel < approver?.length
          ? true
          : false,
    };
    try {
      const response = await submitApprovRejectStatus(payloadToSend);

      if (response?.success) {
        setConfirmationModal(false);
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

  const handleWithdraw = async () => {
    const dataToAdd = {
      mouId: mouId || null,
      contractId: null,
      aggregatorId: withdraw?.payload?.aggregatorId,
      // aggregatorNumber: 0,
    };

    try {
      const withdrawn = await Withdrawal({ data: dataToAdd });
      if (withdrawn?.success) {
        setWithdraw({ status: false, payload: {} });
        setWithdrawSuccess(true);
      }
    } catch (error) {
      toast.error(error.message ?? "Error while withdrawing notice", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleTermination = async () => {
    const dataToAdd = {
      mouId: termination?.payload?.mouId || null,
      type: "Terminated",
      contractId: null,
      aggregatorId: termination?.payload?.aggregatorId || null,
    };
    try {
      const postTerminationData = await Termination({ data: dataToAdd });
      if (postTerminationData?.success) {
        setTermination({ status: false, payload: {} });
        setTerminationSuccess(true);
      }
    } catch (error) {
      toast.error(error.message ?? "Error while terminating notice", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  function afterPrintCallback() {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  const printContent = () => {
    const content = document.getElementById("contentToPrint").innerHTML;
    const originalBody = document.body.innerHTML;
    document.body.innerHTML = content;
    window.onafterprint = afterPrintCallback;
    window.print();
    document.body.innerHTML = originalBody;
  };

  useEffect(() => {
    if (openPreviewId) {
      let result = MOUDetails?.aggregators?.filter(
        (k) => k?.aggregatorId == openPreviewId
      );
      const statuses = bifurcateAggregatorApprovalStatus(
        result[0]?.approvalLogs,
        result[0]?.createdBy,
        result[0]?.createdOn,
        result[0]?.statusName,
        result[0]?.unixvalidityTo,
        true,
        result[0]?.contractStatusTypeName
      );

      setAggregatorStatuses(statuses);
      if (result) {
        setOpenPreviewIdData(result[0]);
      }
    }
  }, [openPreviewId]);

  return (
    <div>
      <ToastContainer />

      <PageTitle
        title={`Mou Contract ${mouName}`}
        buttonTitle=""
        breadCrumbData={breadCrumb}
        bg={true}
      />
      <div className="mb-4">
        <StepperBar data={mouStatuses} step={1} />
      </div>

      <div className="grid grid-cols-12 py-4 px-4 bg-white shadow ">
        <div className="col-span-12">
          <p className="text-xl font-semibold">Aggregator</p>
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
      
      {MOUDetails?.aggregators?.length
        ? (cameFrom == "Pending Approval"
            ? MOUDetails?.aggregators?.filter(
                (item) => item?.statusName == "Pending Approval"
              )
            : MOUDetails?.aggregators
          )?.map((MOUDetail, key) => (
            <>
            {/* ${
                  MOUDetail?.contractStatusTypeName == "New"
                    ? ""
                    : MOUDetail?.contractStatusTypeName
                } */}
              <AccordionItem
                key={key}
                title={`Aggregator Id - ${
                  // MOUDetail?.contractStatusTypeName == "Addendum" ||
                  // MOUDetail?.contractStatusTypeName == "Renewal"
                  //   ? MOUDetail?.aggregatorReference
                    // : 
                    MOUDetail?.aggregatorId
                } (${
                  MOUDetail?.statusName == "Pending Approval"
                    ? `L${MOUDetail?.contractAggregatorApprovalLogs.sort((a,b)=>b?.level - a?.level)[0]?.level} - Pending Approval`
                    : MOUDetail?.statusName
                  // MOUDetail?.statusName
                })  ${
                  MOUDetail?.contractStatusTypeName == "New"
                    ? ""
                    : `[${MOUDetail?.contractStatusTypeName}${(MOUDetail?.contractStatusTypeName == "Addendum" && 
                    (MOUDetail?.statusName == "Pending Approval" || MOUDetail?.statusName == "Rejected")) || 
                    (MOUDetail?.contractStatusTypeName == "Renewal") 
                    ? ` of ${MOUDetail?.aggregatorReference}` : "" }]`
                }`}
              >
                <div
                  key={key}
                  className="bg-white px-5 py-5 shadow relative rounded-b flex flex-col gap-y-4 mb-4"
                >
                  {/*---------AGGREGATOR DETAILS SECTION------------ */}

                  <>
                    {MOUDetail?.terminationStatuses != null && (
                      <PageTitle
                        title={""}
                        buttonTitle=""
                        breadCrumbData={""}
                        bg={true}
                        cameFromTerminationData={"Aggregator"}
                        terminationData={
                          MOUDetail?.terminationStatuses != null
                            ? {
                                startDate:
                                  MOUDetail?.terminationStatuses
                                    ?.terminationStartDate,
                                endsDate:
                                  MOUDetail?.terminationStatuses
                                    ?.terminationEndDate,
                              }
                            : ""
                        }
                      />
                    )}

                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12 md:col-span-4">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
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
                        <p className="text-xl font-semibold">
                          Contract Segment
                        </p>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          OP
                        </label>
                        <p className="text-lg font-medium">
                          {MOUDetail?.op
                            ? "Yes"
                            : MOUDetail?.op == false
                            ? "No"
                            : "-"}
                        </p>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          IP
                        </label>
                        <p className="text-lg font-medium">
                          {MOUDetail?.ip
                            ? "Yes"
                            : MOUDetail?.ip == false
                            ? "No"
                            : "-"}
                        </p>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Hc
                        </label>
                        <p className="text-lg font-medium">
                          {MOUDetail?.hc
                            ? "Yes"
                            : MOUDetail?.hc == false
                            ? "No"
                            : "-"}
                        </p>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
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
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-2"
                        >
                          Co-Payment in %
                        </label>
                        <p className="text-lg font-medium flex justify-between gap-2">
                          {MOUDetail?.coPaymentInPercent
                            ? MOUDetail?.coPaymentInPercent
                                ?.charAt(0)
                                .toUpperCase() +
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
                                    {MOUDetail?.netralayaCoPaymentEmployee ||
                                      "--"}{" "}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {MOUDetail?.netralayaCoPaymentDependant ||
                                      "--"}{" "}
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
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              From
                            </label>
                            <p className="text-lg font-medium">
                              {MOUDetail?.validityDateFrom
                                ? formatDateString(MOUDetail?.validityDateFrom)
                                : "--"}
                            </p>
                          </div>
                          <div className="col-span-6">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
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
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              From
                            </label>
                            <p className="text-lg font-medium">
                              {MOUDetail?.renewalFrom
                                ? formatDateString(MOUDetail?.renewalFrom)
                                : "--"}
                            </p>
                          </div>
                          <div className="col-span-6">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
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
                        <p className="text-xl font-semibold">
                          Discount on Tariff
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Tariff
                        </label>
                        <p className="text-lg font-medium">
                          {MOUDetail?.discountTariff?.label}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Transaction Year
                        </label>
                        <p className="text-lg font-medium">
                          {MOUDetail?.discountTransactionYear}
                        </p>
                      </div>
                      <div className="col-span-12">
                        <div className="grid grid-cols-12 gap-5">
                          <div className="col-span-6 md:col-span-2">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              OP
                            </label>
                            <p className="text-lg font-medium">
                              {MOUDetail?.opDiscount || "--"}{" "}
                              {MOUDetail?.opDiscount ? "%" : ""}
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              IP
                            </label>
                            <p className="text-lg font-medium">
                              {MOUDetail?.ipDiscount || "--"}
                              {MOUDetail?.ipDiscount ? "%" : ""}
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              HC
                            </label>
                            <p className="text-lg font-medium">
                              {MOUDetail?.hcDiscount || "--"}{" "}
                              {MOUDetail?.hcDiscount ? "%" : ""}
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              Netralaya
                            </label>
                            <p className="text-lg font-medium">
                              {MOUDetail?.netralayaDiscount || "--"}{" "}
                              {MOUDetail?.netralayaDiscount ? "%" : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12">
                        <p className="text-xl font-semibold">
                          Approval Documents
                        </p>
                      </div>
                      <div className="col-span-12">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
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
                          // register={()=>}
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
                          uuidVal={`aggregator_${key}`}
                        />
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
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
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
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
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
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
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
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
                        <p className="text-xl font-semibold">
                          Physical Document Details
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Employee Name
                        </label>
                        <p className="text-lg font-medium">
                          {MOUDetail?.custodianName?.label}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          File Location
                        </label>
                        <p className="text-lg font-medium">
                          {MOUDetail?.fileLocation?.label}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Add Details
                        </label>
                        <p className="text-lg font-medium">
                          {MOUDetail?.addDetails}
                        </p>
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
                                <div className="flex items-center justify-between">
                                  <label className="inline-block text-xl font-semibold">
                                    {item?.type} Notice
                                  </label>
                                  <label className="inline-block text-gray-500 font-medium mb-1 justify-end">
                                    Approval Status -{" "}
                                    <span className="font-semibold text-gray-800">
                                      {item?.statusName == "Active"
                                        ? "Approved"
                                        : item?.statusName}
                                    </span>
                                  </label>
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
                                  item?.type == "Withdraw"
                                    ? "col-span-8"
                                    : "col-span-12"
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
                    <div className="flex justify-start items-center gap-4 py-4">
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

                          {cameFrom != "Pending Approval" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenPreview(true);
                                setOpenPreviewId(MOUDetail?.aggregatorId);
                              }}
                              className="py-2.5 px-8 text-md font-medium text-gray-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-gray-600 hover:border-gray-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                            >
                              <BsPrinter size={"18px"} className="mr-2" />
                              Print
                            </button>
                          ) : (
                            ""
                          )}
                        </>

                        {MOUDetail?.statusName == "Pending Approval" &&
                          cameFrom == "Pending Approval" && (
                            <>
                              <div className="w-full flex items-center gap-2">
                                {isAdmin ||
                                currentApprover?.empCode ==
                                  userDetail?.UserId ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const isPresent =
                                          sendAggregatorForRenewal.some(
                                            (item) =>
                                              item.aggregatorId ===
                                              MOUDetail?.aggregatorId
                                          );

                                        if (isPresent) {
                                          const filtered =
                                            sendAggregatorForRenewal.filter(
                                              (item) =>
                                                item.aggregatorId !==
                                                MOUDetail?.aggregatorId
                                            );
                                          setSendAggregatorForRenewal(filtered);
                                        } else {
                                          setSendAggregatorForRenewal([
                                            ...sendAggregatorForRenewal,
                                            {
                                              aggregatorId:
                                                MOUDetail?.aggregatorId,
                                              remarks: null,
                                              requestTypeId: null,
                                              status: 2,
                                              // note: ""
                                            },
                                          ]);
                                        }
                                      }}
                                      disabled={sendAggregatorForRenewal.some(
                                        (item) =>
                                          item.aggregatorId ===
                                            MOUDetail?.aggregatorId &&
                                          item.status === 3
                                      )}
                                      className="py-2.5 pr-8 pl-6 text-md font-medium text-green-700 focus:outline-none bg-white rounded border border-gray-300 hover:bg-green-600 hover:border-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                                    >
                                      <BsCheck size={"20px"} className="mr-2" />
                                      <span>
                                        {sendAggregatorForRenewal.some(
                                          (item) =>
                                            item.aggregatorId ===
                                              MOUDetail?.aggregatorId &&
                                            item.status === 2
                                        )
                                          ? "Remove Approval"
                                          : "Approve"}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const isPresent =
                                          sendAggregatorForRenewal.some(
                                            (item) =>
                                              item.aggregatorId ===
                                              MOUDetail?.aggregatorId
                                          );

                                        if (isPresent) {
                                          const filtered =
                                            sendAggregatorForRenewal.filter(
                                              (item) =>
                                                item.aggregatorId !==
                                                MOUDetail?.aggregatorId
                                            );
                                          setSendAggregatorForRenewal(filtered);
                                        } else {
                                          setSendAggregatorForRenewal([
                                            ...sendAggregatorForRenewal,
                                            {
                                              aggregatorId:
                                                MOUDetail?.aggregatorId,
                                              remarks: "",
                                              requestTypeId: null,
                                              status: 3,
                                              // note: ""
                                            },
                                          ]);
                                        }
                                      }}
                                      disabled={sendAggregatorForRenewal.some(
                                        (item) =>
                                          item.aggregatorId ===
                                            MOUDetail?.aggregatorId &&
                                          item.status === 2
                                      )}
                                      className="py-2.5 pr-8 pl-6 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                                    >
                                      <BsX size={"20px"} className="mr-2" />
                                      <span>
                                        {sendAggregatorForRenewal.some(
                                          (item) =>
                                            item.aggregatorId ===
                                              MOUDetail?.aggregatorId &&
                                            item.status === 3
                                        )
                                          ? "Remove Rejection"
                                          : "Reject"}
                                      </span>
                                    </button>
                                  </>
                                ) : (
                                  ""
                                )}
                                {sendAggregatorForRenewal.some(
                                  (item) =>
                                    item.aggregatorId ===
                                      MOUDetail?.aggregatorId &&
                                    item.status === 3
                                ) && (
                                  <div className="flex flex-col w-full">
                                    <textarea
                                      className="form-textarea mt-1 block w-full"
                                      placeholder="Enter remarks"
                                      value={
                                        sendAggregatorForRenewal.find(
                                          (item) =>
                                            item.aggregatorId ===
                                              MOUDetail?.aggregatorId &&
                                            item.status === 3
                                        )?.remarks
                                      }
                                      onChange={(e) => {
                                        if (e.target.value?.length < 2001) {
                                          const updated =
                                            sendAggregatorForRenewal.map(
                                              (item) => {
                                                if (
                                                  item.aggregatorId ===
                                                  MOUDetail?.aggregatorId
                                                ) {
                                                  return {
                                                    ...item,
                                                    remarks: e.target.value,
                                                  };
                                                }
                                                return item;
                                              }
                                            );
                                          setSendAggregatorForRenewal(updated);
                                        }
                                      }}
                                    />
                                    <p className="text-red-500">
                                      {sendAggregatorForRenewal?.find(
                                        (item) =>
                                          item?.aggregatorId ==
                                          MOUDetail?.aggregatorId
                                      )?.remarks?.length > 1999
                                        ? "Remarks should be less than or equal to 2000 characters"
                                        : ""}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </>
                          )}

                        {(MOUDetail?.statusName == "Active" ||
                          MOUDetail?.statusName === "Expired") &&
                          !MOUDetail?.isAddendumCreated &&
                          !MOUDetail?.terminationDetails?.filter(
                            (item) => item?.statusName == "Pending Approval"
                          )?.length && (
                            <>
                              {!MOUDetail?.isRenewalCreated &&
                                (MOUDetail?.statusName === "Active" ||
                                  MOUDetail?.statusName === "Expired") && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCurrentAggregatorId(
                                        MOUDetail?.aggregatorId
                                      );
                                      setCurrentUnitId(MOUDetails?.unitId)
                                      setOpenPreviewName("Add Renew");
                                      setOpenAddendumRenew(true);
                                    
                                    }}
                                    className="py-2.5 px-8 text-md font-medium text-green-700 focus:outline-none bg-white rounded border border-gray-300 hover:bg-green-600 hover:border-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                                  >
                                    <BsArrowClockwise
                                      size={"18px"}
                                      className="mr-2"
                                    />
                                    Renew
                                  </button>
                                )}

                              {MOUDetail?.statusName !== "Expired" ? (
                                 <button
                                 type="button"
                                 onClick={() => {
                                  setCurrentAggregatorId(
                                    MOUDetail?.aggregatorId
                                  );
                                  setCurrentUnitId(MOUDetails?.unitId)
                                   setOpenPreviewName("Add Addendum");
                                   setOpenAddendumRenew(true);
                                  
                                 }}
                                 className="py-2.5 px-8 text-md font-medium text-blue-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                               >
                                 <BsPlusCircle size={"18px"} className="mr-2" />
                                 Add Addendum
                               </button>
                              ) :""}
                             

                              {MOUDetail?.statusName == "Active" &&
                              !MOUDetail?.terminationDetails?.filter(
                                (item) =>
                                  item?.statusName == "Active" &&
                                  item?.type == "Terminated"
                              )?.length ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPostTerminationPopUp({
                                      status: true,
                                      payload: {
                                        dateFrom: MOUDetail?.unixvalidityFrom,
                                        dateTo: MOUDetail?.unixvalidityTo,
                                        globalObjectId:
                                          MOUDetail?.globalObjectId,
                                        aggregatorId: MOUDetail?.aggregatorId,
                                        mouId: mouId,
                                      },
                                    })
                                  }
                                  className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                                >
                                  <IoNewspaperOutline
                                    size={"18px"}
                                    className="mr-2"
                                  />
                                  Post Termination Notice
                                </button>
                              ) : (
                                ""
                              )}

                              {MOUDetail?.statusName == "Active" &&
                              MOUDetail?.terminationDetails?.filter(
                                (item) =>
                                  item?.statusName == "Active" &&
                                  item?.type == "Terminated"
                              )?.length ? (
                                <>
                                  {MOUDetail?.statusName == "Active" &&
                                  MOUDetail?.terminationDetails?.filter(
                                    (item) =>
                                      item?.statusName == "Active" &&
                                      item?.type == "Withdraw"
                                  )?.length ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setWithdraw({
                                          status: true,
                                          payload: {
                                            mouId: mouId,
                                            aggregatorId:
                                              MOUDetail?.aggregatorId,
                                          },
                                        });
                                      }}
                                      className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                                    >
                                      <RiIndeterminateCircleLine
                                        size={"18px"}
                                        className="mr-2"
                                      />
                                      Withdraw Notice
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTermination({
                                            status: true,
                                            payload: {
                                              mouId: mouId,
                                              aggregatorId:
                                                MOUDetail?.aggregatorId,
                                            },
                                          });
                                        }}
                                        className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                                      >
                                        <RiIndeterminateCircleLine
                                          size={"18px"}
                                          className="mr-2"
                                        />
                                        Terminate
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setWithdrawlTermination({
                                            status: true,
                                            payload: {
                                              globalObjectId:
                                                MOUDetail?.globalObjectId,
                                              aggregatorId:
                                                MOUDetail?.aggregatorId,
                                              mouId: mouId,
                                            },
                                          });
                                        }}
                                        className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
                                      >
                                        <IoNewspaperOutline
                                          size={"18px"}
                                          className="mr-2"
                                        />
                                        Post Withdraw Notice
                                      </button>
                                    </>
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          )}
                      </>
                    </div>
                  </>
                  {/*---------AGGREGATOR ACTION BUTTONS SECTION ENDS HERE------------ */}
                  {/* -------------------AGGREGATOR AUDIT LOG SECTION --------------------------- */}
                  {mouId && (
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

                {openAddendumRenew ? (
                  <div className="z-50 fixed inset-0  flex justify-center w-[100%] py-10 bg-black bg-opacity-35 top-0 left-0">
                    <div className="my-4 overflow-y-scroll bg-white px-5 pt-10 rounded-lg">
                      <div id="contentToPrint">
                        <AddendumRenewalAggregator
                          id={mouId}
                          AggregatorId={currentAggregatorId}
                          // AggregatorId={MOUDetail?.aggregatorId}
                          openPreviewName={openPreviewName}
                          status={MOUDetail?.statusName}
                          currentUnitId={currentUnitId}
                          setOpenAddendumRenew={setOpenAddendumRenew}
                          index={key}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </AccordionItem>
            </>
          ))
        : ""}

      {/* ----------------ALL THE POPUPS -------------- */}
      <>
        {withdrawlTermination?.status && (
          <WithdrawlTerminatioNoticsPopUp
            open={withdrawlTermination}
            setOpen={() =>
              setWithdrawlTermination({ status: false, payload: {} })
            }
            mouId={withdrawlTermination?.payload?.mouId}
            aggregatorId={withdrawlTermination?.payload?.aggregatorId}
            contractId={""}
            globalObjectId={withdrawlTermination?.payload?.globalObjectId}
            aggregatorInsurenceName={insuranceCompanyName}
          />
        )}

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
              aggregatorInsurenceName={insuranceCompanyName}
              open={postTerminationPopUp}
              setOpen={() =>
                setPostTerminationPopUp({ status: false, payload: {} })
              }
            />
          )}

        {withdraw?.status ? (
          <Modal
            isOpen={withdraw?.status}
            title={"Are you sure ?"}
            description={"Are you sure you want to withdraw notice ?"}
            onClose={() => setWithdraw({ status: false, payload: {} })}
            onConfirm={handleWithdraw}
            mouAllDetails={mouAllDetails}
            aggregator={true}
          />
        ) : (
          ""
        )}

        {termination?.status ? (
          <Modal
            isOpen={termination?.status}
            title={`Are you sure you want to terminate the aggregator ${
              MOUDetails?.aggregators?.filter(
                (item) =>
                  item?.aggregatorId === termination?.payload?.aggregatorId
              )[0]?.insuranceCompany?.label || ""
            }?`}
            description={``}
            onClose={() => setTermination({ status: false, payload: {} })}
            onConfirm={handleTermination}
            mouAllDetails={mouAllDetails}
            aggregator={true}
          />
        ) : (
          ""
        )}

        <Modal
          isOpen={confirmationModal}
          title1="Are you Sure?"
          description={`You are about to submit approval response for following contract with ${creditCompany?.label} ?`}
          bodyText={`${
            currentLevel && currentLevel != approverMetrixLength
              ? // approver?.length && approver?.length != currentLevel
                ` MOU will be sent for L${currentLevel + 1} Approval`
              : ` MOU will be ${
                  sendAggregatorForRenewal[0]?.status == 3
                    ? "rejected"
                    : "activated"
                }`
          }`}
          // description={
          //   `${creditCompany?.label} ?`
          // }
          onClose={() => setConfirmationModal(false)}
          onConfirm={SendApproveRejectStatus}
          sendForNextLevel={sendForNextLevel}
          setSendForNextLevel={setSendForNextLevel}
          contractName={mouAllDetails?.contractName}
          mouAllDetails={mouAllDetails}
          aggregator={true}
          currentLevel={currentLevel}
          approver={approver}
        />
        {successModal && (
          <SuccessModal
            title={`${
              currentLevel == approverMetrixLength ||
              (currentLevel == 2 && !sendForNextLevel)
                ? `MOU Aggregator with ${creditCompany?.label} is ${
                    sendAggregatorForRenewal[0]?.status == 3
                      ? "rejected"
                      : "activated"
                  } successfully`
                : `L${currentLevel} Approval response submitted successfully for ${creditCompany?.label}`
            }`}
            showSuccessModal={successModal}
            setShowSuccessModal={setSuccessModal}
            handleResponse={() => {
              navigate("/mou-contract-list-pending");
              // window.location.reload();
            }}
          />
        )}

        {terminationSuccess && (
          <SuccessModal
            title={`Aggregator terminated successfully with ${creditCompany?.label}`}
            showSuccessModal={terminationSuccess}
            setShowSuccessModal={setTerminationSuccess}
            handleResponse={() => {
              navigate("/mou-contract-list-pending");
              // window.location.reload();
            }}
          />
        )}
        {withdrawSuccess && (
          <SuccessModal
            title={`Aggregator withdrawn successfully with ${creditCompany?.label}`}
            showSuccessModal={withdrawSuccess}
            setShowSuccessModal={setWithdrawSuccess}
            handleResponse={() => {
              navigate("/mou-contract-list-pending");
              // window.location.reload();
            }}
          />
        )}
      </>
      {/* ----------------ALL THE POPUPS ENDS HERE-------------- */}

      {(isAdmin || currentApprover?.empCode == userDetail?.UserId) &&
      cameFrom == "Pending Approval" &&
      MOUDetails?.aggregators?.length &&
      MOUDetails?.aggregators?.filter(
        (item) => item?.statusName == "Pending Approval"
      )?.length ? (
        <div className="w-full flex items-center  justify-center gap-2 py-8">
          <button
            type="button"
            onClick={handleApproveRejectStatus}
            className="py-2.5 pr-8 pl-6 text-md font-medium text-green-700 focus:outline-none bg-white rounded border border-gray-300 hover:bg-green-600 hover:border-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
          >
            {/* <BsCheck size={"20px"} className="mr-2" /> */}
            <span>Submit Approval/Rejection Status</span>
          </button>
        </div>
      ) : (
        ""
      )}

      {/* here is print preview popup starts */}

      {openPreview ? (
        <div className="z-50 fixed inset-0  flex justify-center w-[100%] py-10 bg-black bg-opacity-35 top-0 left-0">
          <div className="my-4 overflow-y-scroll bg-white px-5 pt-10 rounded-lg">
            <div id="contentToPrint">
              {openPreviewIdData && (
                <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-4">
                  {`#${MOUDetails?.mouId} Aggregator Id - ${openPreviewIdData?.aggregatorId} (${openPreviewIdData?.statusName})`}
                </h1>
              )}
              <div className="mb-4">
                <StepperBar data={aggregatorStatuses} step={1} />
              </div>

              <div className="grid grid-cols-12 py-4 px-4 bg-white shadow ">
                <div className="col-span-12">
                  <p className="text-xl font-semibold">Aggregator</p>
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
                    <p className="text-lg font-medium">
                      {creditCompany?.label}
                    </p>
                  </div>
                </div>
              </div>

              {openPreviewIdData && (
                <div className="bg-white px-5 shadow relative rounded-b flex flex-col gap-y-4">
                  {/*---------AGGREGATOR DETAILS SECTION------------ */}

                  <>
                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12 md:col-span-4">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Insurance Company
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.insuranceCompany?.label || "--"}
                        </p>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="grid grid-cols-12 gap-5 ">
                      <div className="col-span-12">
                        <p className="text-xl font-semibold">
                          Contract Segment
                        </p>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          OP
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.op
                            ? "Yes"
                            : openPreviewIdData?.op == false
                            ? "No"
                            : "-"}
                        </p>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          IP
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.ip
                            ? "Yes"
                            : openPreviewIdData?.ip == false
                            ? "No"
                            : "-"}
                        </p>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Hc
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.hc
                            ? "Yes"
                            : openPreviewIdData?.hc == false
                            ? "No"
                            : "-"}
                        </p>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Netralaya
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.netralaya
                            ? "Yes"
                            : openPreviewIdData?.netralaya == false
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
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-2"
                        >
                          Co-Payment in %
                        </label>
                        <p className="text-lg font-medium flex justify-between gap-2">
                          {openPreviewIdData?.coPaymentInPercent
                            ? openPreviewIdData?.coPaymentInPercent
                                ?.charAt(0)
                                .toUpperCase() +
                              openPreviewIdData?.coPaymentInPercent.slice(1)
                            : ""}
                        </p>
                      </div>
                      <div className="col-span-8">
                        {openPreviewIdData?.coPaymentInPercent && (
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
                                  {openPreviewIdData?.opCoPaymentEmployee ||
                                    "--"}{" "}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {openPreviewIdData?.opCoPaymentDependant ||
                                    "--"}{" "}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2">IP </td>
                                <td className="px-3 py-2 text-center">
                                  {openPreviewIdData?.ipCoPaymentEmployee ||
                                    "--"}{" "}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {openPreviewIdData?.ipCoPaymentDependant ||
                                    "--"}{" "}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2">HC </td>
                                <td className="px-3 py-2 text-center">
                                  {openPreviewIdData?.hcCoPaymentEmployee ||
                                    "--"}{" "}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {openPreviewIdData?.hcCoPaymentDependant ||
                                    "--"}{" "}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2">Netralaya </td>
                                <td className="px-3 py-2 text-center">
                                  {openPreviewIdData?.netralayaCoPaymentEmployee ||
                                    "--"}{" "}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {openPreviewIdData?.netralayaCoPaymentDependant ||
                                    "--"}{" "}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="grid grid-cols-12 gap-5 ">
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <p className="text-xl font-semibold">Validity</p>
                        <div className="grid grid-cols-12 gap-x-8 mt-4">
                          <div className="col-span-6">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              From
                            </label>
                            <p className="text-lg font-medium">
                              {openPreviewIdData?.validityDateFrom
                                ? formatDateString(
                                    openPreviewIdData?.validityDateFrom
                                  )
                                : "--"}
                            </p>
                          </div>
                          <div className="col-span-6">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              To
                            </label>
                            <p className="text-lg font-medium">
                              {openPreviewIdData?.validityDateTo
                                ? formatDateString(
                                    openPreviewIdData?.validityDateTo
                                  )
                                : "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <p className="text-xl font-semibold">Renewal Date</p>
                        <div className="grid grid-cols-12 gap-x-8 mt-4">
                          <div className="col-span-6">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              From
                            </label>
                            <p className="text-lg font-medium">
                              {openPreviewIdData?.renewalFrom
                                ? formatDateString(
                                    openPreviewIdData?.renewalFrom
                                  )
                                : "--"}
                            </p>
                          </div>
                          <div className="col-span-6">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              To
                            </label>
                            <p className="text-lg font-medium">
                              {openPreviewIdData?.renewalTo
                                ? formatDateString(openPreviewIdData?.renewalTo)
                                : "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12">
                        <p className="text-xl font-semibold">
                          Discount on Tariff
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Tariff
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.discountTariff?.label}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Transaction Year
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.discountTransactionYear}
                        </p>
                      </div>
                      <div className="col-span-12">
                        <div className="grid grid-cols-12 gap-5">
                          <div className="col-span-6 md:col-span-2">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              OP
                            </label>
                            <p className="text-lg font-medium">
                              {openPreviewIdData?.opDiscount || "--"}{" "}
                              {openPreviewIdData?.opDiscount ? "%" : ""}
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              IP
                            </label>
                            <p className="text-lg font-medium">
                              {openPreviewIdData?.ipDiscount || "--"}{" "}
                              {openPreviewIdData?.ipDiscount ? "%" : ""}
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              HC
                            </label>
                            <p className="text-lg font-medium">
                              {openPreviewIdData?.hcDiscount || "--"}{" "}
                              {openPreviewIdData?.hcDiscount ? "%" : ""}
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <label
                              for=""
                              class="inline-block text-gray-500 text-lg mb-1"
                            >
                              Netralaya
                            </label>
                            <p className="text-lg font-medium">
                              {openPreviewIdData?.netralayaDiscount || "--"}{" "}
                              {openPreviewIdData?.netralayaDiscount ? "%" : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12">
                        <p className="text-xl font-semibold">
                          Approval Documents
                        </p>
                      </div>
                      <div className="col-span-12">
                        <label
                          for=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Documents
                        </label>
                        <ul className="grid grid-cols-12">
                          {openPreviewIdData?.approvalDocuments?.map((item) => (
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
                          globalObjectId={openPreviewIdData?.globalObjectId}
                          disabled={true}
                          // errors={errors}
                          name={""}
                          mandate={false}
                          uploadFor={
                            openPreviewIdData?.contractStatusTypeName ==
                            "Addendum"
                              ? "Aggregator Addendum Document"
                              : openPreviewIdData?.contractStatusTypeName ==
                                "Renewal"
                              ? "Aggregator Renewal Document"
                              : "Aggregator Document"
                          }
                          id={openPreviewIdData?.aggregatorId}
                          aggregatorId={openPreviewIdData?.aggregatorId}
                          type="Aggregator"
                          // uuidVal={`aggregator_${key}`}
                        />
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Patient Deposit
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.patientDeposit == "yes"
                            ? "Yes"
                            : openPreviewIdData?.patientDeposit == "no"
                            ? "No"
                            : ""}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Patient Deposit In Rupees
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.patientDepositInRupees || "-"}{" "}
                        </p>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="grid grid-cols-12 gap-y-5 gap-x-8">
                      <div className="col-span-12">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Non Admissable Material / Service
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.nonAdmissableService == "yes"
                            ? "Yes"
                            : openPreviewIdData?.nonAdmissableService == "no"
                            ? "No"
                            : ""}
                        </p>

                        {openPreviewIdData?.nonAdmissableService == "yes" ? (
                          <ul className="grid grid-cols-12 mt-3">
                            {openPreviewIdData?.naMaterialService?.map(
                              (item) => (
                                <li className="col-span-12 md:col-span-3 text-lg inline-flex items-center font-medium gap-2">
                                  <BsChevronRight /> <span>{item?.label}</span>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Payment Terms
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.paymentTerms} Days
                        </p>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12">
                        <p className="text-xl font-semibold">
                          Physical Document Details
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Employee Name
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.custodianName?.label}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          File Location
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.fileLocation?.label}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          class="inline-block text-gray-500 text-lg mb-1"
                        >
                          Add Details
                        </label>
                        <p className="text-lg font-medium">
                          {openPreviewIdData?.addDetails}
                        </p>
                      </div>
                    </div>
                  </>
                  {/*---------AGGREGATOR DETAILS SECTION ENDS HERE------------ */}
                  {/* ----------------AGGREGATOR STATUS SECTION ---------------- */}
                  {openPreviewIdData?.terminationDetails && (
                    <div>
                      {openPreviewIdData?.terminationDetails?.map(
                        (item, index) => (
                          <React.Fragment key={index}>
                            <div className="bg-white border-2 border-gray-400 relative p-4 rounded mt-5">
                              <div className="grid grid-cols-12 gap-x-8 gap-y-5">
                                <div className="col-span-12">
                                  <div className="flex items-center justify-between">
                                    <label className="inline-block text-xl font-semibold">
                                      {item?.type} Notice
                                    </label>
                                    <label className="inline-block text-gray-500 font-medium mb-1 justify-end">
                                      Approval Status -{" "}
                                      <span className="font-semibold text-gray-800">
                                        {item?.statusName == "Active"
                                          ? "Approved"
                                          : item?.statusName}
                                      </span>
                                    </label>
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
                                    item?.type == "Withdraw"
                                      ? "col-span-8"
                                      : "col-span-12"
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
                        )
                      )}
                    </div>
                  )}

                  {/* ----------------AGGREGATOR STATUS SECTION ENDS HERE---------------- */}

                  {/* -------------------AGGREGATOR AUDIT LOG SECTION --------------------------- */}
                  {mouId && (
                    <AuditLogs
                      id={
                        openPreviewIdData?.parentContractId
                          ? openPreviewIdData?.parentContractId
                          : openPreviewIdData?.aggregatorId
                      }
                      type="Aggregator"
                      print={true}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="preview-actions mt-4 -ml-0.5 -mr-0.5 pb-5 pt-3 border-t flex justify-center gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  window.location.reload();
                  setOpenPreview(false);
                }}
                className="border border-blue-600 bg-white hover:bg-blue-600 hover:text-white font-medium rounded text-md px-5 py-2.5 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={printContent}
                className="border border-blue-600 text-white bg-blue-600 hover:bg-blue-700 focus:ring-0 font-medium rounded text-md px-5 py-2.5 flex items-center"
              >
                <BsPrinter size={"16px"} className="mr-3" /> Print
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ViewMouAggregator;
