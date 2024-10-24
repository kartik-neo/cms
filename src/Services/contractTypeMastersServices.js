import {
  CREATE_CONTRACT,
  UPDATE_CONTRACT,
  CONTRACT_BY_ID,
  CONTRACT_LIST,
  CONTRACT_DELETE,
  CONTRACT_GET,
} from "../Constant/apiConstant";
import { api } from "../utils/api";
import { getUnitId } from "../utils/functions";

export async function addContract({ data }) {
  try {
    const response = await api.post(`${CREATE_CONTRACT}`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding contract :", error.message);
    throw error;
  }
}

export async function updateContract({ data }) {
  try {
    const response = await api.post(`${UPDATE_CONTRACT}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating contract :", error.message);
    throw error;
  }
}

export async function fetchContractById({ id }) {
  try {
    const response = await api.get(`${CONTRACT_BY_ID}`, {
      params: { id: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contract by Id :", error.message);
    throw error;
  }
}

export async function fetchContractList(contractType = "", isActiveInactive = false) {
  const unitId = getUnitId();
  let params = { unitId: unitId, contractType: contractType };
if(!isActiveInactive) params.isActive = true;
  try {
    const response = await api.get(`${CONTRACT_LIST}`, {
      params: params,
      // params: { unitId: unitId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contract list :", error.message);
    throw error;
  }
}
export async function deleteContract({ id }) {
  try {
    const response = await api.post(`${CONTRACT_DELETE}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error delete contract :", error.message);
    throw error;
  }
}

export async function fetchContractView({ id }) {
  try {
    const response = await api.get(`${CONTRACT_GET}`, {
      params: { id: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contract by Id :", error.message);
    throw error;
  }
}
