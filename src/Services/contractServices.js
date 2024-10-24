import { api } from "../utils/api";
import {
  CONTRACT_APPROVAL,
  CONTRACT_GETALL,
  CONTRACT_PENDINGLIST,
  CONTRACT_REJECT,
  CREATE_CONTRACT_FORM,
  DELETE_CONTRACT,
  GET_DEPARTMENTS,
  UPDATE_CONTRACT_FORM,
} from "../Constant/apiConstant";
import { getUnitId } from "../utils/functions";
import { fetchIsAdmin } from "./sessionService";

export async function fetchDepartments() {
  try {
    const response = await api.get(`${GET_DEPARTMENTS}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments :", error.message);
    throw error;
  }
}

export async function fetchContracts(name = "", type, hasAddendum,addAddendum) {
  const unitId = getUnitId();
  const isAdmin = await fetchIsAdmin();
  let params = {
    searchText: name,
    hasAddendum: hasAddendum,
    // searchText: name,
    addAddendum:addAddendum,
    status: "Active",
    isActive: true,
    isClassified: type == "Classified" ? true : false,
  };
  if (!isAdmin) params.locationId = unitId;

  try {
    const response = await api.get(`${CONTRACT_GETALL}`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts :", error.message);
    throw error;
  }
}

export async function createContractForm({ data }) {
  try {
    const response = await api.post(`${CREATE_CONTRACT_FORM}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Emergency Data :", error.message);
    throw error;
  }
}

export async function updateContractForm({ data }) {
  try {
    const response = await api.post(`${UPDATE_CONTRACT_FORM}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Emergency Data :", error.message);
    throw error;
  }
}

export async function fetchContractList(
  queryString = "",
  type,
  isClassified,
  location
) {
  const unitId = getUnitId();
  const isAdmin = await fetchIsAdmin();
  try {
    let params = {};
    if (location?.state?.cameFrom == "dashboard") {
      params.locationId = unitId;
    } else if (!isAdmin) {
      params.locationId = unitId;
    }
    // if (!isAdmin) params.locationId = unitId;
    if (type !== "All") params.status = type;
    if (isClassified == true) params.isClassified = true;
    else params.isClassified = false;

    const response = await api.get(`${CONTRACT_GETALL}?${queryString}`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export async function deleteContract(id) {
  try {
    const response = await api.post(`${DELETE_CONTRACT}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}

export async function fetchContractPendingList(
  queryString = "",
  type,
  isClassified,
  location,
  pageNumber=null,
  pageSize=null,

) {
  const unitId = getUnitId();
  const isAdmin = await fetchIsAdmin();
  try {
    let params = {};
    if (location?.state?.cameFrom == "dashboard") {
      params.locationId = unitId;
    } else if (!isAdmin) {
      params.locationId = unitId;
    }
    // if (!isAdmin) params.locationId = unitId;
    if (type !== "All") params.status = type;
    // if (type == "Pending Approval") params.isAdmin = isAdmin;
    if (type == "Pending Approval") params.isAdmin = isAdmin;
    if (isClassified == true) params.isClassified = true;
    else params.isClassified = false;

    if(pageNumber){
      params.pageNumber = pageNumber
    }
    if(pageSize){
      params.pageSize = pageSize
    }
    const response = await api.get(`${CONTRACT_PENDINGLIST}?${queryString}`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

// export const fetchContractWithOptions = async (inputValue) => {
//   if (!inputValue) return [];

//   try {
//     const response = await fetchCompanyList(inputValue);
//     const data = response?.data.splice(0, 15);

//     return data.map((item) => ({
//       label: `${item.id} - ${item.name}`,
//       value: item.id,
//     }));
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return [];
//   }
// };

export async function contractApproval(data) {
  try {
    const response = await api.post(`${CONTRACT_APPROVAL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts :", error.message);
    throw error;
  }
}

export async function contractReject(data) {
  try {
    const response = await api.post(`${CONTRACT_REJECT}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts :", error.message);
    throw error;
  }
}
