import { DASHBOARD, DASHBOARD_CONTRACT } from "../Constant/apiConstant";
import { api } from "../utils/api";
import { getUnitId } from "../utils/functions";
export async function fetchDashboard(isAdmin) {
  const unitId = getUnitId();
  // const isAdmin = await fetchIsAdmin();
  try {
    const response = await api.get(`${DASHBOARD}`, {
      params: { unitId: unitId, isAdmin: isAdmin },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}

export async function fetchDashboardContract(isAdmin) {
  const unitId = getUnitId();
  // const isAdmin = await fetchIsAdmin();
  try {
    const response = await api.get(`${DASHBOARD_CONTRACT}`, {
      params: { unitId: unitId, isAdmin: isAdmin },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GetById :", error.message);
    throw error;
  }
}
