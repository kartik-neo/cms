import React, { useState, useEffect } from "react";
import DataTable from "../../Common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import "../../../Components/Common/DataTable/index.css";
import PageTitle from "../../Common/PageTitle";
import { Link } from "react-router-dom";
import Loader from "../../Common/Loader";
import {
   DateFromUnixTimestampNoti, formatDurationFromUnixTimestamp, TimeFromUnixTimestamp,
} from "../../../utils/functions";

import FilterAudit from "../../Common/DataTable/FilterAudit";
import { fetchAuditList } from "../../../Services/reportService";
const AuditLogsList = ({
  title = true,
  filter = true,
  isPaginated = true,
  isPaginatedServerSide = true,
  type,
  showDownload = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [defaultData, setData] = React.useState();
  const [downloadData, setDownloadData] = React.useState();
  const [filters, setFilters] = useState();
  const [pageNumber, setPageNumber] = useState("");
  const [pageSize, setPageSize] = useState("");


  // Call usePermission hook unconditionally
  // const deletePermission = usePermission(
  //   type === "WithOutMockDrill"
  //     ? MENU_PERMISSIONS?.EMS?.Emergency?.View
  //     : MENU_PERMISSIONS?.EMS?.EmergencyMockDrill?.View
  // );


  // Now use



  // const handleEmergencyList = async (queryString = "") => {
  //   try {
  //     setIsLoaded(true);
  //     const emergencyList = await fetchAuditList(queryString, type);
  //     setData(emergencyList?.data);
  //     setIsLoaded(false);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setIsLoaded(false);
  //   }
  // };

  const handleEmergencyList = async (queryString = "", pageNumber, pageSize) => {
    try {
      setIsLoaded(true);
      const fullQueryString = `${queryString}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
      const emergencyList = await fetchAuditList(fullQueryString, type);
      setData(emergencyList?.data);
      setIsLoaded(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoaded(false);
    }
  };

  useEffect(() => {
    handleEmergencyList("", pageNumber, pageSize);
  }, [type, pageNumber, pageSize]);

  const columnHelper = createColumnHelper();

  useEffect(() => {
    let newObject =
      defaultData &&
      defaultData.map((item) => ({
        "Contract / MOU ID": item.contractDisplyId || item.mouContractDisplyId,
        "Contract / MOU Name": item.contractName || item.mouName,
        "Date": item.actionOn
          ? formatDurationFromUnixTimestamp(item.actionOn)
          : "-",
        "Time": item?.actionOn
          ? TimeFromUnixTimestamp(item?.actionOn)
          : "-",
        "Name": item.actionBy,
        "Action Description": item.action,

      }));
    setDownloadData(newObject);
  }, [defaultData]);


  const columns = [
   
    columnHelper.accessor((row) => row.contractDisplyId || row.mouContractDisplyId, {
      id: "contractDisplyId",
      cell: (info) => {
        const displayId = info.row.original.contractDisplyId || info.row.original.mouContractDisplyId;
        const contractDisplyId = info.row.original.contractDisplyId;
        const contractId = info.row.original.contractId;
        const mouId = info.row.original.mouId;
        const mouCategory = info.row.original.mouCategory;
        
        const linkPath = contractDisplyId ? `/details-screen/${contractId}` 
                        : mouCategory === "Aggregator" ? `/view-mou-aggregators/${mouId}` 
                        : `/mou-view/${mouId}`;
        const typeOf = contractId ? "Contract" : "Mou";
    
        return (
          <div className="flex justify-center items-center">
            <Link
              to={linkPath}
              // state={{
              //   cameFrom: "Pending Approval",
              //   type: type,
              //   typeOf: info.row?.original?.typeOfApproval,
              // }}
              state={{
                type: info.row.original.type,
                typeOf: typeOf,
                cameFrom: "Pending Approval",
                type: type,
                typeOf: info.row?.original?.typeOfApproval,
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
    columnHelper.accessor(
      (row) => row.contractName || row.mouName,
      {
        id: "contractOrMouName",
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Contract / MOU Name</span>,
      }
    ),
    columnHelper.accessor((row) => row.actionOn, {
      id: "actionOn",
      cell: (info) => <span>{DateFromUnixTimestampNoti(+info.getValue())}</span>,
      header: () => <span>Date</span>,
    }),
    columnHelper.accessor((row) => row.actionOn, {
      id: "actionOn",
      cell: (info) => <span>{TimeFromUnixTimestamp(info.getValue())}</span>,
      header: () => <span>Time</span>,
    }),
  
    columnHelper.accessor((row) => row.actionBy, {
      id: "actionBy",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Name </span>,
    }),
    columnHelper.accessor((row) => row.action, {
      id: "actionDescription",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Action Description</span>,
    }),
  ];

  const breadCrumbData = [
    {
      route: "",
      name: "Reports",
    },
    {
      route: "",
      name: "Audit Logs",
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
        setPageNumber(1); // Reset to first page on filter
        handleEmergencyList(queryString, 1, pageSize);
      // handleEmergencyList(queryString);
    } else {
      console.error("Error: Filters object is null or undefined.");
    }
  };

  const handleNextPage = () => {
    setPageNumber((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPageNumber((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  return (
    <div>
      {title && (
        <PageTitle
          title="Audit Logs"
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      )}

      <div className="content-wrapper">
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              {/* <div className="col-span-10">
              </div>
              <div className="col-span-2">
             
              </div> */}
              {filter && (
                <FilterAudit
                  filters={filters}
                  setFilters={setFilters}
                  handleFilterClick={handleFilterClick}
                />
              )}
            </div>
            <div className="col-span-12">
              {defaultData && !isLoaded && (
                <DataTable
                  key={defaultData?.length}
                  columns={columns}
                  defaultData={defaultData}
                  downloadData={downloadData}
                  isPaginated={isPaginated}
                  showDelete={true}
                  tableName="Audit Logs"
                  pageSize={20}
                  showDownload={showDownload}
                 
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

export default AuditLogsList;
