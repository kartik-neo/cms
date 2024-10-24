import React, { useState, useEffect, useContext } from "react";
import DataTable from "../Common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import "../../Components/Common/DataTable/index.css";
import PageTitle from "../Common/PageTitle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import {
  formatDurationFromUnixTimestamp,
  } from "../../utils/functions";
import FilterContract from "../Common/DataTable/FilterContract";
import {
  deleteContract,
  fetchContractPendingList,
} from "../../Services/contractServices";
import { FiFile } from "react-icons/fi";
import { TETooltip } from "tw-elements-react";
import LatestModalPopUp from "../Common/LatestModalPopUp";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import SuccessModal from "../Common/ModalPopups/SuccessModal";
import UserContext from "../../context/UserContext";

const ContractPendingList = ({
  title = true,
  filter = true,
  isPaginated = true,
  entriesPerPage = true,
  type,
  contractType,
  isDashBoard,
  showContractStatus,
  isClassified = false,
  showDownload = true,
  pageNumber=null,
  pageSize=null
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const Navigate = useNavigate();
  const [defaultData, setData] = React.useState();
  const [totalCount, setTotalCount] = React.useState();
  const [downloadData, setDownloadData] = React.useState();
  const [filters, setFilters] = useState();
  const [idToDelete, setIdToDelete] = useState();
  const [verify, setVerify] = useState(false);
  const [success, setSuccess] = useState(false);
  // const isAdmin = fetchIsAdmin();
  const { isAdmin } = useContext(UserContext);
  const location = useLocation();


 
  const viewDocPermission = true;
  const columnHelper = createColumnHelper();
  const handleContractList = async (queryString = "") => {
    try {
      setIsLoaded(true);
      const result = await fetchContractPendingList(
        queryString,
        type,
        isClassified,
        location,
        pageNumber,
        pageSize
      );
      // if(!isPaginated){
      //   const dataToSend = result?.data?.slice(0,10)
      //   setData(dataToSend);
      // }else{
        setData(result?.data);
        setTotalCount(result?.totalCount)
      // }
      
      setIsLoaded(false);
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



  useEffect(() => {
    if (type) {
      handleContractList();
    }
  }, [type]);


  useEffect(() => {
    let newObject =
      defaultData &&
      defaultData.map((item) => ({
        "Contract ID": item.contractId,
        "Contract Name": item.companyName ? item.companyName?.split(",").join(" "):"-",
        "Contract Type": item?.contractTypeName || item?.contractTypeOther,
        Department: item.departmentName,
        "Effective Date": item.keyEffectiveDate
          ? formatDurationFromUnixTimestamp(item.keyEffectiveDate)
          : "-",
        "Expiry Date": item.keyExpiryDate
          ? formatDurationFromUnixTimestamp(item.renewalExpiryDate)
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
        Status: item.statusName,
        "Created On": item?.createdOn
          ? formatDurationFromUnixTimestamp(item?.createdOn)
          : "-",
        "Created By": item.createdBy,
        "Type Of Approval": item?.typeOfApproval,
        "Approval Pending from": item.approvalPendingFrom,
        "Renewal Due in": item.renewalDueIn,
        Location: item.locationName,
      }));
    setDownloadData(newObject);
  }, [defaultData]);

  const columns = [
    columnHelper.accessor((row) => row.action, {
      id: "action",
      cell: (info) => (
        <>
          {viewDocPermission && (
            <button type="button">
              <TETooltip tag={"span"} title={"View Documents"}>
                <FiFile
                  className="text-xl"
                  onClick={() =>
                    Navigate(
                      `/view-doc/${
                        info?.row?.original?.parentContractId
                          ? info?.row?.original?.parentContractId
                          : info?.row?.original?.id
                      }/${info?.row?.original?.contractId}`,
                      {
                        state: {
                          contractId: info?.row?.original?.id,
                          companyName: info?.row?.original?.companyName,
                          type: "contractId",
                          contractType: contractType,
                        },
                      }
                    )
                  }
                />
              </TETooltip>
            </button>
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
          <Link
            // ${info?.row?.original?.id}
            to={{ pathname: `/details-screen/${info.row?.original?.id}` }}
            state={{
              cameFrom: "Pending Approval",
              type: type,
              typeOf: info.row?.original?.typeOfApproval,
              contractType: contractType,
            }}
            className="text-blue-600  px-2 py-1 text-md font-medium"
          >
            {info.getValue()}
          </Link>
          {/* {info?.row?.original?.status != "Pending Approval" &&
            (editPermission || info?.row?.original?.createdBy == loggedInUserId) ? (
            <Link
              to={`/contract-edit/${info?.row?.original?.id}`}
              className="text-blue-600  px-2 py-1 text-md font-medium"
            >
              {info.getValue()}
            </Link>
          ) : (
            <>
              {type == "Pending Approval" ? (
                <Link
                  to={{ pathname: `/details-screen/${info.row?.original?.id}` }}
                  state={{
                    cameFrom: "Pending Approval",
                    type: type,
                    typeOf: info.row?.original?.typeOfApproval,
                  }}
                  className="text-blue-600  px-2 py-1 text-md font-medium"
                >
                  {info.getValue()}
                </Link>
              ) : (
                <Link
                  to={`/details-screen/${info.row?.original?.id}`}
                  state={{ type: type }}
                  className="text-blue-600  px-2 py-1 text-md font-medium"
                >
                  {info.getValue()}
                </Link>
              )}
            </>
          )} */}
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
    // columnHelper.accessor((row) => row.lastRenewedOn, {
    //   id: "lastRenewedOn",
    //   cell: (info) => (
    //     <span>
    //       {info.getValue()
    //         ? formatDurationFromUnixTimestamp(info.getValue())
    //         : "-"}
    //     </span>
    //   ),
    //   header: () => <span>Last Renewed On</span>,
    // }),
    // columnHelper.accessor((row) => row.addendumDate, {
    //   id: "addendumDate",
    //   cell: (info) => (
    //     <span>
    //       {info.getValue()
    //         ? formatDurationFromUnixTimestamp(info.getValue())
    //         : "-"}
    //     </span>
    //   ),
    //   header: () => <span>Addendum Date</span>,
    // }),
    columnHelper.accessor(
      (row) =>
        row.typeOfApproval === "Withdraw Notice" ||
        row.typeOfApproval === "Termination"
          ? `${row.terminationStatus} Approval`
          : row.statusName,
      {
        id: "statusName",
        cell: (info) => {
          // let bgColor = info.getValue() === "Pending Approval" ? "green" : "red";
          let bgColor =
            info.getValue() === "Pending Approval"
              ? "yellow"
              : info.getValue() === "Active"
              ? "green"
              : info.getValue() === "Terminated"
              ? "red"
              : info.getValue() === "Rejected"
              ? "orange"
              : "#AAAAAA";
          return (
            <div className="flex justify-center items-center">
              <span
                style={{
                  backgroundColor: `${bgColor}`,
                  color: `${bgColor === "yellow" ? "#000" : "#fff"}`,
                }}
                className={`py-1 my-3 w-[150px] rounded-full shadow bg-yellow-500 text-black font-medium`}
              >
                {!info.getValue() || info.getValue() == ""
                  ? "-"
                  : info?.row?.original?.approvalPendingLevel
                  ? "L" +
                    info?.row?.original?.approvalPendingLevel +
                    " " +
                    info.getValue()
                  : info.getValue()}
                {/* {info.getValue() === true ? "Active" : "Inactive"} */}
              </span>
            </div>
          );
        },
        header: () => <span>Status </span>,
      }
    ),
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
    columnHelper.accessor((row) => row.typeOfApproval, {
      id: "typeOfApproval",
      cell: (info) => <span>{info.getValue() ?? "-"}</span>,
      header: () => <span>Type of Approval</span>,
    }),

    columnHelper.accessor((row) => row.approvalPendingFrom, {
      id: "approvalPendingFrom",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Approval Pending From</span>,
    }),
    // columnHelper.accessor((row) => row.approvalPendingFrom, {
    //   id: "approvalPendingFrom",
    //   cell: (info) => <span>{info.getValue()}</span>,
    //   header: () => <span>Renewal Contact Person</span>,
    // }),
    columnHelper.accessor((row) => row.renewalDueIn, {
      id: "renewalDueIn",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Renewal Due In</span>,
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

  return (
    <div>
      {verify ? (
        <LatestModalPopUp
          open={verify}
          title={"Are you sure do you want delete contract ?"}
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
            Navigate("/contract-list");
          }}
        />
      ) : (
        ""
      )}
      {title && (
        <PageTitle
          title={
            "List of Contracts - " +
            type +
            (contractType === "Classified" ? " [Classified]" : "")
          }
          buttonTitle=""
          breadCrumbData={breadCrumbData}
          bg="transparent"
        />
      )}

      <div className="content-wrapper">
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          {filter && (
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 flex justify-end items-center space-x-2 mb-3">
                <button
                  type="button"
                  // onClick={() =>
                  //   Navigate("/contract-new", { state: (contractType = 1) })
                  // }
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
                  // onClick={() =>
                  //   Navigate("/contract-new", { state: (contractType = 2) })
                  // }
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
                  Pending Approvals{" "}
                  <span>({totalCount ||""})</span>
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
                    entriesPerPage={entriesPerPage}
                    showDelete={true}
                    tableName="Contract Approval Pending List"
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

export default ContractPendingList;
