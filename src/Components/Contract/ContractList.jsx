import React, { useState, useEffect, useContext } from "react";
import DataTable from "../Common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import "../../Components/Common/DataTable/index.css";
import PageTitle from "../Common/PageTitle";
import { Link, useNavigate } from "react-router-dom";
import { usePermission } from "../../App";
import { MENU_PERMISSIONS } from "../../Constant/permissionConstant";
import Loader from "../Common/Loader";
import {
  formatDurationFromUnixTimestamp,
  userDetails,
} from "../../utils/functions";
import FilterContract from "../Common/DataTable/FilterContract";
import {
  deleteContract,
  fetchContractList,
} from "../../Services/contractServices";
import { BsTrash } from "react-icons/bs";
import { FiFile } from "react-icons/fi";
import { TETooltip } from "tw-elements-react";
import LatestModalPopUp from "../Common/LatestModalPopUp";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import SuccessModal from "../Common/ModalPopups/SuccessModal";
import { useLocation } from "react-router-dom";
import StatusChip from "../Common/DataTable/StatusChip";
import UserContext from "../../context/UserContext";

const ContractList = ({
  title = true,
  filter = true,
  isPaginated = true,
  type,
  contractType,
  isDashBoard,
  showContractStatus,
  isClassified = false,
  showDownload = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const Navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cameFrom = location?.state?.cameFrom;
  const status = queryParams.get("status");
  const contractOptionId = queryParams.get("contractOptionId");
  const dateFrom = queryParams.get("dateFrom");
  const dateTo = queryParams.get("dateTo");
  const titleName = queryParams.get("titleName");
  const [defaultData, setData] = React.useState();
  const [downloadData, setDownloadData] = React.useState();
  const [filters, setFilters] = useState();
  const [idToDelete, setIdToDelete] = useState();
  const [idDisplay, setIdDisplay] = useState();
  const [verify, setVerify] = useState(false);
  const [success, setSuccess] = useState(false);

  // const isAdmin = fetchIsAdmin();
  const { isAdmin } = useContext(UserContext);
  // Call usePermission hook unconditionally
  const deletePermission = usePermission(
    MENU_PERMISSIONS?.CMS.Contract?.Delete
  );
  const editPermission = usePermission(MENU_PERMISSIONS?.CMS.Contract?.Edit);
  const createPermission = usePermission(
    MENU_PERMISSIONS?.CMS.Contract?.Create
  );
  // const viewDocPermission = usePermission(
  //   MENU_PERMISSIONS?.CMS?.DocumentMaster?.View
  // );
  const viewDocPermission = true;

  const handleContractList = async (queryString = "") => {
    try {
      setIsLoaded(true);

      if (isClassified) {
        if (
          status === "Expired" ||
          status === "Terminated" ||
          status === "Active"
        ) {
          const result = await fetchContractList(
            queryString,
            status,
            isClassified,
            location
          );
          setData(result?.data);
          setIsLoaded(false);
        } else {
          // Handle case when status is not one of the specified values
          const result = await fetchContractList(
            queryString,
            type,
            isClassified,
            location
          );
          setData(result?.data);
          setIsLoaded(false);
        }
      } else {
        const result = await fetchContractList(
          queryString,
          type,
          isClassified,
          location
        );
        setData(result?.data);
        setIsLoaded(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoaded(false);
    }
  };

  const handleDeleteContract = async () => {
    if (idToDelete) {
      try {
        setVerify(false);
        setIsLoaded(true);
        const result = await deleteContract(idToDelete);
        // setData(result?.data);
        if (result?.success) {
          handleContractList();
          setIsLoaded(false);
          setSuccess(true);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsLoaded(false);
        toast.error(error.message ?? "Error while deleting contract", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      setVerify(false);
    }
  };

  const columnHelper = createColumnHelper();
  const userDetailsVal = userDetails();
  const loggedInUserId = userDetailsVal?.user;
  // const handleClick = (info) => {
  //   const targetUrl =
  //     info?.row?.original?.status !== "Pending Approval" && editPermission
  //       ? `/contract-edit/${info?.row?.original?.id}`
  //       : `/details-screen/${info.row?.original?.id}`;
  //   Navigate(targetUrl, { state: "Contract" });
  // };

  useEffect(() => {
    let newObject =
      defaultData &&
      defaultData.map((item) => ({
        "Contract ID": item.contractId,
        "Contract Name": item.companyName
          ? item.companyName?.split(",").join(" ")
          : "-",
        "Contract Type": item?.contractTypeName || item?.contractTypeOther,
        Department: item.departmentName,
        "Effective Date": item.keyEffectiveDate
          ? formatDurationFromUnixTimestamp(item.keyEffectiveDate)
          : "-",
        "Expiry Date": item?.keyExpiryDate
          ? formatDurationFromUnixTimestamp(item?.keyExpiryDate)
          : "-",
        "To Be Renewed on": item.renewalEffectiveDate
          ? formatDurationFromUnixTimestamp(item.renewalEffectiveDate)
          : "-",
        "Last Renewed on": item.lastRenewedOn
          ? formatDurationFromUnixTimestamp(item.lastRenewedOn)
          : "-",

        "Addendum Date": item.addendumDate
          ? formatDurationFromUnixTimestamp(item.addendumDate)
          : "-",
        Status: item.status,
        "Approval Pending from": item.approvalPendingFrom,
        "Renewal Due in": item.renewalDueIn,
        "Created On": item?.createdOn
          ? formatDurationFromUnixTimestamp(item?.createdOn)
          : "-",
        "Created By": item.createdBy,
        // "Type Of Approval": item?.typeOfApproval,
        ...(isAdmin ? { Location: item.locationName } : {}),
      }));
    setDownloadData(newObject);
  }, [defaultData]);

  const columns = [
    columnHelper.accessor((row) => row.action, {
      id: "action",
      cell: (info) => (
        <>
          {viewDocPermission && (
            <button
              type="button"
              onClick={() =>
                Navigate(
                  `/view-doc/${
                    info?.row?.original?.parentContractId
                      ? info?.row?.original?.parentContractId
                      : info?.row?.original?.id
                  }/${info?.row?.original?.contractId}`,
                  {
                    state: {
                      contractId: info?.row?.original?.parentContractId
                        ? info?.row?.original?.parentContractId
                        : info?.row?.original?.id,
                      companyName: info?.row?.original?.companyName,
                      type: "contractId",
                      contractType: contractType,
                    },
                  }
                )
              }
            >
              <TETooltip tag={"span"} title={"View Documents"}>
                <FiFile className="text-xl" />
              </TETooltip>
            </button>
          )}
          {deletePermission &&
          info?.row?.original?.approvalPendingLevel < 2 &&
          info?.row?.original?.status == "Pending Approval" &&
          (info?.row?.original?.createdById == loggedInUserId || isAdmin) ? (
            <button
              type="button"
              className="ml-5"
              onClick={() => {
                setIdDisplay(info?.row?.original?.contractId);
                setIdToDelete(info?.row?.original?.id);
                setVerify(true);
              }}
            >
              <TETooltip tag={"span"} title="Delete">
                <BsTrash className="text-xl" style={{ color: "red" }} />
              </TETooltip>
            </button>
          ) : (
            <span className="ml-10"></span>
          )}
        </>
      ),
      header: () => <span>Action</span>,
      enableSorting: false, // Disable sorting for this column
    }),
    columnHelper.accessor((row) => row.contractId, {
      id: "contractId",
      cell: (info) => (
        <div className="flex justify-center items-center">
          {
            // info?.row?.original?.status == "Pending Approval" &&
            // info?.row?.original?.approvalPendingLevel < 2 &&
            editPermission &&
            info?.row?.original?.approvalPendingLevel < 2 &&
            info?.row?.original?.status == "Pending Approval" &&
            (info?.row?.original?.createdById == loggedInUserId || isAdmin) ? (
              <Link
                to={`/contract-edit/${info?.row?.original?.id}`}
                state={{
                  contractType: contractType,
                }}
                className="text-blue-600  px-2 py-1 text-md font-medium"
              >
                {info.getValue()}
              </Link>
            ) : (
              <>
                <Link
                  to={`/details-screen/${info.row?.original?.id}`}
                  state={{
                    type: type,
                    typeOf: "Contract",
                    contractType: contractType,
                    // typeOf: info.row?.original?.typeOfApproval,
                  }}
                  className="text-blue-600  px-2 py-1 text-md font-medium"
                >
                  {info.getValue()}
                </Link>
              </>
            )
          }
          {/* <button
              onClick={() => handleClick(info)}
              className="text-blue-600 px-2 py-1 text-md font-medium"
            >
              {info.getValue() ? info?.getValue() : "-"}
            </button> */}
        </div>
      ),
      header: () => <span>Contract ID</span>,
    }),
    columnHelper.accessor((row) => row.companyName, {
      id: "companyName",
      cell: (info) => <span>{info.getValue() ? info.getValue() : "-"}</span>,
      header: () => <span> Contract Name </span>,
    }),
    columnHelper.accessor((row) => row.contractTypeName, {
      id: "contractTypeName",
      cell: (info) => (
        <span>
          {info.getValue()
            ? info.getValue()
            : info?.row?.original?.contractTypeOther}
        </span>
      ),
      header: () => <span> Contract Type </span>,
    }),
    columnHelper.accessor((row) => row.departmentName, {
      id: "departmentName",
      cell: (info) => <span>{info.getValue() ? info.getValue() : "-"}</span>,
      header: () => <span> Department </span>,
    }),
    columnHelper.accessor((row) => row.keyEffectiveDate, {
      id: "keyEffectiveDate",
      cell: (info) => (
        <span>
          {info.getValue()
            ? formatDurationFromUnixTimestamp(info.getValue())
            : "-"}
        </span>
      ),
      header: () => <span>Effective Date</span>,
    }),
    columnHelper.accessor((row) => row.keyExpiryDate, {
      id: "keyExpiryDate",
      cell: (info) => (
        <span>
          {info.getValue()
            ? formatDurationFromUnixTimestamp(info.getValue())
            : "-"}
        </span>
      ),
      header: () => <span>Expiry Date</span>,
    }),
    columnHelper.accessor((row) => row.toBeRenewedOn, {
      id: "toBeRenewedOn",
      cell: (info) => (
        <span>
          {info.getValue()
            ? formatDurationFromUnixTimestamp(info.getValue())
            : "-"}
        </span>
      ),
      header: () => <span>To be Renewed On</span>,
    }),
    columnHelper.accessor((row) => row.lastRenewedOn, {
      id: "lastRenewedOn",
      cell: (info) => (
        <span>
          {info.getValue()
            ? formatDurationFromUnixTimestamp(info.getValue())
            : "-"}
        </span>
      ),
      header: () => <span>Last Renewed On</span>,
    }),
    columnHelper.accessor((row) => row.addendumDate, {
      id: "addendumDate",
      cell: (info) => (
        <span>
          {info.getValue()
            ? formatDurationFromUnixTimestamp(info.getValue())
            : "-"}
        </span>
      ),
      header: () => <span>Addendum Date</span>,
    }),
    columnHelper.accessor((row) => row.status, {
      id: "status",
      cell: (info) => <StatusChip info={info} />,
      header: () => <span>Status </span>,
    }),

    columnHelper.accessor((row) => row.approvalPendingFrom, {
      id: "approvalPendingFrom",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Approval Pending From</span>,
    }),
    columnHelper.accessor((row) => row.renewalDueIn, {
      id: "renewalDueIn",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Renewal Due In</span>,
    }),
    columnHelper.accessor((row) => row.createdOn, {
      id: "createdOn",
      cell: (info) => (
        <span>
          {info.getValue()
            ? formatDurationFromUnixTimestamp(info.getValue())
            : "-"}
        </span>
      ),
      header: () => <span>Created On</span>,
    }),
    columnHelper.accessor((row) => row.createdBy, {
      id: "createdBy",
      cell: (info) => <span>{info.getValue() ?? "-"}</span>,
      header: () => <span>Created By</span>,
    }),
  ];

  if (isAdmin) {
    columns.push(
      columnHelper.accessor((row) => row.locationName, {
        id: "locationName",
        cell: (info) => <span>{info.getValue() ? info.getValue() : "-"}</span>,
        header: () => <span>Location</span>,
      })
    );
  }

  const breadCrumbData = [
    {
      route:
        contractType == "Classified"
          ? "/contract-classified-list"
          : "/contract-list",
      name: `Contract  ${contractType === "Classified" ? " Classified" : ""}`,
    },
    {
      route: "",
      name: `Contract ${type}  ${
        contractType === "Classified" ? " [Classified]" : ""
      }`,
    },
  ];

  const handleFilterClick = (filters) => {
    if (filters && typeof filters === "object") {
      const queryString = Object.keys(filters)
        .filter(
          (key) =>
            filters[key] !== null &&
            filters[key] !== undefined &&
            filters[key] !== ""
        )
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(filters[key])
        )
        .join("&");

      handleContractList(queryString);
    } else {
      console.error("Error: Filters object is null or undefined.");
    }
  };

  useEffect(() => {
    if (
      cameFrom == "dashboard" &&
      contractOptionId &&
      status &&
      dateFrom &&
      dateTo
    ) {
      let obj = {
        contractOptionId: contractOptionId,
        status: status,
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      setFilters(obj);
      handleFilterClick(obj);
    } else {
      handleContractList();
    }
  }, [type, cameFrom]);
  // useEffect(()=>{
  //  if(cameFrom && Object.keys(filters)?.length){
  //   handleFilterClick()
  //  }
  // },[cameFrom])

  return (
    <div>
      {verify ? (
        <LatestModalPopUp
          open={verify}
          title={`Are you sure do you want delete contract ${idDisplay} ?`}
          setOpen={setVerify}
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
              onClick={handleDeleteContract}
            >
              Delete
            </button>,
            <button
              type="button"
              className="py-2.5 px-4 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:ring-0 w-[100px]"
              onClick={() => setVerify(false)}
              data-autofocus
            >
              Cancel
            </button>,
          ]}
        />
      ) : (
        ""
      )}

      {success ? (
        <SuccessModal
          title="Contract deleted successfully!"
          showSuccessModal={success}
          setShowSuccessModal={(data) => {
            setSuccess(false);
            contractType == "Classified"
              ? Navigate("/contract-classified-list")
              : Navigate("/contract-list");
          }}
        />
      ) : (
        ""
      )}
      {(title && status === "Expired") ||
      status === "Terminated" ||
      status === "Active" ? (
        <PageTitle
          title={
            titleName
              ? `List of Contracts - ${titleName} ${
                  contractType === "Classified" ? " [Classified]" : ""
                }`
              : "List of Contracts - " +
                status +
                (contractType === "Classified" ? " [Classified]" : "")
          }
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      ) : (
        <PageTitle
          title={
            "List of Contracts - " +
            type +
            (contractType === "Classified" ? " [Classified]" : "")
          }
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      )}

      <div className="content-wrapper">
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          {filter && createPermission && (
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 flex justify-end items-center space-x-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    contractType !== "Classified"
                      ? Navigate("/contract-new", {
                          state: {
                            contractType: 1,
                            contractTypeValue: contractType,
                          },
                        })
                      : Navigate("/contract-classified-new", {
                          state: {
                            contractType: 1,
                            contractTypeValue: contractType,
                          },
                        });
                  }}
                  className="mb-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center"
                >
                  New Contract
                </button>
                <button
                  type="button"
                  onClick={() => {
                    contractType !== "Classified"
                      ? Navigate("/contract-new", {
                          state: {
                            contractType: 2,
                            contractTypeValue: contractType,
                            cameFromProps: "NewAddendum",
                          },
                        })
                      : Navigate("/contract-classified-new", {
                          state: {
                            contractType: 2,
                            contractTypeValue: contractType,
                          },
                        });
                  }}
                  className="mb-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center"
                >
                  New Addendum
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              {isDashBoard && (
                <h3 className="text-xl font-medium mt-8">
                  My Pending Approvals{" "}
                  <span>({defaultData ? defaultData?.length : 0})</span>
                </h3>
              )}
              {/* <div className="col-span-10">
              </div>
              <div className="col-span-2">
             
              </div> */}
              {filter && (
                <FilterContract
                  filters={filters}
                  setFilters={setFilters}
                  handleFilterClick={handleFilterClick}
                  contractType={contractType}
                  showContractStatus={showContractStatus}
                />
              )}
            </div>
            <div className="col-span-12">
              {defaultData && !isLoaded && (
                <>
                  {" "}
                  <DataTable
                    key={defaultData?.length}
                    columns={columns}
                    defaultData={defaultData}
                    downloadData={downloadData}
                    isPaginated={isPaginated}
                    showDelete={true}
                    tableName={
                      contractType == "Classified"
                        ? "Contract Classified List"
                        : "Contract List"
                    }
                    showDownload={showDownload}
                  />
                  {isDashBoard && (
                    <button
                      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow underline"
                      onClick={() => Navigate("/contract-list-pending")}
                    >
                      View All
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Loader isLoading={isLoaded} />
    </div>
  );
};

export default ContractList;
