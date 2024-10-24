import React, { useContext, useEffect, useRef, useState } from "react";
import StepperBar from "../../Components/Common/StepperBar";
import TPA from "../../Components/MOU/TPA";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Aggregator from "./Aggregator";
import AuditLogs from "../../Components/Common/AuditLogs";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LatestModalPopUp from "../../Components/Common/LatestModalPopUp";

import { getMouById } from "../../Services/mouServices";
import { toast } from "react-toastify";
import MOUContext from "../../context/MOUContext";
import {
  bifurcateApprovelStatuse,

  bifurcateTerminationStatuse,
 
  bifurcateWithdrawalStatuse,
  makeItProperObject,
} from "../../utils/other";
import PageTitle from "../../Components/Common/PageTitle";
import {

  BsPrinter,
} from "react-icons/bs";
import PostTerminationCommon from "../../Components/Common/PostTerminationCommon";

const ViewMOU = () => {
  const navigate = useNavigate();
  const { mouId } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [alert, setAlert] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [contractType, setContractType] = useState();
  const [contractName, setContractName] = useState();
  const [mouContractOrContractDetails, setMouContractOrContractDetails] =
    useState();
  const { MOUDetails, setMOUDetails } = useContext(MOUContext);
  const [globalObjectId, setGlobalObjectId] = useState();
  const [mouName, setMouName] = useState();
  const [breadCrumb, setBreadCrumb] = useState();
  const [renewal, setRenewal] = useState(false);
  const [addendum, setAddendum] = useState(false);
  const [renewalId, setRenewalId] = useState(false);
  const [mouStatuses, setMouStatuses] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const componentRef = useRef();
  const [creditCompany, setCreditCompany] = useState();
  const { cameFrom, typeOf, type } = location.state || {
    cameFrom: searchParams.get("cameFrom"),
    typeOf: searchParams.get("typeOf"),
    contractType: searchParams.get("contractType"),
    type: searchParams.get("type"),
  };

  const data = [
    { title: "MOU Created", isActive: true, step: 1 },
    { title: "Approval 1 Pending", isActive: true, step: 2 },
    { title: "Approval 2 Pending", isActive: false, step: 3 },
    { title: "Active MOU", isActive: false, step: 4 },
  ];

  const formatUnixToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getMouDetails = async (id) => {
    try {
      const mouDetail = await getMouById({ id: id });

      if (mouDetail?.success) {
        const response = mouDetail?.data?.length ? mouDetail?.data[0] : {};
        setContractName(response?.contractName);
        setMouName(response?.mouId);

        setMouContractOrContractDetails(response);

        if (
          cameFrom &&
          typeOf &&
          cameFrom == "Pending Approval" &&
          typeOf == "Termination"
        ) {
          const data = response?.terminationDetails?.filter(
            (item) => item?.statusName == "Pending Approval"
          );
          const dataToSend = data?.length
            ? data[0]?.terminationApprovalLogs
            : [];
          const detail = data?.length ? data[0] : null;
          const statuses = bifurcateTerminationStatuse(
            dataToSend,
            detail?.createdBy,
            detail?.createdOn,
            detail?.statusName,
            typeOf,
            data[0]?.endsDate
          );
          setMouStatuses(statuses);
        } else if (
          cameFrom &&
          typeOf &&
          cameFrom == "Pending Approval" &&
          typeOf == "Withdraw Notice"
        ) {
          const data = response?.terminationDetails?.filter(
            (item) => item?.statusName == "Pending Approval"
          );
          const dataToSend = data?.length
            ? data[0]?.terminationApprovalLogs
            : [];
          const detail = data?.length ? data[0] : null;
          const statuses = bifurcateWithdrawalStatuse(
            dataToSend,
            detail?.createdBy,
            detail?.createdOn,
            detail?.statusName,
            typeOf,
            data[0]?.endsDate
          );
          setMouStatuses(statuses);
        }
       
        else {
          const statuses = bifurcateApprovelStatuse(
            response?.contractApprovalLogs,
            response?.createdBy,
            response?.createdOn,
            response?.statusName,
            response?.validityDateTo,
            typeOf
          );
          setMouStatuses(statuses);
        }

        
        if (response?.categoryTypeName == "TPA") {
          const defaultValue = makeItProperObject(response, 1);
          // setDefaultData(defaultValue);
          setGlobalObjectId(response?.globalObjectId);
          setDateFrom(response?.validityDateFrom);
          setDateTo(response?.validityDateTo);
          setMOUDetails(defaultValue);

          setContractType(1);
        }
        if (response?.categoryTypeName == "Corporate") {
          const defaultValue = makeItProperObject(response, 2);
          // setDefaultData(defaultValue);
          setGlobalObjectId(response?.globalObjectId);
          setDateFrom(response?.validityDateFrom);
          setDateTo(response?.validityDateTo);
          setMOUDetails(defaultValue);

          setContractType(2);
        }
        if (response?.categoryTypeName == "Aggregator") {
          const defaultValue = makeItProperObject(response, 3);
          // setDefaultData(defaultValue);
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
        name: type == undefined ? `Mou List All` : `Mou List ${type}`,
      },
      {
        route: "",
        name: `Mou Contract ${mouName}`,
      },
    ]);
  }, [mouName]);

  function renewalSuccess() {
    setAlert(false);
    setConfirm(true);
  }

  function afterPrintCallback() {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  const printContent = () => {
    const content = document.getElementById("contentToPrintMou").innerHTML;
    const originalBody = document.body.innerHTML;
    document.body.innerHTML = content;
    window.onafterprint = afterPrintCallback;
    window.print();
    document.body.innerHTML = originalBody;
  };

  return (
    <div>
      <PageTitle
        title={`Mou Contract ${mouName}`}
        buttonTitle=""
        breadCrumbData={breadCrumb}
        bg={true}
        terminationData={
          MOUDetails?.terminationStatuses != null
            ? {
                startDate:
                  MOUDetails?.terminationStatuses?.terminationStartDate,
                endsDate: MOUDetails?.terminationStatuses?.terminationEndDate,
              }
            : ""
        }
      />
      <div className="mb-4">
        <StepperBar data={mouStatuses} step={1} />
      </div>

      <div className="grid grid-cols-12 py-4 px-4 bg-white shadow ">
        <div className="col-span-12">
          <p className="text-xl font-semibold">
            {contractType == 1 ? "TPA" : contractType == 2 ? "Corporate" : ""}
          </p>
        </div>
      </div>

      {contractType && contractType == 1 && (
        <TPA
          contractType={1}
          globalObjectIdVal={globalObjectId}
          view={true}
          renewal={renewal}
          addendum={addendum}
          renewalSuccess={renewalSuccess}
          setRenewalId={setRenewalId}
        />
      )}
      {contractType && contractType == 2 && (
        <TPA
          contractType={2}
          globalObjectIdVal={globalObjectId}
          view={true}
          renewal={renewal}
          addendum={addendum}
          renewalSuccess={renewalSuccess}
          setRenewalId={setRenewalId}
        />
      )}
      {contractType && contractType == 3 && (
        <Aggregator
          contractType={3}
          view={true}
          globalObjectIdVal={globalObjectId}
          creditCompanyProp={creditCompany}
          renewal={renewal}
          renewalSuccess={renewalSuccess}
          setRenewalId={setRenewalId}
        />
      )}

      {alert && (
        <LatestModalPopUp
          open={alert}
          title={`Renew MOU ${contractName}`}
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
                // setAlert(false);
                // setConfirm(true);
                navigate(`/edit-mou-contract/${mouId}?edit=true`, {
                  state: { addendum: false, renew: true },
                });
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
          title={`You will be able to modify details for ${contractName}`}
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
                navigate(`/edit-mou-contract/${renewalId}?edit=true`, {
                  state: { renew: true },
                })
              }
            >
              Ok
            </button>,
          ]}
        />
      )}

      {openPreview ? (
        <div  className="z-50 fixed inset-0  flex justify-center w-[100%] py-10 bg-black bg-opacity-35 top-0 left-0">
          <div className="my-4 overflow-y-scroll bg-white px-5 pt-10 rounded-lg">
            <div id="contentToPrintMou">
              <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-4">{`Mou Contract ${mouName}`}</h1>
              <div className="mb-4">
                <StepperBar data={mouStatuses} step={1} />
              </div>

              <div className="grid grid-cols-12 py-4 px-4 bg-white shadow ">
                <div className="col-span-12">
                  <p className="text-xl font-semibold">
                    {contractType == 1
                      ? "TPA"
                      : contractType == 2
                      ? "Corporate"
                      : ""}
                  </p>
                </div>
              </div>

              {contractType && contractType == 1 && (
                <TPA
                  contractType={1}
                  globalObjectIdVal={globalObjectId}
                  view={true}
                  renewal={renewal}
                  addendum={addendum}
                  renewalSuccess={renewalSuccess}
                  setRenewalId={setRenewalId}
                />
              )}
              {contractType && contractType == 2 && (
                <TPA
                  contractType={2}
                  globalObjectIdVal={globalObjectId}
                  view={true}
                  renewal={renewal}
                  addendum={addendum}
                  renewalSuccess={renewalSuccess}
                  setRenewalId={setRenewalId}
                />
              )}

              {contractType && contractType == 3 && (
                <Aggregator
                  contractType={3}
                  view={true}
                  globalObjectIdVal={globalObjectId}
                  creditCompanyProp={creditCompany}
                  renewal={renewal}
                  renewalSuccess={renewalSuccess}
                  setRenewalId={setRenewalId}
                />
              )}

              {mouId && (
                <AuditLogs
                  id={
                    mouContractOrContractDetails?.parentContractId
                      ? mouContractOrContractDetails?.parentContractId
                      : mouId
                  }
                  type="Mou"
                  print={true}
                />
              )}
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

      {/* {terminationNotice && (
        <PostTerminationNotice
          globalObjectId={globalObjectId}
          mouId={mouId}
          dateFrom={dateFrom}
          dateTo= {dateTo}
          open={terminationNotice}
          setOpen={setTerminationNotice}
        />
      )} */}

      {/* {view && ( */}
      {contractType != 3 && (
        <>
          <PostTerminationCommon
            // setTerminationNotice= {setTerminationNotice}
            globalObjectId={globalObjectId}
            mouId={mouId}
            dateFrom={dateFrom}
            dateTo={dateTo}
            mouContractOrContractDetails={mouContractOrContractDetails}
            setAlert={setAlert}
            mou={true}
            setOpenPreview={setOpenPreview}
          />
         
        </>
      )}

      {/* // )} */}
      {/* {view && ( */}
      {mouId && (
        <AuditLogs
          id={
            mouContractOrContractDetails?.parentContractId
              ? mouContractOrContractDetails?.parentContractId
              : mouId
          }
          type="Mou"
          print={false}
        />
      )}

      {/* )} */}
    </div>
  );
};

export default ViewMOU;
