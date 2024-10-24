import { api, apiFile } from "../utils/api";
import {
  S3_SIGNED_URL,
  UPLOAD_ATTACHMENT,
  ALL_ATTACHMENT,
  DELETE_ATTACHMENT,
  VIEW_ATTACHMENT,
  AUDIT_GET_BY_ID,
} from "../Constant/apiConstant";

export const getSignedUrlForFile = async (
  fileName,
  extension,
  uuid,
  isdownload
) => {
  try {
    const response = await api.get(
      `${S3_SIGNED_URL}${uuid}/${fileName}/${extension}/${isdownload}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting signed URL for file:", error);
    return { status: "error", message: "Failed to get signed URL" };
  }
};

export const uploadFileToS3 = async (file, uploadUrl, setIsLoading) => {
  try {
    setIsLoading(true);
    await apiFile.put(uploadUrl, file);
  } catch (error) {
    console.error("Error uploading file:", file.name, error);
  } finally {
    setIsLoading(false);
  }
};

export async function UploadAttachment(data) {
  try {
    const response = await api.post(`${UPLOAD_ATTACHMENT}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function getAllUloadedFiles(GlobalObjectId) {
  try {
    const response = await api.get(
      `${ALL_ATTACHMENT}?GlobalObjectId=${GlobalObjectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching", error.message);
    throw error;
  }
}

export async function getAuditGetById(id, type) {
  try {
    let url = `${AUDIT_GET_BY_ID}?`;
    if (type == "Contract") {
      url += `ContractId=${id}`;
    } else if (type == "Mou") {
      url += `MouId=${id}`;
    }

    if(type == "Aggregator"){
      url+=`AggregatorId=${id}`
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching", error.message);
    throw error;
  }
}

export async function getAllViewDocuments(result) {
  try {
    let url = `${VIEW_ATTACHMENT}?`;
    if (result?.contractId) {
      url += `contractId=${result.contractId}`;
    } else if (result.mouId) {
      url += `mouId=${result.mouId}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching", error.message);
    throw error;
  }
}

export async function DeleteFile(id) {
  try {
    const response = await api.post(`${DELETE_ATTACHMENT}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}
