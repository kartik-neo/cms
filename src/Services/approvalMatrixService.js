import { api } from "../utils/api";
import {
  APPROVAL_MATRIX_DELETE_BY_ID,
  APPROVAL_MATRIX_GET_BY_DEPARTMENT_ID,
  APPROVAL_MATRIX_UPDATE,
  GET_APPROVAL_DEPARTMENT,
} from "../Constant/apiConstant";
import { getUnitId } from "../utils/functions";

export async function fetchApprovalMatrixDepartmentId(
  unitId,
  departmentId,
  contractTypeId
) {
  try {
    const response = await api.get(
      `${APPROVAL_MATRIX_GET_BY_DEPARTMENT_ID}?unitId=${unitId}&departmentId=${departmentId}&contractTypeId=${contractTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export async function updateApprovalMatrix(data) {
  try {
    const response = await api.post(`${APPROVAL_MATRIX_UPDATE}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export async function deleteApprovalMatrixById({ id }) {
  try {
    const response = await api.post(`${APPROVAL_MATRIX_DELETE_BY_ID}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error delete approval :", error.message);
    throw error;
  }
}

export async function GetApprovalDepartmentDetails(empCode, contractTypeId) {
  try {
    const unitId = getUnitId();
    const response = await api.get(
      `${GET_APPROVAL_DEPARTMENT}?unitId=${unitId}&empCode=${empCode}&contractTypeId=${contractTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}
