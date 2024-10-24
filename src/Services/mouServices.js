import { api } from "../utils/api";
import {
  ADD_ADDENDUM_RENEWAL_AGGREGATOR,
  CREATE_MOU_TPA,
  DELETE_MOU,
  GET_MOU_DETAIL,
  MOU_AGGREGATOR_APPROV_REJECT,
  MOU_LIST,
  MOU_PENDING_LIST,
  UPDATE_MOU_TPA,
} from "../Constant/apiConstant";
import { getUnitId } from "../utils/functions";
import { fetchIsAdmin } from "./sessionService";

export async function createMouTpa({ data }) {
  try {
    const response = await api.post(`${CREATE_MOU_TPA}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Emergency Data :", error.message);
    throw error;
  }
}

export async function createAddendumRenewalAggregator({ data }) {
  try {
    const response = await api.post(`${ADD_ADDENDUM_RENEWAL_AGGREGATOR}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Emergency Data :", error.message);
    throw error;
  }
}

export async function updateMouTpa({ data }) {
  try {
    const response = await api.post(`${UPDATE_MOU_TPA}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Emergency Data :", error.message);
    throw error;
  }
}

export async function getMouById({ id }) {
  try {
    const response = await api.get(`${GET_MOU_DETAIL}`, {
      params: {
        id: id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching mou data :", error.message);
    throw error;
  }
}
export async function getAggregatorById({ id, AggregatorId }) {
  try {
    const response = await api.get(`${GET_MOU_DETAIL}`, {
      params: {
        id: id,
        AggregatorId: AggregatorId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching mou data :", error.message);
    throw error;
  }
}

export async function submitApprovRejectStatus(payload) {
  try {
    const response = await api.post(`${MOU_AGGREGATOR_APPROV_REJECT}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting approve reject status :", error.message);
    throw error;
  }
}

export async function fetchMOUList(queryString, type, hasAddendum, location) {
  const unitId = getUnitId();
  const isAdmin = fetchIsAdmin();
  try {
    let params = {};
    if (location?.state?.cameFrom == "dashboard") {
      params.locationId = unitId;
    } else if (!isAdmin) {
      params.locationId = unitId;
    }
    // if (locationId) params.locationId = locationId;
    // if (!isAdmin) params.locationId = unitId;
    if (type !== "All") params.status = type;
    if (!hasAddendum) params.hasAddendum = hasAddendum;
    const response = await api.get(`${MOU_LIST}?${queryString}`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}

export async function fetchMOUAggregatorData(
  creditCompanieId,
  categoryType,
  status
) {
  const unitId = getUnitId();
  try {
    let params = {
      locationId: unitId,
      creditCompanieId: creditCompanieId,
      categoryType: categoryType,
      status: status,
    };
    // if (type !== "All") params.status = type;
    const response = await api.get(`${MOU_LIST}`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}

export async function deleteMou(id) {
  try {
    const response = await api.post(`${DELETE_MOU}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}

export async function fetchMOUPendingList(queryString, type,pageNumber,pageSize) {
  const unitId = getUnitId();
  const isAdmin = await fetchIsAdmin();

  try {
    let params = {};
    if (!isAdmin) params.locationId = unitId;
    if (type !== "All") params.status = type;
    if (type == "Pending Approval") params.isAdmin = isAdmin;
    if(pageNumber)params.pageNumber = pageNumber
    if(pageSize)params.pageSize = pageSize
    const response = await api.get(`${MOU_PENDING_LIST}?${queryString}`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}
