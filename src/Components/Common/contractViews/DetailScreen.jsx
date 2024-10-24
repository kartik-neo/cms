import React, { useState } from "react";
// import VerifyModalBox from "../Common/ModalPopups/VerifyModalBox";
import DepartmentViews from "./DepartmentViews";
import KeyDatesViews from "./KeyDatesViews";
import PartDetailsViews from "./PartDetailsViews";
import CustodianDetailsViews from "./CustodianDetailsViews";
import StepperBar from "../StepperBar";
import TerminationModal from "../ModalPopups/TerminationModal";
import { AiOutlineFilePdf } from "react-icons/ai";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { fetchContractView } from "../../../Services/contractTypeMastersServices";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../PageTitle";
import AuditLogs from "../AuditLogs";
import {
  BsPrinter,
} from "react-icons/bs";
import PostTerminationCommon from "../PostTerminationCommon";
import LatestModalPopUp from "../LatestModalPopUp";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { createContractForm } from "../../../Services/contractServices";
import { convertIntoUnix} from "../../../utils/functions";
import { ToastContainer, toast } from "react-toastify";
import {
  getAllUloadedFiles,
} from "../../../Services/uploadService";
import {
  bifurcateApprovelStatuse,
  bifurcateTerminationStatuse,
  convertFromUnix1,
} from "../../../utils/other";
import UploadMediaCMS from "../UploadMediaCMS";
import { useForm } from "react-hook-form";
import PostTerminationNotice from "../../MOU/PostTerminationNotice";
import { FiEdit } from "react-icons/fi";
import { TETooltip } from "tw-elements-react";

const DetailScreen = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  const { cameFrom, typeOf, contractType, type } = location.state || {
    cameFrom: searchParams.get("cameFrom"),
    typeOf: searchParams.get("typeOf"),
    contractType: searchParams.get("contractType"),
    type: searchParams.get("type"),
  };

  const [isTerminate, setIsTerminate] = useState(false);
  const [datacon, setDatacon] = useState([]);
  const [alert, setAlert] = useState(false);
  const [renewal, setRenewal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [renewId, setRenewId] = useState();
  const [docCount, setDocCount] = useState();
  const [mouStatuses, setMouStatuses] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [showEditTermination, setShowEditTermination] = useState(false);
  const [terminationNotice, setTerminationNotice] = useState(false);


  const {
    register,
    handleSubmit,
    disabled,
    formState: { errors },
  } = useForm({});

  const data = [
    { title: "Create Conntract", isActive: true, step: 1 },
    { title: "Approval 1 Pending", isActive: true, step: 2 },
    { title: "Approval 2 Pending", isActive: false, step: 3 },
    { title: "Active Contract", isActive: false, step: 4 },
  ];

 

  const handleDocumentList = async (id) => {
    try {
      const documentList = await fetchContractView({ id: id });
      const response = documentList?.data[0];
      setDatacon(documentList?.data[0]);
      
      if (
        cameFrom &&
        typeOf &&
        cameFrom == "Pending Approval" &&
        (typeOf == "Termination" || typeOf == "Withdraw Notice")
      ) {
        const data = response?.terminationDetails?.filter(
          (item) => item?.statusName == "Pending Approval"
        );
        const dataToSend = data?.length ? data[0]?.terminationApprovalLogs : [];
        const detail = data?.length ? data[0] : null;
        const statuses = bifurcateTerminationStatuse(
          dataToSend,
          detail?.createdBy,
          detail?.createdOn,
          detail?.statusName,
          typeOf
        );
        setMouStatuses(statuses);
      } else {
        const statuses = bifurcateApprovelStatuse(
          response?.contractApprovalLogs,
          response?.createdBy,
          response?.createdOn,
          response?.statusName,
          response?.keyExpiryDate,
          typeOf
        );
        setMouStatuses(statuses);
      }

      // if (response?.status == "Active" && cameFrom == "Pending Approval") {
      //   const data = response?.terminationDetails?.filter(
      //     (data) => data?.type == "Terminated"
      //   )[0];
      //   const statuses = bifurcateTerminationStatus(
      //     // response?.terminationDetails,
      //     data?.terminationApprovalLogs,
      //     data?.createdBy,
      //     data?.createdOn,
      //     response?.approvalMatrixModel,
      //     response?.terminationDetails[0].statusName,
      //     location?.state?.typeOf
      //   );
      //   setMouStatuses(statuses);
      // } else {
      //   const statuses = bifurcateApprovelStatuse(
      //     response?.contractApprovalLogs,
      //     response?.createdBy,
      //     response?.createdOn,
      //     response?.approvalMatrixModel,
      //     response?.status,
      //     location?.state?.typeOf
      //   );
      //   setMouStatuses(statuses);
      // }
    } catch (error) {
      console.error("Error:", error);
      // setIsLoaded(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleDocumentList(id);
    }
  }, [id]);

  const navigate = useNavigate();
  let value;
  if (location?.state?.type == "Pending Approval") {
    value = "pending";
  } else if (location?.state?.type == "Terminated") {
    value = "terminated";
  } else if (location?.state?.type == "Rejected") {
    value = "rejected";
  } else if (location?.state?.type == "Active") {
    value = "active";
  } else {
    value = "";
  }

  const breadCrumbData = [
    {
      route: value == "" ? "/contract-list" : `/contract-list-${value}`,
      name:
        location?.state?.type == undefined
          ? `Contract List All`
          : `Contract List ${location?.state?.type}`,
    },
    {
      route: "",
      name:
        contractType == "Classified"
          ? `View Contract [Classified] ${datacon?.contractId}`
          : `View Contract ${datacon?.contractId}`,
    },
  ];

  const handleContract = () => {
    const payload = {
      id: 0,
      locationId: datacon?.locationId,
      locationName: datacon?.locationName,
      departmentId: datacon?.departmentId,
      departmentName: datacon?.departmentName,

      contractTypeId: datacon?.contractTypeId,
      contractTypeOther: datacon?.contractTypeOther,

      companyId: datacon?.companyId,
      // contractId: datacon?.id.toString(),
      contractId: "",

      // contractReference: allContractData?.id.toString(),

      contractReference: datacon?.id ? datacon?.id?.toString() : null,
      // contractReference: "",

      reference: datacon?.reference,
      apostilleId: datacon?.apostilleId,

      retainerContractId: datacon?.retainerContractId,
      retainerContractName: datacon?.retainerContractName,
      terms: datacon?.terms,

      keyEffectiveDate: datacon?.keyEffectiveDate,
      keyExpiryDate: datacon?.keyExpiryDate,
      renewalEffectiveDate: datacon?.renewalEffectiveDate,
      renewalExpiryDate: datacon?.renewalExpiryDate,

      empCode: datacon?.empCode,
      empId: datacon?.empCode,
      empName: datacon?.empName,
      empEmail: datacon?.empEmail,
      empPhone: datacon?.empPhone,
      designationId: 0,
      designation: datacon?.designation,
      empDepartment: datacon?.empDepartment,
      empLocationId: 0,
      empLocation: datacon?.empLocation,

      cmpName: datacon?.cmpName,
      cmpPhone: datacon?.cmpPhone,
      cmpEmail: datacon?.cmpEmail,
      cmpAdd1: datacon?.cmpAdd1,
      cmpAdd2: datacon?.cmpAdd2,
      cmpAdd3: datacon?.cmpAdd3,
      cmpPincode: datacon?.cmpPincode,
      cmpState: datacon?.cmpState,
      cmpStateId: datacon?.cmpStateId,
      cmpCity: datacon?.cmpCity,
      cmpCityId: datacon?.cmpCityId,
      cmpCountry: datacon?.cmpCountry,
      cmpCountryId: datacon?.cmpCountryId,
      pocName: datacon?.pocName,
      pocContactNo: datacon?.pocContactNo,
      pocEmailID: datacon?.pocEmailID,

      isClassified: contractType == "Classified" ? true : false,
      isActive: true,
      isDeleted: false,
      globalObjectId: datacon?.globalObjectId,
      previousContractId: datacon?.contractId,

      contractStatusType: "Renewal",
      contractCustodianDetailsModel: {
        cId: datacon?.contractCustodianDetailsModel?.cId,
        custodianDetails:
          datacon?.contractCustodianDetailsModel?.custodianDetails,
        custodianEmpCode:
          datacon?.contractCustodianDetailsModel?.custodianEmpCode,
        custodianFileLocation:
          datacon?.contractCustodianDetailsModel?.custodianFileLocation,
        custodianName: datacon?.contractCustodianDetailsModel?.custodianName,
        custodianFilePath:
          datacon?.contractCustodianDetailsModel?.custodianFilePath,
      },
    };


    const createContract = async () => {
      try {
        const contractData = await createContractForm({ data: payload });
        if (contractData?.success) {
          setRenewId(contractData?.data[0]?.id);
          setConfirm(true);
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
    createContract();
  };

  useEffect(() => {
    if (renewal) {
      handleContract();
    }
  }, [renewal]);

  async function getUploadedFiles(globalObjectId) {
    try {
      // const response = await getAllUloadedFiles(15);
      if (isNaN(globalObjectId)) return;
      const response = await getAllUloadedFiles(globalObjectId);
      if (response?.data) {
        setDocCount(response?.data?.length);
      }
    } catch (e) {
      toast.error(e?.message ?? "Error while fetching uploaded files", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(() => {
    location.state && getUploadedFiles(location.state);
  }, [location.state]);

  useEffect(() => {
    datacon?.globalObjectId && getUploadedFiles(datacon?.globalObjectId);
  }, [datacon?.globalObjectId]);

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
    if (datacon) {
      let result = datacon?.terminationDetails;
      if (Array.isArray(result)) {
        const firstObject = result[0];
        const firstApprovalLog =
          firstObject?.terminationApprovalLogs &&
          firstObject?.terminationApprovalLogs[0];
        const currentLevelStatus =
          firstApprovalLog &&
          firstApprovalLog?.level == 2 &&
          firstApprovalLog?.statusName == "Pending";
        if (currentLevelStatus) {
          setShowEditTermination(true);
        }
      }
    }
  }, [datacon]);

  return (
    <>
      <PageTitle
        title={
          contractType == "Classified"
            ? `View contract [Classified] ( ${datacon?.contractId ?? "-"} )`
            : `View contract ( ${datacon?.contractId ?? "-"} )`
        }
        buttonTitle=""
        breadCrumbData={breadCrumbData}
        bg={true}
        terminationData={datacon?.terminationStatuses?.length ? 
          {
            startDate:datacon?.terminationStatuses[0]?.terminationStartDate,
            endsDate:datacon?.terminationStatuses[0]?.terminationEndDate
        } : ""}
      />

      <div className="mb-4">
        <StepperBar data={mouStatuses} step={1} />
      </div>

      <div className="content-wrapper">
        <div className="px-8 py-8 rounded bg-white shadow relative">
          <DepartmentViews data={datacon} />

          <hr className="my-8" />

          <KeyDatesViews data={datacon} />

          <hr className="my-8" />

          <PartDetailsViews data={datacon} />

          <hr className="my-8" />

          <CustodianDetailsViews data={datacon} />

          <hr className="my-8" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-4">
              <UploadMediaCMS
                register={register}
                handleSubmit={handleSubmit}
                globalObjectId={datacon?.globalObjectId}
                disabled={true}
                errors={errors}
                name="View Attachment"
                mandate={true}
                uploadFor={"Contract Document"}
              />
            </div>
            <div>
              <p
                className="text-lg font-medium cursor-pointer flex flex-items-center justify-between"
                onClick={() =>
                  navigate(`/view-doc/${datacon?.id}/${datacon?.contractId}`, {
                    state: {
                      contractId: datacon?.parentContractId
                        ? datacon?.parentContractId
                        : datacon?.id,
                      globalObjectId: datacon?.globalObjectId,
                      companyName: datacon?.companyName,
                    },
                  })
                }
              >
                <AiOutlineFilePdf className="text-red-500" size={"25px"} />
              </p>
            </div>
          </div>
        </div>

        {datacon?.terminationDetails && (
          <div className="mt-5">
            {datacon?.terminationDetails?.map((item, index) => (
              <React.Fragment key={index}>
                <div className="bg-white shadow relative p-4 rounded mb-5">
                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12">
                      <div className="flex items-center justify-between">
                        <label className="inline-block text-xl font-semibold">
                          {item?.type == "Terminated"
                            ? "Termination"
                            : "Withdraw"}{" "}
                          Notice
                        </label>
                        <label className="inline-block text-gray-500 font-medium mb-1 justify-end">
                          Approval Status -{" "}
                          <span className="font-semibold text-gray-800">
                            {item?.statusName == "Active"
                              ? "Approved"
                              : item?.statusName}
                          </span>
                        </label>
                        {showEditTermination && (
                          // <label
                          //   htmlFor=""
                          //   onClick={() => setTerminationNotice(true)}
                          // >
                          //   <GrEdit className="cursor-pointer" />
                          // </label>
                          <TETooltip title={"Edit termination"}>
                            <FiEdit
                              className="text-xl"
                              onClick={() => setTerminationNotice({status:true,dateFrom:convertFromUnix1(item?.startDate),dateTo:convertFromUnix1(item?.endsDate),index:index})}
                            />
                          </TETooltip>
                        )}
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <UploadMediaCMS
                        register={register}
                        handleSubmit={handleSubmit}
                        globalObjectId={datacon.globalObjectId}
                        disabled={true}
                        errors={errors}
                        name={`${
                          item?.type == "Terminated"
                            ? "Termination"
                            : item?.type == "Withdraw"
                            ? "Withdrawal"
                            : ""
                        } Notice`}
                        mandate={true}
                        uploadFor={
                          item?.type == "Terminated"
                            ? "Termination Notice"
                            : item?.type == "Withdraw"
                            ? "Withdrawal Notice"
                            : ""
                        }
                        isVisible={false}
                        id={id}
                        type={item?.type}
                        requestTypeId={item?.tRequestId?.slice(1)}
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

                    {/* <div className="col-span-12 md:col-span-4">
                      <label
                        htmlFor=""
                        className="inline-block text-gray-500 text-lg mb-1"
                      >
                        Start Date
                      </label>
                      <p className="text-lg font-medium">
                        {convertFromUnix1(item?.startDate)}
                      </p>
                    </div> */}
                    {/* <div className="col-span-12 md:col-span-4">
                      <label
                        htmlFor=""
                        className="inline-block text-gray-500 text-lg mb-1"
                      >
                        End Date
                      </label>
                      <p className="text-lg font-medium">
                        {convertFromUnix1(item?.endDate)}
                      </p>
                    </div> */}

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

        <PostTerminationCommon
          globalObjectId={datacon.globalObjectId}
          contractId={id}
          dateFrom={datacon.keyEffectiveDate}
          dateTo={datacon.keyExpiryDate}
          mouContractOrContractDetails={datacon}
          contractIdDisplay={datacon.cmpName}
          setAlert={setAlert}
          type={location?.state}
          name="Contract"
          setOpenPreview={setOpenPreview}
          contractType={contractType}
        />

        {alert && (
          <LatestModalPopUp
            open={alert}
            title={`Are you sure, you want to renew Contract ${datacon?.companyName}`}
            setOpen={setAlert}
            icon={
              <ExclamationTriangleIcon
                className="h-10 w-10 text-red-600"
                aria-hidden="true"
              />
            }
            buttons={[
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                onClick={() => {
                  // setRenewal(true);
                  navigate("/renewal", {
                    state: {
                      // contractType: 2,
                      contractId: id,
                      path: "detailScreen",
                      refValue: "",
                      cameFrom: "active-contract",
                      contractType: contractType,
                      // contractType: "renewal",
                    },
                  });
                  // setConfirm(true);
                }}
              >
                Renew
              </button>,
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setAlert(false)}
                data-autofocus
              >
                Cancel
              </button>,
            ]}
          />
        )}

        {confirm && (
          <LatestModalPopUp
            open={confirm}
            title={`You will be able to modify details for ${datacon?.contractId}`}
            setOpen={setConfirm}
            icon={
              <CheckBadgeIcon
                className="h-10 w-10 text-green-600"
                aria-hidden="true"
              />
            }
            buttons={[
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                onClick={() =>
                  navigate(`/contract-edit/${renewId}`, {
                    state: { renew: true, contractType: contractType },
                  })
                }
              >
                Ok
              </button>,
            ]}
          />
        )}

      
       
        {id && (
          <AuditLogs
            // id={datacon?.contractReference ? datacon?.contractReference : id}
            id={
              datacon?.parentContractId
                ? datacon?.parentContractId
                : datacon?.id
            }
            type="Contract"
            print={false}
          />
        )}

        {terminationNotice?.status && (
          <PostTerminationNotice
            globalObjectId={datacon.globalObjectId}
            contractId={id}
            dateFrom={(terminationNotice?.dateFrom && convertIntoUnix(terminationNotice?.dateFrom))|| datacon.keyEffectiveDate}
            dateTo={(terminationNotice?.dateFrom && convertIntoUnix(terminationNotice?.dateTo)) || datacon.keyExpiryDate}
            mouContractOrContractDetails={datacon}
            contractIdDisplay={datacon.cmpName}
            open={terminationNotice?.status}
            terminationIndex={terminationNotice?.index}
            setOpen={()=>setTerminationNotice({status:false,dateFrom:null,dateTo:null})}
            editTermination={true}
            updateName="Contract"
            mou={false}
          />
        )}

       
        {isTerminate && (
          <TerminationModal
            title="Post Termination Notice"
            isOpen={isTerminate}
            setIsOpen={setIsTerminate}
            // setShowSuccessModal={setShowSuccessModal}
            // confirmPost={onSubmit}
          />
        )}

{openPreview ? (
          <div className="z-50 fixed inset-0  flex justify-center w-[100%] py-10 bg-black bg-opacity-35 top-0 left-0">
            <div className="my-4 overflow-y-scroll bg-white px-5 pt-10 rounded-lg">
              <div id="contentToPrint">
                {contractType == "Classified" ? (
                  <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-4">{`Classified Contract ( ${
                    datacon?.contractId ?? "-"
                  } )`}</h1>
                ) : (
                  <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-4">{`Contract ( ${
                    datacon?.contractId ?? "-"
                  } )`}</h1>
                )}

                <div className="mb-4">
                  <StepperBar data={mouStatuses} step={1} />
                </div>

                <div className="px-8 py-8 rounded bg-white shadow relative">
                  <DepartmentViews data={datacon} />

                  <hr className="my-8" />

                  <KeyDatesViews data={datacon} />

                  <hr className="my-8" />

                  <PartDetailsViews data={datacon} />

                  <hr className="my-8" />

                  <CustodianDetailsViews data={datacon} />

                  <hr className="my-8" />

                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-4">
                      <UploadMediaCMS
                        register={register}
                        handleSubmit={handleSubmit}
                        globalObjectId={datacon?.globalObjectId}
                        disabled={true}
                        errors={errors}
                        name="View Attachment"
                        mandate={true}
                        uploadFor={"Contract Document"}
                      />
                      {/* <p
                        className="text-lg font-medium cursor-pointer flex flex-items-center justify-between"
                        onClick={() =>
                          navigate(
                            `/view-doc/${datacon?.id}/${datacon?.contractId}`,
                            {
                              state: {
                                contractId: datacon?.id,
                                globalObjectId: datacon?.globalObjectId,
                                companyName: datacon?.companyName,
                              },
                            }
                          )
                        }
                      >
                        <span>
                          {" "}
                          {`View Attachments (${docCount ? docCount : "-"})`}
                        </span>
                        <AiOutlineFilePdf
                          className="text-red-500"
                          size={"25px"}
                        />
                      </p> */}
                    </div>
                  </div>
                  <hr className="my-8" />
                  {datacon?.terminationDetails && (
                    <div className="mt-5">
                      {datacon?.terminationDetails?.map((item, index) => (
                        <React.Fragment key={index}>
                          <div className="bg-white shadow relative p-4 rounded mb-5">
                            <div className="grid grid-cols-12 gap-5">
                              <div className="col-span-12">
                                <div className="flex items-center justify-between">
                                  <label className="inline-block text-xl font-semibold">
                                    {item?.type == "Terminated"
                                      ? "Termination"
                                      : "Withdraw"}{" "}
                                    Notice
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
                                  register={register}
                                  handleSubmit={handleSubmit}
                                  globalObjectId={datacon.globalObjectId}
                                  disabled={true}
                                  errors={errors}
                                  name={`${
                                    item?.type == "Terminated"
                                      ? "Termination"
                                      : item?.type == "Withdraw"
                                      ? "Withdrawal"
                                      : ""
                                  } Notice`}
                                  mandate={true}
                                  uploadFor={
                                    item?.type == "Terminated"
                                      ? "Termination Notice"
                                      : item?.type == "Withdraw"
                                      ? "Withdrawal Notice"
                                      : ""
                                  }
                                  isVisible={false}
                                />{" "}
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

                              {/* <div className="col-span-12 md:col-span-4">
                      <label
                        htmlFor=""
                        className="inline-block text-gray-500 text-lg mb-1"
                      >
                        Start Date
                      </label>
                      <p className="text-lg font-medium">
                        {convertFromUnix1(item?.startDate)}
                      </p>
                    </div> */}
                              {/* <div className="col-span-12 md:col-span-4">
                      <label
                        htmlFor=""
                        className="inline-block text-gray-500 text-lg mb-1"
                      >
                        End Date
                      </label>
                      <p className="text-lg font-medium">
                        {convertFromUnix1(item?.endDate)}
                      </p>
                    </div> */}

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
                  <hr className="my-8" />
                  {id && (
                    <AuditLogs
                      id={
                        datacon?.parentContractId
                          ? datacon?.parentContractId
                          : datacon?.id
                        // datacon?.contractReference
                        //   ? datacon?.contractReference
                        //   : id
                      }
                      type="Contract"
                      print={true}
                    />
                  )}
                </div>
              </div>
              <div className="preview-actions mt-4 -ml-0.5 -mr-0.5 pb-5 pt-3 border-t flex justify-center gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setOpenPreview(false)}
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
      <ToastContainer />
    </>
  );
};

export default DetailScreen;
