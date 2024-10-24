import { api } from "../utils/api";
import { VERIFY_SESSION, LOGOUT_SESSION, LOGGEDIN_USER_ROLE } from "../Constant/apiConstant";

let isAdminResponsePromise = null;

export async function fetchVerifySession() {
  try {
    
    const response = await api.get(`${VERIFY_SESSION}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export async function fetchLogoutSession() {
  try {
    const response = await api.get(`${LOGOUT_SESSION}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

export const checkForCMSRoles = (roles) => {
  const cmsRoles = ["CMS Management User", "CMS Admin","Super Admin"];
  return roles.some(role => cmsRoles.includes(role.name));
};
const checkForApprover = (roles) => {
  const CheckApprover = ["CMS MOU Approver", "CMS Contract Approver"];
  return CheckApprover.find(role => roles.some(userRole => userRole.name == role));
}

export async function getIsAdminResponsePromise() {
  if (isAdminResponsePromise) return isAdminResponsePromise
  isAdminResponsePromise = await api.get(`${LOGGEDIN_USER_ROLE}`);
  return isAdminResponsePromise;
}

export async function fetchIsAdmin() {
  try {
    const response = await getIsAdminResponsePromise();
    const roles = response?.data?.success;
    const isAdmin = checkForCMSRoles(roles);
    // const isApprover = checkForApprover(roles);

    // return { isAdmin, isApprover, roles };
    return isAdmin;

  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
} 
export async function fetchOtherRole() {
  try {
    const response = await getIsAdminResponsePromise();
    const roles = response?.data?.success;
    const isAdmin = checkForCMSRoles(roles);
    const isApprover = checkForApprover(roles);

    return { isAdmin, isApprover, roles };
    // return isAdmin;

  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}




