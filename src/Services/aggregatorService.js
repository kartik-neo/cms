import { CREATE_AGGRERATOR, DELETE_AGGRERATOR, UPDATE_AGGRERATOR } from "../Constant/apiConstant";
import { api } from "../utils/api";

export async function addAggregator({ data }) {
    try {
      const response = await api.post(`${CREATE_AGGRERATOR}`,data);
      return response.data;
    } catch (error) {
      console.error("Error fetching patient :", error.message);
      throw error;
    }
  }


  export async function updateAggregator({ data }) {
    try {
      const response = await api.post(`${UPDATE_AGGRERATOR}`,data);
      return response.data;
    } catch (error) {
      console.error("Error while updating aggregator details :", error.message);
      throw error;
    }
  }

  export async function deleteAggregator(id) {
    try {
      const response = await api.post(`${DELETE_AGGRERATOR}?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error while updating aggregator details :", error.message);
      throw error;
    }
  }