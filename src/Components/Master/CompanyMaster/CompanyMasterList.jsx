import React, { useState, useEffect } from "react";
import DataTable from "../../Common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import "../../../Components/Common/DataTable/index.css";
import PageTitle from "../../Common/PageTitle";
import { useNavigate } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { TETooltip } from "tw-elements-react";
import { usePermission } from "../../../App";
import { MENU_PERMISSIONS } from "../../../Constant/permissionConstant";
import Loader from "../../Common/Loader";
import {
  fetchCompanyList,
  deleteCompany,
} from "../../../Services/createCompanyService";
import AlertModal from "../../Common/ModalPopups/AlertModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CompanyMasterList = ({
  title = true,
  filter = true,
  isPaginated = true,
  type,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const Navigate = useNavigate();
  const [defaultData, setData] = React.useState();
  const [downloadData, setDownloadData] = React.useState();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteID, setDeleteID] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  const deletePermission = usePermission(
    MENU_PERMISSIONS?.CMS.CompanyMaster?.Delete
  );
  const editPermission = usePermission(
    MENU_PERMISSIONS?.CMS.CompanyMaster?.Edit
  );
  const createPermission = usePermission(
    MENU_PERMISSIONS?.CMS.CompanyMaster?.Create
  );


  const handleCompanyList = async (queryString = "") => {
    try {
      setIsLoaded(true);
      const companyList = await fetchCompanyList(
        {
          name: searchText,
          onlyActive: false,
        },
        type
      );
      setData(companyList?.data);
      setFilteredData(companyList?.data);
      setIsLoaded(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoaded(false);
    }
  };

  const handleDelete = async (idOfMember) => {
    try {
      const data = await deleteCompany({ id: idOfMember });
      if (data?.success) {
        toast.success("Company Deleted Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleCompanyList();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete company", {
        position: toast.POSITION.TOP_RIGHT,
      });    
    }finally{
      setDeleteID()
      setIsOpen(false);
     
    }
  };
 
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = defaultData.filter((item) =>{
     let query = `${item.name.toLowerCase()}${item.city.toLowerCase()}${item.stateName.toLowerCase()}${item.countryName.toLowerCase()}`
     return query.includes(value.toLowerCase())
    }
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleCompanyList();
  }, []);

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (isSearchTouched) {
  //       handleCompanyList();
  //     }
  //   }, 5000);
  //   return () => {
  //     clearTimeout(delayDebounceFn);
  //   };
  // }, [searchText, isSearchTouched]);

  // const onchangeSerach = (e) => {
  //   if (!isSearchTouched) {
  //     setIsSerchTouched(true);
  //   }
  //   if (isSortTouched) {
  //     setIsSortTouched(false);
  //   }
  //   setSearchText(e.target.value);
  // };

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
                if (info?.row?.original?.id) {
                  Navigate(
                    `/master-management/company-master/edit-company/${info?.row?.original?.id}`
                  );
                }
              }}
            >
              <TETooltip tag={"span"} title={"Edit Company"}>
                <FiEdit className="text-xl" />
              </TETooltip>
            </button>
          )}
          {deletePermission && (
            <button
              type="button"
              className="ml-5"
              onClick={() => {
                setDeleteID(info?.row?.original?.id);
                setIsOpen(true);
              }}
            >
              <TETooltip tag={"span"} title="Delete Company">
                <BsTrash className="text-xl" style={{ color: "red" }} />
              </TETooltip>
            </button>
          )}
        </>
      ),
      header: () => <span>Action</span>,
      enableSorting: false, // Disable sorting for this column
    }),
    columnHelper.accessor((row) => row.id, {
      id: "id",
      cell: (info) => (
        <div className="flex justify-center items-center">
          <span className="text-black bg-gray-100 px-2 py-1 rounded-md text-md font-medium">
            {info.getValue()}
          </span>
        </div>
      ),
      header: () => <span>Value ID</span>,
    }),
    columnHelper.accessor((row) => row.name, {
      id: "name",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Company Name </span>,
    }),
    // columnHelper.accessor((row) => row.contractType, {
    //   id: "contractType",
    //   cell: (info) => <span>{info.getValue()}</span>,
    //   header: () => <span>Contract Type </span>,
    // }),
    columnHelper.accessor((row) => row.location, {
      id: "location",
      cell: (info) => (
        <span>
          {info?.row?.original?.city +
            ", " +
            info?.row?.original?.stateName +
            ", " +
            info?.row?.original?.countryName ?? "-"}
        </span>
      ),
      header: () => <span>Company Location</span>,
    }),

    columnHelper.accessor((row) => row.isActive, {
      id: "isActive",
      cell: (info) => {
        let bgColor = info.getValue() === true ? "green" : "red";
        return (
          <div className="flex justify-center items-center">
            <span
              style={{ backgroundColor: `${bgColor}` }}
              className={`text-white py-1 my-3 w-[120px] rounded-full text-md font-medium shadow`}
            >
              {info.getValue() === true ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
      header: () => <span>Status</span>,
    }),
  ];

  const breadCrumbData = [
    {
      route: "",
      name: "Masters",
    },
    {
      route: "",
      name: "Company Master",
    },
  ];

  useEffect(() => {
    let newObject =
      defaultData &&
      defaultData.map((item) => ({
        "Value ID": item.id,
        "Company Name": item.name,
        "Contract Type": item.contractType,
        "Company Location": item.companyLocation,
        Status: item.isActive,
      }));
    setDownloadData(newObject);
  }, [defaultData]);

  return (
    <div>
      <ToastContainer />
      {title && (
        <PageTitle
          title="Company Master List"
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
                placeholder="Search by Company Name"
                className="border p-2 rounded"
              />
            </div>
            <div className="col-span-2">
              {createPermission && (
                <button
                  type="button"
                  className="mb-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center"
                  onClick={() => {
                    Navigate(`/master-management/company-master/add-company`);
                  }}
                >
                  Add New Company
                </button>
              )}
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
                  tableName="Company Master List"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Loader isLoading={isLoaded} />
      {isOpen && (
        <AlertModal
          title="Are you sure you want to delete this company details?"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setShowSuccessModal={setShowSuccessModal}
          confirmPost={() => handleDelete(deleteID)}
        />
      )}
    </div>
  );
};

export default CompanyMasterList;
