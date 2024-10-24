import React, { useState, useEffect } from "react";
import { BsFileEarmark, BsTrash3 } from "react-icons/bs";
import { nanoid } from 'nanoid';
import Loader from "./Loader";
import {
  getSignedUrlForFile,
  uploadFileToS3,
  UploadAttachment,
  getAllUloadedFiles,
  DeleteFile,
} from "../../Services/uploadService";
import { categorizeFiles } from "../../utils/functions";
import { TETooltip } from "tw-elements-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";

const UploadMediaCMS = ({
  register,
  handleSubmit,
  globalObjectId,
  disabled,
  name,
  errors,
  mandate = false,
  uploadFor,
  isEdit,
  isVisible = true,
  id,
  type,
  uuidVal = 1,
  requestTypeId,
  aggregatorId,
  allowedSingleFile,
  isAddendum,
  isRenew,
  aggregatorReference=null
  // watch
}) => {
  const [loading, setIsLoading] = useState(false);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);
  const { mouId, id: contract_Id } = useParams();
  const editId = mouId ?? contract_Id ?? null;
  const checkFileUuid = (uuid) => {
    return newAttachments.some((file) => file.fileUuid === uuid);
  };

  async function getUploadedFiles() {
    try {
      const response = await getAllUloadedFiles(globalObjectId);
      const { otherFiles } = categorizeFiles(response?.data);
      const filesInfo = response?.data?.length > 0 ? otherFiles : [];
      let finalFiles = [];
      if (
        uploadFor == "Termination Notice" ||
        uploadFor == "Withdrawal Notice"
      ) {
        finalFiles = filesInfo?.filter(
          (file) =>
            file?.section == uploadFor &&
            disabled &&
            file?.requestTypeId == requestTypeId
        );
      } else if (uploadFor == "Aggregator Document") {
        finalFiles = filesInfo.filter((file) => file?.aggregatorId == id);
      } else if (uploadFor == "Aggregator Addendum Document") {
        finalFiles = filesInfo.filter((file) => file?.aggregatorId == id || file?.aggregatorId == aggregatorReference);
      } else if (uploadFor == "Aggregator Renewal Document") {
        finalFiles = filesInfo.filter((file) => file?.aggregatorId == id || file?.aggregatorId == aggregatorReference);
      } else if (
        uploadFor == "MSME Document" ||
        uploadFor == "PAN Document" ||
        uploadFor == "GST Document"
      ) {
        finalFiles = filesInfo.filter((file) => file?.documentTypeId == id);
      } else {
        finalFiles = filesInfo?.filter(
          (file) =>
            file?.section != "Termination Notice" &&
            file?.section != "Withdrawal Notice"
        );
      }
     
      setUploadedAttachments(finalFiles?.length > 0 ? finalFiles : []);
    
    } catch (e) {
      toast.error(e.message ?? "Error while fetching uploaded files", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
  useEffect(() => {
    if(globalObjectId){
      getUploadedFiles();
    }else{
      setUploadedAttachments([])
    }
  }, [globalObjectId]);
  // useEffect(() => {
  //   globalObjectId && getUploadedFiles();
  // }, [globalObjectId]);

  const handleUpload = async (event, type) => {
    const validTypes = {
      Photo: ["image/gif", "image/jpeg", "image/png", "image/svg+xml"],
      Video: [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/avi",
        "video/mpeg",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-ms-wmv",
      ],
      Attachment: [
        "application/pdf", // .pdf
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "text/plain", // .txt
        "application/rtf", // .rtf
        "application/vnd.oasis.opendocument.text", // .odt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
        "application/vnd.ms-powerpoint", // .ppt
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv", // .csv
        "application/vnd.oasis.opendocument.presentation", // .odp
        "application/vnd.oasis.opendocument.spreadsheet", // .ods
        "application/vnd.oasis.opendocument.graphics", // .odg
        "application/vnd.oasis.opendocument.formula", // .odf
        "application/xml", // .xml
        "application/json", // .json
        "text/html", // .html
        "application/epub+zip", // .epub
        "text/markdown", // .md
      ],
    };

    const typeMessages = {
      Photo: "Only image files are allowed!",
      Video: "Only video files are allowed!",
      Attachment: "File format not supported!",
    };

    const validFileTypes = validTypes[type] || [];
    const errorMessage = typeMessages[type] || "Invalid file type!";
    const filesToUpload = event.target.files;

    if (
      filesToUpload?.length > 10 ||
      filesToUpload?.length + uploadedAttachments?.length > 10
    ) {
      toast.error("You can only upload a maximum of 10 files", {
        position: toast.POSITION.TOP_RIGHT,
      });
      event.target.value = "";
      return;
    }

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];

      if (!validFileTypes.includes(file.type)) {
        toast.error(
          " Attachment : Only the listed file types are accepted for the attachment pdf, doc, docx, txt, rtf, odt, pptx, ppt, xlsx, xls, csv, odp, ods, odg, odf, xml, json, html, epub, md.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        // Clear the input value to prevent any invalid files from being uploaded
        event.target.value = "";
        return;
      }

      if (file.size > 24 * 1024 * 1024) {
        toast.error("File size must be less than 25 MB", {
          position: toast.POSITION.TOP_RIGHT,
        });
        event.target.value = "";
        return;
      }

      const lastDotIndex = file.name.lastIndexOf(".");
      let fileType = null;
      let fileName = null;
      if (lastDotIndex !== -1) {
        fileName = file.name.substring(0, lastDotIndex); // Extract name before the dot
        fileType = file.name.slice(lastDotIndex + 1).toLowerCase();
      }
      const uuid = nanoid();
      //let fileRes = file.name.split(".");
      // const fileName = fileRes[0];
      const extension = fileType;
      const signedUrlResponse = await getSignedUrlForFile(
        fileName,
        extension,
        uuid,
        false
      );

      if (signedUrlResponse.success) {
        const uploadUrl = signedUrlResponse?.data;
        await uploadFileToS3(file, uploadUrl, setIsLoading);
        const data = {
          fileName: fileName,
          fileType: extension,
          fileUuid: uuid,
          globalObjectId: globalObjectId,
          section: uploadFor,
        };
        if (
          uploadFor == "MSME Document" ||
          uploadFor == "PAN Document" ||
          uploadFor == "GST Document"
        ) {
          data.documentTypeId = id;
        }
        if (type === "Contract") data.contractId = id;
        if (type === "MOU") data.mouId = id;
        if (type === "Aggregator") data.aggregatorId = id;
        if (
          requestTypeId &&
          (uploadFor === "Termination Notice" ||
            uploadFor === "Withdrawal Notice")
        ){
          data.requestTypeId = requestTypeId;
        }

        //if (type === "Attachment") {
        setUploadedAttachments((prevFiles) => [...prevFiles, data]);
        // setNewAttachments((prevFiles) => [data]);
        setNewAttachments((prevFiles) => [...prevFiles, data]);
        if(uploadFor == "Termination Notice"){
          setNewAttachments((prevFiles) => [data])
        }
           

        //}
      } else {
        console.error("Failed to get signed URL for file:", file.name);
      }
    }

    // Clear the input value to avoid showing file names
    event.target.value = "";
  };

  const updateUploadedData = async (data) => {
    data["globalObjectId"] = globalObjectId;
    if (
      uploadFor == "MSME Document" ||
      uploadFor == "PAN Document" ||
      uploadFor == "GST Document"
    ) {
      data.documentTypeId = id;
    }
    if (type === "Contract") data.contractId = id;
    if (type === "MOU") data.mouId = id;
    if (type === "Aggregator") data.aggregatorId = id;
    if (
      requestTypeId &&
      (uploadFor === "Termination Notice" || uploadFor === "Withdrawal Notice")
    )
      data.requestTypeId = requestTypeId;
    const uploadResponse = await UploadAttachment(data);
  };

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

  
  async function deleteFile(file, id) {
  
   const newAttachmentsdata = newAttachments?.filter((item) => item?.fileUuid !== file?.fileUuid);
   setNewAttachments(newAttachmentsdata);
   const data = uploadedAttachments?.filter((item, index) => index !== id);
   setUploadedAttachments(data);


 
    if (file?.id) {
      const res = await DeleteFile(file?.id);
      if (res?.success) {
        toast.success("File Deleted Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
     
    }
  }

  // useEffect(() => {
  //   if (globalObjectId) {
  //     uploadedAttachments.map((fileData) => {
  //       updateUploadedData(fileData);
  //     });
  //   }
  // }, [globalObjectId, isEdit]);

  useEffect(() => {
    const processUploadedAttachments = async () => {
      if (globalObjectId) {
        for (const fileData of newAttachments) {
          await updateUploadedData(fileData);
        }
      }
    };

    processUploadedAttachments();
  }, [globalObjectId, isEdit]);

  const isRequired = uploadedAttachments?.length < 1 && mandate;

  const classFileView =
    uploadFor === "Termination Notice" ||
    uploadFor === "Withdrawal Notice" ||
    disabled
      ? "md:col-span-12"
      : "md:col-span-6";


  return (
    <>
      <ToastContainer />
      <Loader isLoading={loading} />

      <p className="inline-block text-gray-500 text-lg mb-1 flex items-center gap-1  cursor-pointer">
        {name}
        {!disabled && (
          <span>
            <TETooltip
              title={
                " Attachment : pdf, doc, docx, txt, rtf, odt, pptx, ppt, xlsx, xls, csv, odp, ods, odg, odf, xml, json, html, epub, md format only"
              }
              tag={"span"}
            >
              <FaInfoCircle data-tip data-for="infoTooltip" />
            </TETooltip>
          </span>
        )}

        {mandate ? <span className="text-danger ml-2">*</span> : ""}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-y-5 gap-x-8">
          <div className={`col-span-11 ${classFileView} text-left`}>
            <div className="rounded-md block">
              {isVisible && !disabled && (
                <>
                  <label
                    class="custom-file-label"
                    htmlFor={`uploadFileAttachments_${uuidVal}`}
                  >
                    <span class="file-button">Choose files</span>
                  </label>
                  <input
                    id={`uploadFileAttachments_${uuidVal}`}
                    type="file"
                    className="custom-file-input block w-full border border-gray-300 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-200 file:border-0 file:me-4 file:py-3 file:px-4 cursor-pointer"
                    // {...register("uploadMou", {
                    //   required: "File upload is required",
                    // })}
                    disabled={
                      allowedSingleFile
                        ? uploadedAttachments.length > 0
                          ? true
                          : false
                        : disabled
                    }
                    // disabled={disabled}
                    accept="*.*"
                    multiple
                    {...register(`uploadFileAttachments_${uuidVal}`, {
                      required: isRequired && "Required",
                    })}
                    onChange={(e) => handleUpload(e, "Attachment")}
                  />
                </>
              )}
             
              <p className="text-red-500   mt-1  ">
                {errors &&
                  errors[`uploadFileAttachments_${uuidVal}`] &&
                  isRequired &&
                  "This field is required"}
              </p>
            </div>
            <div className="max-h-[220px] overflow-auto ">
              <div className="mt-2 text-left">
                {uploadedAttachments.length > 0 &&
                  uploadedAttachments.map((file, index) => {
                    // const deleteCondition =
                    //   !disabled &&
                    //   (editId == file?.mouId ||
                    //     editId == file?.contractId ||
                    //     editId == file?.aggregatorId ||
                    //     (!file?.mouId &&
                    //       !file?.contractId &&
                    //       !file?.aggregatorId));
               
                    const deleteCondition =
                      !disabled &&
                      (
                        checkFileUuid(file?.fileUuid) ||
                        (
                          // !isEdit &&
                          // uploadFor !== "Renewal Document" &&
                          // uploadFor !== "Addendum Document" &&
                          (!isRenew && !isAddendum) &&
                          (editId == file?.mouId ||
                            editId == file?.contractId ||
                            editId == file?.aggregatorId ||
                            (!file?.mouId &&
                              !file?.contractId &&
                              !file?.aggregatorId))));
                    //const deleteCondition = checkFileUuid(file?.fileUuid);
                    return (
                      <div key={index} className="mb-3">
                        <div className="text-gray-600 hover:text-blue-600 cursor-pointer flex items-center gap-2">
                          <BsFileEarmark
                            size="20px"
                            className="text-blue-600 shrink-0"
                          />
                          <span
                            onClick={() => downloadFile(file)}
                            className=" w-full"
                          >
                            {file?.fileName}.{file?.fileType}
                          </span>
                          {/* {
                             && (
                              <span onClick={() => deleteFile(file, index)}>
                              <TETooltip title={"Delete File"} tag={"span"}>
                                <BsTrash3 className="shrink-0" />
                              </TETooltip>
                            </span>
                            )
                          } */}
                          {(deleteCondition ||
                            (!disabled &&
                              aggregatorId &&
                              uploadFor == "Aggregator Document")) && (
                            <span onClick={() => deleteFile(file, index)}>
                              <TETooltip title={"Delete File"} tag={"span"}>
                                <BsTrash3 className="shrink-0" />
                              </TETooltip>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UploadMediaCMS;
