import { CREATE_DOCUMENT, UPDATE_DOCUMENT,DOCUMENT_BY_ID, DOCUMENT_LIST, DOCUMENT_DELETE } from "../Constant/apiConstant";
import { api } from "../utils/api";
import { getUnitId } from "../utils/functions";

export async function addDocuments({ data }) {
    try {
      const response = await api.post(`${CREATE_DOCUMENT}`,data);
      return response.data;
    } catch (error) {
      console.error("Error fetching patient :", error.message);
      throw error;
    }
  }

  export async function updateDocument({ data }) {
    try {
      const response = await api.post(`${UPDATE_DOCUMENT}`,data);
      return response.data;
    } catch (error) {
      console.error("Error fetching patient :", error.message);
      throw error;
    }
  }

  export async function fetchDocumentById({ id }) {
    try {
      const response = await api.get(`${DOCUMENT_BY_ID}`, {
        params: { id: id },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patient :", error.message);
      throw error;
    }
  }

  export async function fetchDocumentList() {
    const unitId = getUnitId();
    try {
      const response = await api.get(`${DOCUMENT_LIST}`, {
        params: { unitId: unitId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching GetById :", error.message);
      throw error;
    }
  }
  export async function deleteDocument({ id }) {
    try {
      const response = await api.post(`${DOCUMENT_DELETE}?id=${id}`
       );
      return response.data;
    } catch (error) {
      console.error("Error fetching patient :", error.message);
      throw error;
    }
  }