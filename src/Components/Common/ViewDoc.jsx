import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAllViewDocuments,
  getSignedUrlForFile,
} from "../../Services/uploadService";
import { formatDurationFromUnixTimestamp } from "../../utils/functions";
import PageTitle from "./PageTitle";
import { BsArrowLeftShort, BsFilePdf } from "react-icons/bs";
import { toast } from "react-toastify";

const ViewDoc = () => {
  const [tableData, setTableData] = useState(null);
  const navigate = useNavigate();
  const { typeId } = useParams();
  const location = useLocation();
  const result = location.state || {};

  async function getUploadedFiles() {
    try {
      // const response = await getAllUloadedFiles(15);
      const response = await getAllViewDocuments(result);
      if (response?.data) {
        setTableData(response?.data);
      }
    } catch (e) {
      toast.error(e.message ?? "Error while fetching documents", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(() => {
    result && getUploadedFiles(result);
  }, [result]);

  async function downloadFile(file) {
    const signedUrlResponse = await getSignedUrlForFile(
      file?.fileName,
      file?.fileType,
      file?.fileUuid,
      true
    );
    if (signedUrlResponse.success) {
      const downloadUrl = signedUrlResponse?.data;
      window.open(downloadUrl, "_blank");
    }
  }

  const breadCrumbData = [

    {
      route: "",
      name: result && result?.type == "mouId" 
      ? `MOU Contract` 
      : `Contract`,
    },
   
    {
      route:
        result && result?.type == "mouId"
          ? "/mou-contract-list"
          : "/contract-list",
      name:
        result && result?.type == "mouId"
          ? "Mou List All"
          : result?.contractType == "Classified"
          ? `Contract Pending Approval [${result?.contractType}]`
          : `Contract List All`,
    },
   
  ];

  return (
    <>
      {typeId && result.companyName ? (
        <PageTitle
          title={
            result?.contractType == "Classified"
              ? `View documents [${result?.contractType}] ( ${typeId} - ${result.companyName} )`
              : `View documents ( ${typeId} - ${result.companyName} )`
          }
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      ) : typeId && result.mouName ? (
        <PageTitle
          title={`View documents ( ${typeId} - ${result.mouName} )`}
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      ) : null}

      <div className="">
        <button type="button">
          <p
            className="py-2.5 pl-3 pr-5 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white inline-flex items-center gap-x-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <BsArrowLeftShort size={'22px'} />
            Back
          </p>
        </button>
      </div>
      <h1 className="mt-2.5 mb-2.5 mx-0 font-medium text-sm">
        {/* Contract ID / MOU ID - {contractId} */}
      </h1>

      <div className="bg-white shadow rounded-lg p-4 mb-8">

      <div className="overflow-auto table-container">
            <table className="table-borderless table-auto table-striped w-full">
                <thead className="bg-blue-600 text-white text-center leading-normal">
                    <tr>
                        <th className="py-2">View Attachment</th>
                        <th className="py-2">Attachment Name</th>
                        <th className="py-2">Document Type</th>
                        <th className="py-2">Attachment Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300 text-center">
                {tableData && tableData.length > 0 ? (
                    <>
                    {tableData &&
                        tableData?.map((item, index) => (
                            <tr key={index} className="hover:bg-blue-50 transition duration-200 ease-in-out">
                                <td
                                    className="px-3 py-3 whitespace-nowrap text-base font-medium border-b cursor-pointer"
                                    onClick={() => downloadFile(item)}
                                >
                                    {<BsFilePdf size={'24px'} className="mx-auto text-red-600" />}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-base font-medium border-b">{item.fileName}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-base font-medium border-b">{item.section}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-base font-medium border-b">
                                {item.createdOn
                                    ? formatDurationFromUnixTimestamp(item.createdOn)
                                    : "-"}
                                </td>
                            </tr>
                        ))}
                    </>
                ) : (
                    <tr>
                    <td colSpan="4" className="border px-4 py-2 text-center">
                        No attachments found.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );
};

export default ViewDoc;
