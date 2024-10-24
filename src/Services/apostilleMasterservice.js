import {
  CREATE_APOSTILLE,
  UPDATE_APOSTILLE,
  ASPOSTILLE_BY_ID,
  APOSTILLE_LIST,
  APOSTILLE_DELETE,
} from "../Constant/apiConstant";
import { api } from "../utils/api";
import { getUnitId } from "../utils/functions";

export async function addApostille({ data }) {
  try {
    const response = await api.post(`${CREATE_APOSTILLE}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}
export async function updateApostille({ data }) {
  try {
    const response = await api.post(`${UPDATE_APOSTILLE}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function fetchApostilleById({ id }) {
  try {
    const response = await api.get(`${ASPOSTILLE_BY_ID}`, {
      params: { id: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function fetchApostilleList(name = "", isActiveInactive,locationId=null) {
  const unitId = getUnitId();
  let params =  { unitId: locationId || unitId, name: name };
  if(!isActiveInactive) params.isActive= true;

  try {
    const response = await api.get(`${APOSTILLE_LIST}`, {
      params:params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}

export async function deleteApostille({ id }) {
  try {
    const response = await api.post(`${APOSTILLE_DELETE}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}
