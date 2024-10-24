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
import { APPROVAL_GET_ALL } from "../../../Constant/apiConstant";
import { api } from "../../../utils/api";
const ApprovalMatrixList = ({
  title = true,
  filter = true,
  isPaginated = true,
  type,
  typeId,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const Navigate = useNavigate();
  const [defaultData, setData] = React.useState();
  const [downloadData, setDownloadData] = React.useState();
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  let permissionName = null;

  if (typeId == 1) {
    permissionName = MENU_PERMISSIONS?.CMS.ApprovalMatrixMOU?.Edit;
  } else if (typeId == 2) {
    permissionName = MENU_PERMISSIONS?.CMS.ApprovalMatrixContract?.Edit;
  } else if (typeId == 3) {
    permissionName = MENU_PERMISSIONS?.CMS.ApprovalMatrixClassified?.Edit;
  }

  const editPermission = usePermission(permissionName);

  async function fetchApprovalMatrixList(queryString = "", type, typeId) {
    const unitId = getUnitId();
    try {
      const response = await api.get(
        `${APPROVAL_GET_ALL}?contractTypeId=${typeId}&unitid=${unitId}&${queryString}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      throw error;
    }
  }

  const handleApprovalList = async (queryString = "") => {
    try {
      setIsLoaded(true);
      const approvalList = await fetchApprovalMatrixList(
        queryString,
        type,
        typeId
      );
      setData(approvalList?.data);
      setFilteredData(approvalList?.data);
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
    handleApprovalList();
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
              onClick={() => {
                if (info?.row?.original?.departmentId) {
                  Navigate(
                    `/master-management/edit-approval-matrix/${info?.row?.original?.contractTypeName}/${info?.row?.original?.departmentId}/${info?.row?.original?.departmentName}/${info?.row?.original?.contractType}`,
                    { state: { data: info?.row?.original } }
                  );
                }
              }}
            >
              <TETooltip tag={"span"} title={"Edit Approval Matrix "}>
                <FiEdit className="text-xl" />
              </TETooltip>
            </button>
          )}
        </>
      ),
      header: () => <span>Action</span>,
      enableSorting: false, // Disable sorting for this column
    }),
    columnHelper.accessor((row) => row.departmentName, {
      id: "departmentName",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Department </span>,
    }),
    columnHelper.accessor((row) => row.departmentName, {
      id: "approver1",
      cell: (info) => (
        <span>
          {info?.row?.original?.approvalMatrixModel?.[0]?.empName ?? "-"}
        </span>
      ),
      header: () => <span>Approver 1</span>,
    }),
    columnHelper.accessor((row) => row.departmentName, {
      id: "approver2",
      cell: (info) => (
        <span>
          {info?.row?.original?.approvalMatrixModel?.[1]?.empName ?? "-"}
        </span>
      ),
      header: () => <span>Approver 2 </span>,
    }),
  ];

  if (type !== "Classified") {
    columns.push(
      columnHelper.accessor((row) => row.departmentName, {
        id: "approver3",
        cell: (info) => (
          <span>
            {info?.row?.original?.approvalMatrixModel?.[2]?.empName ?? "-"}
          </span>
        ),
        header: () => <span>Approver 3 </span>,
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
      name: " Approval Matrix - " + type,
    },
  ];
  

  useEffect(() => {
    let newObject =
      defaultData &&
      defaultData.map((item) => ({
        "Value ID": item.valueid,
        Department: item.departmentName,
        "Approver 1": item.approver1,
        "Approver 2": item.approver2,
        "Approver 3": item.approver3,
      }));
    setDownloadData(newObject);
  }, [defaultData]);

  return (
    <div>
      {title && (
        <PageTitle
          title={`Approval Matrix - ${type}`}
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
              {/* <h1 className="text-2xl">Department wise Approval</h1> */}
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-12">
              {filteredData && !isLoaded ? (
                <DataTable
                  key={filteredData?.length}
                  columns={columns}
                  defaultData={filteredData}
                  downloadData={downloadData}
                  isPaginated={isPaginated}
                  showDelete={true}
                  tableName={`Approval Matrix - ${type}`}
                />
              ) : (
                "No data available"
              )}
            </div>
          </div>
        </div>
      </div>
      <Loader isLoading={isLoaded} />
    </div>
  );
};

export default ApprovalMatrixList;
