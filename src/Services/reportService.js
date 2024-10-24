import { AUDIT_GET_ALL, NOTIFICATION, AUDITLOG_EMPLOYEE } from "../Constant/apiConstant";
import { api } from "../utils/api";
import { getUnitId } from "../utils/functions";
import { fetchOtherRole } from "./sessionService";

export async function fetchNotificationList(name = "") {
    const unitId = getUnitId();
    const { isAdmin, isApprover, roles } = await fetchOtherRole();
  
    let contractTypes = [];
    if (isApprover) {
      if (roles.some(role => role.name == "CMS MOU Approver")) {
        contractTypes.push(1); // MOU Approver
      }
      if (roles.some(role => role.name == "CMS Contract Approver")) {
        contractTypes.push(2); // Contract Approver
      }
    }
    const ContractType = contractTypes.join(',');
    const params = { Locationid: unitId, isAdmin };
    if (!isAdmin) {
      params.ContractType = ContractType;
    }
    try {
      const response = await api.get(`${NOTIFICATION}`, {params});
      return response.data;
    } catch (error) {
      console.error("Error fetching GetById :", error.message);
      throw error;
    }
  }

  
  
  
  export async function fetchAuditList(queryString = "", type) {
    const unitId = getUnitId();
    const { isAdmin, isApprover, roles } = await fetchOtherRole();
    
    let contractTypes = [];
    if (isApprover) {
      if (roles.some(role => role.name == "CMS MOU Approver")) {
        contractTypes.push(1); // MOU Approver
      }
      if (roles.some(role => role.name == "CMS Contract Approver")) {
        contractTypes.push(2); // Contract Approver
      }
    }
    
    const ContractType = contractTypes.join(',');
    const params = { Locationid: unitId, isAdmin };
    if (!isAdmin) {
      params.ContractType = ContractType;
    }
    try {
      const response = await api.get(`${AUDIT_GET_ALL}?${queryString}`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching GetById :", error.message);
      throw error;
    }
  }
 

  export async function fetchAuditEmpList({ name }) {
    let params =  { name: name };
  
    try {
      const response = await api.get(`${AUDITLOG_EMPLOYEE}`, {
        params:params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching GetById :", error.message);
      throw error;
    }
  }