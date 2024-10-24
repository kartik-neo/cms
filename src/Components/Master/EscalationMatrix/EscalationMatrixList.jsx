import React, { useState, useEffect } from "react";
import DataTable from "../../Common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import "../../../Components/Common/DataTable/index.css";
import PageTitle from "../../Common/PageTitle";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { TETooltip } from "tw-elements-react";
import { usePermission } from "../../../App";
import { MENU_PERMISSIONS } from "../../../Constant/permissionConstant";
import Loader from "../../Common/Loader";
import { getUnitId } from "../../../utils/functions";
import { ESCALATION_MATRIX_GET_BY_DEPARTMENT_ID } from "../../../Constant/apiConstant";
import { api } from "../../../utils/api";
const EscalationMatrixList = ({
  title = true,
  filter = true,
  isPaginated = true,
  type,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const Navigate = useNavigate();
  const [defaultData, setData] = React.useState();
  const [downloadData, setDownloadData] = React.useState();
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  let permissionName = null;

  if (type == "MOU") {
    permissionName = MENU_PERMISSIONS?.CMS.EscalationMatrixMOU?.Edit;
  } else if (type == "Contract") {
    permissionName = MENU_PERMISSIONS?.CMS.EscalationMatrixContract?.Edit;
  } else if (type == "Classified") {
    permissionName = MENU_PERMISSIONS?.CMS.EscalationMatrixClassified?.Edit;
  }

  const editPermission = usePermission(permissionName);

  async function fetchEscalationMatrixList(queryString = "", type) {
    const unitId = getUnitId();
    try {
      const response = await api.get(
        `${ESCALATION_MATRIX_GET_BY_DEPARTMENT_ID}?contractTypeName=${type}&unitid=${unitId}&${queryString}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      throw error;
    }
  }

  const handleEmergencyList = async (queryString = "") => {
    try {
      setIsLoaded(true);
      const escalationList = await fetchEscalationMatrixList(queryString, type);
      setData(escalationList?.data);
      setFilteredData(escalationList?.data);
      setIsLoaded(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoaded(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = defaultData.filter((item) =>{
      let query = `${item.departmentName.toLowerCase()}`   
      return query.includes(value.toLowerCase())
    }
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleEmergencyList();
  }, [type]);
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row) => row.action, {
      id: "action",
      cell: (info) => (
        <>
          {editPermission && (
            <button
              type="button"
              disabled={
                !info?.row?.original?.isActivated &&
                info?.row?.original?.isActivation &&
                info?.row?.original?.isPostEventAnalysis &&
                info?.row?.original?.isVerification &&
                info?.row?.original?.isActionItemsClosed
              }
              className={`${
                !info?.row?.original?.isActivated &&
                info?.row?.original?.isActivation &&
                info?.row?.original?.isPostEventAnalysis &&
                info?.row?.original?.isVerification &&
                info?.row?.original?.isActionItemsClosed
                  ? "opacity-40"
                  : ""
              }
              `}
              onClick={() => {
                // handle the click event
                // Navigate(`/code-${info.row.original.emergencyId}`);
                if (info?.row?.original?.departmentId) {
                  // Navigate(
                  //   // `/edit-escalation/${info?.row?.original?.valueid}/${info?.row?.original?.status}`
                  //   `/master-management/edit-escalation-matrix/${info?.row?.original?.valueid}/${type}`
                  // );
                  Navigate(
                    // `/edit-apostille/${info?.row?.original?.valueid}/${info?.row?.original?.status}`
                    `/master-management/edit-escalation-matrix/${info?.row?.original?.contractTypeName}/${info?.row?.original?.departmentId}/${info?.row?.original?.departmentName}/${info?.row?.original?.contractType}`,
                    { state: { data: info?.row?.original } }
                  );
                }
              }}
            >
              <TETooltip tag={"span"} title={"Edit Escalation Matrix"}>
                <FiEdit className="text-xl" />
              </TETooltip>
            </button>
          )}
        </>
      ),
      header: () => <span>Action</span>,
      enableSorting: false, // Disable sorting for this column
    }),
    // columnHelper.accessor((row) => row.locationName, {
    //   id: "locationName",
    //   cell: (info) => (
    //     <div className="flex justify-center items-center">
    //       <span className="text-black bg-gray-100 px-2 py-1 rounded-md text-md font-medium">
    //         {info.getValue()}
    //       </span>
    //     </div>
    //   ),
    //   header: () => <span>Location</span>,
    // }),
    columnHelper.accessor((row) => row.departmentName, {
      id: "departmentName",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Department </span>,
    }),
    columnHelper.accessor((row) => row.departmentName, {
      id: "escalation1",
      cell: (info) => (
        <span>
          {" "}
          {info?.row?.original?.escalationMatrixModel?.[0]?.empName || "-"}
        </span>
      ),
      header: () => <span>Escalation 1</span>,
    }),
  ];

  if (type !== "Classified") {
    columns.push(
      columnHelper.accessor((row) => row.departmentName, {
        id: "escalation2",
        cell: (info) => (
          <span>
            {info?.row?.original?.escalationMatrixModel?.[1]?.empName || "-"}
          </span>
        ),
        header: () => <span>Escalation 2 </span>,
      }),
      columnHelper.accessor((row) => row.departmentName, {
        id: "escalation3",
        cell: (info) => (
          <span>
            {info?.row?.original?.escalationMatrixModel?.[2]?.empName || "-"}
          </span>
        ),
        header: () => <span>Escalation 3 </span>,
      })
    );
  }
  const breadCrumbData = [
    {
      route: "",
      name: "Masters",
    },
    {
      route: "",
      name: "Escalation Matrix - " + type,
    },
  ];

  useEffect(() => {
    let newObject =
      defaultData &&
      defaultData.map((item) => ({
        "Value ID": item.valueid,
        Department: item.departmentName,
        "Escalation 1": item.escalation1,
        "Escalation 2": item.escalation2,
        "Escalation 3": item.escalation3,
      }));
    setDownloadData(newObject);
  }, [defaultData]);

  return (
    <div>
      {title && (
        <PageTitle
          title={`Escalation Matrix - ${type}`}
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      )}

      <div className="content-wrapper">
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-10">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by Department Name"
                className="border p-2 rounded"
              />
            </div>
            <div className="col-span-2">
              {/* <button
                type="button"
                className="mb-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center"
                // onClick={()=>{}}
              >
                Add New Apostille
              </button> */}
            </div>
            {/* {filter && (
                <FilterComponent
                  filters={filters}
                  setFilters={setFilters}
                  handleFilterClick={handleFilterClick}
                />
              )} */}
            <div className="col-span-12">
              {filteredData && !isLoaded && (
                <DataTable
                  key={filteredData?.length}
                  columns={columns}
                  defaultData={filteredData}
                  downloadData={downloadData}
                  isPaginated={isPaginated}
                  showDelete={true}
                  tableName={`Escalation Matrix - ${type}`}
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

export default EscalationMatrixList;
