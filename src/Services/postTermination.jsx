import { api } from "../utils/api";
import {
  POST_TERMINATION,
  TERMINATION,
  UPDATE_POST_TERMINATION,
  WITHDRAW,
} from "../Constant/apiConstant";

export async function postTermination({ data }) {
  try {
    const response = await api.post(`${POST_TERMINATION}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function updatePostTermination({ data }) {
  try {
    const response = await api.post(`${UPDATE_POST_TERMINATION}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function Termination({ data }) {
  try {
    const response = await api.post(`${TERMINATION}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function Withdrawal({ data }) {
  try {
    const response = await api.post(`${WITHDRAW}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}
