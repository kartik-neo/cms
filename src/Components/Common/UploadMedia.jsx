import React, { useState, useEffect } from "react";
import {
  BsFileEarmark,
  BsTrash3,
} from "react-icons/bs";
import { nanoid } from 'nanoid';

import Loader from "../Common/Loader";
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

const UploadMedia = ({
  register,
  handleSubmit,
  globalObjectId,
  disabled,
}) => {
  const [loading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedVideos, setUploadedVideo] = useState([]);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);

  async function getUploadedFiles() {
    try {
      const response = await getAllUloadedFiles(globalObjectId);
      const { images, videos, otherFiles } = categorizeFiles(response?.data);
      setUploadedFiles(images);
      setUploadedVideo(videos);
      setUploadedAttachments(otherFiles);
    } catch (e) {
      toast.error(e.message ?? "Error while fetching uploaded files", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(() => {
    globalObjectId && getUploadedFiles();
  }, [globalObjectId]);

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
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
      ],
    };

    const typeMessages = {
      Photo: "Only image files are allowed!",
      Video: "Only video files are allowed!",
      Attachment: "Image & video files are not allowed!",
    };

    const validFileTypes = validTypes[type] || [];
    const errorMessage = typeMessages[type] || "Invalid file type!";
    const filesToUpload = event.target.files;
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];

      if (!validFileTypes.includes(file.type)) {
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Clear the input value to prevent any invalid files from being uploaded
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
          section: type,
        };

        const uploadResponse = await UploadAttachment(data);
        data["id"] = uploadResponse?.data?.data?.[0]?.id;
        if (uploadResponse?.success) {
          if (type === "Photo") {
            setUploadedFiles((prevFiles) => [...prevFiles, data]);
          } else if (type === "Video") {
            setUploadedVideo((prevFiles) => [...prevFiles, data]);
          } else if (type === "Attachment") {
            setUploadedAttachments((prevFiles) => [...prevFiles, data]);
          }
        }
      } else {
        console.error("Failed to get signed URL for file:", file.name);
      }
    }
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

  async function deleteFile(id, type) {
    const response = await DeleteFile(id);
    if (response.success) {
      if (type === "Photo") {
        // Get the file input element by its ID
        const fileInput = document.getElementById("photoUpload");
        // Reset the value of the file input
        fileInput.value = "";
        const data = uploadedFiles.filter((item) => item.id !== id);
        setUploadedFiles(data);
      } else if (type === "Video") {
        const fileInput = document.getElementById("videoUpload");
        // Reset the value of the file input
        fileInput.value = "";
        const data = uploadedVideos.filter((item) => item.id !== id);
        setUploadedVideo(data);
      } else if (type === "Attachment") {
        const fileInput = document.getElementById("uploadFileAttachments");
        // Reset the value of the file input
        fileInput.value = "";
        const data = uploadedAttachments.filter((item) => item.id !== id);
        setUploadedAttachments(data);
      }
      toast.success("File Deleted Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return (
    <>
      <ToastContainer />
      <Loader isLoading={loading} />
      <h3 class="text-xl font-semibold flex items-center mb-3 mt-8">
        Upload MOU
      </h3>

      <div className="border px-8 py-8 rounded-lg bg-white shadow relative">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-y-5 gap-x-8">
            {/* <div className="col-span-4 text-left">
              <div className="rounded-md block">
                <label
                  for="upload"
                  className="flex flex-row items-center gap-3 cursor-pointer py-3 px-8 rounded border border-gray-300 text-gray-900 bg-white hover:bg-blue-600 hover:text-white ease-linear"
                  onClick={
                    !disabled
                      ? () => document.getElementById("photoUpload").click()
                      : null
                  }
                >
                  <BsImage size={"18px"} />
                  <span className="font-medium">Upload Photo</span>
                </label>
                <input
                  id="photoUpload"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  {...register("photoUpload")}
                  onChange={(e) => handleUpload(e, "Photo")}
                />
              </div>
              <div className="max-h-[220px] overflow-auto">
                <div className="mt-5 text-left">
                  {uploadedFiles.length > 0 &&
                    uploadedFiles.map((file, index) => (
                      <div key={index} className="mb-3">
                        <div className="text-gray-600 hover:text-blue-600 cursor-pointer flex items-center gap-2">
                          <BsFileImage
                            size="20px"
                            className="text-blue-600 shrink-0"
                          />
                          <span
                            onClick={() => downloadFile(file)}
                            className="truncate w-full"
                          >
                            {file?.fileName}.{file?.fileType}
                          </span>
                          {!disabled ? (
                            <span onClick={() => deleteFile(file?.id, "Photo")}>
                              <TETooltip title={"Delete File"} tag={"span"}>
                                <BsTrash3 className="shrink-0" />
                              </TETooltip>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-span-4 text-left">
              <div className="rounded-md block">
                <label
                  for="upload"
                  className="flex flex-row items-center gap-3 cursor-pointer py-3 px-8 rounded border border-gray-300 text-gray-900 bg-white hover:bg-blue-600 hover:text-white ease-linear"
                  onClick={
                    !disabled
                      ? () => document.getElementById("videoUpload").click()
                      : null
                  }
                >
                  <BsCameraVideo size={"18px"} />
                  <span className="font-medium">Upload Videos</span>
                </label>
                <input
                  id="videoUpload"
                  type="file"
                  className="hidden"
                  multiple
                  accept="video/*"
                  {...register("videoUpload")}
                  onChange={(e) => handleUpload(e, "Video")}
                />
              </div>
              <div className="max-h-[220px] overflow-auto">
                <div className="mt-5 text-left">
                  {uploadedVideos.length > 0 &&
                    uploadedVideos.map((file, index) => (
                      <div key={index} className="mb-3">
                        <span className="text-gray-600 hover:text-blue-600 cursor-pointer flex items-center gap-2">
                          <BsFilePlay
                            size="20px"
                            className="text-blue-600 shrink-0"
                          />
                          <span
                            onClick={() => downloadFile(file)}
                            className="truncate w-full"
                          >
                            {file?.fileName}.{file?.fileType}
                          </span>
                          <span onClick={() => deleteFile(file?.id, "Video")}>
                            <TETooltip title={"Delete File"} tag={"span"}>
                              <BsTrash3 className="shrink-0" />
                            </TETooltip>
                          </span>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div> */}
            <div className="col-span-4 text-left">
              <div className="rounded-md block">
                <label
                  for="upload"
                  className="flex flex-row items-center gap-3 cursor-pointer py-3 px-8 rounded border border-gray-300 text-gray-900 bg-white hover:bg-blue-600 hover:text-white ease-linear"
                  onClick={
                    !disabled
                      ? () =>
                          document
                            .getElementById("uploadFileAttachments")
                            .click()
                      : null
                  }
                >
                  <BsFileEarmark size={"18px"} />
                  <span className="font-medium">Upload Attachment</span>
                </label>
                <input
                  id="uploadFileAttachments"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                  multiple
                  {...register("uploadFileAttachments")}
                  onChange={(e) => handleUpload(e, "Attachment")}
                />
              </div>
              <div className="max-h-[220px] overflow-auto">
                <div className="mt-5 text-left">
                  {uploadedAttachments.length > 0 &&
                    uploadedAttachments.map((file, index) => (
                      <div key={index} className="mb-3">
                        <div className="text-gray-600 hover:text-blue-600 cursor-pointer flex items-center gap-2">
                          <BsFileEarmark
                            size="20px"
                            className="text-blue-600 shrink-0"
                          />
                          <span
                            onClick={() => downloadFile(file)}
                            className="truncate w-full"
                          >
                            {file?.fileName}.{file?.fileType}
                          </span>
                          <span
                            onClick={() => deleteFile(file?.id, "Attachment")}
                          >
                            <TETooltip title={"Delete File"} tag={"span"}>
                              <BsTrash3 className="shrink-0" />
                            </TETooltip>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadMedia;
