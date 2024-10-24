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
  fetchApostilleList,
  deleteApostille,
} from "../../../Services/apostilleMasterservice";
import AlertModal from "../../Common/ModalPopups/AlertModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessModal from "../../Common/ModalPopups/SuccessModal";

const ApostilleMasterList = ({
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
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const deletePermission = usePermission(
    MENU_PERMISSIONS?.CMS.ApostilleMaster?.Delete
  );
  const editPermission = usePermission(
    MENU_PERMISSIONS?.CMS.ApostilleMaster?.Edit
  );
  const createPermission = usePermission(
    MENU_PERMISSIONS?.CMS.ApostilleMaster?.Create
  );


  const handleApostilleList = async (queryString = "") => {
    try {
      setIsLoaded(true);
      let isActiveInactive = true;
      const apostilleList = await fetchApostilleList(
        queryString,
        isActiveInactive
      );
      setData(apostilleList?.data);
      setFilteredData(apostilleList?.data);
      setIsLoaded(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoaded(false);
    }
  };
  const handleDelete = async (idOfMember) => {
    try {
      const data = await deleteApostille({ id: idOfMember });
      if (data?.success) {
        toast.success("Apostille Deleted Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleApostilleList();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }finally{
      setIsOpen(false);
      setDeleteID();
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = defaultData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleApostilleList();
  }, []);
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
                    `/master-management/apostille-master/edit-apostille/${info?.row?.original?.id}`
                  );
                }
              }}
            >
              <TETooltip tag={"span"} title={"Edit Apostille"}>
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
              <TETooltip tag={"span"} title="Delete Apostille">
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
      header: () => <span>Apostille Name </span>,
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
      name: "Apostille Master",
    },
  ];

  useEffect(() => {
    let newObject =
      defaultData &&
      defaultData.map((item) => ({
        "Value ID": item.valueid,
        "Apostille Name": item.apostilleName,
        Status: item.status,
      }));
    setDownloadData(newObject);
  }, [defaultData]);

  return (
    <div>
      <ToastContainer />
      {title && (
        <PageTitle
          title="Apostille Master List"
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
                placeholder="Search by Apostile Name"
                className="border p-2 rounded"
              />
            </div>
            <div className="col-span-2">
              {createPermission && (
                <button
                  type="button"
                  className="mb-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center"
                  onClick={() => {
                    Navigate(
                      `/master-management/apostille-master/add-apostille`
                    );
                  }}
                >
                  Add New Apostille
                </button>
              )}
            </div>

            <div className="col-span-12">
              {filteredData && !isLoaded && (
                <DataTable
                  key={filteredData?.length}
                  columns={columns}
                  defaultData={filteredData}
                  downloadData={downloadData}
                  isPaginated={isPaginated}
                  showDelete={true}
                  tableName="Apostille Master List"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Loader isLoading={isLoaded} />
      {isOpen && (
        <AlertModal
          title="Are you sure you want to delete this Apostille?"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setShowSuccessModal={setShowSuccessModal}
          confirmPost={() => handleDelete(deleteID)}
        />
      )}

      {success && (
        <SuccessModal
          title="Apostille detail deleted successfully"
          showSuccessModal={success}
          setShowSuccessModal={setSuccess}
          handleResponse={() => {
            handleApostilleList();
            setSuccess(false);
          }}
        />
      )}
    </div>
  );
};

export default ApostilleMasterList;
