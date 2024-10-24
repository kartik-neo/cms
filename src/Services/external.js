import {
  GET_ALL_UNITS,
  GET_DEPARTMENTS,
  GET_EMPLOYEE_BY_ID,
  GET_LOCATIONS,
  GET_PATIENT_BY_IP,
  GET_PATIENT_BY_MR,
  GET_MODULE_GROUP_MENU,
  GET_MENU_LIST,
  ASSIGN_ROLE_TO_USER,
  DOCUMENT_LIST,
  GET_COUNTRIES,
  GET_STATES,
  GET_CITIES,
  GET_CREDIT_COMPANY_BY_ID,
  GET_INSURANCE_COMPANY_BY_ID,
  GET_TARIFF_LIST,
  GET_MATERIAL_LIST,
  GET_SERVICES_LIST,
  GET_FILE_LOCATIONS,
  LOCATION_ID,
} from "../Constant/apiConstant";
import { api } from "../utils/api";
import { getUnitId } from "../utils/functions";

export async function fetchPatientByIp({ ip }) {
  try {
    const response = await api.get(`${GET_PATIENT_BY_IP}`, {
      params: { Ip: ip },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patient :", error.message);
    throw error;
  }
}

export async function fetchPatientByMr({ mr }) {
  if (mr) {
    try {
      const response = await api.get(`${GET_PATIENT_BY_MR}`, {
        params: { MrNo: mr },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patient :", error.message);
      throw error;
    }
  }
}

export async function fetchEmpId({ id }) {
  if (id) {
    try {
      const response = await api.get(`${GET_EMPLOYEE_BY_ID}`, {
        params: { Input: id },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patient :", error.message);
      throw error;
    }
  }
}

export async function fetchCreditCompanies() {
  try {
    const response = await api.get(`${GET_CREDIT_COMPANY_BY_ID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching credit company :", error.message);
    throw error;
  }
}
export async function fetchAggregatorCreditCompanies({ status }) {
  try {
    const statusString = status.join(", ");
    const unitId = getUnitId();
    const response = await api.get(`${GET_CREDIT_COMPANY_BY_ID}`, {
      params: { status: statusString, locationId: unitId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching credit company :", error.message);
    throw error;
  }
}
export async function fetchInsuranceCompanies() {
  try {
    const response = await api.get(`${GET_INSURANCE_COMPANY_BY_ID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching credit company :", error.message);
    throw error;
  }
}
export async function fetchTariffs() {
  try {
    const response = await api.get(`${GET_TARIFF_LIST}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching credit company :", error.message);
    throw error;
  }
}

export async function locationId({ id }) {
  if (id) {
    try {
      const response = await api.get(`${LOCATION_ID}`, {
        params: { Input: id },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patient :", error.message);
      throw error;
    }
  }
}
export async function fetchCountryDataValue() {
  try {
    const response = await api.get(`${GET_COUNTRIES}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching country :", error.message);
    throw error;
  }
}
export async function fetchStateDataValue(id) {
  try {
    const response = await api.get(`${GET_STATES}`, {
      params: { countryId: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching states :", error.message);
    throw error;
  }
}

export async function fetchCityDataValue(id) {
  try {
    const response = await api.get(`${GET_CITIES}`, {
      params: { stateId: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching states :", error.message);
    throw error;
  }
}
export async function fetchMaterialList({ id }) {
  try {
    const response = await api.get(`${GET_MATERIAL_LIST}`, {
      params: { searchText: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching credit company :", error.message);
    throw error;
  }
}
export async function fetchServicesList({ id }) {
  try {
    const response = await api.get(`${GET_SERVICES_LIST}`, {
      params: { searchText: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching credit company :", error.message);
    throw error;
  }
}

export async function documentApproval({ id, isActive }) {
  const unitId = getUnitId();
  try {
    const response = await api.get(`${DOCUMENT_LIST}`, {
      params: { unitId: unitId, name: id, isActive },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}

export async function fetchFileLocations() {
  const unitId = getUnitId();
  try {
    const response = await api.get(`${GET_FILE_LOCATIONS}`, {
      params: { unitId: unitId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}

export async function fetchDepartments() {
  try {
    const response = await api.get(`${GET_DEPARTMENTS}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments :", error.message);
    throw error;
  }
}

export async function fetchAllUnits({ includeInactive }) {
  try {
    const response = await api.get(`${GET_ALL_UNITS}`, {
      params: {
        includeInactive: includeInactive,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching units :", error.message);
    throw error;
  }
}

export async function fetchLocations({ includeInactive }) {
  try {
    const response = await api.get(`${GET_LOCATIONS}`, {
      params: {
        includeInactive: includeInactive,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching units :", error.message);
    throw error;
  }
}

export async function fetchMenuList() {
  try {
    const response = await api.get(`${GET_MENU_LIST}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching units :", error.message);
    throw error;
  }
}

export async function fetchMenuGroup() {
  try {
    const response = await api.get(`${GET_MODULE_GROUP_MENU}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching units :", error.message);
    throw error;
  }
}

export async function assignRoleToUser(data) {
  try {
    const response = await api.post(`${ASSIGN_ROLE_TO_USER}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching  :", error.message);
    throw error;
  }
}
