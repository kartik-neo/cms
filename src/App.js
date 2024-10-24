import {
  useState,
  useEffect,
  useContext,
 
  lazy,
  Suspense,
} from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import {
  MENU_PERMISSIONS,
} from "./Constant/permissionConstant";
import Unauthorized from "./Components/Common/Unauthorized";
import {
  checkForCMSRoles,
  fetchVerifySession,
  getIsAdminResponsePromise,
} from "./Services/sessionService";
import { api, getCookie } from "./utils/api";
import { allowedOrganization } from "./Constant/permissionConstant";
import {
  CREATE_LOGGED_USER,
  GET_LOGGEDIN_USER,
  GET_LOGGEDIN_USER_DETAILS,
  VERIFY_SESSION,
} from "./Constant/apiConstant";
import "react-toastify/dist/ReactToastify.css";
import { getUnitId, removeLocalStorage } from "./utils/functions";

import UserContext from "./context/UserContext";
import { toast } from "react-toastify";
// import {AddCompany} from "./Components/Master/CompanyMaster/AddCompany"
const AuthRoutes = lazy(() => import("./Routes/AuthRoutes"));
const RootLayout = lazy(() => import("./Components/Layout/RootLayout"));
const Home = lazy(() => import("./Pages/Home"));
const NewMOU = lazy(() => import("./Pages/MOU/NewMOU"));
const EditMOU = lazy(() => import("./Pages/MOU/EditMou"));
const ViewMouAggregator = lazy(() => import("./Pages/MOU/ViewMouAggregator"));
const ViewAggregator = lazy(() => import("./Pages/MOU/ViewAggregator"));
const ViewMOU = lazy(() => import("./Pages/MOU/ViewMOU"));
const NewContract = lazy(() => import("./Pages/Contract/NewContract"));
const AddendumContract = lazy(() =>
  import("./Components/Contract/AddendumContract")
);
const RenewalContract = lazy(() =>
  import("./Components/Contract/RenewalContract")
);
const EditContract = lazy(() => import("./Components/Contract/EditContract"));
const ApprovalMatrixContract = lazy(() =>
  import("./Pages/approvalMatrix/ApprovalMatrixContract")
);
const EscalationMatrixContract = lazy(() =>
  import("./Pages/escalationMatrix/EscalationMatrixContract")
);
const DetailScreen = lazy(() =>
  import("./Components/Common/contractViews/DetailScreen")
);
const ViewDoc = lazy(() => import("./Components/Common/ViewDoc"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const AddCompany = lazy(() =>
  import("./Components/Master/CompanyMaster/AddCompany").then((module) => ({
    default: module.AddCompany,
  }))
);
const NotificationsList = lazy(() =>
  import("./Components/Reports/Notifications/Notifications")
);
const AuditLogsList = lazy(() =>
  import("./Components/Reports/AuditLogs/AuditLogsList")
);
const CompanyMasterList = lazy(() =>
  import("./Components/Master/CompanyMaster/CompanyMasterList")
);
const DocumentMasterList = lazy(() =>
  import("./Components/Master/DocumentMaster/DocumentMasterList")
);
const ContractMasterList = lazy(() =>
  import("./Components/Master/ContractMaster/ContractMasterList")
);
const AddDocument = lazy(() =>
  import("./Components/Master/DocumentMaster/AddDocument").then((module)=>({
    default: module.AddDocument,
  }))
);
const AddContractType = lazy(() =>
  import("./Components/Master/ContractMaster/AddContractType").then((module)=>({
    default:module.AddContractType
  }))
);
const ApostilleMasterList = lazy(() =>
  import("./Components/Master/ApostilleMaster/ApostilleMasterList")
);
const AddApostille = lazy(() =>
  import("./Components/Master/ApostilleMaster/AddApostille").then((module)=>({
    default:module.AddApostille
  }))
);
const ApprovalMatrixList = lazy(() =>
  import("./Components/Master/ApprovalMatrix/ApprovalMatrixList")
);
const EscalationMatrixList = lazy(() =>
  import("./Components/Master/EscalationMatrix/EscalationMatrixList")
);
const MOUList = lazy(() => import("./Components/MOU/MOUList"));
const MOUPendingList = lazy(() => import("./Components/MOU/MOUPendingList"));
const ContractList = lazy(() => import("./Components/Contract/ContractList"));
const ContractPendingList = lazy(() =>
  import("./Components/Contract/ContractPendingList")
);


// Custom hook to check user permissions
export function usePermission(permission) {
  let permissions = JSON.parse(localStorage.getItem("loggedInUser")) ?? [];
  if (permissions?.permissions?.length > 0) {
    permissions = permissions?.permissions;
    return permissions.includes(permission);
  } else {
    return false;
  }
}

// Protected route component
export function ProtectedRoute({ permission, element }) {
  const hasPermission = usePermission(permission);

  if (!hasPermission) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
}

function App() {
  const [sessionData, setSessionData] = useState();
  // const [empCode, setEmpCode] = useState();
  const [loggedUserData, setLoggedUserData] = useState();
  const { setOrganisations, setIsAdmin } = useContext(UserContext);

  const handleVerifySession = async () => {
    try {
      const verifySession = await fetchVerifySession();
      if (
        verifySession?.success?.length < 1 ||
        verifySession?.status === false
      ) {
        removeLocalStorage();
        window.location.href = "/login";
      }
      setSessionData(verifySession?.success);
      localStorage.setItem("token", verifySession?.success?.token);
      localStorage.setItem(
        "loginOptions",
        JSON.stringify(verifySession?.success?.loginOptions)
      );
      getUnitId();
    } catch (error) {
      removeLocalStorage();
      window.location.href = "/login";
    }
  };

  const fetchLoggedInUser = async () => {
    try {
      const response = await api.get(`${GET_LOGGEDIN_USER}`);
      await checkIsAdmin();
      if (response?.data?.userId) {
        const res = JSON.stringify(response.data);
        localStorage.setItem("loggedInUser", res);
        setLoggedUserData((prevData) => ({
          ...prevData,
          empCode: response?.data?.employeeCode,
          name: response?.data?.username,
          byId: response?.data?.userId,
        }));
        // setEmpCode(response?.data?.employeeCode);
      }
    } catch (error) {
      handleVerifySession();
      const currentUrl = window.location.href;
      if (!currentUrl.includes("/login") && !currentUrl.includes("localhost")) {
        removeLocalStorage();
        window.location.href = "/login";
      } else {
      }
      console.error("Error fetching user data:", error.message);
      // throw error;
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`${GET_LOGGEDIN_USER_DETAILS}`);
      if (response?.data?.success) {
        let result = response?.data?.success[0];
        if (result) {
          setLoggedUserData((prevData) => ({
            ...prevData,
            ...result,
          }));
        }
      }
    } catch (error) {
      toast.error(error.message ?? "Error while fetching user details", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const fetchOrganisationList = async () => {
    try {
      const response = await api.get(`${VERIFY_SESSION}`);
      if (response?.status == 200) {
        let result = response?.data?.success?.loginOptions;
        if (result) {
          setOrganisations(result);
        }
      }
    } catch (error) {
      toast.error(error.message ?? "Error while fetching organisation list", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const checkIsAdmin = async () => {
    try {
      const response = await getIsAdminResponsePromise();
      const roles = response?.data?.success;
      const isAdmin = checkForCMSRoles(roles);
      // const isApprover = checkForApprover(roles);
      setIsAdmin(isAdmin);
      // return { isAdmin, isApprover, roles };
      // return isAdmin;
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    if (
      !currentUrl.includes("/login") &&
      !currentUrl.includes("/emergency-response")
    ) {
      fetchLoggedInUser();
      fetchUserDetails();
      fetchOrganisationList();
    }
  }, []);

  useEffect(() => {
    const postLoggedUserData = async () => {
      if (loggedUserData) {
        const payload = {
          id: 0,
          ...loggedUserData,
        };
        const length = Object.keys(payload).length;
        if (length === 7) {
          try {
            const response = await api.post(`${CREATE_LOGGED_USER}`, payload);
            return response.success;
          } catch (error) {
            console.error("Error creating logged user:", error.message);
            throw error;
          }
        }
      }
    };

    postLoggedUserData();

    // if(loggedUserData){
    //   checkIsAdmin()
    // }
  }, [loggedUserData]);

  useEffect(() => {
    const currentUrl = window.location.href;
    if (
      window.location.hostname !== "localhost" &&
      !currentUrl.includes("/login") &&
      !currentUrl.includes("/emergency-response")
    ) {
      handleVerifySession();
    } else {
      const token = getCookie("jlhlToken");
      localStorage.setItem("token", token);
      localStorage.setItem("loginOptions", JSON.stringify(allowedOrganization));
      setSessionData([]);
    }
  }, []);

  const routes = createBrowserRouter(
    [
      {
        path: "",
        element:  <Suspense fallback={<></>}> <AuthRoutes /> </Suspense>,
        children: [
          {
            path: "",
            element: 
            <Suspense fallback={<></>}> 
            <RootLayout sessionData={sessionData} /> 
            </Suspense>
            ,
            children: [
              {
                path: "/",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Dashboard.View}
                      element={<Home />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/mou-contract-new",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.MOUContract.Create}
                      element={<NewMOU />}
                      key={"new-mou"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/edit-mou-contract/:mouId",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.MOUContract.Edit}
                      element={<EditMOU />}
                      key={"new-mou-edit"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/view-mou-aggregators/:mouId",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.MOUContract.Edit}
                      element={<ViewMouAggregator />}
                      key={"view-mou-aggregators"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/view-mou-aggregator/:mouId/:aggregatorId",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.MOUContract.Edit}
                      element={<ViewAggregator />}
                      key={"view-mou-aggregator"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/mou-view/:mouId",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.MOUContract.ViewAll}
                      element={<ViewMOU />}
                      key={"view-mou"}
                    />
                  </Suspense>
                ),
              },
              // {
              //   path: "/testing",
              //   element: <PrintEmergencyDetails />,
              // },

              {
                path: "/contract-new",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.Create}
                      element={<NewContract type={"WithOutClassified"} />}
                      key={"new-contract"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/add-addendum",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.Create}
                      element={<AddendumContract />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/renewal",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.Create}
                      element={<RenewalContract />}
                    />
                  </Suspense>
                ),
              },
              
              {
                path: "/contract-edit/:id",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.Edit}
                      element={<EditContract type={"WithOutClassified"} />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/contract-classified-new",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.ContractClassified.Create
                      }
                      element={<NewContract type="Classified" />}
                      key={"new-contract-classified"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/edit-approval-matrix/:type/:Id/:departName/:contractType",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.CompanyMaster.Edit}
                      element={<ApprovalMatrixContract />}
                    />
                  </Suspense>
                ),
              },

              {
                path: "/master-management/edit-escalation-matrix/:type/:Id/:departName/:contractType",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.EscalationMatrixContract.Edit
                      }
                      element={<EscalationMatrixContract />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/details-screen/:id",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.ViewAll}
                      element={<DetailScreen />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/view-doc/:id/:typeId",
                element: (
                  <Suspense fallback={<></>}>
                    {" "}
                    <ViewDoc />{" "}
                  </Suspense>
                ),
              },
              {
                path: "/dashboard",
                element: (
                  // <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Dashboard.View}
                      element={<Dashboard />}
                    />
                  // </Suspense>
                ),
              },

              {
                path: "/master-management/company-master/add-company",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.CompanyMaster.Create}
                      element={<AddCompany />}
                    />
                 </Suspense>
                ),
              },
              {
                path: "/master-management/company-master/edit-company/:id",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.CompanyMaster.Edit}
                      element={<AddCompany />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/unauthorized",
                element: <Unauthorized />,
              },
              {
                path: "/notifications",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Notification.View}
                      element={<NotificationsList />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/auditlogs",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.AuditLog.View}
                      element={<AuditLogsList />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/company-master",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.CompanyMaster.View}
                      element={<CompanyMasterList type={"WithOutMockDrill"} />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/document-master",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.DocumentMaster.View}
                      element={<DocumentMasterList />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/contracttype-master",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.ContractType.View}
                      element={<ContractMasterList />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/document-master/add-document",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.DocumentMaster.Create}
                      element={<AddDocument />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/contract-master/add-contract-type",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.ContractType.Create}
                      element={<AddContractType />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/contract-master/edit-contract-type/:id",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.ContractType.Edit}
                      element={<AddContractType />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/document-master/edit-document/:id",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.DocumentMaster.Edit}
                      element={<AddDocument />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/contract-master/edit-document/:id",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.CompanyMaster.Edit}
                      element={<AddContractType />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/apostille-master",
                path: "/master-management/apostille-master",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.ApostilleMaster.View}
                      element={<ApostilleMasterList />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/apostille-master/add-apostille",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.ApostilleMaster.Create}
                      element={<AddApostille type={"WithOutMockDrill"} />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/apostille-master/edit-apostille/:id",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.ApostilleMaster.Edit}
                      element={<AddApostille type={"WithOutMockDrill"} />}
                    />
                  </Suspense>
                ),
              },

              {
                path: "/master-management/approval-matrix-contract",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.ApprovalMatrixContract.View
                      }
                      element={
                        <ApprovalMatrixList type={"Contract"} typeId="2" />
                      }
                    />
                  </Suspense>
                ),
              },

              {
                path: "/master-management/approval-matrix-mou",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.ApprovalMatrixMOU.View}
                      element={<ApprovalMatrixList type={"MOU"} typeId="1" />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/approval-matrix-classified",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.ApprovalMatrixClassified.View
                      }
                      element={
                        <ApprovalMatrixList type={"Classified"} typeId="3" />
                      }
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/escalation-matrix-classified",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.EscalationMatrixClassified.View
                      }
                      element={<EscalationMatrixList type={"Classified"} />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/escalation-matrix-mou",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.EscalationMatrixMOU.View}
                      element={<EscalationMatrixList type={"MOU"} />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/master-management/escalation-matrix-contract",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.EscalationMatrixContract.View
                      }
                      element={<EscalationMatrixList type={"Contract"} />}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/mou-contract-list",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.MOUContract.ViewAll}
                      element={<MOUList type="All" showContractStatus={true} />}
                      key={"All"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/mou-contract-list-active",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.MOUContract.ViewActive}
                      element={
                        <MOUList type="Active" showContractStatus={false} />
                      }
                      key={"active"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/mou-contract-list-pending",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.MOUContract.ViewPendingApproval
                      }
                      element={
                        <MOUPendingList
                          type="Pending Approval"
                          showContractStatus={false}
                        />
                      }
                      key={"pending-approval"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/mou-contract-list-terminated",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.MOUContract.ViewTerminated
                      }
                      element={
                        <MOUList type="Terminated" showContractStatus={false} />
                      }
                      key={"terminate"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/mou-contract-list-rejected",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.MOUContract.ViewRejected}
                      element={
                        <MOUList type="Rejected" showContractStatus={false} />
                      }
                      key={"rejected"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/contract-list",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.ViewAll}
                      element={
                        <ContractList
                          type="All"
                          contractType="Contract"
                          showContractStatus={true}
                        />
                      }
                      key={"All"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/contract-list-active",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.ViewActive}
                      element={
                        <ContractList
                          type="Active"
                          contractType="Contract"
                          showContractStatus={false}
                        />
                      }
                      key={"Active"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/contract-list-pending",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.Contract.ViewPendingApproval
                      }
                      element={
                        <ContractPendingList
                          type="Pending Approval"
                          contractType="Contract"
                          showContractStatus={false}
                          isClassified={false}
                        />
                      }
                      key={"Pending Approval"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/contract-list-terminated",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.ViewTerminated}
                      element={
                        <ContractList
                          type="Terminated"
                          contractType="Contract"
                          showContractStatus={false}
                        />
                      }
                      key={"Terminated"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/contract-list-rejected",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.ViewRejected}
                      element={
                        <ContractList
                          type="Rejected"
                          contractType="Contract"
                          showContractStatus={false}
                        />
                      }
                      key={"Rejected"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/contract-list-expired",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={MENU_PERMISSIONS.CMS.Contract.ViewRejected}
                      element={
                        <ContractList
                          type="Expired"
                          contractType="Contract"
                          showContractStatus={false}
                        />
                      }
                      key={"Expired"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/contract-classified-list",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.ContractClassified.ViewAll
                      }
                      element={
                        <ContractList
                          type="All"
                          contractType="Classified"
                          showContractStatus={true}
                          isClassified={true}
                        />
                      }
                      key={"classified-all"}
                    />
                  </Suspense>
                ),
              },
              {
                path: "/contract-classified-list-pending",
                element: (
                  <Suspense fallback={<></>}>
                    <ProtectedRoute
                      permission={
                        MENU_PERMISSIONS.CMS.ContractClassified
                          .ViewPendingApproval
                      }
                      element={
                        <ContractPendingList
                          type="Pending Approval"
                          contractType="Classified"
                          showContractStatus={false}
                          isClassified={true}
                        />
                      }
                      key={"classified-pending-approval"}
                    />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
    {
      basename: "/cms",
    }
  );
  
  return sessionData && <RouterProvider router={routes} />;
}

export default App;
