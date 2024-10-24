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
import { BsTrash } from "react-icons/bs";
import { FiFile } from "react-icons/fi";
import { TETooltip } from "tw-elements-react";
import { deleteMou, fetchMOUList } from "../../Services/mouServices";
import LatestModalPopUp from "../Common/LatestModalPopUp";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import SuccessModal from "../Common/ModalPopups/SuccessModal";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import UserContext from "../../context/UserContext";
import MOUContext from "../../context/MOUContext";
import MOUStatusChip from "../Common/DataTable/MOUStatusChip";

const MOUList = ({
  title = true,
  filter = true,
  isPaginated = true,
  type,
  showDownload = true,
  isDashBoard,
  showContractStatus,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const Navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const [defaultData, setData] = React.useState();
  const [downloadData, setDownloadData] = React.useState();
  const [filters, setFilters] = useState();
  const [verify, setVerify] = useState(false);
  const [success, setSuccess] = useState(false);
  const [idToDelete, setIdToDelete] = useState();
  const [idDisplay, setIdDisplay] = useState();
  const { isAdmin } = useContext(UserContext);
  const { MOUDetails, setMOUDetails } = useContext(MOUContext);
  const cameFrom = location?.state?.cameFrom;
  const titleName = queryParams.get("titleName");
  const contractOptionId = queryParams.get("contractOptionId");
  const dateFrom = queryParams.get("dateFrom");
  const dateTo = queryParams.get("dateTo");
  // const [isAdmin, setIsAdmin] = useState(false);
  // Call usePermission hook unconditionally
  const deletePermission = usePermission(
    MENU_PERMISSIONS?.CMS.MOUContract?.Delete
  );
  const editPermission = usePermission(MENU_PERMISSIONS?.CMS.MOUContract?.Edit);
  const createPermission = usePermission(
    MENU_PERMISSIONS?.CMS.MOUContract?.Create
  );

  const viewDocPermission = true;

  const handleMOUList = async (queryString = "") => {
    try {
      setIsLoaded(true);

      if (status === "Expired") {
        let hasAddendum;
        const result = await fetchMOUList(
          queryString,
          status,
          hasAddendum,
          location
        );
        setData(result?.data);
        setIsLoaded(false);
      } else {
        setIsLoaded(true);
        let hasAddendum;
        const result = await fetchMOUList(
          queryString,
          type,
          hasAddendum,
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

  const handleDeleteMou = async () => {
    if (idToDelete) {
      try {
        setVerify(false);
        setIsLoaded(true);
        const result = await deleteMou(idToDelete);
        // setData(result?.data);
        if (result?.success) {
          handleMOUList();
          setIsLoaded(false);
          setSuccess(true);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsLoaded(false);
        toast.error(error.message ?? "Error while deleting mou contract", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      setVerify(false);
    }
  };

  useEffect(() => {
    let newObject =
      defaultData &&
      defaultData.map((item) => ({
        "MOU ID": item.mouId,
        "MOU Name": item.mouName ? item.mouName?.split(",").join(" ") : " - ",
        "MOU Start Date": item.mouStartDate
          ? formatDurationFromUnixTimestamp(item.mouStartDate)
          : "-",
        "Expiry Date": item.mouExpiryDate
          ? formatDurationFromUnixTimestamp(item.mouExpiryDate)
          : "-",
        "To Be Renewed on": item.toBeRenewedOn
          ? formatDurationFromUnixTimestamp(item.toBeRenewedOn)
          : "-",
        "Last Renewed on": item.lastRenewedOn
          ? formatDurationFromUnixTimestamp(item.lastRenewedOn)
          : "-",

        "Addendum Date": item.addendumDate
          ? formatDurationFromUnixTimestamp(item.addendumDate)
          : "-",
        "MOU Category": item.mouCategory,
        Status: item.status,
        "Approval Pending from": item.approvalPendingFrom,
        "Renewal Due in": item.renewalDueIn,
        "Created On": item?.createdOn
          ? formatDurationFromUnixTimestamp(item?.createdOn)
          : "-",
        "Created By": item.createdBy,
        ...(isAdmin ? { Location: item.locationName } : {}),
      }));
    setDownloadData(newObject);
  }, [defaultData]);

  const columnHelper = createColumnHelper();
  const userDetailsVal = userDetails();
  const loggedInUserId = userDetailsVal?.user;

  useEffect(() => {
    setMOUDetails({});
  }, []);

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
                     : info?.row?.original?.id}/${info?.row?.original?.mouId}`,
                  {
                    state: {
                      mouId: info?.row?.original?.parentContractId 
                      ? info?.row?.original?.parentContractId 
                      : info?.row?.original?.id,
                      mouName: info?.row?.original?.mouName,
                      type: "mouId",
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
            // &&
            // info?.row?.original?.status == "Pending Approval" &&
            // info?.row?.original?.approvalPendingLevel < 2)

            <button
              type="button"
              className="ml-5"
              onClick={() => {
                setIdDisplay(info?.row?.original?.mouId);
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
    columnHelper.accessor((row) => row.mouId, {
      id: "mouId",
      cell: (info) => {
        return (
          <div className="flex justify-center items-center">
            {editPermission &&
            info?.row?.original?.approvalPendingLevel < 2 &&
            info?.row?.original?.status == "Pending Approval" &&
            (info?.row?.original?.createdById == loggedInUserId || isAdmin) ? (
              <Link
                to={`/edit-mou-contract/${info?.row?.original?.id}?edit=true`}
                state={{
                  editAggregator: true,
                  renew: info?.row?.original?.contrctStatusTypes === 2,
                  addendum: info?.row?.original?.contrctStatusTypes === 3,
                }}
                className="text-blue-600  px-2 py-1 text-md font-medium"
              >
                {info.getValue()}
              </Link>
            ) : (
              <>
                {info?.row?.original?.mouCategory == "Aggregator" ? (
                  <Link
                    to={`/view-mou-aggregators/${info?.row?.original?.id}`}
                    state={{ type: type, typeOf: "Mou" }}
                    className="text-blue-600  px-2 py-1 text-md font-medium"
                  >
                    {info.getValue()}
                  </Link>
                ) : (
                  <Link
                    to={`/mou-view/${info?.row?.original?.id}`}
                    state={{ type: type, typeOf: "Mou" }}
                    className="text-blue-600  px-2 py-1 text-md font-medium"
                  >
                    {info.getValue()}
                  </Link>
                )}
              </>
            )}
          </div>
        );
      },
      header: () => <span>MOU ID</span>,
    }),
    columnHelper.accessor((row) => row.mouName, {
      id: "mouName",
      cell: (info) => <span>{info.getValue() ?? "-"}</span>,
      header: () => <span> MOU Name </span>,
    }),
    columnHelper.accessor((row) => row.mouStartDate, {
      id: "mouStartDate",
      cell: (info) => (
        <span>
          {info.getValue()
            ? formatDurationFromUnixTimestamp(info.getValue())
            : "-"}
        </span>
      ),
      header: () => <span>MOU Start Date</span>,
    }),
    columnHelper.accessor((row) => row.mouExpiryDate, {
      id: "mouExpiryDate",
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
            ? formatDurationFromUnixTimestamp(+info.getValue())
            : "-"}
        </span>
      ),
      header: () => <span>Addendum Date</span>,
    }),
    columnHelper.accessor((row) => row.mouCategory, {
      id: "mouCategory",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>MOU Category </span>,
    }),
    columnHelper.accessor((row) => row.status, {
      id: "status",
      cell: (info) => <MOUStatusChip info={info} />,
      header: () => <span>Status </span>,
    }),

    columnHelper.accessor((row) => row.approvalPendingFrom, {
      id: "approvalPendingFrom",
      cell: (info) => <span>{info.getValue() ?? "-"}</span>,
      header: () => <span>Approval Pending From</span>,
    }),
    columnHelper.accessor((row) => row.renewalDueIn, {
      id: "renewalDueIn",
      cell: (info) => <span>{info.getValue() ?? "-"}</span>,
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
        id: "location",
        cell: (info) => <span>{info.getValue() ?? "-"}</span>,
        header: () => <span>Location</span>,
      })
    );
  }

  const breadCrumbData = [
    {
      route: "",
      name: "MOU Contract",
    },
    {
      route: "",
      name: `MOU List ${type}`,
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

      handleMOUList(queryString);
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
      handleMOUList();
    }
  }, [type, cameFrom]);

  return (
    <div>
      {verify ? (
        <LatestModalPopUp
          open={verify}
          title={`Are you sure do you want delete mou contract ${idDisplay} ?`}
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
              onClick={handleDeleteMou}
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
          title="MOU deleted successfully!"
          showSuccessModal={success}
          setShowSuccessModal={(data) => {
            setSuccess(false);
            Navigate("/mou-contract-list");
          }}
        />
      ) : (
        ""
      )}

      {title && status == "Expired" ? (
        <PageTitle
          title={
            titleName ? `List of MOU - ${titleName}` : "List of MOU - " + status
          }
          buttonTitle=""
          breadCrumbData={breadCrumbData}
          bg="transparent"
        />
      ) : (
        <PageTitle
          title={
            titleName ? `List of MOU - ${titleName}` : "List of MOU - " + type
          }
          buttonTitle=""
          breadCrumbData={breadCrumbData}
          bg="transparent"
        />
      )}

      <div className="content-wrapper">
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          {isDashBoard && (
            <h3 className="text-xl font-medium mt-8">
              My Pending Approvals{" "}
              <span>({defaultData ? defaultData?.length : 0})</span>
            </h3>
          )}
          {filter && createPermission && (
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 flex justify-end items-center space-x-2 mb-3">
                <button
                  type="button"
                  onClick={() => Navigate("/mou-contract-new")}
                  className="mb-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center"
                >
                  New MOU
                </button>
                <button
                  type="button"
                  onClick={() =>
                    Navigate("/mou-contract-new", { state: { addendum: true } })
                  }
                  className="mb-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center"
                >
                  New Addendum
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              {/* <div className="col-span-10">
              </div>
              <div className="col-span-2">
             
              </div> */}
              {filter && (
                <FilterContract
                  filters={filters}
                  setFilters={setFilters}
                  handleFilterClick={handleFilterClick}
                  showContractStatus={showContractStatus}
                  type={"MOU"}
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
                    tableName="MOU List"
                    showDownload={showDownload}
                  />
                  {isDashBoard && (
                    <button
                      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow underline"
                      onClick={() => Navigate("/mou-contract-list-pending")}
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

export default MOUList;
