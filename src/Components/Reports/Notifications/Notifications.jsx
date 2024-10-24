import React, { useState, useEffect } from "react";
import DataTable from "../../Common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import "../../../Components/Common/DataTable/index.css";
import PageTitle from "../../Common/PageTitle";
import { Link, useNavigate } from "react-router-dom";
import { usePermission } from "../../../App";
import { MENU_PERMISSIONS } from "../../../Constant/permissionConstant";
import Loader from "../../Common/Loader";
import {
  DateFromUnixTimestamp,
  DateFromUnixTimestampNoti,
  TimeFromUnixTimestamp,
  userDetails,
} from "../../../utils/functions";
import { fetchNotificationList } from "../../../Services/reportService";
import PageTitleReport from "../../Common/PageTitleReport";
const NotificationsList = ({
  title = true,
  filter = true,
  isPaginated = true,
  type,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const Navigate = useNavigate();
  const [defaultData, setData] = React.useState([]);
  const [downloadData, setDownloadData] = React.useState();


  const editPermission = usePermission(MENU_PERMISSIONS?.CMS.MOUContract?.Edit);

  const handleEmergencyList = async (queryString = "") => {
    try {
      setIsLoaded(true);
      const notificationList = await fetchNotificationList(queryString, type);
      const res =
        notificationList?.totalCount > 0 ? notificationList?.data : [];
      setData(res);
      setIsLoaded(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoaded(false);
    }
  };

  useEffect(() => {
    handleEmergencyList();
  }, [type]);
  const columnHelper = createColumnHelper();
  const userDetailsVal = userDetails();
  const loggedInUserId = userDetailsVal?.user;
  const columns = [
    // columnHelper.accessor((row) => row.contractId, {
    //   id: "contractId",
    //   cell: (info) => (
    //     <div className="flex justify-center items-center">
    //       {info?.row?.original?.contractID ? (
    //         info?.row?.original?.status == "Pending Approval" &&
    //         (editPermission ||
    //           info?.row?.original?.createdBy == loggedInUserId) ? (
    //           <Link
    //             to={`/contract-edit/${info?.row?.original?.id}`}
    //             className="text-blue-600  px-2 py-1 text-md font-medium"
    //           >
    //             {info.getValue() ?? info?.row?.original?.mouContractId}
    //           </Link>
    //         ) : (
    //           <>
    //             <Link
    //               to={`/details-screen/${info.row?.original?.id}`}
    //               state={{
    //                 type: type,
    //                 typeOf: "Contract",
    //                 // typeOf: info.row?.original?.typeOfApproval,
    //               }}
    //               className="text-blue-600  px-2 py-1 text-md font-medium"
    //             >
    //               {info.getValue() ?? info?.row?.original?.mouContractId}
    //             </Link>
    //           </>
    //         )
    //       ) : info?.row?.original?.status == "Pending Approval" &&
    //         (editPermission ||
    //           info?.row?.original?.createdBy == loggedInUserId) ? (
    //         <Link
    //           to={`/edit-mou-contract/${info?.row?.original?.id}?edit=true`}
    //           className="text-blue-600  px-2 py-1 text-md font-medium"
    //         >
    //           {info.getValue() ?? info?.row?.original?.mouContractId}
    //         </Link>
    //       ) : (
    //         <Link
    //           to={`/mou-view/${info?.row?.original?.id}`}
    //           state={{ type: type }}
    //           className="text-blue-600  px-2 py-1 text-md font-medium"
    //         >
    //           {info.getValue() ?? info?.row?.original?.mouContractId}
    //         </Link>
    //       )}
    //     </div>
    //   ),
    //   header: () => <span>Contract / MOU ID</span>,
    // }),
    // columnHelper.accessor((row) => row.contractDisplyId, {
    //   id: "contractDisplyId",
    //   cell: (info) => {
    //     const displayId = info.row.original.contractDisplyId;
    //     const contractId = info.row.original.contractId;
    
    //     return (
    //       <div className="flex justify-center items-center">
    //         <Link
    //           to={`/details-screen/${contractId}`}
    //           state={{
    //             type: info.row.original.type,
    //             typeOf: "Contract", // Assuming it's always a contract in this context
    //           }}
    //           className="text-blue-600 px-2 py-1 text-md font-medium"
    //         >
    //           {displayId}
    //         </Link>
    //       </div>
    //     );
    //   },
    //   header: () => <span>Contract / MOU ID </span>,
    // }),
    columnHelper.accessor((row) => row.contractDisplyId || row.mouContractDisplyId, {
      id: "contractDisplyId",
      cell: (info) => {
        const displayId = info.row.original.contractDisplyId || info.row.original.mouContractDisplyId;
        const contractDisplyId = info.row.original.contractDisplyId;
        const contractId = info.row.original.contractId;
        const mouId = info.row.original.mouContractId;
        const mouCategory = info.row.original.mouCategory;
        const aggregatorId = info.row.original.aggregatorId
        
        const linkPath = contractDisplyId ? `/details-screen/${contractId}` 
                        // : mouCategory === "Aggregator"
                        : aggregatorId  ? `/view-mou-aggregators/${mouId}` 
                        : `/mou-view/${mouId}`;
        const typeOf = contractId ? "Contract" : "Mou";
    
        return (
          <div className="flex justify-center items-center">
            <Link
              to={linkPath}
              state={{
                type: info.row.original.type,
                typeOf: typeOf,
              }}
              className="text-blue-600 px-2 py-1 text-md font-medium"
            >
              {displayId}
            </Link>
          </div>
        );
      },
      header: () => <span>Contract / MOU ID</span>,
    }),
    columnHelper.accessor((row) => row.notificationTitle, {
      id: "notificationTitle",
      cell: (info) => <span>{info.getValue() ?? "-"}</span>,
      header: () => <span>Notification Title </span>,
    }),
    columnHelper.accessor((row) => row.subject, {
      id: "subject",
      cell: (info) => <span>{info.getValue() ?? "-"}</span>,
      header: () => <span>Notification Subject </span>,
    }),
    columnHelper.accessor((row) => row.createdOn, {
      id: "createdOn",
      cell: (info) => <span>{DateFromUnixTimestampNoti(+info.getValue())}</span>,
      header: () => <span>Date</span>,
    }),
    columnHelper.accessor((row) => row.createdOn, {
      id: "createdOn",
      cell: (info) => <span>{TimeFromUnixTimestamp(info.getValue())}</span>,
      header: () => <span>Time</span>,
    }),
  ];

  const breadCrumbData = [
    {
      route: "",
      name: "Reports",
    },
    {
      route: "",
      name: "Notifications",
    },
  ];

  // useEffect(() => {
  //   let newObject =
  //     defaultData &&
  //     defaultData.map((item) => ({
  //       "Contract/MOU ID": item?.contractID ?? item?.mouid,
  //       "Notification Title": item?.notificationTitle,
  //       "Notification Subject": item?.notificationSubject,
  //       Date: item.dateTime,
  //       Time: item.dateTime,
  //       // Status: item.isActive,
  //     }));
  //   setDownloadData(newObject);
  // }, [defaultData]);

  return (
    <div>
      {/* <PageTitle title={title} breadCrumbData={breadCrumbData} /> */}
      {title && (
        <PageTitle
          title="Notifications"
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      )}

      <div className="content-wrapper">
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-10">
              <h1 className="text-2xl">List of Notifications</h1>
            </div>
            <div className="col-span-2"></div>
            {/* {filter && (
                <FilterComponent
                  filters={filters}
                  setFilters={setFilters}
                  handleFilterClick={handleFilterClick}
                />
              )} */}
            <div className="col-span-12">
              {defaultData && !isLoaded && (
                <DataTable
                  key={defaultData?.length}
                  columns={columns}
                  defaultData={defaultData}
                  downloadData={downloadData}
                  isPaginated={isPaginated}
                  showDelete={true}
                  tableName="Notifications List"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Loader isLoading={isLoaded} />
    </div>
  );
};

export default NotificationsList;
