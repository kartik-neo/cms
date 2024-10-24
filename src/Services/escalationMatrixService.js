import { api } from "../utils/api";
import {
  ESCALATION_MATRIX_DELETE_BY_ID,
  ESCALATION_MATRIX_GET_BY_DEPARTMENT_ID,
  ESCALATION_MATRIX_UPDATE,
  ESC_MATRIX_GET_BY_CODE_ID,
  ESC_MATRIX_UPSERT,
  ESS_MATRIX_GET_ALL,
} from "../Constant/apiConstant";

export async function fetchEscalarationMatrixDepartmentId(
  unitId,
  departmentId,
  contractTypeId
) {
  try {
    const response = await api.get(
      `${ESCALATION_MATRIX_GET_BY_DEPARTMENT_ID}?unitId=${unitId}&departmentId=${departmentId}&contractTypeId=${contractTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export async function updateEscalationMatrix(data) {
  try {
    const response = await api.post(`${ESCALATION_MATRIX_UPDATE}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export async function fetchAllEscalationMatrixMaster({ unitid }) {
  try {
    const response = await api.get(`${ESS_MATRIX_GET_ALL}`, {
      params: { unitid },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export async function fetchEscalationMatrixMasterById(id) {
  try {
    const response = await api.get(`${ESS_MATRIX_GET_ALL}`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export async function fetchEscalationMatrixMasterByColorId(id) {
  try {
    const response = await api.get(`${ESC_MATRIX_GET_BY_CODE_ID}`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export async function upsertEscalationMatrixMaster(data) {
  try {
    const response = await api.post(`${ESC_MATRIX_UPSERT}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function deleteEscalationMatrixById({ id }) {
  try {
    const response = await api.post(
      `${ESCALATION_MATRIX_DELETE_BY_ID}?id=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error delete approval :", error.message);
    throw error;
  }
}
