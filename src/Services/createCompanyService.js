import {
  CREAT_COMPANY,
  UPDATE_COMPANY,
  COMPANY_BY_ID,
  COMPANY_LIST,
  COMPANY_DELETE,
} from "../Constant/apiConstant";
import { api } from "../utils/api";
import { getUnitId } from "../utils/functions";

export async function addCompany({ data }) {
  try {
    const response = await api.post(`${CREAT_COMPANY}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}
export async function updateCompany({ data }) {
  try {
    const response = await api.post(`${UPDATE_COMPANY}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function fetchCompanyById({ id }) {
  try {
    const response = await api.get(`${COMPANY_BY_ID}`, {
      params: { id: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function fetchCompanyList({name = "", onlyActive,locationId = null}) {
  const unitId = getUnitId();
  try {
    const response = await api.get(`${COMPANY_LIST}`, {
      params: { unitId: locationId || unitId, name: name, ...(onlyActive && {isActive: onlyActive })},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}

export async function deleteCompany({ id }) {
  try {
    const response = await api.post(`${COMPANY_DELETE}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}
