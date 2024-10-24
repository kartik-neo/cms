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
  deleteDocument,
  fetchDocumentList,
} from "../../../Services/documentsMasterService";
import AlertModal from "../../Common/ModalPopups/AlertModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DocumentMasterList = ({
  title = true,
  filter = true,
  isPaginated = true,
  type,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const [defaultData, setDefaultData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteID, setDeleteID] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const deletePermission = usePermission(
    MENU_PERMISSIONS?.CMS.DocumentMaster?.Delete
  );
  const editPermission = usePermission(
    MENU_PERMISSIONS?.CMS.DocumentMaster?.Edit
  );
  const createPermission = usePermission(
    MENU_PERMISSIONS?.CMS.DocumentMaster?.Create
  );

  const handleDocumentList = async () => {
    try {
      setIsLoaded(true);
      const documentList = await fetchDocumentList("", type);
      setDefaultData(documentList?.data);
      setFilteredData(documentList?.data);
      setIsLoaded(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoaded(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteDocument({ id: id });
      if (data?.success) {
        setShowSuccessModal(true);
        toast.success("Document Deleted Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleDocumentList();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete document", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }finally{
      setIsOpen(false);
      setDeleteID()
     
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
    handleDocumentList();
  }, []);

  useEffect(() => {
    let newObject =
      defaultData &&
      defaultData.map((item) => ({
        "Value ID": item.valueid,
        "Document Name": item.documentName,
        Status: item.status,
      }));
    setDownloadData(newObject);
  }, [defaultData]);

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
                  navigate(
                    `/master-management/document-master/edit-document/${info?.row?.original?.id}`
                  );
                }
              }}
            >
              <TETooltip tag={"span"} title={"Edit Document"}>
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
              <TETooltip tag={"span"} title="Delete Document">
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
      header: () => <span>Document Name</span>,
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
      name: "Document Masters",
    },
  ];

  return (
    <div>
      <ToastContainer />
      {title && (
        <PageTitle
          title="Document Master List"
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
                placeholder="Search by Document Name"
                className="border p-2 rounded"
              />
            </div>
            <div className="col-span-2">
              {createPermission && (
                <button
                  type="button"
                  className="mb-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center"
                  onClick={() => {
                    navigate(`/master-management/document-master/add-document`);
                  }}
                >
                  Add New Document
                </button>
              )}
            </div>
            <div className="col-span-12">
              {filteredData && !isLoaded && (
                <DataTable
                  key={filteredData.length}
                  columns={columns}
                  defaultData={filteredData}
                  downloadData={downloadData}
                  isPaginated={isPaginated}
                  showDelete={true}
                  tableName="Document Master List"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Loader isLoading={isLoaded} />
      {isOpen && (
        <AlertModal
          title="Are you sure you want to delete this Document?"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setShowSuccessModal={setShowSuccessModal}
          confirmPost={() => handleDelete(deleteID)}
        />
      )}
    </div>
  );
};

export default DocumentMasterList;
