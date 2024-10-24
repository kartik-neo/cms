import React from "react";
import { BsFileImage, BsFilePlay, BsPencil } from "react-icons/bs";
import { convertTimestampToFormattedDate } from "../../utils/other";
import { getSignedUrlForFile } from "../../Services/uploadService";
import { BsFileEarmark } from "react-icons/bs";

const ViewAttachmentsCMS = ({
  print,
  handleStepChange,
  step,
  uploadedAttachments = [],
  uploadedFiles = [],
  uploadedVideos = [],
  viewAttachmentsDetails = {},
}) => {
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
  return (
    <>
      <h3 className="flex items-center mt-8 mb-3 text-xl font-semibold">
        Attachments
      </h3>

      <div className="relative px-8 py-8 bg-white border rounded-lg shadow">
        <div className="grid grid-cols-12 gap-5 mb-5">
          {!print && (
            <button
              type="button"
              className="absolute top-3 right-3 opacity-50 hover:opacity-100"
            >
              <BsPencil
                size={"18px"}
                onClick={() => handleStepChange(step - 1)}
              />
            </button>
          )}

          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-5 mb-5">
              <div className="col-span-2">
                <p className="text-lg">Photos</p>
              </div>
              <div className="col-span-10">
                <div className="text-left grid grid-cols-12 gap-x-8 gap-y-5">
                  {uploadedFiles.length > 0 ?
                    uploadedFiles.map((file, index) => (
                      <div key={index} className="col-span-4">
                        <span
                          onClick={() => downloadFile(file)}
                          className="text-gray-600 hover:text-blue-700 cursor-pointer flex items-center gap-2"
                        >
                          <BsFileImage size="20px" className="shrink-0" />
                          <span className="truncate w-full">{file?.fileName}.{file?.fileType}</span>
                          {/* <TETooltip title={'Delete File'} tag={'span'}>
                            <BsTrash3 className="shrink-0" />
                          </TETooltip> */}
                        </span>
                      </div>
                    )) : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-5 mb-5">
              <div className="col-span-2">
                <p className="text-lg">Videos</p>
              </div>
              <div className="col-span-10">
                <div className="text-left grid grid-cols-12 gap-x-8 gap-y-5">
                  {uploadedVideos.length > 0 ?
                    uploadedVideos.map((file, index) => (
                      <div key={index} className="col-span-4">
                        <span
                          onClick={() => downloadFile(file)}
                          className="text-gray-600 hover:text-blue-700 cursor-pointer flex items-center gap-2"
                        >
                          <BsFilePlay size="20px" className="shrink-0" />
                          <span className="truncate w-full">{file?.fileName}.{file?.fileType}</span>
                          {/* <TETooltip title={'Delete File'} tag={'span'}>
                            <BsTrash3 className="shrink-0" />
                          </TETooltip> */}
                        </span>
                      </div>
                    )) : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-5 mb-5">
              <div className="col-span-2">
                <p className="text-lg">Attachment</p>
              </div>
              <div className="col-span-10">
                <div className="text-left grid grid-cols-12 gap-x-8 gap-y-5">
                  {uploadedAttachments.length > 0 ?
                    uploadedAttachments.map((file, index) => (
                      <div key={index} className="col-span-4">
                        <span
                          onClick={() => downloadFile(file)}
                          className="text-gray-600 hover:text-blue-700 cursor-pointer flex items-center gap-2"
                        >
                          <BsFileEarmark size="20px" className="shrink-0" />
                          <span className="truncate w-full">{file?.fileName}.{file?.fileType}</span>
                          {/* <TETooltip title={'Delete File'} tag={'span'}>
                            <BsTrash3 className="shrink-0" />
                          </TETooltip> */}
                        </span>
                      </div>
                    )) : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 mt-5">
            <div className="flex">
              <p className="text-gray-600 me-3">Added By : </p>
              <p className="font-medium text-md">
                {`${viewAttachmentsDetails?.createdBy ?? '-'} `}
                <span className="text-gray-500 ml-2">
                  {viewAttachmentsDetails?.createdOn &&
                    convertTimestampToFormattedDate(
                      viewAttachmentsDetails?.createdOn
                    )}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAttachmentsCMS;
