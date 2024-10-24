import { COUNTRY } from "../Constant/apiConstant";
import { api } from "../utils/api";
import { getUnitId } from "../utils/functions";


export async function fetchCountry({id}) {
    const unitId = getUnitId();
    try {
      const response = await api.get(`${COUNTRY}`, {
        params: { name:id },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching GetById :", error.message);
      throw error;
    }
  }